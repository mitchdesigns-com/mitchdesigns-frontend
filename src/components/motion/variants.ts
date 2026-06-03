import type { Variants } from "framer-motion";

export const EASE_LUXE = [0.16, 1, 0.3, 1] as const;
export const EASE_CINEMA = [0.76, 0, 0.24, 1] as const;

export const SPRING = { type: "spring", stiffness: 100, damping: 20 } as const;

export const TIMING = { fast: 0.3, medium: 0.6, slow: 0.9 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: { opacity: 1, scale: 1 },
};

export function staggerChildren(stagger = 0.1, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };
}

export const itemFadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE_LUXE,
    },
  },
};
