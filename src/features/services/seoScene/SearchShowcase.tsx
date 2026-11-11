"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { RevealItem, RevealStagger } from "@/components/motion";
import { RichText } from "@/components/ui/RichText";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { SparklesIcon } from "@/components/icons/SparklesIcon";
import { Star } from "@/components/icons/Star";
import { ArrowUp } from "@/components/icons/ArrowUp";
import { noOrphan } from "@/lib/noOrphan";
import type { DesignsAdaptProps } from "@/lib/cms/types";
import { cn } from "@/lib/cn";
import { easeOutSoft } from "@/lib/motion";

/** One frame of the phone demos (ms); every timing below is in frames. */
const FRAME = 50;
/** Frames in one loop of a demo. */
const LOOP = 260;

/** What the visitor's customer types (illustration only, hidden from screen readers). */
const GOOGLE_QUERY = "best sofa store cairo";
const AI_QUESTION = "Where should I buy a sofa in Cairo?";

/** A frame counter that runs while the phone is on screen and loops. */
function useFrames(on: boolean) {
  const [f, setF] = useState(0);
  useEffect(() => {
    if (!on) return;
    const id = window.setInterval(() => setF((n) => (n + 1) % LOOP), FRAME);
    return () => window.clearInterval(id);
  }, [on]);
  return f;
}

/**
 * SEO page: one search strategy, two places customers look. Each CMS card
 * (`designsAdapt` cards, Google first, then AI) gets its own row with a coded
 * phone showing it from the customer's side: the brand climbing to the top of
 * Google, then the brand recommended in an AI answer.
 */
