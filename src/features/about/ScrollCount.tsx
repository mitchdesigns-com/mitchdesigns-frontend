"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Counts the numeric part of a stat (e.g. "400+", "20+", "100%") up from zero
 * the first time it scrolls into view, keeping any prefix or suffix. Values
 * with no leading number render as they are. Reduced motion shows the final
 * value straight away.
 */
export function ScrollCount({
  value,
  className,
  duration = 1.6,
}: {
  value: string;
  className?: string;
  /** Seconds the count takes. */
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const parsed = value.match(/^(\D*)(\d[\d,]*)(.*)$/);
  const prefix = parsed?.[1] ?? "";
  const target = parsed ? parseInt(parsed[2].replace(/,/g, ""), 10) : 0;
  const suffix = parsed?.[3] ?? "";
  const hasNumber = parsed !== null;

  const [display, setDisplay] = useState(hasNumber ? `${prefix}0${suffix}` : value);

  useEffect(() => {
    const node = ref.current;
    if (!node || !hasNumber) return;
    const show = (n: number) => setDisplay(`${prefix}${Math.round(n).toLocaleString("en-US")}${suffix}`);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      show(target);
      return;
    }

    let frame = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / (duration * 1000), 1);
        show(target * (1 - Math.pow(1 - t, 3))); // ease-out cubic
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        run();
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [hasNumber, prefix, suffix, target, duration]);

  return (
    <span
      ref={ref}
      // Reserve a stable width so the counting digits don't reflow the row.
      className={cn("inline-block min-w-50", className)}
      aria-label={value}
    >
      {display}
    </span>
  );
}
