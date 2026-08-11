"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Count up to `value` once it scrolls into view. When `value` is non-numeric
 * (e.g. "D2C", "F&B", "24/7") the raw string is rendered as-is.
 */
export function Counter({
  value,
  suffix = "",
  className,
}: {
  value: string;
  suffix?: string;
  className?: string;
}) {
  // Only count when the value is a plain integer (e.g. "20"). Anything with
  // other characters — "D2C", "100%", "24/7", "F&B" — renders verbatim.
  const numeric = /^\d+$/.test(String(value).trim());
  const target = numeric ? Number(value) : 0;
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(numeric ? `0${suffix}` : value);

  useEffect(() => {
    if (!numeric) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          let c = 0;
          const step = Math.max(1, Math.ceil(target / 40));
          const tick = () => {
            c += step;
            if (c >= target) {
              setDisplay(`${target}${suffix}`);
            } else {
              setDisplay(`${c}${suffix}`);
              requestAnimationFrame(tick);
            }
          };
          tick();
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [numeric, target, suffix]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
