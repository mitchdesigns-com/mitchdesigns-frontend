"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import { Media } from "@/components/ui/Media";
import { featuredCover } from "./listCovers";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion";
import type { CaseStudy } from "@/lib/cms/types";
import { LiquidCursor } from "@/components/ui/LiquidCursor";

const DRAG_THRESHOLD = 50;
/** Autoplay: time each project stays centred while the stage is on screen. */
const AUTOPLAY_MS = 2500;

// ── Layout constants (px, based on design at ~1512px) ──────────────────────
const CENTER_W = 928; // 58rem
const SIDE_W = 560; // 35rem
const GAP = 120; // layout gap; the 3D turn pulls side cards ~60px inwards, leaving ~60px visible
const CARD_AR = 940 / 580; // image width / height — the mockup covers' shape
const META_H = 120; // first-paint estimate for the title + year rows; the real height is measured

type Slot = "left" | "center" | "right" | "hiddenLeft" | "hiddenRight";

type SlotGeom = {
  x: number;
  /** Turn toward the stage centre, degrees (3D, seen through the stage perspective). */
  rotateY: number;
  /** Depth push, px — negative sits further back. */
  z: number;
  scale: number;
  opacity: number;
  zIndex: number;
  width: number;
  /** Black wash over the image — side cards read further away. */
  dim: number;
};

type Dims = { center: number; side: number; offset: number; height: number };

// Coverflow geometry derived from the viewport so the center card always fits
// with the side cards peeking at the edges (desktop keeps the design values).
function getDims(vw: number): Dims {
  const desktop = vw >= 1024;
  const center = desktop ? CENTER_W : Math.max(240, vw * 0.82);
  const side = center * (SIDE_W / CENTER_W);
  const gap = desktop ? GAP : 44;
  const offset = center / 2 + gap + side / 2;
  const height = center / CARD_AR + META_H;
  return { center, side, offset, height };
}

// Coverflow: side cards turn their faces toward the centre (left card's inner
// edge recedes, outer edge comes forward — and mirrored on the right), sit a
// step back and dim; cards off-stage swing further round and fade out.
function buildSlotMap(d: Dims): Record<Slot, SlotGeom> {
  const off = d.offset;
  return {
    left: { x: -off, rotateY: 32, z: -140, scale: 0.94, opacity: 1, zIndex: 1, width: d.side, dim: 0.45 },
    center: { x: 0, rotateY: 0, z: 0, scale: 1, opacity: 1, zIndex: 10, width: d.center, dim: 0 },
    right: { x: off, rotateY: -32, z: -140, scale: 0.94, opacity: 1, zIndex: 1, width: d.side, dim: 0.45 },
    hiddenLeft: { x: -off * 2.2, rotateY: 55, z: -420, scale: 0.8, opacity: 0, zIndex: 0, width: d.side, dim: 0.8 },
    hiddenRight: { x: off * 2.2, rotateY: -55, z: -420, scale: 0.8, opacity: 0, zIndex: 0, width: d.side, dim: 0.8 },
  };
}

// One spring for every property so position, turn and depth stay in step.
const CARD_SPRING = { type: "spring", stiffness: 170, damping: 26, mass: 1 } as const;

function getSlot(idx: number, active: number, n: number): Slot {
  const diff = (((idx - active) % n) + n) % n;
  if (diff === 0) return "center";
  if (diff === 1) return "right";
  if (diff === n - 1) return "left";
  return diff < n / 2 ? "hiddenRight" : "hiddenLeft";
}

