"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createCalBooking,
  dateFromKey,
  fetchCalSlots,
  getBrowserTimeZone,
  monthSlotRange,
  startOfMonth,
} from "./cal";
import type { CalBookingResult, CalSlot, CalSlotsByDate } from "./cal";

/**
 * Attendee details sent to Cal.com when the booking is created.
 * NOTE: Cal.com requires a valid `email`. If your form collects email as
 * optional, synthesise a placeholder (e.g. from the phone number) before
 * passing it here, otherwise booking creation fails with a 422.
 */
export interface CalAttendee {
  name: string;
  email: string;
  phoneNumber?: string | null;
}

export interface UseCalBookingOptions {
  /** md-leads origin that proxies Cal.com (see `leadsApiOrigin`). */
  apiOrigin: string;
  /** Current attendee details; the latest value is read at confirm() time. */
  attendee: CalAttendee;
  /** Prefills the booking's "Additional notes" field; read at confirm() time. */
  notes?: string;
  /**
   * Optional project-specific dispatch that runs AFTER the Cal.com booking is
   * created but BEFORE onConfirmed — e.g. create a CRM lead/RFQ, POST to your
   * own backend, write a DB row. If it throws, the Cal booking is NOT recreated
   * on the next confirm() — only this step is retried (retry-without-rebooking),
   * so the user never gets a duplicate calendar event.
   */
  onBeforeComplete?: (booking: CalBookingResult, attendee: CalAttendee) => Promise<void>;
  /** Called once the Cal booking + onBeforeComplete both succeed. */
  onConfirmed?: (booking: CalBookingResult) => void;
}

export interface UseCalBooking {
  // timezone
  timeZone: string;
  setTimeZone: (tz: string) => void;
  // month navigation
  viewMonth: Date;
  canGoPrevMonth: boolean;
  goPrevMonth: () => void;
  goNextMonth: () => void;
  // slots
  slotsByDate: CalSlotsByDate;
  slotsLoading: boolean;
  slotsError: string | null;
  reloadSlots: () => void;
  availableDateKeys: Set<string>;
  // date selection
  selectedDateKey: string | null;
  selectedDate: Date | null;
  selectDate: (key: string) => void;
  // time selection
  daySlots: CalSlot[];
  selectedSlot: string | null;
  selectSlot: (iso: string) => void;
  // confirm
  confirm: () => void;
  isBooking: boolean;
  bookingError: string | null;
}

export function useCalBooking({
  apiOrigin,
  attendee,
  notes,
  onBeforeComplete,
  onConfirmed,
}: UseCalBookingOptions): UseCalBooking {
  // Keep the latest attendee + notes + callbacks available inside async
  // callbacks without re-creating confirm() (avoids stale closures).
  const attendeeRef = useRef(attendee);
  const notesRef = useRef(notes);
  const callbacksRef = useRef({ onBeforeComplete, onConfirmed });
  useEffect(() => {
    attendeeRef.current = attendee;
    notesRef.current = notes;
    callbacksRef.current = { onBeforeComplete, onConfirmed };
  });

  const [timeZone, setTimeZone] = useState(getBrowserTimeZone);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()));
  const [reloadKey, setReloadKey] = useState(0);

  const [slotsByDate, setSlotsByDate] = useState<CalSlotsByDate>({});
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Guards: prevent double-submit and avoid re-creating a Cal booking on retry.
  const submittingRef = useRef(false);
  const calBookingRef = useRef<CalBookingResult | null>(null);

  // Load availability for the visible month / timezone.
  useEffect(() => {
    const controller = new AbortController();
    const { start, end } = monthSlotRange(viewMonth);

    setSlotsLoading(true);
    setSlotsError(null);

    fetchCalSlots({ origin: apiOrigin, start, end, timeZone, signal: controller.signal })
      .then((data) => {
        setSlotsByDate(data);
        const keys = Object.keys(data)
          .filter((k) => (data[k]?.length ?? 0) > 0)
          .sort();
        // Keep the current selection if it still has slots, else jump to the
        // first available day in the month.
        setSelectedDateKey((curr) =>
          curr && keys.includes(curr) ? curr : (keys[0] ?? null),
        );
        setSelectedSlot(null);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setSlotsByDate({});
        setSelectedDateKey(null);
        setSlotsError(err instanceof Error ? err.message : "Failed to load availability");
      })
      .finally(() => {
        if (!controller.signal.aborted) setSlotsLoading(false);
      });

    return () => controller.abort();
  }, [apiOrigin, viewMonth, timeZone, reloadKey]);

  const availableDateKeys = useMemo(
    () =>
      new Set(
        Object.keys(slotsByDate).filter((k) => (slotsByDate[k]?.length ?? 0) > 0),
      ),
    [slotsByDate],
  );

  const currentMonthStart = startOfMonth(new Date());
  const canGoPrevMonth = viewMonth > currentMonthStart;

  const goPrevMonth = useCallback(() => {
    setViewMonth((m) => {
      const candidate = new Date(m.getFullYear(), m.getMonth() - 1, 1);
      const floor = startOfMonth(new Date());
      return candidate < floor ? floor : candidate;
    });
  }, []);

  const goNextMonth = useCallback(() => {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }, []);

  const selectDate = useCallback((key: string) => {
    setSelectedDateKey(key);
    setSelectedSlot(null);
  }, []);

  const selectSlot = useCallback((iso: string) => {
    setSelectedSlot(iso);
    setBookingError(null);
  }, []);

  const reloadSlots = useCallback(() => setReloadKey((k) => k + 1), []);

  const daySlots = selectedDateKey ? (slotsByDate[selectedDateKey] ?? []) : [];
  const selectedDate = selectedDateKey ? dateFromKey(selectedDateKey) : null;

  const confirm = useCallback(async () => {
    if (submittingRef.current || !selectedSlot) return;

    submittingRef.current = true;
    setIsBooking(true);
    setBookingError(null);

    try {
      const att = attendeeRef.current;

      // 1. Create the Cal.com booking. Skip if a previous attempt already
      //    succeeded — only the downstream dispatch is being retried.
      if (!calBookingRef.current) {
        calBookingRef.current = await createCalBooking(apiOrigin, {
          start: selectedSlot,
          name: att.name,
          email: att.email,
          phoneNumber: att.phoneNumber ?? null,
          timeZone,
          notes: notesRef.current ?? null,
        });
      }
      const booked = calBookingRef.current;

      // 2. Run the project-specific post-booking dispatch (CRM lead, RFQ, etc.).
      await callbacksRef.current.onBeforeComplete?.(booked, att);

      // 3. Hand control back to the caller (advance a flow, show a thank-you...).
      callbacksRef.current.onConfirmed?.(booked);
    } catch (err) {
      setBookingError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      submittingRef.current = false;
      setIsBooking(false);
    }
  }, [apiOrigin, selectedSlot, timeZone]);

  return {
    timeZone,
    setTimeZone,
    viewMonth,
    canGoPrevMonth,
    goPrevMonth,
    goNextMonth,
    slotsByDate,
    slotsLoading,
    slotsError,
    reloadSlots,
    availableDateKeys,
    selectedDateKey,
    selectedDate,
    selectDate,
    daySlots,
    selectedSlot,
    selectSlot,
    confirm,
    isBooking,
    bookingError,
  };
}
