"use client";

import { useId, useState, useSyncExternalStore } from "react";

import { CalendarCheckIcon } from "@/components/icons/CalendarCheckIcon";
import { ClockIcon } from "@/components/icons/ClockIcon";
import { Tick } from "@/components/icons/Tick";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion";
import { Input } from "@/components/ui/Input";
import { leadsApiOrigin } from "@/config/nav";
import type { ContactPageData } from "@/lib/cms/types";
import { noOrphan } from "@/lib/noOrphan";
import { BookingCalendar } from "./booking/BookingCalendar";
import { useCalBooking } from "./booking/useCalBooking";
import { ContactForm, type ContactDetails } from "./ContactForm";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const noopSubscribe = () => () => {};

/** md-leads origin for this host; null during SSR and hydration. */
function useLeadsOrigin(): string | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => leadsApiOrigin(window.location.hostname),
    () => null,
  );
}

function Booking({
  origin,
  copy,
  details,
  onDetailsChange,
}: {
  origin: string;
  copy: ContactPageData;
  details: ContactDetails;
  onDetailsChange: (d: ContactDetails) => void;
}) {
  const id = useId();
  const [booked, setBooked] = useState(false);
  const booking = useCalBooking({
    apiOrigin: origin,
    attendee: { name: details.name.trim(), email: details.email.trim() },
    notes: "Booked from the website contact page.",
    onConfirmed: () => setBooked(true),
  });
  const canConfirm = !!details.name.trim() && EMAIL_RE.test(details.email.trim());

  if (booked) {
    return (
      <div className="flex flex-col items-start gap-4" role="status">
        <span className="flex size-14 items-center justify-center rounded-full bg-yellow text-black">
          <Tick size={26} />
        </span>
        <p className="text-hero-5 font-bold text-fg text-balance">{copy.bookingSuccessTitle}</p>
        <p className="text-lg text-fg-muted text-balance">{copy.bookingSuccessBody}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-name`} className="text-sm font-medium text-fg">{copy.nameLabel}</label>
          <Input
            id={`${id}-name`}
            autoComplete="name"
            value={details.name}
            onChange={(e) => onDetailsChange({ ...details, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-email`} className="text-sm font-medium text-fg">{copy.emailFieldLabel}</label>
          <Input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            value={details.email}
            onChange={(e) => onDetailsChange({ ...details, email: e.target.value })}
          />
        </div>
      </div>
      <BookingCalendar
        booking={booking}
        canConfirm={canConfirm}
        labels={{
          confirm: copy.bookingConfirmLabel,
          empty: copy.bookingEmptyText,
          unavailable: copy.bookingUnavailableText,
        }}
      />
    </div>
  );
}

/**
 * The form and the booking calendar. They share the visitor's name and
 * email, so whoever fills one in doesn't have to type them again.
 */
export function ContactConnect({ copy }: { copy: ContactPageData }) {
  const [details, setDetails] = useState<ContactDetails>({ name: "", email: "" });
  const origin = useLeadsOrigin();

  return (
    <>
      <Section className="pb-20 md:pb-28">
        <Reveal>
          <ContactForm copy={copy} details={details} onDetailsChange={setDetails} />
        </Reveal>
      </Section>

      <Section id="book" className="pb-24 md:pb-32">
        <Reveal className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="flex flex-col gap-4">
            <span className="flex size-14 items-center justify-center rounded-full bg-yellow text-black">
              <CalendarCheckIcon size={26} />
            </span>
            <h2 className="text-hero-3 font-bold text-fg text-balance">{noOrphan(copy.bookingHeading)}</h2>
          </div>
          {copy.bookingIntro && (
            <p className="flex items-start gap-3 text-lg text-fg-muted text-balance md:max-w-md">
              <ClockIcon size={22} className="mt-0.5 shrink-0 text-fg" />
              {noOrphan(copy.bookingIntro)}
            </p>
          )}
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-card border border-border p-6 md:p-12">
            {origin ? (
              <Booking origin={origin} copy={copy} details={details} onDetailsChange={setDetails} />
            ) : (
              <div className="min-h-96 animate-pulse rounded-card-sm bg-panel" aria-busy="true" />
            )}
          </div>
        </Reveal>
      </Section>
    </>
  );
}