// ── Category pill ────────────────────────────────────────────────────────────
function CategoryPill({
  label,
  theme,
}: {
  label: string;
  theme: "dark" | "light";
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-1.5 text-sm ${theme === "dark" ? "bg-card-border text-white" : "bg-border text-black"
        }`}
    >
      {label}
    </span>
  );
}

// ── Single card (renders in any slot) ───────────────────────────────────────
interface CardProps {
  project: CaseStudy;
  slot: Slot;
  geom: SlotGeom;
  theme: "dark" | "light";
  onNext: () => void;
  onPrev: () => void;
  onCenterEnter: () => void;
  onCenterLeave: () => void;
  suppressClickRef: React.MutableRefObject<boolean>;
}

function Card({
  project,
  slot,
  geom,
  theme,
  onNext,
  onPrev,
  onCenterEnter,
  onCenterLeave,
  suppressClickRef,
}: CardProps) {
  const s = geom;
  const isCenter = slot === "center";
  const mockup = featuredCover(project.slug);
  const isLeft = slot === "left";
  const isRight = slot === "right";
  const titleColor = isCenter
    ? theme === "dark"
      ? "text-white"
      : "text-black"
    : "text-white";

  return (
    <motion.div
      animate={{
        x: s.x,
        rotateY: s.rotateY,
        z: s.z,
        scale: s.scale,
        opacity: s.opacity,
        width: s.width,
        zIndex: s.zIndex,
      }}
      transition={CARD_SPRING}
      className="absolute"
      style={{
        left: "50%",
        top: "50%",
        translateX: "-50%",
        translateY: "-50%",
        transformOrigin: "center center",
      }}
    >
      {/* Prev/next hit area for side cards */}
      {(isLeft || isRight) && (
        <button
          type="button"
          aria-label={isLeft ? "Previous project" : "Next project"}
          onClick={isLeft ? onPrev : onNext}
          className="absolute inset-0 z-10"
        />
      )}

      {/* Image — framed in a box whose colour comes from Strapi (project.bgColor) */}
      <div
        className="relative w-full overflow-hidden rounded-sm"
        style={{
          aspectRatio: "940 / 580",
          backgroundColor:
            project.bgColor ??
            (theme === "dark" ? "var(--color-card)" : "var(--color-img-placeholder)"),
        }}
      >
        {/* Our 940×580 mockup cover fills the card (same shape); projects
            without one show their CMS screenshot, framed. */}
        <Media
          src={mockup ?? (project.featuredThumbnail ?? project.cover).url}
          mime={mockup ? null : (project.featuredThumbnail ?? project.cover).mime}
          alt={project.title}
          sizes={isCenter ? "(min-width: 1024px) 928px, 82vw" : "560px"}
          className={mockup ? "object-cover" : "object-contain p-6 md:p-8"}
        />

        {/* Depth wash — side cards recede into the dark */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black"
          initial={false}
          animate={{ opacity: s.dim }}
          transition={CARD_SPRING}
        />

        {/* Center card links to the project; hovering it swaps the stage
            cursor to the "Explore Project" pill. */}
        {isCenter && (
          <Link
            href={`/case-studies/${project.slug}`}
            aria-label={`Explore ${project.title}`}
            onMouseEnter={onCenterEnter}
            onMouseLeave={onCenterLeave}
            onClick={(e) => {
              if (suppressClickRef.current) e.preventDefault();
            }}
            className="absolute inset-0 z-20"
          />
        )}
      </div>

      {/* Meta */}
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/case-studies/${project.slug}`}
            onClick={(e) => e.stopPropagation()}
            className={`line-clamp-2 text-balance font-bold leading-snug hover:underline ${isCenter ? "text-2xl" : "text-lg font-medium"
              } ${titleColor}`}
          >
            {project.title}{`’s Website`}
          </Link>
          {project.services.length > 0 && (
            <CategoryPill label={project.services[0]} theme={theme} />
          )}
        </div>
        {project.year && (
          <span className="text-base text-fg-muted">Since {project.year}</span>
        )}
      </div>
    </motion.div>
  );
}

// ── Dot indicators ───────────────────────────────────────────────────────────
function Dots({
  count,
  active,
  theme,
  onSelect,
}: {
  count: number;
  active: number;
  theme: "dark" | "light";
  onSelect: (i: number) => void;
}) {
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          aria-label={`Go to project ${i + 1}`}
          onClick={() => onSelect(i)}
          className={`h-2 rounded-full transition-all duration-300 ${i === active
              ? "w-6 bg-yellow"
              : theme === "dark"
                ? "w-2 bg-white/30 hover:bg-white/60"
                : "w-2 bg-black/20 hover:bg-black/40"
            }`}
        />
      ))}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
interface FeaturedProjectsProps {
  caseStudies: CaseStudy[];
  theme?: "dark" | "light";
}

