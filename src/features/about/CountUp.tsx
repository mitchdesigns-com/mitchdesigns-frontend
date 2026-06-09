"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";

/**
 * Animates the numeric portion of a stat value (e.g. "400+", "20+", "100%")
 * counting up from zero the first time it scrolls into view, while preserving
 * any non-numeric prefix/suffix. Values with no leading number render as-is.
 */
export function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  const parsed = value.match(/^(\D*)(\d[\d,]*)(.*)$/);
  const target = parsed ? parseInt(parsed[2].replace(/,/g, ""), 10) : 0;
  const prefix = parsed?.[1] ?? "";
  const suffix = parsed?.[3] ?? "";

  const count = useMotionValue(0);
  const text = useTransform(
    count,
    (v) => `${prefix}${Math.round(v).toLocaleString()}${suffix}`,
  );

  useEffect(() => {
    if (!parsed || !inView) return;
    const controls = animate(count, target, { duration: 1.6, ease: "easeOut" });
    return () => controls.stop();
  }, [parsed, inView, target, count]);

  // Non-numeric values (no leading digit) just render statically.
  if (!parsed) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <motion.span ref={ref} className={className} aria-label={value}>
      {text}
    </motion.span>
  );
}
