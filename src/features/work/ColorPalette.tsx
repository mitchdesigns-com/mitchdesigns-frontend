"use client";

import { motion, useReducedMotion } from "framer-motion";
import { staggerChildren, EASE_LUXE } from "@/components/motion/variants";
import { useReveal } from "@/components/motion/useReveal";

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

/** Perceived luminance (0–255). Returns true when a swatch is light enough that
 *  white text would fail to read against it. Handles #rgb and #rrggbb. */
function isLight(hex: string): boolean {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return false;
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

export function ColorPalette({ palettes }: Props) {
  const { ref, inView } = useReveal();
  const reduced = useReducedMotion();

  if (!palettes.length) return null;

  return (
    <div ref={ref}>
      <motion.div
        className="flex flex-col gap-2"
        variants={staggerChildren(0.08)}
        initial={reduced ? "visible" : "hidden"}
        animate={inView || reduced ? "visible" : "hidden"}
      >
        {palettes.map((palette) => {
          const light = isLight(palette.hex);
          return (
            <motion.div
              key={palette.name}
              variants={swatchVariants}
              className="flex items-center px-6 h-16 rounded-2xs"
              style={{ backgroundColor: palette.hex }}
            >
              <span className={light ? "text-xl text-space-grey" : "text-xl text-white"}>
                {palette.name}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
