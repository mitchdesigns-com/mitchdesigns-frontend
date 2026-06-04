"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

export interface JourneyStep {
  number: string;
  title: string;
  description?: string;
  image?: string;
}

export interface JourneyProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  steps?: JourneyStep[];
}

export function Journey({
  title = "Your System's Journey",
  subtitle = "From the customer's screen right to their door, fully automated and synced.",
  ctaLabel = "Contact Sales",
  ctaHref = "#",
  steps = defaultSteps,
}: JourneyProps) {
  const reduced = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);

  // Center divider fills top→bottom as the steps scroll through the viewport.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[var(--container-max)] px-[3.75rem] flex flex-col items-center gap-10">

        {/* Header */}
        <div className="w-full max-w-[1232px] flex flex-col items-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-hero-2 font-bold text-fg text-balance leading-[1.1]">
              {title}
            </h2>
            <p className="text-xl text-fg text-balance">
              {subtitle}
            </p>
          </div>
          <a
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-pill bg-orderbase-red px-9 py-4 text-xl font-medium text-white"
          >
            {ctaLabel}
          </a>
        </div>

        {/* Steps */}
        <div ref={timelineRef} className="relative w-full max-w-[1232px] flex flex-col">
          {/* Continuous center divider — fills red on scroll */}
          <span aria-hidden className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2">
            <span className="absolute inset-0 bg-border" />
            {reduced ? (
              <span className="absolute inset-0 bg-orderbase-red" />
            ) : (
              <motion.span
                style={{ scaleY: fill }}
                className="absolute inset-0 origin-top bg-orderbase-red"
              />
            )}
          </span>

          {steps.map((step, i) => {
            const textLeft = i % 2 === 0;
            return (
              <div key={i} className="flex items-center gap-[60px] min-h-[578px]">
                {/* Left column */}
                <div className="w-[555px] shrink-0">
                  {textLeft ? (
                    <StepText step={step} />
                  ) : (
                    <StepImage step={step} />
                  )}
                </div>

                {/* Divider spacer — the animated line is drawn once for the
                    whole column via the overlay above */}
                <div className="relative shrink-0 w-px self-stretch">
                  {/* Dot marker on even rows */}
                  {!textLeft && (
                    <div className="absolute left-1/2 top-[111px] -translate-x-1/2 w-4 h-4 rounded-full border-2 border-orderbase-red bg-white z-10" />
                  )}
                </div>

                {/* Right column */}
                <div className="w-[555px] shrink-0">
                  {textLeft ? (
                    <StepImage step={step} />
                  ) : (
                    <StepText step={step} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StepText({ step }: { step: JourneyStep }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Number + title baseline-aligned */}
      <div className="flex items-baseline gap-4">
        <span className="text-xl font-medium text-orderbase-red leading-[1.25] translate-y-[5px]">
          {step.number}
        </span>
        <h3 className="text-hero-3 font-bold text-fg leading-[1.1]">
          {step.title}
        </h3>
      </div>
      <p className="text-lg text-fg text-balance leading-[1.3]">
        {step.description}
      </p>
    </div>
  );
}

function StepImage({ step }: { step: JourneyStep }) {
  return (
    <div className="w-full aspect-[555/518] rounded-card overflow-hidden bg-panel">
      {step.image ? (
        <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-sm text-fg-muted">{step.title}</span>
        </div>
      )}
    </div>
  );
}

const defaultSteps: JourneyStep[] = [
  {
    number: "01",
    title: "Order Capture",
    description:
      "Customer places an order via your custom-branded platform, offering a premium, native-feeling checkout experience.",
  },
  {
    number: "02",
    title: "Routing & Inventory",
    description:
      "OrderBase instantly routes the order to the nearest operational branch, automatically updating centralized stock to prevent overselling.",
  },
  {
    number: "03",
    title: "Fulfillment & Tracking",
    description:
      "The kitchen receives a streamlined ticket while the integrated courier app handles dispatching and live status updates.",
  },
];
