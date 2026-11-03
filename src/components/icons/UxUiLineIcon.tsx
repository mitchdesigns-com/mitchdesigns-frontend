"use client";

import { motion, useReducedMotion } from "framer-motion";

// One isometric plane (a 2×2 tile seen at 30°), centred on 0,0.
const PLANE = "M0 -11 L19.05 0 L0 11 L-19.05 0 Z";
// A small "button" tile on the top layer.
const CHIP = "M-4.76 2.75 L0 0 L4.76 2.75 L0 5.5 Z";
const stroke = { strokeWidth: 1.25, strokeLinejoin: "round", vectorEffect: "non-scaling-stroke" } as const;

/** Isometric line mark for "UX & UI": three interface layers that float
 *  apart and settle back, the top one in yellow. */
export function UxUiLineIcon({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  // Layer i sits `gap` above the one below; the gap breathes open and shut.
  const at = (i: number) => (reduced ? 32 + (1 - i) * 10 : [7, 14, 7].map((g) => 32 + (1 - i) * g));
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden className={className}>
      {[0, 1, 2].map((i) => (
        <motion.g
          key={i}
          initial={{ x: 32, y: 32 + (1 - i) * 7 }}
          animate={{ y: at(i) }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d={PLANE} className={i === 2 ? "fill-black stroke-yellow" : "fill-black stroke-current"} {...stroke} />
          {i === 2 && <path d={CHIP} className="fill-yellow" />}
        </motion.g>
      ))}
    </svg>
  );
}
