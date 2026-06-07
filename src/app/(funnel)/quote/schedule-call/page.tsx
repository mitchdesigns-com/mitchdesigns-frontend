import type { Metadata } from "next";
import { CalendlyEmbed } from "@/features/quote/CalendlyEmbed";
import { AwayTitle } from "@/lib/quote/useAwayTitle";

export const metadata: Metadata = {
  title: "Schedule a call",
  robots: { index: false, follow: false },
};

export default function ScheduleCallPage() {
  return (
    <section className="container-page py-12">
      <AwayTitle />
      <div className="mx-auto max-w-5xl">
        <h1 className="text-hero-4 font-bold">Schedule a call</h1>
        <p className="mt-3 text-lg text-fg-muted text-balance">
          Pick a time that works for you and we&apos;ll walk through your project brief together.
        </p>
        <div className="mt-10">
          <CalendlyEmbed />
        </div>
      </div>
    </section>
  );
}
