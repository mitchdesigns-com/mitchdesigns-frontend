"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  const reduced = useReducedMotion();

  if (reduced) return null;

  return (
    <motion.div
      style={{ scaleX: smoothProgress, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-yellow z-50"
    />
  );
}
