"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { staggerChildren, EASE_LUXE } from "@/components/motion/variants";

type Props = {
  palettes: Array<{ name: string; hex: string }>;
};

const swatchVariants = {
  hidden: { opacity: 0, scaleY: 0.85, transformOrigin: "bottom" },
  visible: {
    opacity: 1,
    scaleY: 1,
    transition: { duration: 0.5, ease: EASE_LUXE },
  },
};

export function ColorPalette({ palettes }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  if (!palettes.length) return null;

  return (
    <div ref={ref} className="overflow-hidden rounded-2xs">
      <motion.div
        variants={staggerChildren(0.08)}
        initial={reduced ? "visible" : "hidden"}
        animate={inView || reduced ? "visible" : "hidden"}
      >
        {palettes.map((palette) => (
          <motion.div
            key={palette.name}
            variants={swatchVariants}
            className="flex items-center px-6 h-16"
            style={{ backgroundColor: palette.hex }}
          >
            <span className="text-xl text-white">{palette.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
