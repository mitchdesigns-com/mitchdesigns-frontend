"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * Animates the numeric portion of a stat value (e.g. "400+", "20+", "100%")
 * counting up from zero the first time it scrolls into view, while preserving
 * any non-numeric prefix/suffix. Values with no leading number render as-is.
 * Pass `play` to drive the start from a choreographed timeline instead.
 */
export function CountUp({
  value,
  className,
  play,
  delay = 0,
  duration = 1.6,
}: {
  value: string;
  className?: string;
  /** Start trigger; when omitted the count starts on first scroll into view. */
  play?: boolean;
  /** Seconds to wait after the trigger before counting. */
  delay?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const started = play ?? inView;

  const parsed = value.match(/^(\D*)(\d[\d,]*)(.*)$/);
  const hasNumber = parsed !== null;
  const target = parsed ? parseInt(parsed[2].replace(/,/g, ""), 10) : 0;
  const prefix = parsed?.[1] ?? "";
  const suffix = parsed?.[3] ?? "";

  const format = (n: number) =>
    `${prefix}${Math.round(n).toLocaleString()}${suffix}`;
  const [display, setDisplay] = useState(hasNumber ? format(0) : value);
  const current = useRef(0);

  useEffect(() => {
    if (!hasNumber) return;
    const onUpdate = (v: number) => {
      current.current = v;
      setDisplay(format(v));
    };
    // A driven timeline (`play`) that switches off counts back down to zero.
    const reversing = !started && play === false && current.current > 0;
    if (!started && !reversing) return;
    const controls = started
      ? animate(current.current, target, { duration, delay, ease: "easeOut", onUpdate })
      : animate(current.current, 0, { duration: 0.4, ease: "easeIn", onUpdate });
    return () => controls.stop();
    // `parsed` is a fresh array each render — depend only on stable primitives
    // so the animation isn't restarted on every onUpdate re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNumber, started, play, target, prefix, suffix, delay, duration]);

  return (
    <span
      ref={ref}
      // Reserve a stable width so the counting digits don't reflow the row as
      // the number grows (min-w-50 = 12.5rem = 200px on the spacing scale).
      className={cn("inline-block min-w-50", className)}
      aria-label={value}
    >
      {display}
    </span>
  );
}
