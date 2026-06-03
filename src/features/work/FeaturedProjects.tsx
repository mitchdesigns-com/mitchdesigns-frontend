"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion";
import { DragCursor } from "@/components/icons/DragCursor";
import type { CaseStudy } from "@/lib/cms/types";

const DRAG_THRESHOLD = 50;

// ── Layout constants (px, based on design at ~1512px) ──────────────────────
const CENTER_W = 928; // 58rem
const SIDE_W = 560; // 35rem
const GAP = 24; // 1.5rem
const CARD_AR = 911 / 800; // image width / height
const META_H = 96; // title + year row below the image

type Slot = "left" | "center" | "right" | "hiddenLeft" | "hiddenRight";

type SlotGeom = {
  x: number;
  rotate: number;
  scale: number;
  opacity: number;
  zIndex: number;
  width: number;
};

type Dims = { center: number; side: number; offset: number; height: number };

// Coverflow geometry derived from the viewport so the center card always fits
// with the side cards peeking at the edges (desktop keeps the design values).
function getDims(vw: number): Dims {
  const desktop = vw >= 1024;
  const center = desktop ? CENTER_W : Math.max(240, vw * 0.82);
  const side = center * (SIDE_W / CENTER_W);
  const gap = desktop ? GAP : 16;
  const offset = center / 2 + gap + side / 2;
  const height = center / CARD_AR + META_H;
  return { center, side, offset, height };
}

function buildSlotMap(d: Dims): Record<Slot, SlotGeom> {
  const off = d.offset;
  return {
    left: { x: -off, rotate: -5, scale: 1, opacity: 1, zIndex: 1, width: d.side },
    center: { x: 0, rotate: 0, scale: 1, opacity: 1, zIndex: 10, width: d.center },
    right: { x: off, rotate: 5, scale: 1, opacity: 1, zIndex: 1, width: d.side },
    hiddenLeft: { x: -off * 2.4, rotate: -8, scale: 0.7, opacity: 0, zIndex: 0, width: d.side },
    hiddenRight: { x: off * 2.4, rotate: 8, scale: 0.7, opacity: 0, zIndex: 0, width: d.side },
  };
}

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
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-1.5 text-sm ${
        theme === "dark" ? "bg-card-border text-white" : "bg-border text-black"
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
}

function Card({ project, slot, geom, theme, onNext, onPrev }: CardProps) {
  const s = geom;
  const isCenter = slot === "center";
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
        rotate: s.rotate,
        scale: s.scale,
        opacity: s.opacity,
        width: s.width,
        zIndex: s.zIndex,
      }}
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
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

      {/* Image */}
      <div className="relative w-full overflow-hidden rounded-sm" style={{ aspectRatio: "911 / 800" }}>
        <Image
          src={project.cover.url}
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Meta */}
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/case-studies/${project.slug}`}
            onClick={(e) => e.stopPropagation()}
            className={`font-bold leading-snug hover:underline ${
              isCenter ? "text-2xl" : "text-lg font-medium"
            } ${titleColor}`}
          >
            {project.title}
          </Link>
          <CategoryPill label={project.services[0]} theme={theme} />
        </div>
        <span className="text-base text-fg-muted">Since {project.year}</span>
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
          className={`h-2 rounded-full transition-all duration-300 ${
            i === active
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
  const n = caseStudies.length;

  // Viewport-derived coverflow geometry (lazy init avoids a desktop→mobile flash)
  const [vw, setVw] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1512,
  );
  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const dims = getDims(vw);
  const slotMap = buildSlotMap(dims);

  // Custom cursor position
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const cursorX = useSpring(rawX, { stiffness: 400, damping: 35 });
  const cursorY = useSpring(rawY, { stiffness: 400, damping: 35 });

  // Drag tracking
  const dragStartX = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wheelCooldown = useRef(false);

  const goNext = useCallback(() => setActiveIndex((i) => (i + 1) % n), [n]);
  const goPrev = useCallback(() => setActiveIndex((i) => (i - 1 + n) % n), [n]);

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
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > DRAG_THRESHOLD) {
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
            className={`text-center text-hero-2 font-bold ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Featured Projects
          </h2>
        </Reveal>

        {/* Stage wrapper — outer is overflow-visible so cursor isn't clipped */}
        <div
          ref={stageRef}
          className="relative select-none"
          style={{ height: `${dims.height}px`, cursor: "none" }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            dragStartX.current = null;
          }}
          onMouseMove={handleMouseMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          {/* Cards — clipped separately */}
          <div className="absolute inset-0 overflow-hidden">
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
                />
              );
            })}
          </div>

          {/* Custom drag cursor */}
          <motion.div
            className="pointer-events-none absolute z-50"
            style={{
              left: cursorX,
              top: cursorY,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{
              opacity: isHovering ? 1 : 0,
              scale: isHovering ? 1 : 0.5,
            }}
            transition={{ duration: 0.2 }}
          >
            <DragCursor size={100} />
          </motion.div>
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
