"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export type PileItem = { id: number; name: string; category: string; logo?: string };

type Placement = {
  x: number;
  y: number;
  rotate: number;
  /** Drop order — bottom rows land first so cards settle onto each other. */
  order: number;
  /** Where the card starts inside the stage (px from its top) before falling. */
  startY: number;
  spin: number;
};

type Layout = { cw: number; ch: number; places: Placement[] };

// Small seeded PRNG: the pile looks random but is identical on every load.
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Tidy heap in px for a W x H stage: cards sit edge to edge in brick-like rows
 * (each row centred over the gaps of the one below), overlapping only a sliver
 * so every logo stays readable, with a slight natural tilt.
 * Desktop: rows of cap, cap, cap-1, … hugging the bottom-right. Mobile: 2-wide.
 */
function layoutPile(n: number, W: number, H: number, desktop: boolean): Layout {
  const rand = rng(20261002);
  const jitter = (amp: number) => (rand() * 2 - 1) * amp;

  const cw = desktop ? Math.min(290, Math.max(220, W * 0.2)) : Math.min(185, W * 0.49);
  const ch = desktop ? cw * 0.42 : 76;
  const step = cw * 0.99; // cards just touch side by side
  const rise = ch * 0.96; // and overlap a sliver vertically
  // Even rows (4-4-4 on desktop, 2-wide on mobile) — no lone card on top.
  const cap = desktop ? Math.max(2, Math.min(4, Math.floor((W * 0.9) / step))) : 2;

  const rows: number[] = [];
  for (let left = n, r = 0; left > 0; r++) {
    const size = cap;
    rows.push(Math.min(size, left));
    left -= rows[r];
  }

  const places: Placement[] = [];
  const edge = 6; // keep jitter/tilt inside the content edge
  let center = W - edge - (rows[0] * step) / 2;
  rows.forEach((count, r) => {
    const rowW = count * step;
    if (r > 0) {
      // Same-size row: shift a quarter card (brick offset); smaller row: centre
      // over the row below, which lands it on the gaps naturally.
      // Alternate a quarter-card left/right so rows sit like bricks.
      const shift = count === rows[r - 1] ? (r % 2 ? -step / 4 : step / 4) : 0;
      center = Math.min(W - edge - rowW / 2, Math.max(rowW / 2 + edge, center + shift));
    }
    const top = H - ch - r * rise;
    const rowStart = places.length;
    const shuffled = Array.from({ length: count }, (_, i) => i).sort(() => rand() - 0.5);
    for (let i = 0; i < count; i++) {
      places.push({
        x: center - rowW / 2 + i * step + jitter(3),
        y: top + jitter(2),
        rotate: jitter(r === 0 ? 2 : 4),
        order: rowStart + shuffled[i],
        startY: rand() * Math.min(80, H * 0.1),
        spin: jitter(20),
      });
    }
  });
  return { cw, ch, places };
}

export function TechPile({ items }: { items: PileItem[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number; desktop: boolean } | null>(null);
  // Keyed to the stage's bottom edge, where the pile sits: drop once it's
  // 40px inside the screen (whole pile in view); scrolling back up, reverse as
  // soon as it slips 60px below the fold — while most of the pile is still
  // visible, so the lift-out is seen. The gap between the two avoids flicker.
  // Read straight from the stage's position on scroll — simple and reliable.
  const [dropped, setDropped] = useState(false);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom <= vh - 40) setDropped(true);
      else if (r.bottom > vh + 60) setDropped(false);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () =>
      setSize({ w: el.clientWidth, h: el.clientHeight, desktop: window.innerWidth >= 1024 });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const layout = useMemo(
    () => (size ? layoutPile(items.length, size.w, size.h, size.desktop) : null),
    [items.length, size],
  );
  const landed = dropped || Boolean(reduced);

  return (
    <div ref={stageRef} className="relative h-120 w-full lg:absolute lg:inset-0 lg:h-auto">
      {layout &&
        items.map((t, i) => {
          const p = layout.places[i];
          return (
            <motion.div
              key={t.id}
              className="absolute left-0 top-0 flex items-center gap-3 rounded-card-sm border border-tech-card-border bg-white p-3 shadow-tech-card lg:gap-5 lg:p-5"
              style={{ width: layout.cw, height: layout.ch, x: p.x, zIndex: 10 + i }}
              // Starts near the top of the stage (inside the section), fades in
              // and falls into its place in the pile.
              initial={reduced ? false : { y: p.startY, rotate: p.rotate + p.spin, opacity: 0 }}
              animate={
                landed
                  ? { y: p.y, rotate: p.rotate, opacity: 1 }
                  : { y: p.startY, rotate: p.rotate + p.spin, opacity: 0 }
              }
              transition={
                landed
                  ? {
                      type: "spring",
                      stiffness: 150,
                      damping: 14,
                      mass: 1,
                      delay: reduced ? 0 : p.order * 0.09,
                      opacity: { duration: 0.25, delay: reduced ? 0 : p.order * 0.09 },
                    }
                  : // Reverse: each card visibly flies back up to the top of the
                    // stage, last-landed first, and only fades near the end.
                    {
                      duration: 0.6,
                      ease: [0.5, 0, 0.75, 0],
                      delay: (items.length - 1 - p.order) * 0.05,
                      opacity: {
                        duration: 0.25,
                        ease: "easeIn",
                        delay: (items.length - 1 - p.order) * 0.05 + 0.35,
                      },
                    }
              }
              whileHover={{ rotate: 0, scale: 1.05, zIndex: 60, transition: { type: "spring", stiffness: 300, damping: 18 } }}
            >
              {t.logo ? (
                <Image
                  src={t.logo}
                  alt={t.name}
                  width={60}
                  height={60}
                  className="size-9 shrink-0 object-contain lg:size-15"
                  draggable={false}
                />
              ) : (
                <span className="size-9 shrink-0 rounded-lg bg-bg-alt lg:size-15" />
              )}
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium leading-[125%] text-space-grey lg:text-xl">
                  {t.name}
                </span>
                <span className="truncate text-xs font-medium leading-[125%] text-fg-muted lg:text-base">
                  {t.category}
                </span>
              </div>
            </motion.div>
          );
        })}
    </div>
  );
}
