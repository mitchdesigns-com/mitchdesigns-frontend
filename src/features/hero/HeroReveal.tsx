"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  animate,
  cubicBezier,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { HeroRevealContext } from "@/context/HeroRevealContext";

const openEase = cubicBezier(0.65, 0, 0.35, 1);
/** Length of the automatic open / close (s). */
const REVEAL_S = 1.1;

/**
 * The hero is pinned for one screen. The content below opens over it from a
 * slit at the viewport's centre, growing to the top and bottom edges — but
 * as one automatic move, not scrubbed: the first scroll down plays the full
 * opening and lands exactly on the content; scrolling back up into the hero
 * plays the closing. There's never a half-open in-between state, and input
 * is held while it plays. Reduced motion: plain stacked layout.
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

  // Scroll position through the pinned screen — only used to keep the
  // content held at the top of the viewport while the hero is pinned.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  // How open the reveal is (0 = hero, 1 = content) — time-driven.
  const open = useMotionValue(0);

  // True while the content fills the screen — sections below time their
  // entrances (and reverse them) off this rather than off in-view checks.
  const [opened, setOpened] = useState(false);
  useMotionValueEvent(open, "change", (o) => {
    if (o >= 0.85) setOpened(true);
    else if (o < 0.7) setOpened(false);
  });

  useEffect(() => {
    if (!enabled) return;
    const track = trackRef.current;
    if (!track) return;

    const trackTop = () => track.getBoundingClientRect().top + window.scrollY;
    const trackEnd = () => trackTop() + track.offsetHeight - window.innerHeight;
    let busy = false;
    let lastY = window.scrollY;

    // Hold wheel / touch / keyboard scrolling while the reveal plays.
    const block = (e: Event) => {
      if (busy) e.preventDefault();
    };
    const blockKeys = (e: KeyboardEvent) => {
      if (busy && ["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"].includes(e.key)) {
        e.preventDefault();
      }
    };

    const play = (to: 0 | 1) => {
      busy = true;
      animate(open, to, {
        duration: REVEAL_S,
        ease: [0.65, 0, 0.35, 1],
        onComplete: () => {
          // Land exactly on the content (or back at the very top).
          window.scrollTo({ top: to === 1 ? trackEnd() : trackTop(), behavior: "instant" });
          lastY = window.scrollY;
          busy = false;
        },
      });
    };

    // Start state matches where the page loads.
    const y0 = window.scrollY;
    open.set(y0 >= trackEnd() - 2 ? 1 : 0);
    if (y0 > trackTop() + 2 && y0 < trackEnd() - 2) {
      window.scrollTo({ top: trackTop(), behavior: "instant" });
    }

    const onScroll = () => {
      if (busy) return;
      const y = window.scrollY;
      const down = y > lastY;
      lastY = y;
      const inZone = y > trackTop() + 1 && y < trackEnd() - 1;
      if (!inZone) return;
      if (down && open.get() < 0.5) play(1);
      else if (!down && open.get() > 0.5) play(0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    window.addEventListener("keydown", blockKeys);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      window.removeEventListener("keydown", blockKeys);
    };
  }, [enabled, open]);

  // Keep the content at the top of the viewport wherever the scroll sits in
  // the pinned screen. Dropped to "none" once past it — any transform would
  // re-anchor `position: fixed` descendants (lightboxes, modals).
  const transform = useTransform(scrollYProgress, (p) =>
    p >= 1 ? "none" : `translateY(${(p - 1) * 100}svh)`,
  );

  // Half-height of the still-closed band around the centre line, in svh.
  const clipPath = useTransform(open, (o) => {
    if (o >= 1) return "none";
    const gap = 50 * (1 - openEase(Math.max(0, o)));
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
