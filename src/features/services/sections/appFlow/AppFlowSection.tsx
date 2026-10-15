"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { easeOutSoft } from "@/lib/motion";
import { flowPosition } from "./flowPosition";
import type { FlowStep } from "./screens";
import { APP_SCREENS } from "./steps";

// three.js only loads (client-side) for this section.
const PhoneScene = dynamic(() => import("./PhoneScene"), { ssr: false });

/** Scroll length per stop, in viewport heights. */
const STOP_SVH = 85;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Mobile-app flow, told by a realistic 3D phone centred in front of the copy:
 * the section pins while the phone (an iPhone 16 in a matte yellow case)
 * makes a full turn for each step, its screen swapping — while its back
 * faces you — to another of our real app designs. The step title sits behind it on the
 * left, the description on the right. At the end it lies on its back, screen
 * glowing, showing one last design (or the whole flow, if there is no extra
 * screen). Reduced motion: a plain list.
 */
export function AppFlowSection({ steps, eyebrow = "How we build your app" }: { steps: FlowStep[]; eyebrow?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [index, setIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => setIndex(flowPosition(p, steps.length).index));

  const done = index >= steps.length;
  const step = steps[Math.min(index, steps.length - 1)];

  if (reduced) {
    return (
      <Section theme="dark" className="py-20 md:py-28">
        <p className="mb-6 text-sm font-medium uppercase tracking-1 text-yellow">{eyebrow}</p>
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-yellow">{pad(i + 1)}</span>
              <h3 className="text-xl font-semibold text-balance">{s.title}</h3>
              <p className="text-base text-grey-500 text-balance">{s.description}</p>
            </li>
          ))}
        </ol>
      </Section>
    );
  }

  return (
    <div ref={ref} className="relative" style={{ height: `${(steps.length + 1) * STOP_SVH + 100}svh` }}>
      <Section theme="dark" className="sticky top-0 h-svh overflow-hidden">
        {/* Copy sits behind the phone: title to its left, description to its
            right, both tucked in toward the middle so the phone overlaps them. */}
        <div className="relative grid h-svh grid-rows-2 items-center md:grid-cols-2 md:grid-rows-1 md:gap-96">
          <div className="flex flex-col gap-4 self-start pt-28 md:items-end md:self-center md:pt-0 md:text-right">
            <p className="text-sm font-medium uppercase tracking-1 text-yellow">{eyebrow}</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.h2
                key={done ? "done" : index}
                className="text-hero-3 font-bold text-balance md:text-hero-1"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.45, ease: easeOutSoft }}
              >
                {done ? "Idea to App Store" : step.title}
              </motion.h2>
            </AnimatePresence>
          </div>
          <div className="flex flex-col gap-6 self-end pb-16 md:self-center md:pb-0">
            <div className="flex items-end gap-3 font-bold">
              <span className="text-hero-2 leading-none tabular-nums">{done ? pad(steps.length) : pad(index + 1)}</span>
              <span className="pb-1 text-xl text-grey-500">/ {pad(steps.length)}</span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={done ? "done" : index}
                className="max-w-md text-lg text-grey-500 text-balance md:text-2xl"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.45, ease: easeOutSoft }}
              >
                {done
                  ? "Every stage, one accountable partner — from the first idea to an app in your customers' hands."
                  : step.description}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* The phone, centred in front of the copy */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <PhoneScene progress={scrollYProgress} steps={steps} screens={APP_SCREENS} />
        </div>

        {/* Progress along the bottom */}
        <div className="absolute inset-x-0 bottom-8 z-20">
          <div className="container-page flex justify-center gap-2">
            {steps.map((s, i) => (
              <span
                key={s.title}
                className={`h-1 w-12 rounded-pill transition-colors duration-500 ${i <= index ? "bg-yellow" : "bg-white/15"}`}
              />
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
