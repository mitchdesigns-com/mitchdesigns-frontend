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
import { ParallaxImage } from "@/components/motion";
import { UxUiLineIcon } from "@/components/icons/UxUiLineIcon";
import { SolvingLineIcon } from "@/components/icons/SolvingLineIcon";
import { RotatingBadge } from "@/components/ui/RotatingBadge";
import { useHeroRevealOpened } from "@/context/HeroRevealContext";
import { cn } from "@/lib/cn";
import { easeOutSoft } from "@/lib/motion";
import type { HomeAboutSection } from "@/lib/cms/types";
import { CountUp } from "./CountUp";
import { Doodle, type DoodleShape } from "./Doodle";

const DEFAULT_STATS = [
  { value: "20+", unit: "Years", label: "Years of experience," },
  { value: "500+", unit: "Projects", label: "Delivered with Impact" },
  { value: "30+", unit: "Experts", label: "Dedicated Team Members" },
];

// Told as "we", with one "I" (the founding). No em dashes, no colons.
const DEFAULT_BODY = [
  "In 2005, I founded MitchDesigns, and we built our first corporate website in Egypt.",
  "Brands kept asking for more, so we built online stores, mobile apps, dashboards and ERPs, then the campaigns that brought them customers.",
  "Twenty years and 500 projects later, we learned that pretty was never the goal.",
  "Our mission is to transform successful brands digitally.",
  "We give them systems that automate their work for the AI era, and experiences their customers love to use.",
  "We work as partners, not vendors. We share their targets, sit at the same table and stay long after launch.",
  "And we keep everything transparent. Clear scope, clear pricing, honest numbers and no surprises.",
  "We connect design, data and marketing into one platform, so they grow, scale and earn.",
  "And we never stop innovating, so every brand we work with gets a service that stays hassle free, today and for years to come.",
].join("\n\n");

const DEFAULT_SIGNATURE = "Mitch";

// The place and the people behind the letter, shown under it (front-end only).
const STUDIO = {
  main: { src: "/images/studio/office-wide.webp", alt: "The MitchDesigns team at work in the Cairo studio" },
  side: { src: "/images/studio/happy-square.webp", alt: "MitchDesigns team members sharing a laugh in the studio" },
  portrait: { src: "/images/studio/home-portrait.webp", alt: "A MitchDesigns team member focused at his desk" },
};
const BADGE_TEXT = "Since 2005 • Built in Egypt • ";

