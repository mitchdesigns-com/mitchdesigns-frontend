// Cal.com booking helpers, ported from md-leads (src/utils/cal.ts and
// src/types/cal.ts). The site has no Cal.com key: it calls md-leads'
// /api/cal/* proxies cross-origin (md-leads allows mitchdesigns.com via CORS).

export interface CalSlot {
  /** ISO 8601 start time, expressed in the requested timeZone (carries its offset). */
  start: string;
}

/** Cal.com groups available slots by local date key (`YYYY-MM-DD`). */
export type CalSlotsByDate = Record<string, CalSlot[]>;

/** Shape returned by `GET /api/cal/slots`. */
export interface CalSlotsResponse {
  slotsByDate: CalSlotsByDate;
}

/** Request body for `POST /api/cal/bookings`. */
export interface CreateCalBookingInput {
  /** ISO start of the chosen slot. */
  start: string;
  name: string;
  email: string;
  phoneNumber?: string | null;
  timeZone: string;
  language?: string;
  /** Prefills the booking's "Additional notes" field (Cal field slug `notes`). */
  notes?: string | null;
}

/** Shape returned by `POST /api/cal/bookings`. */
export interface CalBookingResult {
  uid: string;
  start: string;
  status: string;
}


// ---------------------------------------------------------------------------
// Timezone + date helpers
// ---------------------------------------------------------------------------

/** Detect the visitor's IANA timezone, falling back to UTC. */
export function getBrowserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/** Curated timezone list shown first; merged with the full IANA list when available. */
const CURATED_TIMEZONES = [
  "UTC",
  "Europe/London",
  "Europe/Paris",
  "Africa/Cairo",
  "Asia/Dubai",
  "America/New_York",
  "America/Los_Angeles",
];

/** The list of selectable timezones, with the detected zone surfaced first. */
export function getTimeZoneOptions(detected: string): string[] {
  let all: string[] = CURATED_TIMEZONES;
  try {
    const supported = (Intl as unknown as {
      supportedValuesOf?: (key: string) => string[];
    }).supportedValuesOf?.("timeZone");
    if (supported?.length) all = supported;
  } catch {
    // keep the curated fallback
  }
  return Array.from(new Set([detected, ...CURATED_TIMEZONES, ...all]));
}

/** `YYYY-MM-DD` for a Date using its local calendar components. */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse a `YYYY-MM-DD` key into a local midnight Date. */
export function dateFromKey(key: string): Date {
  return new Date(`${key}T00:00:00`);
}

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface MonthCell {
  date: Date;
  key: string;
  inMonth: boolean;
  isPast: boolean;
  isToday: boolean;
}

/** First-of-month Date for the month containing `date`. */
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** Build a 6-row × 7-col calendar grid (Sunday-first) for the month of `viewDate`. */
export function buildMonthGrid(viewDate: Date): MonthCell[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const startOffset = new Date(year, month, 1).getDay(); // 0 = Sunday
  const gridStart = new Date(year, month, 1 - startOffset);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cells: MonthCell[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    const cellMidnight = new Date(date);
    cellMidnight.setHours(0, 0, 0, 0);
    cells.push({
      date,
      key: toDateKey(date),
      inMonth: date.getMonth() === month,
      isPast: cellMidnight < today,
      isToday: cellMidnight.getTime() === today.getTime(),
    });
  }
  return cells;
}

/** In-month days from today onward — used by the mobile date strip. */
export function upcomingMonthDays(viewDate: Date): MonthCell[] {
  return buildMonthGrid(viewDate).filter((c) => c.inMonth && !c.isPast);
}

/**
 * Inclusive date range (`YYYY-MM-DD`) to request slots for a visible month,
 * clamped so we never ask Cal.com for days in the past.
 */
export function monthSlotRange(viewDate: Date): { start: string; end: string } {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = firstOfMonth < today ? today : firstOfMonth;
  return { start: toDateKey(start), end: toDateKey(lastOfMonth) };
}

/** "9:00 AM" for an ISO slot, rendered in the chosen timezone. */
export function formatSlotTime(iso: string, timeZone: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  });
}

/** "Monday, September 5" for a local-midnight Date. */
export function formatLongDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/** "September 2026" month/year label. */
export function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// ---------------------------------------------------------------------------
// API client — md-leads' /api/cal/* proxy routes, at `origin`
// ---------------------------------------------------------------------------

export async function fetchCalSlots(params: {
  origin: string;
  start: string;
  end: string;
  timeZone: string;
  signal?: AbortSignal;
}): Promise<CalSlotsByDate> {
  const qs = new URLSearchParams({
    start: params.start,
    end: params.end,
    timeZone: params.timeZone,
  });
  const res = await fetch(`${params.origin}/api/cal/slots?${qs.toString()}`, { signal: params.signal });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.error ?? "Failed to load availability");
  }
  return (body?.slotsByDate ?? {}) as CalSlotsByDate;
}

export async function createCalBooking(
  origin: string,
  input: CreateCalBookingInput,
): Promise<CalBookingResult> {
  const res = await fetch(`${origin}/api/cal/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.error ?? "Failed to create booking");
  }
  return body as CalBookingResult;
}
