"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

/** Seconds over which cells start breaking up, and how long glitch bars run. */
const SPREAD = 1.1;
const GLITCH = 0.7;

/** A cell's flicker: fills (null = see-through) held until each `until`. */
type Step = { until: number; fill: "black" | "yellow" | null };
type Cell = { x: number; y: number; size: number; at: number; steps: Step[] };
type Bar = { y: number; h: number; from: number; to: number; x: number; w: number };

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** 2–5 harsh flickers between yellow, black and see-through, ending clear. */
function flicker(): Step[] {
  const fills: Step["fill"][] = ["yellow"];
  const n = 1 + Math.floor(Math.random() * 4);
  for (let i = 0; i < n; i++) {
    const last = fills[fills.length - 1];
    const options = (["yellow", "black", null] as const).filter((f) => f !== last);
    fills.push(options[Math.floor(Math.random() * options.length)]);
  }
  let t = 0;
  return fills.map((fill) => ({ fill, until: (t += rand(0.03, 0.11)) }));
}

/**
 * Covers its content in black blocks of random sizes (big ones broken into
 * smaller ones at random), then tears them away out of order: every block
 * stutters through yellow, black and see-through a few times before it's
 * gone, while yellow glitch bars streak across. Plays once when scrolled into
 * view; reduced motion shows the content straight away.
 */
export function PixelReveal({
  children,
  className,
  delay = 0,
  cols = 14,
  play,
}: {
  children: React.ReactNode;
  className?: string;
  /** Seconds after entering view before the wave starts. */
  delay?: number;
  /** Finest pixels across the frame (blocks are squares of 1, 2 or 4). */
  cols?: number;
  /** Start from the caller (e.g. a shared trigger for a group); defaults to
   *  this frame entering view. */
  play?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const ownView = useInView(ref, { once: true, amount: 0.35 });
  const inView = play ?? ownView;
  // The content stays hidden under the cover until the wave starts, so no
  // sliver of it shows at anti-aliased edges.
  const [uncovered, setUncovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const box = ref.current;
    if (!canvas || !box || reduced) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const styles = getComputedStyle(box);
    const black = styles.getPropertyValue("--color-black").trim() || "#07020d";
    const yellow = styles.getPropertyValue("--color-yellow").trim() || "#ffdb00";

    let cells: Cell[] = [];
    let bars: Bar[] = [];
    let width = 0;
    const layout = () => {
      const rect = box.getBoundingClientRect();
      width = rect.width;
      const height = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Big blocks four pixels wide, each split into quarters (and again) at
      // random, so the grid reads as a jumble of chunky and fine pixels.
      const unit = width / cols;
      const block = unit * 4;
      cells = [];
      const add = (x: number, y: number, size: number, depth: number) => {
        if (x >= width || y >= height) return;
        if (depth < 2 && Math.random() < (depth === 0 ? 0.7 : 0.5)) {
          const half = size / 2;
          add(x, y, half, depth + 1);
          add(x + half, y, half, depth + 1);
          add(x, y + half, half, depth + 1);
          add(x + half, y + half, half, depth + 1);
          return;
        }
        const wave = (x / width + y / height) / 2;
        cells.push({ x, y, size, at: (wave * 0.25 + Math.random() * 0.75) * SPREAD, steps: flicker() });
      };
      for (let y = 0; y < height; y += block) {
        for (let x = 0; x < width; x += block) add(x, y, block, 0);
      }
      bars = Array.from({ length: 3 + Math.floor(Math.random() * 4) }, () => {
        const from = rand(0, GLITCH);
        return {
          y: rand(0, height),
          h: unit * rand(0.15, 0.6),
          from,
          to: from + rand(0.04, 0.12),
          x: rand(-0.2, 0.4) * width,
          w: rand(0.4, 1) * width,
        };
      });
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let pending = false;
      for (const cell of cells) {
        const local = t - cell.at;
        let fill: Step["fill"] = "black";
        if (local >= 0) {
          const step = cell.steps.find((s) => local < s.until);
          if (!step) continue;
          fill = step.fill;
        }
        pending = true;
        if (!fill) continue;
        ctx.fillStyle = fill === "black" ? black : yellow;
        // +0.5 overlap hides hairline seams between neighbours.
        ctx.fillRect(cell.x, cell.y, cell.size + 0.5, cell.size + 0.5);
      }
      ctx.fillStyle = yellow;
      for (const bar of bars) {
        if (t < bar.from || t >= bar.to) continue;
        // Each frame the bar jitters sideways.
        ctx.fillRect(bar.x + rand(-0.05, 0.05) * width, bar.y, bar.w, bar.h);
      }
      return pending;
    };

    layout();
    draw(-1);
    if (!inView) {
      const ro = new ResizeObserver(() => {
        layout();
        draw(-1);
      });
      ro.observe(box);
      return () => ro.disconnect();
    }

    let raf = 0;
    const start = performance.now() + delay * 1000;
    const tick = (now: number) => {
      if (draw((now - start) / 1000)) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const show = window.setTimeout(() => setUncovered(true), delay * 1000);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(show);
    };
  }, [inView, reduced, delay, cols]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <div className={cn("absolute inset-0", !reduced && !uncovered && "opacity-0")}>
        {children}
      </div>
      {!reduced && (
        <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
      )}
    </div>
  );
}
