"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { CountUp } from "@/components/ui/CountUp";
import type { NumbersSectionProps } from "@/lib/cms/types";
import { easeOutSoft } from "@/lib/motion";

/** Seconds after the section shows before the first figure rises (lets the hero land). */
const START_DELAY = 0.6;
/** Seconds each figure takes to count up. */
const COUNT_DURATION = 2.8;
const STAGGER = 0.15;

/**
 * Key figures in yellow, counting up. Starts as soon as any part of the
 * band is on screen — right under the hero on load — instead of waiting
 * for a scroll, so the band never sits empty.
 */
export function NumbersSection({ numbers }: NumbersSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const on = shown || !!reduced;

  return (
    <Section theme="dark" className="py-20 md:py-28">
      <div ref={ref} className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {numbers.map((item, i) => {
          const [num, ...rest] = item.value.split(" ");
          const unit = rest.join(" ");
          const delay = START_DELAY + i * STAGGER;
          return (
            <motion.div
              key={item.title}
              className="flex flex-col gap-2"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={on ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay, ease: easeOutSoft }}
            >
              <span className="flex items-start gap-2 whitespace-nowrap text-yellow">
                <span className="text-hero-3 font-bold md:text-hero-2">
                  <CountUp value={num} start={on} delay={delay} duration={COUNT_DURATION} />
                </span>
                {unit && (
                  <span className="text-xl font-semibold md:text-2xl">{unit}</span>
                )}
              </span>
              <span className="text-lg font-semibold text-fg-muted">{item.title}</span>
              {item.description && (
                <p className="text-sm text-fg-muted text-balance">{item.description}</p>
              )}
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
