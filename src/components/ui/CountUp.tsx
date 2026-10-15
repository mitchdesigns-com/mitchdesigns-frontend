"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

// ── Format parser ─────────────────────────────────────────────────────────────
// Handles: "50", "+50", "-10", "1.2", "1,221.00", "+1,500.50k"
interface Parsed {
  prefix: string; // leading non-digit non-dot: "+", "-", etc.
  suffix: string; // trailing non-digit: "k", "%", etc.
  target: number;
  decimals: number;
  commas: boolean; // original string used comma-grouping
}

function parse(raw: string | number): Parsed {
  const str = String(raw).trim();

  const prefixMatch = str.match(/^([^0-9]*)/)!;
  const prefix = prefixMatch[1];

  const suffixMatch = str.match(/([^0-9.,]+)$/)!;
  const suffix = suffixMatch ? suffixMatch[1] : "";

  const numStr = str.slice(
    prefix.length,
    suffix ? str.length - suffix.length : str.length,
  );
  const commas = numStr.includes(",");
  const cleaned = numStr.replace(/,/g, "");
  const target = parseFloat(cleaned) || 0;
  const dotIdx = cleaned.indexOf(".");
  const decimals = dotIdx >= 0 ? cleaned.length - dotIdx - 1 : 0;

  return { prefix, suffix, target, decimals, commas };
}

function format(n: number, decimals: number, commas: boolean): string {
  const fixed = n.toFixed(decimals);
  if (!commas) return fixed;
  const [int, dec] = fixed.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec !== undefined ? `${grouped}.${dec}` : grouped;
}

// ── Component ─────────────────────────────────────────────────────────────────
interface CountUpProps {
  value: string | number;
  className?: string;
  style?: React.CSSProperties;
  duration?: number; // seconds, default 1.5
  delay?: number;    // seconds, default 0
  /** Start signal from the parent; when given, replaces the built-in in-view trigger. */
  start?: boolean;
}

export function CountUp({
  value,
  className,
  style,
  duration = 1.5,
  delay = 0,
  start,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const isInView = start ?? seen;
  const { prefix, suffix, target, decimals, commas } = parse(value);

  useEffect(() => {
    if (!isInView || !ref.current) return;
    const el = ref.current;
    el.textContent = `${prefix}${format(0, decimals, commas)}${suffix}`;

    const controls = animate(0, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        el.textContent = `${prefix}${format(v, decimals, commas)}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [isInView, target, prefix, suffix, decimals, commas, duration, delay]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {format(0, decimals, commas)}
      {suffix}
    </span>
  );
}