export function FeaturedProjects({
  caseStudies,
  theme = "dark",
}: FeaturedProjectsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [overCenter, setOverCenter] = useState(false);
  const n = caseStudies.length;

  // Viewport-derived coverflow geometry. Init to the same value the server uses
  // so the first client render matches the SSR HTML (no hydration mismatch); the
  // effect below syncs to the real width right after mount.
  const [vw, setVw] = useState(1512);
  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const dims = getDims(vw);
  const slotMap = buildSlotMap(dims);

  // Custom cursor position (raw; LiquidCursor adds its own trailing spring)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Drag tracking
  const dragStartX = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wheelCooldown = useRef(false);
  // Set true on a real drag so the trailing click on the center link is ignored.
  const suppressClickRef = useRef(false);

  const goNext = useCallback(() => setActiveIndex((i) => (i + 1) % n), [n]);
  const goPrev = useCallback(() => setActiveIndex((i) => (i - 1 + n) % n), [n]);

  // The stage is as tall as its tallest card — the centre one, whose title
  // can wrap to two lines on phones — so nothing below the image is clipped.
  const cardsRef = useRef<HTMLDivElement>(null);
  const [cardH, setCardH] = useState<number | null>(null);
  useEffect(() => {
    const box = cardsRef.current;
    if (!box) return;
    const cards = [...box.children] as HTMLElement[];
    // Only ever grows at a given width, so the page below doesn't jump as
    // projects with one- and two-line titles rotate through.
    setCardH(null);
    const ro = new ResizeObserver(() =>
      setCardH((h) => Math.max(h ?? 0, ...cards.map((c) => c.offsetHeight))),
    );
    cards.forEach((c) => ro.observe(c));
    return () => ro.disconnect();
  }, [n, vw]);

  // Autoplay while the stage is on screen; pauses under the pointer, and the
  // timer restarts after every move (manual ones included).
  const inView = useInView(stageRef, { amount: 0.4 });
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!inView || isHovering || reduced || n < 2) return;
    const t = setTimeout(goNext, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [inView, isHovering, reduced, n, activeIndex, goNext]);

  // Trackpad horizontal swipe — needs passive:false to preventDefault
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    function onWheel(e: WheelEvent) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (wheelCooldown.current) return;
      if (Math.abs(e.deltaX) > 20) {
        if (e.deltaX > 0) { goNext(); } else { goPrev(); }
        wheelCooldown.current = true;
        setTimeout(() => {
          wheelCooldown.current = false;
        }, 650);
      }
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [goNext, goPrev]);

  if (!n) return null;

  function handleMouseMove(e: React.MouseEvent) {
    const rect = stageRef.current!.getBoundingClientRect();
    rawX.set(e.clientX - rect.left);
    rawY.set(e.clientY - rect.top);
  }

  function handlePointerDown(e: React.PointerEvent) {
    dragStartX.current = e.clientX;
    suppressClickRef.current = false;
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > DRAG_THRESHOLD) {
      // Real drag — advance and swallow the click that follows pointerup.
      suppressClickRef.current = true;
      if (delta < 0) { goNext(); } else { goPrev(); }
    }
    dragStartX.current = null;
  }

  return (
    <Section theme={theme} bleed>
      <div className="py-20">
        {/* Heading */}
        <Reveal className="mb-10 lg:mb-15">
          <h2
            className={`text-center text-hero-2 font-bold ${theme === "dark" ? "text-white" : "text-black"
              }`}
          >
            Featured Projects
          </h2>
        </Reveal>

        {/* Stage wrapper — outer is overflow-visible so cursor isn't clipped */}
        <div
          ref={stageRef}
          className="relative select-none"
          style={{ height: `${cardH ?? dims.height}px`, cursor: "none" }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            setOverCenter(false);
            dragStartX.current = null;
          }}
          onMouseMove={handleMouseMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          {/* Cards — clipped separately. One shared perspective for the whole
              stage (vanishing point at its centre) gives the coverflow depth. */}
          <div ref={cardsRef} className="absolute inset-0 overflow-hidden perspective-distant">
            {caseStudies.map((project, i) => {
              const slot = getSlot(i, activeIndex, n);
              return (
                <Card
                  key={project.slug}
                  project={project}
                  slot={slot}
                  geom={slotMap[slot]}
                  theme={theme}
                  onNext={goNext}
                  onPrev={goPrev}
                  onCenterEnter={() => setOverCenter(true)}
                  onCenterLeave={() => setOverCenter(false)}
                  suppressClickRef={suppressClickRef}
                />
              );
            })}
          </div>

          {/* Custom drag / explore cursor */}
          <LiquidCursor x={rawX} y={rawY} visible={isHovering} explore={overCenter} />
        </div>

        <Dots
          count={n}
          active={activeIndex}
          theme={theme}
          onSelect={setActiveIndex}
        />
      </div>
    </Section>
  );
}
