"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tick } from "@/components/icons/Tick";
import { easeOutSoft } from "@/lib/motion";
import type { ProcessCard, ProcessSectionProps } from "@/lib/cms/types";

/* ------------------------------------------------------------------
 * Process — pinned scroll scene (≥1024px).
 * The section pins while you scroll through the steps:
 *   · left: a big step number that rolls over, the title, and the
 *     step's points ticking in one by one; below, a clickable step
 *     navigator with a yellow progress rail
 *   · right: a stacked deck of the step photos — as a step ends, the
 *     top photo flies up and away with a twist and the next rises
 *     to the front
 * Everything follows scroll position, so scrolling up runs it back.
 * Phones / reduced motion get a clean stacked list instead.
 * ------------------------------------------------------------------ */
const SCREENS_PER_STEP = 0.9;
/** Share of a step the top photo holds still before it flies off. */
const HOLD = 0.6;

/** Step points: the CMS sends rich-text blocks (paragraphs or a list);
 *  local fixtures send plain strings. Both become a list of lines. */
type InlineNode = { text?: string; children?: InlineNode[] };
type Block = { type?: string; children?: InlineNode[] };
const inlineText = (nodes?: InlineNode[]): string =>
  (nodes ?? []).map((n) => n.text ?? inlineText(n.children)).join("");
function toPoints(description: unknown): string[] {
  if (typeof description === "string") return description.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  if (!Array.isArray(description)) return [];
  return (description as Array<string | Block>).flatMap((b) => {
    if (typeof b === "string") return [b];
    if (b?.type === "list") return (b.children ?? []).map((li) => inlineText(li.children ?? [li]));
    return [inlineText(b?.children)];
  }).map((s) => s.trim()).filter(Boolean);
}

function Points({ points, stagger = 0 }: { points: string[]; stagger?: number }) {
  return (
    <ul className="flex flex-col gap-3">
      {points.map((pt, k) => (
        <motion.li
          key={pt}
          className="flex items-start gap-3"
          initial={stagger ? { opacity: 0, x: -16 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: easeOutSoft, delay: 0.15 + k * stagger }}
        >
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-yellow">
            <Tick className="size-4 text-black" />
          </span>
          <span className="text-lg text-balance text-fg-muted">{pt}</span>
        </motion.li>
      ))}
    </ul>
  );
}

/** One photo of the deck. `local` = how far the scroll is into this
 *  card's step (0→1 while it's on top; negative while it waits behind). */
function DeckCard({ step, i, n, p }: { step: ProcessCard; i: number; n: number; p: MotionValue<number> }) {
  // The last photo stays on the deck — nothing comes after it.
  const local = useTransform(p, (v) => (i === n - 1 ? Math.min(v * n - i, HOLD) : v * n - i));
  const y = useTransform(local, (l) => {
    if (l >= 0) return `${-Math.min(1, Math.max(0, (l - HOLD) / (1 - HOLD))) * 118}%`;
    return `${Math.min(-l, 3) * 6}%`; // waiting cards peek out below
  });
  const rotate = useTransform(local, (l) => {
    if (l >= 0) return -Math.min(1, Math.max(0, (l - HOLD) / (1 - HOLD))) * 10;
    return (i % 2 ? 2.5 : -2.5) * Math.min(-l, 1);
  });
  const scale = useTransform(local, (l) => (l >= 0 ? 1 : 1 - Math.min(-l, 3) * 0.06));
  const opacity = useTransform(local, (l) => {
    if (l >= 0) return 1 - Math.min(1, Math.max(0, (l - HOLD - 0.15) / (1 - HOLD - 0.15)));
    return l < -3 ? 0 : 1;
  });
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden rounded-card shadow-soft-lg"
      style={{ y, rotate, scale, opacity, zIndex: n - i }}
    >
      <Image src={step.image} alt={step.imageAlt ?? ""} fill className="object-cover" sizes="50vw" />
    </motion.div>
  );
}

export function ProcessSection({ title, description, processCards }: ProcessSectionProps) {
  const reduced = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const header = <SectionHeader title={title} description={description} />;

  if (!desktop || reduced) {
    return (
      <Section theme="dark" className="py-20 md:py-28">
        <div className="space-y-12">
          {header}
          <ol className="space-y-14">
            {processCards.map((step) => (
              <li key={step.stepNumber} className="grid items-center gap-6 md:grid-cols-2 md:gap-x-16">
                <div className="relative aspect-case-photo overflow-hidden rounded-card">
                  <Image src={step.image} alt={step.imageAlt ?? ""} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <div className="flex flex-col gap-5">
                  <span className="text-hero-4 text-yellow">{String(step.stepNumber).padStart(2, "0")}</span>
                  <h3 className="text-hero-5 text-balance text-fg">{step.title}</h3>
                  <Points points={toPoints(step.description)} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>
    );
  }

  return <ProcessScene header={header} steps={processCards} />;
}

/** Desktop scene — its own component so scroll tracking binds to the pinned
 *  wrapper on mount (it isn't rendered on the server pass). */
function ProcessScene({ header, steps }: { header: React.ReactNode; steps: ProcessCard[] }) {
  const n = steps.length;
  const sceneRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const rail = useTransform(p, [0, 1], [0, 1]);

  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(n - 1, Math.floor(v * n))));
  const step = steps[active];

  // Jump to a step from the navigator.
  const goTo = (i: number) => {
    const el = sceneRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + travel * ((i + 0.3) / n), behavior: "smooth" });
  };

  return (
    <Section theme="dark" className="pt-20 md:pt-28">
      {header}
      <div ref={sceneRef} className="relative" style={{ height: `${n * SCREENS_PER_STEP * 100 + 100}svh` }}>
        <div className="sticky top-0 grid h-svh grid-cols-2 items-center gap-x-16">
          {/* Left — current step */}
          <div className="flex flex-col gap-10">
            <div className="flex min-h-96 flex-col gap-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  className="flex flex-col gap-6"
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35, ease: easeOutSoft }}
                >
                  <span className="flex items-baseline gap-3">
                    <span className="text-hero-1 text-yellow">{String(step.stepNumber).padStart(2, "0")}</span>
                    <span className="text-lg text-fg-muted">/ {String(n).padStart(2, "0")}</span>
                  </span>
                  <h3 className="text-hero-4 text-balance text-fg">{step.title}</h3>
                  <Points points={toPoints(step.description)} stagger={0.08} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Step navigator with progress rail */}
            <nav aria-label="Process steps" className="relative pl-5">
              <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 rounded-pill bg-yellow/25" />
              <motion.span
                aria-hidden
                className="absolute inset-y-0 left-0 w-0.5 origin-top rounded-pill bg-yellow"
                style={{ scaleY: rail }}
              />
              <ol className="flex flex-col gap-2">
                {steps.map((s, i) => (
                  <li key={s.stepNumber}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={i === active ? "step" : undefined}
                      className={`flex items-center gap-3 text-left text-base transition-colors duration-300 ${
                        i === active ? "font-bold text-fg" : "text-fg-muted hover:text-fg"
                      }`}
                    >
                      <span className={`tabular-nums ${i <= active ? "text-yellow" : ""}`}>
                        {String(s.stepNumber).padStart(2, "0")}
                      </span>
                      {s.title}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {/* Right — photo deck */}
          <div className="relative aspect-case-photo">
            {steps.map((s, i) => (
              <DeckCard key={s.stepNumber} step={s} i={i} n={n} p={p} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
