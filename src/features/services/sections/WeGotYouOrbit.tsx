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
import { cn } from "@/lib/cn";
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
 *              word over the same stretch
 *   0.76–0.86  "Get Proposal" CTA grows in exactly where the card vanished
 * The eyebrow is "written" on its yellow pill once the scene starts,
 * then tilts; it resets when you scroll back above the section.
 * ------------------------------------------------------------------ */
const SCENE_SCREENS = 3;
/** The card's single journey: paragraph corner → CTA spot. */
const MOVE = { start: 0.04, end: 0.82 };
const TURN = { from: -6 }; // deg — the card's starting tilt
/** With a photo story, where along the card's travel (0–1) each next shot
 *  takes over — the last one lands while the card is still large. */
const STORY_AT = [0, 0.2, 0.4, 0.6];

/** Optional sequence of shots the card flips through as it travels. */
export type OrbitStoryShot = { src: string; alt: string };

type Box = { w: number; h: number; tx: number; ty: number; tw: number; th: number; cx: number; cy: number; pr: number; pt: number; pb: number };
const EMPTY: Box = { w: 0, h: 0, tx: 0, ty: 0, tw: 0, th: 0, cx: 0, cy: 0, pr: 0, pt: 0, pb: 0 };



/**
 * Title with its highlight words written in: each highlight word (black,
 * extra-bold — never yellow text on white) rises in letter by letter, then a
 * hand-drawn yellow underline draws under it. Plays when `on` turns true,
 * reverses when off.
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
  const words = title.split(/\s+/);
  let hi = -1;
  // The whole title writes in one left-to-right sweep (plain words and
  // highlights alike), so no word sits waiting in a gap.
  const LETTER = 0.025;
  const totalLetters = words.reduce((n, w) => n + w.length, 0);
  const writeTime = 0.3 + totalLetters * LETTER;
  let letterAt = 0;
  const letter = (ch: string, j: number, at: number) => (
    <motion.span
      key={j}
      className="inline-block"
      initial={false}
      animate={active ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: "40%", rotate: 8 }}
      transition={
        active
          ? { type: "spring", stiffness: 420, damping: 18, delay: 0.15 + (at + j) * LETTER }
          : { duration: 0.15 }
      }
    >
      {ch}
    </motion.span>
  );

  return (
    <div ref={boxRef} className="relative">
      <Tag className="text-hero-5 text-balance">
        {words.map((word, i) => {
          const bare = word.replace(/[.,!?;:]+$/, "");
          const trail = word.slice(bare.length);
          const space = i < words.length - 1 ? " " : "";
          const at = letterAt;
          letterAt += word.length;
          if (!highlights.includes(bare)) {
            return (
              <Fragment key={i}>
                <span className="sr-only">{word}</span>
                <span aria-hidden className="inline-block">
                  {Array.from(word).map((ch, j) => letter(ch, j, at))}
                </span>
                {space}
              </Fragment>
            );
          }
          hi += 1;
          const k = hi;
          return (
            <Fragment key={i}>
              <span className="relative inline-block font-black">
                <span className="sr-only">{bare}</span>
                <span aria-hidden>
                  {Array.from(bare).map((ch, j) => letter(ch, j, at))}
                </span>
                {/* Hand-drawn underline */}
                <span aria-hidden className="pointer-events-none absolute -inset-x-1 top-full h-3">
                  <svg className="size-full overflow-visible" viewBox="0 0 100 12" preserveAspectRatio="none">
                    <motion.path
                      d="M2 7C14 3 26 9 40 6s28-4 40 1c6 2 12 2 18-1"
                      fill="none"
                      className="stroke-yellow"
                      strokeWidth={3.5}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={false}
                      animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
                      transition={active ? { duration: 0.5, ease: easeInOutSoft, delay: writeTime + k * 0.25 } : { duration: 0.15 }}
                    />
                  </svg>
                </span>
              </span>
              {trail && (
                <>
                  <span className="sr-only">{trail}</span>
                  <span aria-hidden>{Array.from(trail).map((ch, j) => letter(ch, j, at + bare.length))}</span>
                </>
              )}
              {space}
            </Fragment>
          );
        })}
      </Tag>

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

/** Corporate "We Got You" section. Desktop gets the pinned scroll scene;
 *  phones and reduced-motion users get the same content, stacked and still.
 *  The scene is its own component so its scroll tracking attaches to the
 *  pinned wrapper on mount (it isn't rendered on the first, server pass). */
export function WeGotYouOrbit(props: WeGotYouProps & { story?: OrbitStoryShot[] }) {
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
  story,
  scene,
}: WeGotYouProps & { story?: OrbitStoryShot[]; scene: boolean }) {
  // The card shows the CMS image, or flips through a photo story.
  const shots: OrbitStoryShot[] = story?.length ? story : [{ src: image, alt: imageAlt ?? "" }];
  const Title = titleTag;

  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
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
  const [shot, setShot] = useState(0);
  useMotionValueEvent(travel, "change", (t) => {
    let i = 0;
    while (i + 1 < Math.min(shots.length, STORY_AT.length) && t >= STORY_AT[i + 1]) i++;
    setShot(i);
  });
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
          <div className={cn("grid w-full gap-3", shots.length > 1 && "grid-cols-2")}>
            {shots.map((s) => (
              <div key={s.src} className="relative aspect-4/3 overflow-hidden rounded-card">
                <Image src={s.src} alt={s.alt} fill className="object-cover" sizes={shots.length > 1 ? "50vw" : "100vw"} />
              </div>
            ))}
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
            {shots.map((s, i) => (
              <motion.div
                key={s.src}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: i <= shot ? 1 : 0, scale: i === shot ? 1 : 1.06 }}
                transition={{ duration: 0.45, ease: easeOutSoft }}
              >
                <Image src={s.src} alt={i === shot ? s.alt : ""} fill className="object-cover" sizes="22rem" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
    </div>
  );
}
