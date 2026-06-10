"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, EASE_LUXE } from "./variants";
import { useReveal } from "./useReveal";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  /** Reveal on mount instead of waiting to scroll into view. Use for
   *  above-the-fold content that is already visible on first paint — the
   *  shared scroll trigger (margin: "-40% 0px") otherwise never fires for it. */
  immediate?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.8,
  immediate = false,
}: Props) {
  const { ref, inView } = useReveal();
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={fadeUp}
      initial={reduced ? "visible" : "hidden"}
      animate={inView || reduced || immediate ? "visible" : "hidden"}
      transition={{ duration, ease: EASE_LUXE, delay }}
    >
      {children}
    </motion.div>
  );
}
