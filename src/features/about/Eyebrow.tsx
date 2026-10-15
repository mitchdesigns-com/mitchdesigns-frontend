"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { easeOutSoft } from "@/lib/motion";

/**
 * The About page's eyebrow: a rounded pill, slightly tilted. On entering it
 * paints in left→right, its text fades up, then it tips into its tilt.
 * `tone="dark"` (black pill, yellow text) is for yellow backgrounds.
 */
export function Eyebrow({
  children,
  tone = "yellow",
  className,
  immediate = false,
}: {
  children: React.ReactNode;
  tone?: "yellow" | "dark";
  className?: string;
  /** Play on mount (above the fold) instead of on scroll into view. */
  immediate?: boolean;
}) {
  // The trigger watches an unclipped wrapper — the pill itself starts fully
  // clipped, which the in-view observer can't see.
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const on = immediate || inView || !!reduced;

  return (
    <span ref={ref} className={cn("inline-flex w-fit", className)}>
      <motion.span
        initial={reduced ? false : { clipPath: "inset(0% 100% 0% 0% round 999px)", rotate: 0 }}
        animate={on ? { clipPath: "inset(0% 0% 0% 0% round 999px)", rotate: -3 } : undefined}
        transition={{
          clipPath: { duration: 0.6, ease: easeOutSoft },
          rotate: { duration: 0.5, ease: easeOutSoft, delay: 0.55 },
        }}
        className={cn(
          "inline-flex items-center rounded-pill px-4 py-1.5 text-base font-bold",
          tone === "yellow" ? "bg-yellow text-black" : "bg-black text-yellow",
        )}
      >
        <motion.span
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={on ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.4, ease: easeOutSoft, delay: 0.3 }}
        >
          {children}
        </motion.span>
      </motion.span>
    </span>
  );
}