export function SearchShowcase({ title, description, cards }: DesignsAdaptProps) {
  const demos = [GooglePhone, AiPhone];
  return (
    <Section className="overflow-hidden py-20 md:py-28">
      <RevealStagger className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <RevealItem>
          <h2 className="text-hero-4 font-bold text-balance md:text-hero-3">{noOrphan(title)}</h2>
        </RevealItem>
        {description ? (
          <RevealItem>
            <RichText content={description} className="text-lg text-fg-muted" />
          </RevealItem>
        ) : null}
      </RevealStagger>

      <div className="mt-16 flex flex-col gap-20 md:mt-24 md:gap-28">
        {cards.slice(0, 2).map((card, i) => {
          const Demo = demos[i];
          return (
            <div key={card.title} className="grid items-center gap-10 md:grid-cols-12 md:gap-10 lg:gap-16">
              <RevealStagger className={cn("flex flex-col gap-5 md:col-span-5", i === 1 && "md:order-2 md:col-start-8")}>
                <RevealItem>
                  <h3 className="text-hero-4 font-bold text-balance">{card.title}</h3>
                </RevealItem>
                <RevealItem>
                  <RichText content={card.description} checkList className="flex flex-col gap-5 text-lg text-fg-muted" />
                </RevealItem>
              </RevealStagger>
              <div className={cn("md:col-span-7", i === 1 && "md:order-1 md:col-span-6")}>
                <Stage>
                  <Demo />
                </Stage>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/** Yellow glow, ground shadow and the phone rising in once it scrolls into view. */
function Stage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.3, once: true });
  const reduced = useReducedMotion();
  return (
    <div ref={ref} aria-hidden className="relative mx-auto flex w-full max-w-xl items-center justify-center py-10">
      <motion.div
        className="absolute inset-1/5 rounded-full bg-yellow blur-3xl"
        initial={reduced ? false : { opacity: 0, scale: 0.6 }}
        animate={seen ? { opacity: 0.55, scale: 1 } : undefined}
        transition={{ duration: 1.2, ease: easeOutSoft }}
      />
      <div className="absolute bottom-1/12 left-1/2 h-6 w-2/5 -translate-x-1/2 rounded-full bg-black/20 blur-xl" />
      <motion.div
        className="relative"
        initial={reduced ? false : { y: 160, rotate: 8, opacity: 0 }}
        animate={seen ? { y: 0, rotate: 0, opacity: 1 } : undefined}
        transition={{ type: "spring", stiffness: 90, damping: 16 }}
      >
        <Phone>{children}</Phone>
      </motion.div>
    </div>
  );
}

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative aspect-9/19 w-56 rounded-phone bg-black p-2.5 shadow-soft-lg sm:w-60 lg:w-64">
      <div className="relative size-full overflow-hidden rounded-phone-screen bg-white">
        <div className="absolute top-2 left-1/2 z-20 h-5 w-20 -translate-x-1/2 rounded-pill bg-black" />
        <div className="absolute inset-0 flex flex-col px-4 pt-12 pb-5">{children}</div>
      </div>
    </div>
  );
}

/** Live while on screen; reduced motion shows the finished frame. */
function useDemo(ref: React.RefObject<HTMLDivElement | null>, end: number) {
  const inView = useInView(ref, { amount: 0.5 });
  const reduced = useReducedMotion();
  const f = useFrames(inView && !reduced);
  return reduced ? end : f;
}

/** Grey bars standing in for a competitor's result. */
function SkeletonResult() {
  return (
    <div className="flex flex-col gap-1.5 rounded-card-sm bg-panel p-3">
      <div className="flex items-center gap-2">
        <span className="size-4 rounded-full bg-border" />
        <span className="h-2 w-1/3 rounded-pill bg-border" />
      </div>
      <span className="h-2.5 w-4/5 rounded-pill bg-fg-muted/25" />
      <span className="h-2 w-full rounded-pill bg-border" />
    </div>
  );
}

/** Google from the customer's side: the query typed, results in, the brand climbs to #1 and gets the tap. */
function GooglePhone() {
  const ref = useRef<HTMLDivElement>(null);
  const f = useDemo(ref, 200);
  const typed = GOOGLE_QUERY.slice(0, Math.min(GOOGLE_QUERY.length, Math.max(0, f - 6)));
  const results = f >= 44;
  const top = f >= 96;
  const tapped = f >= 140 && f < 160;
  const order = top ? ["brand", "a", "b", "c", "d"] : ["a", "b", "c", "brand", "d"];

  return (
    <div ref={ref} className="flex size-full flex-col gap-4">
      <p className="text-center text-2xl font-bold tracking-tight">Google</p>
      <div className="flex items-center gap-2 rounded-pill border border-border px-3 py-2.5 text-xs shadow-soft">
        <SearchIcon size={14} className="shrink-0 text-fg-muted" />
        <span className="truncate">
          {typed}
          {f < 44 && <span className="ml-px inline-block h-3 w-px animate-pulse bg-fg align-middle" />}
        </span>
      </div>
      <div className="relative flex flex-col gap-2">
        {order.map((key, i) =>
          key === "brand" ? (
            <motion.div
              key={key}
              layout
              transition={{ layout: { type: "spring", stiffness: 140, damping: 18 } }}
              initial={false}
              animate={{ opacity: results ? 1 : 0, y: results ? 0 : 12, scale: tapped ? 0.96 : 1 }}
              className={cn(
                "relative flex flex-col gap-1 rounded-card-sm border p-3 transition-colors duration-500",
                top ? "border-yellow bg-yellow-soft" : "border-transparent bg-panel",
              )}
            >
              <span className="flex items-center gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-black text-2xs font-bold text-yellow">Y</span>
                <span className="flex flex-col">
                  <span className="text-xs font-semibold">Your brand</span>
                  <span className="text-2xs text-fg-muted">yourbrand.com</span>
                </span>
              </span>
              <span className="text-sm leading-tight font-semibold">Sofas and furniture in Cairo, free delivery</span>
              <span className="flex items-center gap-1 text-xs text-fg-muted">
                <Star size={10} filled className="text-yellow" /> 4.9 · 1,200 reviews
              </span>
              <AnimatePresence>
                {top && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.25, 1] }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="absolute -top-2 -right-2 flex items-center gap-0.5 rounded-pill bg-black px-2 py-0.5 text-xs font-bold text-yellow"
                  >
                    <ArrowUp size={10} /> #1
                  </motion.span>
                )}
              </AnimatePresence>
              {tapped && (
                <motion.span
                  className="absolute top-1/2 left-1/2 size-8 rounded-full bg-black/20"
                  initial={{ scale: 0, opacity: 1, x: "-50%", y: "-50%" }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 0.7 }}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key={key}
              layout
              transition={{ layout: { type: "spring", stiffness: 140, damping: 18 }, delay: results ? i * 0.08 : 0 }}
              initial={false}
              animate={{ opacity: results ? 1 : 0, y: results ? 0 : 12 }}
            >
              <SkeletonResult />
            </motion.div>
          ),
        )}
      </div>
    </div>
  );
}

