"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { itemFadeUp } from "@/components/motion";
import { RichText } from "@/components/ui/RichText";
import { Tick } from "@/components/icons/Tick";
import type { ProcessSectionProps } from "@/lib/cms/types";

export function ProcessSection({
  title,
  description,
  processCards,
}: ProcessSectionProps) {
  const reduced = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);

  // Line draws from top to bottom as the timeline scrolls through the viewport.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const reveal = reduced
    ? { initial: "visible" as const }
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, margin: "-15% 0px" } as const,
      };

  return (
    <Section className="py-20 md:py-28">
      <div className="space-y-16">
        <SectionHeader title={title} description={description} />

        <div ref={timelineRef} className="relative">
          {/* Center timeline line — desktop only */}
          <span
            aria-hidden
            className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 md:block"
          >
            <span className="absolute inset-0 bg-yellow/20" />
            {reduced ? (
              <span className="absolute inset-0 bg-yellow" />
            ) : (
              <motion.span
                style={{ scaleY: fill }}
                className="absolute inset-0 origin-top bg-yellow"
              />
            )}
          </span>

          <ol className="space-y-12 md:space-y-0">
            {processCards.map((step, i) => {
              const reversed = i % 2 !== 0;
              const badge = (extra: string) => (
                <span
                  className={`inline-flex size-9 items-center justify-center rounded-xs border border-black bg-yellow-soft ${extra}`}
                >
                  {step.stepIcon && (
                    <Image
                      src={step.stepIcon}
                      alt={step.stepIconAlt ?? ""}
                      width={24}
                      height={24}
                      className="size-6 object-contain"
                    />
                  )}
                </span>
              );

              return (
                <motion.li
                  key={step.stepNumber}
                  variants={itemFadeUp}
                  {...reveal}
                  className="relative grid items-center gap-6 md:grid-cols-2 md:gap-x-16 md:py-12"
                >
                  {/* Image */}
                  <div
                    className={`relative aspect-[515/300] overflow-hidden rounded-card ${
                      reversed ? "md:order-2" : ""
                    }`}
                  >
                    <Image
                      src={step.image}
                      alt={step.imageAlt ?? ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Text */}
                  <div
                    className={`flex flex-col gap-6 ${reversed ? "md:order-1" : ""}`}
                  >
                    {badge("md:hidden")}
                    <h3 className="text-hero-5 font-bold text-fg">{step.title}</h3>
                    <div className="flex items-start gap-2">
                      <Tick className="mt-1 size-6 shrink-0 text-fg" />
                      <RichText
                        content={step.description}
                        className="text-lg text-grey-700"
                      />
                    </div>
                  </div>

                  {/* Icon badge on the center line — desktop */}
                  {badge(
                    "absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:inline-flex",
                  )}
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </Section>
  );
}
