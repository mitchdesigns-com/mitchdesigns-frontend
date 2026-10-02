"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  cubicBezier,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { HeroRevealContext } from "@/context/HeroRevealContext";

const openEase = cubicBezier(0.65, 0, 0.35, 1);

/**
 * Pins `hero` for one screen of scroll while the content below opens over it
 * from a slit at the viewport's centre, growing to the top and bottom edges.
 * The content is held still (counter-translated) while it opens, then the page
 * scrolls on normally. Reduced motion: plain stacked layout.
 */
export function HeroReveal({
  hero,
  children,
}: {
  hero: ReactNode;
  children: ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // 0 while the hero is fully shown → 1 once the content fills the screen.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // True while the content fills the screen — sections below time their
  // entrances (and reverse them) off this rather than off in-view checks.
  // The gap between the two thresholds stops it flickering at the boundary.
  const [opened, setOpened] = useState(false);
  // Flips a touch before fully open so content starts entering while the
  // band finishes (the eased band is ~95% open at 0.85).
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (p >= 0.85) setOpened(true);
    else if (p < 0.7) setOpened(false);
  });
  useEffect(() => {
    if (scrollYProgress.get() >= 0.85) setOpened(true);
  }, [scrollYProgress]);

  // Hold the content at the top of the viewport while it opens. Dropped to
  // "none" afterwards — any transform would re-anchor `position: fixed`
  // descendants (lightboxes, modals) to this wrapper.
  const transform = useTransform(scrollYProgress, (p) =>
    p >= 1 ? "none" : `translateY(${(p - 1) * 100}svh)`,
  );

  // Half-height of the still-closed band around the centre line, in svh.
  const clipPath = useTransform(scrollYProgress, (p) => {
    if (p >= 1) return "none";
    const gap = 50 * (1 - openEase(Math.max(0, p)));
    return `inset(${gap}svh 0 calc(100% - 100svh + ${gap}svh) 0)`;
  });

  if (!enabled) {
    return (
      <>
        {hero}
        {children}
      </>
    );
  }

  return (
    <HeroRevealContext.Provider value={opened}>
      <div ref={trackRef} className="relative" style={{ height: "200svh" }}>
        <div className="sticky top-0 h-svh overflow-hidden">{hero}</div>
      </div>
      <motion.div
        className="relative z-10 bg-bg"
        style={{ marginTop: "-100svh", transform, clipPath }}
      >
        {children}
      </motion.div>
    </HeroRevealContext.Provider>
  );
}
