"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";

export type DoodleShape = "strike" | "wave" | "swash";

type Box = { w: number; h: number };

/**
 * Hand-drawn marks, built in real pixels from the marked element's box so the
 * stroke weight stays even at any size. Coordinates may spill outside the box
 * (the svg is overflow-visible). Multi-stroke shapes draw stroke after stroke.
 */
const SHAPES: Record<DoodleShape, (b: Box) => string[]> = {
  // Crossed-out: two slightly wobbly lines through the middle.
  strike: ({ w, h }) => [
    `M -5 ${h * 0.6} C ${w * 0.3} ${h * 0.48}, ${w * 0.66} ${h * 0.64}, ${w + 5} ${h * 0.5}`,
    `M ${w * 0.04} ${h * 0.68} C ${w * 0.38} ${h * 0.58}, ${w * 0.7} ${h * 0.72}, ${w + 2} ${h * 0.6}`,
  ],
  // Wavy underline, wavelength kept roughly constant.
  wave: ({ w, h }) => {
    const y = h * 0.98;
    const n = Math.max(4, Math.round(w / 22));
    const step = w / n;
    let d = `M 0 ${y}`;
    for (let i = 0; i < n; i++) {
      d += ` Q ${step * (i + 0.5)} ${y + (i % 2 ? 7 : -7)} ${step * (i + 1)} ${y}`;
    }
    return [d];
  },
  // Signature underline that swings back under itself.
  swash: ({ w, h }) => [
    `M ${-w * 0.04} ${h * 0.94} C ${w * 0.3} ${h * 0.84}, ${w * 0.72} ${h * 0.8}, ${w * 1.08} ${h * 0.86} C ${w * 0.8} ${h * 0.92}, ${w * 0.45} ${h * 1.02}, ${w * 0.2} ${h * 1.08}`,
  ],
};

export function Doodle({
  shape,
  progress,
  range,
  strokeWidth = 3,
}: {
  shape: DoodleShape;
  /** Drives the drawing; the mark draws in fully across `range`. */
  progress: MotionValue<number>;
  range: [number, number];
  strokeWidth?: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [box, setBox] = useState<Box | null>(null);

  useLayoutEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const measure = () => setBox({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const paths = box ? SHAPES[shape](box) : [];
  const [start, end] = range;
  const slice = (end - start) / Math.max(1, paths.length);

  return (
    <svg
      ref={ref}
      aria-hidden
      fill="none"
      className="pointer-events-none absolute inset-0 size-full overflow-visible text-yellow"
    >
      {paths.map((d, i) => (
        <DoodleStroke
          key={i}
          d={d}
          progress={progress}
          range={[start + slice * i, start + slice * (i + 1)]}
          strokeWidth={strokeWidth}
        />
      ))}
    </svg>
  );
}

function DoodleStroke({
  d,
  progress,
  range,
  strokeWidth,
}: {
  d: string;
  progress: MotionValue<number>;
  range: [number, number];
  strokeWidth: number;
}) {
  const pathLength = useTransform(progress, range, [0, 1]);
  // A zero-length round-capped path still paints a dot — hide it until drawing.
  const opacity = useTransform(progress, [range[0], range[0] + 0.002], [0, 1]);
  return (
    <motion.path
      d={d}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ pathLength, opacity }}
    />
  );
}
