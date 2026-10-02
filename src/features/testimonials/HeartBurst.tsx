"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, type Transition } from "framer-motion";
import { Heart } from "@/components/icons/Heart";

// One beat: the heart pops, squashes, rebounds and settles; at the peak of the
// pop a ring of short yellow strokes bursts outward and fades. Then a rest.
const BEAT = 1.1; // s
const REST = 1.4; // s between beats
const RAYS = [-90, -45, 0, 45, 90, 135, 180, -135]; // degrees

const loop: Transition = {
  duration: BEAT,
  repeat: Infinity,
  repeatDelay: REST,
  ease: "easeOut",
};

/** Yellow heart that beats with a little burst — plays only while on screen. */
export function HeartBurst() {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const play = inView && !reduced;

  return (
    <span ref={ref} className="relative inline-grid place-items-center">
      <motion.span
        className="relative z-10 inline-flex"
        initial={false}
        animate={
          play
            ? { scale: [1, 1.35, 0.88, 1.08, 1], y: [0, -5, 0, -1.5, 0] }
            : { scale: 1, y: 0 }
        }
        transition={play ? { ...loop, times: [0, 0.22, 0.45, 0.68, 1] } : { duration: 0.2 }}
      >
        <Heart />
      </motion.span>

      {RAYS.map((angle) => (
        // Each ray is a short bar that shoots out along its angle at the pop.
        <span
          key={angle}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 size-0"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <motion.span
            className="absolute left-0 top-0 block h-0.5 w-2 -translate-y-1/2 rounded-full bg-yellow"
            style={{ originX: 0 }}
            initial={{ opacity: 0, x: 14, scaleX: 0.2 }}
            animate={
              play
                ? { opacity: [0, 0, 1, 0], x: [14, 14, 20, 28], scaleX: [0.2, 0.2, 1, 0.3] }
                : { opacity: 0 }
            }
            transition={play ? { ...loop, times: [0, 0.12, 0.28, 0.7] } : { duration: 0.2 }}
          />
        </span>
      ))}
    </span>
  );
}
