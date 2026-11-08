"use client";

import { useMemo } from "react";

import { ChevronDown } from "@/components/icons/ChevronDown";
import { GlobeIcon } from "@/components/icons/GlobeIcon";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  buildMonthGrid,
  formatLongDate,
  formatMonthLabel,
  formatSlotTime,
  getTimeZoneOptions,
  WEEKDAY_LABELS,
} from "./cal";
import type { UseCalBooking } from "./useCalBooking";

type Props = {
  booking: UseCalBooking;
  /** False until the visitor has a name and a valid email for the invite. */
  canConfirm: boolean;
  labels: { confirm: string; empty: string; unavailable: string };
};

/**
 * One responsive month calendar plus time slots, driven by md-leads'
 * `useCalBooking` state (ported in ./useCalBooking). Slots stack under the
 * calendar on phones and sit beside it from `lg`.
 */
export function BookingCalendar({ booking, canConfirm, labels }: Props) {
  // Drop trailing weeks with no day of this month, so short months don't
  // leave an empty row above the slots on phones.
  const grid = buildMonthGrid(booking.viewMonth);
  const lastInMonth = grid.findLastIndex((c) => c.inMonth);
  const cells = grid.slice(0, Math.ceil((lastInMonth + 1) / 7) * 7);
  const loading = booking.slotsLoading && !booking.slotsError;
  const zones = useMemo(() => getTimeZoneOptions(booking.timeZone), [booking.timeZone]);

  return (
    <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
      <div className="lg:col-span-3">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-lg font-bold text-fg">{formatMonthLabel(booking.viewMonth)}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={booking.goPrevMonth}
              disabled={!booking.canGoPrevMonth}
              aria-label="Previous month"
              className="grid size-10 place-items-center rounded-full text-fg transition-colors hover:bg-bg-alt disabled:opacity-25"
            >
              <ChevronDown size={18} className="rotate-90" />
            </button>
            <button
              type="button"
              onClick={booking.goNextMonth}
              aria-label="Next month"
              className="grid size-10 place-items-center rounded-full text-fg transition-colors hover:bg-bg-alt"
            >
              <ChevronDown size={18} className="-rotate-90" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center text-xs font-medium uppercase tracking-1 text-fg-muted">
          {WEEKDAY_LABELS.map((d) => (
            <span key={d} className="py-2">
              {d}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((cell) => {
            const available = booking.availableDateKeys.has(cell.key);
            const selected = booking.selectedDateKey === cell.key;
            const disabled = !cell.inMonth || cell.isPast || !available;
            return (
              <button
                key={cell.key}
                type="button"
                disabled={disabled}
                onClick={() => booking.selectDate(cell.key)}
                className={cn(
                  "relative mx-auto grid aspect-square w-full max-w-12 place-items-center rounded-full text-sm transition-colors",
                  !cell.inMonth && "pointer-events-none opacity-0",
                  disabled && cell.inMonth && "text-grey-200",
                  !disabled && !selected && "font-medium text-fg hover:bg-bg-alt",
                  selected && "bg-fg font-bold text-bg",
                  cell.isToday && !selected && "ring-1 ring-inset ring-fg/30",
                )}
              >
                {cell.date.getDate()}
                {available && !selected && (
                  <span className="absolute bottom-1.5 size-1 rounded-full bg-accent" aria-hidden />
                )}
                {loading && cell.inMonth && !cell.isPast && (
                  <span className="absolute bottom-1.5 size-1 animate-pulse rounded-full bg-grey-200" aria-hidden />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:col-span-2 lg:border-l lg:border-border lg:pl-12">
        <label className="mb-5 inline-flex w-fit max-w-full items-center gap-2 rounded-pill border border-border px-4 py-2 text-sm text-fg">
          <GlobeIcon size={16} className="shrink-0 text-fg-muted" />
          <select
            aria-label="Time zone"
            value={booking.timeZone}
            onChange={(e) => booking.setTimeZone(e.target.value)}
            className="min-w-0 truncate bg-transparent outline-none"
          >
            {zones.map((tz) => (
              <option key={tz} value={tz}>
                {tz.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </label>

        {booking.slotsError ? (
          <div className="rounded-card-sm bg-bg-alt p-6">
            <p className="text-base text-fg text-balance">{labels.unavailable}</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 gap-2" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="h-11 animate-pulse rounded-card-sm bg-panel" />
            ))}
          </div>
        ) : booking.selectedDate ? (
          <>
            <p className="mb-3 text-base font-bold text-fg text-balance">{formatLongDate(booking.selectedDate)}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
              {booking.daySlots.map((slot) => {
                const selected = booking.selectedSlot === slot.start;
                return (
                  <button
                    key={slot.start}
                    type="button"
                    onClick={() => booking.selectSlot(slot.start)}
                    className={cn(
                      "rounded-card-sm border py-3 text-center text-sm font-medium transition-colors",
                      selected ? "border-fg bg-fg text-bg" : "border-border text-fg hover:border-fg",
                    )}
                  >
                    {formatSlotTime(slot.start, booking.timeZone)}
                  </button>
                );
              })}
            </div>
            {booking.bookingError && (
              <p role="alert" className="mt-3 text-sm text-orderbase-red text-balance">
                {booking.bookingError}
              </p>
            )}
            <Button
              type="button"
              size="lg"
              disabled={!booking.selectedSlot || !canConfirm || booking.isBooking}
              onClick={booking.confirm}
              className="mt-6 w-full"
            >
              {labels.confirm}
            </Button>
          </>
        ) : (
          <p className="py-10 text-center text-base text-fg-muted text-balance">{labels.empty}</p>
        )}
      </div>
    </div>
  );
}