// Phrases that get a hand-drawn yellow mark as the white sweep passes them.
// Matched against the (CMS-editable) body; a phrase that isn't there is skipped.
// CMS `about.marks` replaces these.
// "bold" just sets the words in bold (`at` pins the spot: "earn" is also in "learned").
type Mark = { phrase: string; shape: DoodleShape | "bold"; at?: number };
const DEFAULT_MARKS: Mark[] = [
  { phrase: "pretty was never the goal", shape: "strike" },
  ...["grow", "scale", "earn"].map((w) => ({ phrase: w, shape: "bold" as const, at: DEFAULT_BODY.lastIndexOf(` ${w}`) + 1 })),
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
// Space kept above and below the pinned block (px).
const PIN_GUTTER = 96;

type Segment = { text: string; start: number; mark?: Mark["shape"] };

function splitMarks(body: string, marks: Mark[]): Segment[] {
  const hits = marks
    .map((m) => ({ ...m, at: m.at != null && body.startsWith(m.phrase, m.at) ? m.at : body.indexOf(m.phrase) }))
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
  paraBreak = false,
}: {
  char: string;
  /** The second newline of a paragraph break: a small gap, not a whole empty line. */
  paraBreak?: boolean;
  write: MotionValue<number>;
  sweep: MotionValue<number>;
  writeAt: number;
  sweepAt: number;
}) {
  const opacity = useTransform(write, [writeAt, writeAt + WRITE_WINDOW], [0, 1]);
  const color = useTransform(sweep, [sweepAt, sweepAt + SWEEP_WINDOW], [GREY, WHITE]);
  if (char === "\n") return paraBreak ? <span aria-hidden className="block h-3" /> : <br />;
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
  marks = DEFAULT_MARKS,
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
    // …and only when the block fits with breathing room above and below
    // (PIN_GUTTER each side); otherwise it scrolls past normally.
    const sync = () => {
      // Content height, without the block's own padding (which differs pinned/unpinned).
      const el = blockRef.current;
      const cs = el ? getComputedStyle(el) : null;
      const h = el && cs ? el.offsetHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) : Infinity;
      const fits = h + PIN_GUTTER * 2 <= window.innerHeight;
      const next = mq.matches && fits;
      pinnedRef.current = next;
      setPinned(next);
    };
    sync();
    mq.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    const ro = new ResizeObserver(sync);
    if (blockRef.current) ro.observe(blockRef.current);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
      ro.disconnect();
    };
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
  const segments = useMemo(() => splitMarks(text, marks), [text, marks]);
  const bodyWriteAt = (i: number) => (i / text.length) * (WRITE_BODY_END - WRITE_WINDOW);
  const bodySweepAt = (i: number) => (i / text.length) * (SWEEP_END - SWEEP_WINDOW);

  const sigChars = (signature ?? "").split("");
  const sigClip = useTransform(write, [WRITE_BODY_END, 1], [
    "inset(-40% 100% -40% -10%)",
    "inset(-40% -10% -40% -10%)",
  ]);
  const sigStep = (SIG_COLOR[1] - SIG_COLOR[0]) / Math.max(1, sigChars.length);

  const shown = introStarted || Boolean(reduced);

  // The collage pixels in as one group once it's on screen.
  const collageRef = useRef<HTMLDivElement>(null);
  // While it scrolls through: the studio shot opens to full height, the
  // portrait sinks below its bottom line and the square grows.
  const { scrollYProgress: collageProgress } = useScroll({
    target: collageRef,
    offset: ["start 0.9", "end 0.4"],
  });
  const still = Boolean(reduced);
  const mainClip = useTransform(collageProgress, [0, 1], [
    still ? "inset(0% 0 0% 0)" : "inset(6% 0 10% 0)",
    "inset(0% 0 0% 0)",
  ]);
  const portraitY = useTransform(collageProgress, [0, 1], ["0%", still ? "0%" : "14%"]);
  const badgeY = useTransform(collageProgress, [0, 1], ["0%", still ? "0%" : "40%"]);
  const squareWidth = useTransform(collageProgress, [0, 1], still ? ["42%", "42%"] : ["36%", "48%"]);

  return (
    <Section theme="dark" bleed>
      <div
        ref={trackRef}
        style={pinned ? { height: `calc(100svh + ${PIN_SCROLL_SVH}svh)` } : undefined}
      >
        {/* Pinned: a full screen with fixed breathing room above and below. */}
        <div className={cn(pinned && "sticky top-0 flex h-svh items-center py-24")}>
          <div
            ref={blockRef}
            className={cn(
              "container-page flex flex-col items-center gap-14 bg-black lg:flex-row lg:items-start lg:justify-between lg:gap-16",
              pinned ? "py-0" : "py-14 lg:py-24",
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
              className="order-2 flex max-w-2xl flex-col items-center gap-10 text-center lg:order-none lg:items-start lg:text-left"
            >
              <p className="text-[1.5rem] leading-snug tracking-[0.01em] text-balance sm:text-[1.75rem] lg:text-about-body">
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
                        paraBreak={char === "\n" && text[seg.start + k - 1] === "\n"}
                      />
                    ));
                    if (!seg.mark) return <Fragment key={seg.start}>{chars}</Fragment>;
                    if (seg.mark === "bold") return <strong key={seg.start} className="font-bold">{chars}</strong>;
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

      {/* Studio collage — the studio large; beside it a small square up top
          and a portrait on the bottom line, the badge pinned over the corner
          where they meet. Each one glitches in from black through yellow. */}
      <div ref={collageRef} className="container-page grid gap-4 pb-20 md:grid-cols-12 md:gap-6 lg:pb-28">
        <motion.div className="aspect-4/3 md:col-span-7" style={{ clipPath: mainClip }}>
          <div className="relative size-full">
            <ParallaxImage
              src={STUDIO.main.src}
              alt={STUDIO.main.alt}
              sizes="(max-width: 768px) 100vw, 58vw"
              className="absolute inset-0"
            />
          </div>
        </motion.div>
        <div className="relative aspect-square md:col-span-5 md:aspect-auto">
          <motion.div className="absolute right-0 top-0 aspect-square" style={{ width: squareWidth }}>
            <div className="relative size-full">
              <ParallaxImage
                src={STUDIO.side.src}
                alt={STUDIO.side.alt}
                sizes="(max-width: 768px) 50vw, 24vw"
                className="absolute inset-0"
              />
            </div>
          </motion.div>
          <motion.div className="absolute bottom-0 left-0 aspect-4/5 w-1/2" style={{ y: portraitY }}>
            <div className="relative size-full">
              <ParallaxImage
                src={STUDIO.portrait.src}
                alt={STUDIO.portrait.alt}
                sizes="(max-width: 768px) 50vw, 21vw"
                imageClassName="object-top"
                className="absolute inset-0"
              />
            </div>
          </motion.div>
          {/* Each gap holds an animated line mark for what we do, centred in it. */}
          <div className="absolute left-0 top-0 flex h-2/5 w-1/2 flex-col items-center justify-center gap-2 text-center md:gap-3">
            <UxUiLineIcon className="size-20 text-white md:size-28 lg:size-36" />
            <span className="text-xs font-medium text-white text-balance md:text-sm">UX & UI</span>
          </div>
          <div className="absolute bottom-0 right-0 flex h-1/2 w-1/2 flex-col items-center justify-center gap-2 text-center md:gap-3">
            <SolvingLineIcon className="size-20 text-white md:size-28 lg:size-36" />
            <span className="text-xs font-medium text-white text-balance md:text-sm">Solving Solutions</span>
          </div>
          <motion.div
            className="absolute left-1/2 top-2/5 z-10 w-1/4 max-w-40 -translate-x-1/2 -translate-y-1/2"
            style={{ y: badgeY }}
          >
            <RotatingBadge text={BADGE_TEXT} className="w-full ring-8 ring-black" />
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
