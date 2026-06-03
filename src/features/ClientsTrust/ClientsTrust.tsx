"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/icons/ArrowRight";
import {
  Reveal,
  staggerChildren,
  itemFadeUp,
  REVEAL_VIEWPORT,
} from "@/components/motion";
import { ClientsTrustCard } from "./ClientsTrustCard";

export type TrustReasonCard = {
  image?: string | null;
  title: string;
  body: string;
};

const CARD_WIDTH = 330;
const CARD_GAP = 16;
const SCROLL_STEP = CARD_WIDTH + CARD_GAP;

export function ClientsTrust({ reasons }: { reasons: TrustReasonCard[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * SCROLL_STEP, behavior: "smooth" });
  };

  const reduced = useReducedMotion();
  const inView = useInView(trackRef, REVEAL_VIEWPORT);

  return (
    <Section theme="dark" className="py-20">
      {/* Header */}
      <Reveal className="mb-10 flex flex-col gap-5 lg:mb-15 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <h2 className="text-hero-3 font-bold text-fg">
          {reasons.length} Reasons Clients
          <br />
          Trust MitchDesigns
        </h2>
        <p className="max-w-[506px] text-xl text-fg-muted text-balance max-md:text-center">
          Because choosing a digital partner shouldn&rsquo;t feel risky, it should feel right.
        </p>
      </Reveal>

      {/* Slider */}
      <div className="relative mb-6">
        <motion.div
          ref={trackRef}
          onScroll={updateArrows}
          className="bleed-carousel flex gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          variants={staggerChildren(0.1)}
          initial={reduced ? "visible" : "hidden"}
          animate={inView || reduced ? "visible" : "hidden"}
        >
          {reasons.map((reason) => (
            <motion.div
              key={reason.title}
              variants={itemFadeUp}
              className="shrink-0"
            >
              <ClientsTrustCard {...reason} />
            </motion.div>
          ))}
        </motion.div>

        {/* Nav arrows — desktop only; mobile uses touch scroll */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden items-center sm:flex">
          <div className="pointer-events-auto flex gap-2">
            {canScrollLeft && (
              <button
                onClick={() => scrollBy(-1)}
                aria-label="Previous"
                className="grid size-[72px] place-items-center rounded-full bg-yellow text-black transition-opacity hover:opacity-90 lg:size-[100px]"
              >
                <ArrowRight size={40} className="rotate-180" />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scrollBy(1)}
                aria-label="Next"
                className="grid size-[72px] place-items-center rounded-full bg-yellow text-black transition-opacity hover:opacity-90 lg:size-[100px]"
              >
                <ArrowRight size={40} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <Button size="lg" asChild className="max-md:w-full">
        <Link href="/quote">
          Get Detailed Proposal
          <ArrowRight size={20} />
        </Link>
      </Button>
    </Section>
  );
}
