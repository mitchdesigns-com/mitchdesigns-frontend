"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, type Transition } from "framer-motion";
import { CursorIcon } from "@/components/icons/CursorIcon";
import { easeInOutSoft } from "@/lib/motion";

/** Static reel shots are 1680×900 with the design fitted inside (see
 *  Case-studies/_pipeline/service-reels/build_reel.py); beats use the same
 *  frame so they line up with the shots around them. */
const FRAME_RATIO = "1680 / 900";

/** Where the camera looks: a point in the piece (% of its box) and a zoom. */
export type Camera = { x: number; y: number; zoom: number };
export const WIDE: Camera = { x: 50, y: 50, zoom: 1 };

export const pct = (n: number) => `${n}%`;

/**
 * Plays a beat's steps while it's on screen: returns the current step index,
 * advancing at each `at` time (ms from the start). Back to step 0 whenever
 * the beat isn't active, so it always enters from its first frame.
 */
export function useBeatSteps(active: boolean, at: number[]) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    setStep(0);
    if (!active) return;
    const timers = at.map((t, i) => window.setTimeout(() => setStep(i), t));
    return () => timers.forEach(window.clearTimeout);
    // `at` is a module constant per beat.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
  return step;
}

/**
 * One project's widget, fitted like a static reel shot on its own backdrop,
 * with a camera that can zoom into a point of the widget and follow it.
 * Children are laid out in % of the widget piece.
 */
export function BeatFrame({
  backdrop,
  fit,
  camera,
  cameraTransition = { duration: 0.9, ease: easeInOutSoft },
  children,
}: {
  backdrop: string;
  /** The piece's size in the 1680×900 frame, % (from the pipeline). */
  fit: { w: number; h: number };
  camera: Camera;
  cameraTransition?: Transition;
  children: ReactNode;
}) {
  const left = (100 - fit.w) / 2;
  const top = (100 - fit.h) / 2;
  // Camera point in frame %; translate so it lands in the middle, then zoom.
  const fx = left + (fit.w * camera.x) / 100;
  const fy = top + (fit.h * camera.y) / 100;
  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: backdrop, containerType: "size" }}
    >
      <div
        className="relative"
        style={{ width: "min(100cqw, calc(100cqh * 1680 / 900))", aspectRatio: FRAME_RATIO }}
      >
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{
            scale: camera.zoom,
            x: pct(-camera.zoom * (fx - 50)),
            y: pct(-camera.zoom * (fy - 50)),
          }}
          transition={cameraTransition}
        >
          <div
            className="absolute"
            style={{ left: pct(left), top: pct(top), width: pct(fit.w), height: pct(fit.h) }}
          >
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/** A plain pointer that glides to a point in the piece and taps on `click`. */
export function BeatCursor({
  at,
  click,
  size = 2.4,
}: {
  at: { x: number; y: number } | null;
  click: boolean;
  /** Width, % of the piece. */
  size?: number;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute z-30"
      style={{ width: pct(size) }}
      initial={false}
      animate={
        at
          ? { left: pct(at.x), top: pct(at.y), opacity: 1, scale: click ? [1, 0.75, 1] : 1 }
          : { left: pct(108), top: pct(115), opacity: 0, scale: 1 }
      }
      transition={{
        left: { duration: 0.8, ease: easeInOutSoft },
        top: { duration: 0.8, ease: easeInOutSoft },
        opacity: { duration: 0.3 },
        scale: { duration: 0.28 },
      }}
    >
      <CursorIcon className="h-auto w-full drop-shadow-md" />
    </motion.div>
  );
}
