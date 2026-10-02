"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { Section } from "@/components/layout/Section";
import { useHeroRevealOpened } from "@/context/HeroRevealContext";
import { cn } from "@/lib/cn";
import { easeOutSoft } from "@/lib/motion";
import type { HomeAboutSection } from "@/lib/cms/types";
import { CountUp } from "./CountUp";
import { Doodle, type DoodleShape } from "./Doodle";

const DEFAULT_STATS = [
  { value: "20+", unit: "Years", label: "Years of experience," },
  { value: "400+", unit: "Projects", label: "Delivered with Impact" },
  { value: "30+", unit: "Experts", label: "Dedicated Team Members" },
];

const DEFAULT_BODY =
  "Since 2005, I've built Mitch Designs in Egypt with one belief, businesses deserve more than templates. As a website design company in Egypt, we craft custom design that turns into results. From mobile app development to e-commerce solutions, from custom platforms to booking systems, every project is built for conversions.\n\nWe don’t chase “pretty” — we chase performance marketing, SEO, and measurable success. For us, it’s always about the user, the customer, and their experience. That’s why Mitch Designs has become the partner businesses trust when growth can’t wait.";

const DEFAULT_SIGNATURE = "Mitch";

// Phrases that get a hand-drawn yellow mark as the white sweep passes them.
// Matched against the (CMS-editable) body; a phrase that isn't there is skipped.
const MARKS: { phrase: string; shape: DoodleShape }[] = [
  { phrase: "“pretty”", shape: "strike" },
  { phrase: "measurable success", shape: "wave" },
];

// Colour stops (mirror the grey-600 / white / yellow tokens — interpolated in JS).
const GREY = "#515151";
const WHITE = "#ffffff";
const YELLOW = "#ffdb00";

// ── Intro timeline, in seconds after the section is fully revealed ─────────────
const STATS_START = 0.05;
const STAT_STAGGER = 0.18;
const WRITE_START = 0.45;
const WRITE_DURATION = 2.8;
// Share of the writing timeline taken by the body; the signature pens in after.
const WRITE_BODY_END = 0.84;
const WRITE_WINDOW = 0.02;
// How far (in writing progress) the scroll visuals trail the pen, so a mark
// never starts on a phrase that isn't fully written yet.
const WRITE_LAG = 0.06;

// ── Scroll timeline, 0–1 across the pinned stretch ─────────────────────────────
const SWEEP_END = 0.76; // grey → white sweep across the body finishes here
const SWEEP_WINDOW = 0.035; // how long a single character takes to turn white
const SIG_COLOR: [number, number] = [0.78, 0.88];
const SIG_UNDERLINE: [number, number] = [0.85, 0.98];
// Extra scroll (beyond one screen) the section stays pinned for on desktop.
const PIN_SCROLL_SVH = 160;

type Segment = { text: string; start: number; mark?: DoodleShape };

function splitMarks(body: string): Segment[] {
  const hits = MARKS.map((m) => ({ ...m, at: body.indexOf(m.phrase) }))
    .filter((m) => m.at >= 0)
    .sort((a, b) => a.at - b.at);
  const segments: Segment[] = [];
  let cursor = 0;
  for (const hit of hits) {
    if (hit.at < cursor) continue; // overlapping phrase — keep the first
    if (hit.at > cursor) {
      segments.push({ text: body.slice(cursor, hit.at), start: cursor });
    }
    segments.push({ text: hit.phrase, start: hit.at, mark: hit.shape });
    cursor = hit.at + hit.phrase.length;
  }
  if (cursor < body.length) segments.push({ text: body.slice(cursor), start: cursor });
  return segments;
}

// `custom` is [index, count] — entering staggers top-down, leaving bottom-up.
const statVariants: Variants = {
  hidden: ([i, n]: [number, number]) => ({
    opacity: 0,
    y: 32,
    filter: "blur(8px)",
    transition: { delay: (n - 1 - i) * 0.06, duration: 0.4, ease: "easeIn" },
  }),
  shown: ([i]: [number, number]) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: STATS_START + i * STAT_STAGGER, duration: 0.8, ease: easeOutSoft },
  }),
};

function BodyChar({
  char,
  write,
  sweep,
  writeAt,
  sweepAt,
}: {
  char: string;
  write: MotionValue<number>;
  sweep: MotionValue<number>;
  writeAt: number;
  sweepAt: number;
}) {
  const opacity = useTransform(write, [writeAt, writeAt + WRITE_WINDOW], [0, 1]);
  const color = useTransform(sweep, [sweepAt, sweepAt + SWEEP_WINDOW], [GREY, WHITE]);
  if (char === "\n") return <br />;
  return <motion.span style={{ opacity, color }}>{char}</motion.span>;
}