/** An AI assistant from the customer's side: the question asked, then the brand recommended and cited. */
function AiPhone() {
  const ref = useRef<HTMLDivElement>(null);
  const f = useDemo(ref, 220);
  const sent = f >= 46;
  const typed = sent ? "" : AI_QUESTION.slice(0, Math.min(AI_QUESTION.length, Math.max(0, f - 6)));
  const thinking = f >= 50 && f < 78;
  const answer = f >= 78;
  const card = f >= 100;
  const cited = f >= 130;

  return (
    <div ref={ref} className="flex size-full flex-col">
      <p className="flex items-center justify-center gap-1.5 text-sm font-semibold">
        <SparklesIcon size={16} /> ChatGPT
      </p>
      <div className="flex flex-1 flex-col gap-3 pt-5">
        <AnimatePresence>
          {sent && (
            <motion.p
              key="q"
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: easeOutSoft }}
              className="max-w-4/5 self-end rounded-card-sm bg-panel px-3 py-2 text-xs text-balance"
            >
              {AI_QUESTION}
            </motion.p>
          )}
        </AnimatePresence>
        {thinking && (
          <div className="flex gap-1 px-1">
            {[0, 1, 2].map((d) => (
              <motion.span
                key={d}
                className="size-1.5 rounded-full bg-fg-muted"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
              />
            ))}
          </div>
        )}
        {answer && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-xs leading-relaxed text-balance"
          >
            Here is the store most people recommend for sofas in Cairo
          </motion.p>
        )}
        {card && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="relative flex flex-col gap-1.5 rounded-card-sm border border-yellow bg-yellow-soft p-3"
          >
            <span className="flex items-center gap-2 text-xs">
              <span className="flex size-5 items-center justify-center rounded-full bg-black text-2xs font-bold text-yellow">Y</span>
              <span className="font-semibold">Your brand</span>
              <span className="ml-auto flex items-center gap-0.5 text-fg-muted">
                <Star size={10} filled className="text-yellow" /> 4.9
              </span>
            </span>
            <span className="text-xs leading-snug text-fg-muted text-balance">
              Known for quality sofas, fair prices and free delivery across Cairo
            </span>
            <AnimatePresence>
              {cited && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: [0.6, 1.1, 1] }}
                  transition={{ duration: 0.45 }}
                  className="self-start rounded-pill bg-black px-2 py-0.5 text-2xs font-semibold text-white"
                >
                  yourbrand.com
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        )}
        {cited && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col gap-3 px-1">
            <span className="flex flex-col gap-1.5">
              <span className="h-2 w-full rounded-pill bg-border" />
              <span className="h-2 w-3/4 rounded-pill bg-border" />
            </span>
            <span className="flex flex-col gap-1.5">
              <span className="text-2xs font-semibold text-fg-muted">Sources</span>
              <span className="flex gap-1.5">
                <span className="rounded-pill bg-black px-2 py-0.5 text-2xs font-semibold text-yellow">yourbrand.com</span>
                <span className="h-4 w-12 rounded-pill bg-panel" />
                <span className="h-4 w-10 rounded-pill bg-panel" />
              </span>
            </span>
          </motion.div>
        )}
      </div>
      <div className="flex items-center gap-2 rounded-pill border border-border px-3 py-2 text-xs">
        <span className="flex-1 truncate text-fg-muted">
          {typed || "Ask anything"}
          {!sent && typed && <span className="ml-px inline-block h-3 w-px animate-pulse bg-fg align-middle" />}
        </span>
        <span className={cn("flex size-6 items-center justify-center rounded-full transition-colors", typed ? "bg-black text-white" : "bg-panel text-fg-muted")}>
          <ArrowUp size={12} />
        </span>
      </div>
    </div>
  );
}
