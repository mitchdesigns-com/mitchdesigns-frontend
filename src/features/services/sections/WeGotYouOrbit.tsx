"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { HeaderCtaInView } from "@/components/layout/HeaderCtaInView";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { RichText } from "@/components/ui/RichText";
import { isLeadsHref } from "@/config/nav";
import { easeInOutSoft, easeOutSoft } from "@/lib/motion";
import type { WeGotYouProps } from "@/lib/cms/types";
import { blocksToText } from "@/lib/cms/blocks";

/* ------------------------------------------------------------------
 * Scroll scene (≥768px): the section pins for SCENE_SCREENS viewports.
 * Everything is driven by scroll progress, so scrolling back up plays
 * it in reverse.
 *   0.04–0.82  image card travels, at an even pace, from the paragraph's
 *              top-right corner down the right side and into the CTA's
 *              spot, turning as it goes and shrinking over the second
 *              half until it's gone; the paragraph is written word by
 *              word over the same stretch; doodles draw and float
 *   0.76–0.86  "Get Proposal" CTA grows in exactly where the card vanished
 * The eyebrow is "written" on its yellow pill once the scene starts,
 * then tilts; it resets when you scroll back above the section.
 * ------------------------------------------------------------------ */
const SCENE_SCREENS = 3;
/** The card's single journey: paragraph corner → CTA spot. */
const MOVE = { start: 0.04, end: 0.82 };
const TURN = { from: -6 }; // deg — the card's starting tilt

/** Small hand-drawn doodles (60×60 local units), placed as fractions of
 *  the stage. Each draws itself over [from, to] and floats up as you
 *  scroll, at its own speed. Kept clear of the card's path. */
const DOODLES = [
  { d: "M30 30c4-2 8 2 6 6-2 6-12 6-14 0-3-8 6-16 14-14 10 2 14 14 8 22", at: [0.1, 0.2], from: 0.04, to: 0.22, drift: 40 },
  { d: "M4 44C14 16 32 10 40 24s6 26 18 8", at: [0.2, 0.62], from: 0.12, to: 0.3, drift: 70 },
  { d: "M4 30c6-12 12-12 16 0s10 12 16 0 10-12 16 0", at: [0.07, 0.84], from: 0.2, to: 0.4, drift: 30 },
  { d: "M6 44C14 20 40 14 44 30c3 12-14 14-14 4 0-12 16-20 26-16M50 12l6 6-7 5", at: [0.9, 0.1], from: 0.3, to: 0.5, drift: 55 },
  { d: "M30 10c14 0 22 12 18 24S24 50 14 40 10 16 24 12c10-3 22 2 26 10", at: [0.3, 0.1], from: 0.4, to: 0.58, drift: 45 },
  { d: "M10 20l12 10-4 6 16 8-4 6 18 6", at: [0.92, 0.9], from: 0.5, to: 0.68, drift: 35 },
] as const;

type Box = { w: number; h: number; tx: number; ty: number; tw: number; th: number; cx: number; cy: number; pr: number; pt: number; pb: number };
const EMPTY: Box = { w: 0, h: 0, tx: 0, ty: 0, tw: 0, th: 0, cx: 0, cy: 0, pr: 0, pt: 0, pb: 0 };


type Mark = { x: number; y: number; w: number; h: number };

/**
 * Title with its highlight words written in: each highlight word (black,
 * extra-bold — never yellow text on white) rises in letter by letter, then a
 * hand-drawn yellow oval draws around it, then a curved arrow draws from the
 * first highlight to the last. Plays when `on` turns true, reverses when off.
 */
