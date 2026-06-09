"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

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
  const inView = useInView(ref, { once: true, amount: 0.5 });

  const parsed = value.match(/^(\D*)(\d[\d,]*)(.*)$/);
  const hasNumber = parsed !== null;
  const target = parsed ? parseInt(parsed[2].replace(/,/g, ""), 10) : 0;
  const prefix = parsed?.[1] ?? "";
  const suffix = parsed?.[3] ?? "";

  const format = (n: number) =>
    `${prefix}${Math.round(n).toLocaleString()}${suffix}`;
  const [display, setDisplay] = useState(hasNumber ? format(0) : value);

  useEffect(() => {
    if (!hasNumber || !inView) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(format(v)),
    });
    return () => controls.stop();
    // `parsed` is a fresh array each render — depend only on stable primitives
    // so the animation isn't restarted on every onUpdate re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNumber, inView, target, prefix, suffix]);

  return (
    <span ref={ref} className={className} aria-label={value}>
      {display}
    </span>
  );
}
