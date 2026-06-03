"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { fadeUp, EASE_LUXE } from "./variants";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
};

export function Reveal({ children, className, delay = 0, duration = 0.8 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={fadeUp}
      initial={reduced ? "visible" : "hidden"}
      animate={inView || reduced ? "visible" : "hidden"}
      transition={{ duration, ease: EASE_LUXE, delay }}
    >
      {children}
    </motion.div>
  );
}
