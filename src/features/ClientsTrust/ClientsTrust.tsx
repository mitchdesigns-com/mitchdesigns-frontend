"use client";

import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { CardSlider } from "@/components/ui/CardSlider";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { Reveal } from "@/components/motion";
import { ClientsTrustCard } from "./ClientsTrustCard";

export type TrustReasonCard = {
  image?: string | null;
  title: string;
  body: string;
};

type Cta = { label: string; href: string };

const SCROLL_STEP = 330 + 16; // card width + gap

const DEFAULT_INTRO =
  "Because choosing a digital partner shouldn’t feel risky, it should feel right.";
const DEFAULT_CTA: Cta = { label: "Get Detailed Proposal", href: "/quote" };

type Props = {
  reasons: TrustReasonCard[];
  /** Defaults to the homepage "N Reasons Clients Trust" heading. */
  heading?: React.ReactNode;
  /** Lead paragraph beside the heading. Pass `null` to hide it. */
  intro?: string | null;
  /** Bottom CTA button. Pass `null` to hide it. */
  cta?: Cta | null;
};

export function ClientsTrust({
  reasons,
  heading,
  intro = DEFAULT_INTRO,
  cta = DEFAULT_CTA,
}: Props) {
  return (
    <Section theme="dark" className="py-20">
      {/* Header */}
      <Reveal className="mb-10 flex flex-col gap-5 lg:mb-15 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <h2 className="text-hero-3 font-bold text-fg">
          {heading ?? (
            <>
              {reasons.length} Reasons Clients
              <br />
              Trust MitchDesigns
            </>
          )}
        </h2>
        {intro && (
          <p className="max-w-[506px] text-xl text-fg-muted text-balance max-md:text-center">
            {intro}
          </p>
        )}
      </Reveal>

      {/* Slider */}
      <CardSlider scrollStep={SCROLL_STEP} className="mb-6">
        {reasons.map((reason) => (
          <ClientsTrustCard key={reason.title} {...reason} />
        ))}
      </CardSlider>

      {/* CTA */}
      {cta && (
        <Button size="lg" asChild className="max-md:w-full">
          <Link href={cta.href}>
            {cta.label}
            <ArrowRight size={20} />
          </Link>
        </Button>
      )}
    </Section>
  );
}
