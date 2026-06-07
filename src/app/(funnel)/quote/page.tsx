import type { Metadata } from "next";
import { ServicePicker } from "@/features/quote";
import { AwayTitle } from "@/lib/quote/useAwayTitle";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Tell us about your project and get a tailored proposal from MitchDesigns. We respond within 24 hours with a clear scope, timeline, and budget estimate.",
  robots: { index: false, follow: false },
};

export default function QuoteEntryPage() {
  return (
    <>
      <AwayTitle />
      <ServicePicker />
    </>
  );
}