function HighlightTitle({
  title,
  highlights = [],
  Tag,
  on,
}: {
  title: string;
  highlights?: string[];
  Tag: "h2" | "h3";
  /** Driven by the scroll scene; omitted → plays when the title is in view. */
  on?: boolean;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boxRef, { amount: 0.8 });
  const active = on ?? inView;
  const markRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [marks, setMarks] = useState<Mark[]>([]);

  useLayoutEffect(() => {
    const measure = () => {
      const box = boxRef.current?.getBoundingClientRect();
      if (!box) return;
      setMarks(
        markRefs.current.filter(Boolean).map((el) => {
          const r = el!.getBoundingClientRect();
          return { x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height };
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (boxRef.current) ro.observe(boxRef.current);
    return () => ro.disconnect();
  }, [title]);

  const words = title.split(/\s+/);
  let hi = -1;
  const LETTER = 0.045;
  const letterCount = (w: string) => w.replace(/[.,!?;:]+$/, "").length;
  const writeTime = 0.3 + words.filter((w) => highlights.includes(w.replace(/[.,!?;:]+$/, ""))).reduce((t, w) => t + letterCount(w) * LETTER, 0);

  // Curved arrow from under the first highlight to under the last.
  const first = marks[0];
  const last = marks[marks.length - 1];
  const arrow =
    first && last && marks.length > 1
      ? (() => {
          const x1 = first.x + first.w / 2, y1 = first.y + first.h + 6;
          const x2 = last.x + last.w / 2, y2 = last.y + last.h + 6;
          const dip = Math.max(y1, y2) + 26;
          const head = 9;
          return {
            body: `M${x1} ${y1} C${x1 + 10} ${dip}, ${x2 - 10} ${dip}, ${x2} ${y2 + 2}`,
            head: `M${x2 - head} ${y2 + head + 2} L${x2} ${y2 + 2} L${x2 + head * 0.9} ${y2 + head + 3}`,
          };
        })()
      : null;

  return (
    <div ref={boxRef} className={`relative ${marks.length > 1 ? "mb-4" : ""}`}>
      <Tag className="text-hero-5 text-balance">
        {words.map((word, i) => {
          const bare = word.replace(/[.,!?;:]+$/, "");
          const trail = word.slice(bare.length);
          const space = i < words.length - 1 ? " " : "";
          if (!highlights.includes(bare)) return <Fragment key={i}>{word}{space}</Fragment>;
          hi += 1;
          const k = hi;
          const start = 0.15 + k * (letterCount(word) * LETTER + 0.1);
          return (
            <Fragment key={i}>
              <span
                ref={(el) => {
                  markRefs.current[k] = el;
                }}
                className="relative inline-block font-black"
              >
                <span className="sr-only">{bare}</span>
                <span aria-hidden>
                  {Array.from(bare).map((ch, j) => (
                    <motion.span
                      key={j}
                      className="inline-block"
                      initial={false}
                      animate={active ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: "40%", rotate: 8 }}
                      transition={
                        active
                          ? { type: "spring", stiffness: 420, damping: 18, delay: start + j * LETTER }
                          : { duration: 0.15 }
                      }
                    >
                      {ch}
                    </motion.span>
                  ))}
                </span>
                {/* Hand-drawn oval around the word */}
                <span aria-hidden className="pointer-events-none absolute -inset-x-3 -inset-y-2">
                <svg
                  className="size-full overflow-visible"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M8 52C6 22 40 6 62 9c26 3 36 22 32 44-4 24-38 40-64 34C9 82 3 64 12 40 18 26 34 15 52 13"
                    fill="none"
                    className="stroke-yellow"
                    strokeWidth={3}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    initial={false}
                    animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
                    transition={active ? { duration: 0.6, ease: easeInOutSoft, delay: writeTime + k * 0.25 } : { duration: 0.15 }}
                  />
                </svg>
                </span>
              </span>
              {trail}
              {space}
            </Fragment>
          );
        })}
      </Tag>

      {/* Curved arrow: first highlight → last highlight */}
      {arrow && (
        <svg aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-visible">
          <motion.path
            d={arrow.body}
            fill="none"
            className="stroke-yellow"
            strokeWidth={3}
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
            transition={active ? { duration: 0.7, ease: easeInOutSoft, delay: writeTime + 0.6 } : { duration: 0.15 }}
          />
          <motion.path
            d={arrow.head}
            fill="none"
            className="stroke-yellow"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
            transition={active ? { duration: 0.25, ease: easeOutSoft, delay: writeTime + 1.25 } : { duration: 0.1 }}
          />
        </svg>
      )}
    </div>
  );
}

/** Yellow pill eyebrow: the pill paints in left→right while the letters are
 *  written, then it tips into a slight tilt. Reverses when `on` turns off. */
function WrittenEyebrow({ text, on }: { text: string; on: boolean }) {
  const chars = Array.from(text);
  return (
    <motion.span
      className="inline-block"
      initial={false}
      animate={{ rotate: on ? -4 : 0 }}
      transition={
        on
          ? { type: "spring", stiffness: 260, damping: 14, delay: 0.25 + chars.length * 0.035 }
          : { duration: 0.2 }
      }
    >
      <motion.span
        className="inline-flex rounded-pill bg-yellow px-4 py-1.5 text-base font-bold text-black"
        initial={false}
        animate={{ clipPath: on ? "inset(0 0% 0 0 round 999px)" : "inset(0 100% 0 0 round 999px)" }}
        transition={{ duration: on ? 0.25 + chars.length * 0.035 : 0.2, ease: on ? easeInOutSoft : easeOutSoft }}
      >
        <span className="sr-only">{text}</span>
        <span aria-hidden className="whitespace-pre">
          {chars.map((c, i) => (
            <motion.span
              key={i}
              initial={false}
              animate={{ opacity: on ? 1 : 0 }}
              transition={{ duration: 0.12, delay: on ? 0.08 + i * 0.035 : 0 }}
            >
              {c}
            </motion.span>
          ))}
        </span>
      </motion.span>
    </motion.span>
  );
}

/** One word of the scroll-written paragraph: pale until the scroll reaches
 *  its slot, then inks in. Words share the card's travel, so the last word
 *  lands as the card reaches the CTA. */
function ScrollWord({ word, p, from, to }: { word: string; p: MotionValue<number>; from: number; to: number }) {
  const opacity = useTransform(p, [from, to], [0.14, 1]);
  return (
    <motion.span aria-hidden style={{ opacity }}>
      {word}{" "}
    </motion.span>
  );
}

/** A small doodle that draws itself between two scroll points and floats
 *  upward as the scene scrolls. Drawn at 1.3× its 60-unit box. */
function Doodle({ d, x, y, from, to, drift, p }: {
  d: string; x: number; y: number; from: number; to: number; drift: number; p: MotionValue<number>;
}) {
  const length = useTransform(p, [from, to], [0, 1]);
  const float = useTransform(p, [0, 1], [drift / 2, -drift]);
  return (
    <g transform={`translate(${x - 39} ${y - 39}) scale(1.3)`}>
      <motion.path
        d={d}
        fill="none"
        className="stroke-yellow"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: length, y: float }}
      />
    </g>
  );
}

/** Corporate "We Got You" section. Desktop gets the pinned scroll scene;
 *  phones and reduced-motion users get the same content, stacked and still.
 *  The scene is its own component so its scroll tracking attaches to the
 *  pinned wrapper on mount (it isn't rendered on the first, server pass). */
export function WeGotYouOrbit(props: WeGotYouProps) {
  const reduced = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const scene = desktop && !reduced;
  return <OrbitScene key={scene ? "scene" : "static"} {...props} scene={scene} />;
}

function OrbitScene({
  title,
  titleTag = "h2",
  titleHighlights,
  label,
  description,
  image,
  imageAlt,
  cta,
  theme = "light",
  scene,
}: WeGotYouProps & { scene: boolean }) {
  const Title = titleTag;

  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const [box, setBox] = useState<Box>(EMPTY);
  const boxRef = useRef<Box>(EMPTY);
  // Bumped on every measurement so position transforms recompute even
  // before the next scroll event.
  const measured = useMotionValue(0);

  // Measure the stage, the text block and where the CTA sits.
  useLayoutEffect(() => {
    if (!scene) return;
    const measure = () => {
      const s = stageRef.current?.getBoundingClientRect();
      const t = textRef.current?.getBoundingClientRect();
      const c = ctaRef.current?.getBoundingClientRect();
      const pa = paraRef.current?.getBoundingClientRect();
      if (!s || !t || !c || !pa) return;
      const next = {
        w: s.width, h: s.height,
        tx: t.left - s.left, ty: t.top - s.top, tw: t.width, th: t.height,
        cx: c.left - s.left + c.width / 2, cy: c.top - s.top + c.height / 2,
        pr: pa.right - s.left, pt: pa.top - s.top, pb: pa.bottom - s.top,
      };
      boxRef.current = next;
      setBox(next);
      measured.set(measured.get() + 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (stageRef.current) ro.observe(stageRef.current);
    if (textRef.current) ro.observe(textRef.current);
    return () => ro.disconnect();
  }, [scene, measured]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  // Eyebrow writes itself as soon as the scene starts; resets above it.
  const [written, setWritten] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => setWritten(v > 0.01));

  // Card: one continuous journey from the paragraph's top-right corner to
  // the CTA's spot — down the right side of the copy, curving in — at an
  // even pace, turning as it goes and shrinking over the second half so it
  // vanishes exactly where the CTA grows in. Fully visible at the start.
  const route = () => {
    const b = boxRef.current;
    const cw = cardRef.current?.offsetWidth ?? 0;
    const ch = cardRef.current?.offsetHeight ?? 0;
    const p0 = {
      x: Math.min(b.w - cw / 2 - 8, b.pr + cw * 0.3),
      y: Math.max(ch / 2 + 8, b.pt + ch * 0.2),
    };
    const p2 = { x: b.cx, y: b.cy };
    const c = { x: p0.x, y: p2.y }; // bend: straight down first, then in
    return { p0, c, p2 };
  };
  const bezier = (k: number) => {
    const { p0, c, p2 } = route();
    const u = 1 - k;
    return { x: u * u * p0.x + 2 * u * k * c.x + k * k * p2.x, y: u * u * p0.y + 2 * u * k * c.y + k * k * p2.y };
  };
  // Even pace: re-time the curve by distance travelled.
  const evenAt = (t: number) => {
    const N = 60;
    const pts = Array.from({ length: N + 1 }, (_, i) => bezier(i / N));
    const cum = [0];
    for (let i = 1; i <= N; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
    const target = t * cum[N];
    let j = 0;
    while (j < N - 1 && cum[j + 1] < target) j++;
    const f = (target - cum[j]) / (cum[j + 1] - cum[j] || 1);
    return { x: pts[j].x + (pts[j + 1].x - pts[j].x) * f, y: pts[j].y + (pts[j + 1].y - pts[j].y) * f };
  };
  const travel = useTransform(p, [MOVE.start, MOVE.end], [0, 1], { clamp: true });
  const x = useTransform([travel, measured], ([t]: number[]) => evenAt(t).x);
  const yPx = useTransform([travel, measured], ([t]: number[]) => evenAt(t).y);
  const rotate = useTransform(
    p,
    [0, 0.18, 0.34, 0.5, 0.66, MOVE.end],
    [TURN.from, 8, -5, 7, -3, 0],
  );
  const cardScale = useTransform(p, [MOVE.start, 0.43, MOVE.end], [1, 1, 0]);
  const cardOpacity = useTransform(p, [MOVE.end - 0.03, MOVE.end], [1, 0]);
  const ctaScale = useTransform(p, [MOVE.end - 0.06, MOVE.end + 0.04], [0.4, 1]);
  const ctaOpacity = useTransform(p, [MOVE.end - 0.06, MOVE.end + 0.02], [0, 1]);

  // Paragraph written word by word across the card's travel.
  const paragraph = blocksToText(description) ?? "";
  const words = paragraph.split(/\s+/).filter(Boolean);
  const wordSpan = (MOVE.end - MOVE.start) / Math.max(words.length + 0.5, 1);

  const ctaButton = cta && (
    <HeaderCtaInView active={isLeadsHref(cta.href)}>
      <Button size="lg" asChild>
        <Link href={cta.href} className="flex items-center gap-2">
          {cta.label}
          <ArrowRight size={20} />
        </Link>
      </Button>
    </HeaderCtaInView>
  );

  const copy = (
    <>
      {label && (scene ? <WrittenEyebrow text={label} on={written} /> : (
        <span className="inline-flex -rotate-4 rounded-pill bg-yellow px-4 py-1.5 text-base font-bold text-black">
          {label}
        </span>
      ))}
      <HighlightTitle title={title} highlights={titleHighlights} Tag={Title} on={scene ? written : undefined} />
      {scene ? (
        <p ref={paraRef} className="text-scroll-copy text-balance text-black">
          <span className="sr-only">{paragraph}</span>
          {words.map((w, i) => (
            <ScrollWord
              key={i}
              word={w}
              p={p}
              from={MOVE.start + i * wordSpan}
              to={MOVE.start + (i + 1.5) * wordSpan}
            />
          ))}
        </p>
      ) : (
        <RichText content={description} className="text-2xl font-medium text-black" />
      )}
    </>
  );

  /* Phones / reduced motion: the same content, stacked and static. */
  if (!scene) {
    return (
      <Section theme={theme} className="py-20 md:py-28">
        <div className="flex flex-col items-center gap-8 text-center">
          {copy}
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-card">
            <Image src={image} alt={imageAlt ?? ""} fill className="object-cover" sizes="100vw" />
          </div>
          {ctaButton}
        </div>
      </Section>
    );
  }

  return (
    <div ref={sectionRef} className="relative" style={{ height: `${SCENE_SCREENS * 100}svh` }}>
    <Section theme={theme} className="sticky top-0 overflow-hidden">
      <div ref={stageRef} className="relative flex h-svh items-center justify-center">
        {/* Flying doodles */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full"
          viewBox={`0 0 ${box.w || 1} ${box.h || 1}`}
        >
          {box.w > 0 &&
            DOODLES.map((dd, i) => (
              <Doodle key={i} {...dd} x={dd.at[0] * box.w} y={dd.at[1] * box.h} p={p} />
            ))}
        </svg>

        {/* Centred copy + CTA slot (the CTA grows in where the card vanishes) */}
        <div ref={textRef} className="relative z-10 flex max-w-5xl flex-col items-center gap-8 text-center">
          {copy}
          <motion.div ref={ctaRef} style={{ scale: ctaScale, opacity: ctaOpacity }}>
            {ctaButton}
          </motion.div>
        </div>

        {/* Image card */}
        <motion.div
          className="pointer-events-none absolute top-0 left-0 z-20"
          // Origin at the anchor (= card centre, since the card is pulled back
          // by half its size) so it scales and turns in place.
          style={{ x, y: yPx, rotate, scale: cardScale, opacity: cardOpacity, transformOrigin: "0px 0px" }}
        >
          <div
            ref={cardRef}
            className="relative aspect-4/3 w-orbit-card -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-card shadow-soft-lg"
          >
            <Image src={image} alt={imageAlt ?? ""} fill className="object-cover" sizes="22rem" />
          </div>
        </motion.div>
      </div>
    </Section>
    </div>
  );
}