function SignatureChar({
  char,
  sweep,
  range,
}: {
  char: string;
  sweep: MotionValue<number>;
  range: [number, number];
}) {
  const color = useTransform(sweep, range, [GREY, YELLOW]);
  return <motion.span style={{ color }}>{char}</motion.span>;
}

/**
 * Homepage About block. Choreography: dark and empty while the hero reveal
 * opens → stats rise in one by one and count up → the copy writes itself in
 * grey and "Mitch" is penned in → on scroll (pinned on desktop) a white sweep
 * runs through the copy, drawing yellow marks as it passes key phrases, and
 * ends by turning "Mitch" yellow with a hand-drawn underline.
 */
export function AboutSection({
  stats = DEFAULT_STATS,
  body = DEFAULT_BODY,
  signature = DEFAULT_SIGNATURE,
  cta = { label: "About Us", href: "/about" },
}: Partial<HomeAboutSection> = {}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Intro trigger: the hero reveal being open, or plain in-view elsewhere
  // (/v2). Both switch back off, which plays the intro in reverse.
  const opened = useHeroRevealOpened();
  const inView = useInView(blockRef, { amount: 0.35 });
  const introStarted = Boolean(opened ?? inView);

  // Pin only where the whole block fits on one screen.
  const [pinned, setPinned] = useState(false);
  const pinnedRef = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 700px)");
    const sync = () => {
      pinnedRef.current = mq.matches;
      setPinned(mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // One scroll driver for the sweep, fed by whichever layout is active.
  const sweep = useMotionValue(0);
  const { scrollYProgress: pinProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  // Unpinned (mobile): follow the copy column only — the stats stack below it
  // there — so "Mitch" finishes while it's still low on screen.
  const { scrollYProgress: flowProgress } = useScroll({
    target: textRef,
    offset: ["start 0.7", "end 0.75"],
  });
  useMotionValueEvent(pinProgress, "change", (v) => {
    if (pinnedRef.current && !reduced) sweep.set(v);
  });
  useMotionValueEvent(flowProgress, "change", (v) => {
    if (!pinnedRef.current && !reduced) sweep.set(v);
  });
  useEffect(() => {
    sweep.set(reduced ? 1 : (pinned ? pinProgress : flowProgress).get());
  }, [pinned, reduced, sweep, pinProgress, flowProgress]);

  // Writing timeline — time-based: writes on reveal, un-writes (quicker) when
  // the reveal closes again. Resumes from wherever it was if interrupted.
  const write = useMotionValue(0);
  useEffect(() => {
    if (reduced) {
      write.set(1);
      return;
    }
    const from = write.get();
    const controls = introStarted
      ? animate(write, 1, {
          delay: from === 0 ? WRITE_START : 0,
          duration: WRITE_DURATION * (1 - from),
          ease: "linear",
        })
      : animate(write, 0, { duration: 0.6 * from, ease: "easeIn" });
    return () => controls.stop();
  }, [introStarted, reduced, write]);

  // The scroll visuals (white sweep, marks, Mitch) are capped at how far the
  // writing has got — scrolling fast can't draw marks over unwritten text, and
  // un-writing on the way back up pulls them back with it. "Mitch" itself only
  // colours once the signature is fully penned.
  const drive = useTransform([sweep, write], ([s, w]: number[]) => {
    const written =
      w >= 1
        ? 1
        : Math.min(
            SWEEP_END,
            (Math.max(0, w - WRITE_LAG) / (WRITE_BODY_END - WRITE_WINDOW)) *
              (SWEEP_END - SWEEP_WINDOW),
          );
    return Math.min(s, written);
  });

  const text = body ?? "";
  const segments = useMemo(() => splitMarks(text), [text]);
  const bodyWriteAt = (i: number) => (i / text.length) * (WRITE_BODY_END - WRITE_WINDOW);
  const bodySweepAt = (i: number) => (i / text.length) * (SWEEP_END - SWEEP_WINDOW);

  const sigChars = (signature ?? "").split("");
  const sigClip = useTransform(write, [WRITE_BODY_END, 1], [
    "inset(-40% 100% -40% -10%)",
    "inset(-40% -10% -40% -10%)",
  ]);
  const sigStep = (SIG_COLOR[1] - SIG_COLOR[0]) / Math.max(1, sigChars.length);

  const shown = introStarted || Boolean(reduced);

  return (
    <Section theme="dark" bleed>
      <div
        ref={trackRef}
        style={pinned ? { height: `calc(100svh + ${PIN_SCROLL_SVH}svh)` } : undefined}
      >
        {/* Pinned: a full screen with fixed breathing room above and below. */}
        <div className={cn(pinned && "sticky top-0 flex h-svh items-center py-20")}>
          <div
            ref={blockRef}
            className={cn(
              "container-page flex flex-col items-center gap-14 bg-black lg:flex-row lg:items-start lg:justify-between lg:gap-16",
              pinned ? "py-0" : "py-14",
            )}
          >
            {/* Left — stats + CTA. Below lg this column dissolves (`contents`)
                so its pieces order in the stack: stats → copy → CTA. */}
            <div className="contents lg:flex lg:w-auto lg:shrink-0 lg:flex-col lg:items-center lg:justify-between lg:gap-11 lg:self-stretch">
              <ul className="order-1 flex flex-col gap-11 lg:order-none">
                {stats.map(({ value, unit, label }, i) => (
                  <motion.li
                    key={value}
                    custom={[i, stats.length]}
                    variants={statVariants}
                    initial={reduced ? false : "hidden"}
                    animate={shown ? "shown" : "hidden"}
                    className="flex flex-col items-start"
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Invisible final value reserves the width so the
                          counting digits never shift the unit sideways. */}
                      <span className="grid font-bold text-[3.5rem] leading-none text-white sm:text-[4rem]">
                        <span aria-hidden className="invisible col-start-1 row-start-1">
                          {value}
                        </span>
                        <CountUp
                          value={value}
                          play={shown}
                          delay={reduced ? 0 : STATS_START + i * STAT_STAGGER + 0.1}
                          duration={reduced ? 0 : 1.4}
                          className="col-start-1 row-start-1 min-w-0"
                        />
                      </span>
                      <span className="font-light text-lg text-white">{unit}</span>
                    </div>
                    <span className="text-[13px] tracking-[0.01em] text-fg-muted">
                      {label}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className="order-3 w-full lg:order-none"
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={
                  shown
                    ? {
                        delay: STATS_START + stats.length * STAT_STAGGER + 0.25,
                        duration: 0.7,
                        ease: easeOutSoft,
                      }
                    : { duration: 0.3, ease: "easeIn" }
                }
              >
                <Link
                  href={cta?.href ?? "/about"}
                  className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#373737] px-9 py-4 text-sm font-medium text-white transition-colors hover:bg-[#444]"
                >
                  {cta?.label ?? "About Us"}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                    <path
                      d="M4.167 10h11.666M10 4.167 15.833 10 10 15.833"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </motion.div>
            </div>

            {/* Right — body copy + signature */}
            <div
              ref={textRef}
              className="order-2 flex max-w-[895px] flex-col items-center gap-10 text-center lg:order-none lg:items-start lg:text-left"
            >
              <p className="text-[1.5rem] leading-normal tracking-[0.01em] text-balance sm:text-[1.75rem] lg:text-about-body">
                <span className="sr-only">{text}</span>
                <span aria-hidden>
                  {segments.map((seg) => {
                    const chars = seg.text.split("").map((char, k) => (
                      <BodyChar
                        key={k}
                        char={char}
                        write={write}
                        sweep={drive}
                        writeAt={bodyWriteAt(seg.start + k)}
                        sweepAt={bodySweepAt(seg.start + k)}
                      />
                    ));
                    if (!seg.mark) return <Fragment key={seg.start}>{chars}</Fragment>;
                    // The mark draws as the sweep crosses its phrase, finishing
                    // just after the last letter turns white.
                    const from = bodySweepAt(seg.start);
                    const to = bodySweepAt(seg.start + seg.text.length) + SWEEP_WINDOW + 0.03;
                    return (
                      <span key={seg.start} className="relative inline-block whitespace-nowrap">
                        {chars}
                        <Doodle shape={seg.mark} progress={drive} range={[from, to]} />
                      </span>
                    );
                  })}
                </span>
              </p>

              <span
                className="relative font-signature leading-none"
                // Height-aware so the pinned screen always fits (phones unchanged: 80px).
                style={{ fontSize: "clamp(5rem, min(10vw, 13svh), 10rem)" }}
              >
                <span className="sr-only">{signature}</span>
                <motion.span aria-hidden className="inline-block" style={{ clipPath: sigClip }}>
                  {sigChars.map((char, k) => (
                    <SignatureChar
                      key={k}
                      char={char}
                      sweep={drive}
                      range={[SIG_COLOR[0] + sigStep * k, SIG_COLOR[0] + sigStep * (k + 1)]}
                    />
                  ))}
                </motion.span>
                <Doodle shape="swash" progress={drive} range={SIG_UNDERLINE} strokeWidth={4} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
