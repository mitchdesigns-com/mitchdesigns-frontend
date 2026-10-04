"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { Reveal, RevealItem, RevealStagger, useTilt } from "@/components/motion";
import { ClientsTrustCard } from "./ClientsTrustCard";
import { LEADS_URL } from "@/config/nav";

export type TrustReasonCard = {
  image?: string | null;
  title: string;
  body: string;
};

type Cta = { label: string; href: string };

/** Max grid tilt (deg) when the pointer reaches the section edge. */
const MAX_TILT = 8;

/** Ambient particles — deterministic spread so server and client match. */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 61 + 23) % 100}%`,
  animationDelay: `${-(i * 1.7).toFixed(1)}s`,
  animationDuration: `${20 + (i % 5) * 3}s`,
  big: i % 3 === 0,
  accent: i % 4 === 0,
}));

const DEFAULT_INTRO =
  "Because choosing a digital partner shouldn’t feel risky, it should feel right.";
const DEFAULT_CTA: Cta = { label: "Get Detailed Proposal", href: LEADS_URL };

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
  // Tilt the whole grid toward the pointer (mouse only — touch keeps it flat).
  const { rotateX, rotateY, handlers } = useTilt(MAX_TILT);

  return (
    <Section
      theme="dark"
      className="overflow-hidden py-20"
      {...handlers}
    >
      {/* Ambient particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {PARTICLES.map(({ big, accent, ...style }, i) => (
          <span
            key={i}
            style={style}
            className={`absolute animate-drift rounded-full ${big ? "size-1.5" : "size-1"} ${accent ? "bg-yellow/40" : "bg-white/20"}`}
          />
        ))}
      </div>

      {/* Header */}
      <Reveal className="relative mb-10 flex flex-col gap-5 lg:mb-15 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
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

      {/* Floating 3D grid */}
      <div className="relative mb-10 perspective-midrange lg:mb-15">
        <motion.div className="transform-3d" style={{ rotateX, rotateY }}>
          <RevealStagger
            className="grid grid-cols-1 gap-4 transform-3d md:grid-cols-2 lg:grid-cols-3 lg:gap-6"
            stagger={0.08}
          >
            {reasons.map((reason, i) => (
              <RevealItem key={reason.title} className="transform-3d">
                <ClientsTrustCard {...reason} index={i + 1} />
              </RevealItem>
            ))}
          </RevealStagger>
        </motion.div>
      </div>

      {/* CTA */}
      {cta && (
        <div className="relative flex justify-center">
          <Button size="lg" asChild className="max-md:w-full">
            <Link href={cta.href}>
              {cta.label}
              <ArrowRight size={20} />
            </Link>
          </Button>
        </div>
      )}
    </Section>
  );
}
