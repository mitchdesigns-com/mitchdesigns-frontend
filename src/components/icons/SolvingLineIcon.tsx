"use client";

import { motion, useReducedMotion } from "framer-motion";

// Isometric projection: x runs down-right, y down-left, z up.
const A = 9.53; // cos 30° × unit
const B = 5.5; // sin 30° × unit
const H = 11; // unit height
const p = (x: number, y: number, z: number) =>
  `${(32 + (x - y) * A).toFixed(2)} ${(40 + (x + y) * B - z * H).toFixed(2)}`;
const poly = (...pts: [number, number, number][]) => `M${pts.map((q) => p(...q)).join(" L")} Z`;

/** The three faces you can see of the unit cube at (x, y, z). */
function faces(x: number, y: number, z: number) {
  return {
    top: poly([x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]),
    right: poly([x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]),
    left: poly([x, y + 1, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]),
  };
}

// A 2×2×2 block, drawn back to front so nearer cubes hide what's behind
// them; the front top corner is the piece that's missing.
const CELLS: [number, number, number][] = [];
for (let z = 0; z < 2; z++)
  for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) if (!(x && y && z)) CELLS.push([x, y, z]);
CELLS.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]));
const PIECE = faces(1, 1, 1);
const stroke = { strokeWidth: 1.25, strokeLinejoin: "round", vectorEffect: "non-scaling-stroke" } as const;
const T = { duration: 3, times: [0, 0.35, 0.5, 0.85, 1], repeat: Infinity, ease: "easeInOut" } as const;

function Cube({ f, className }: { f: ReturnType<typeof faces>; className: string }) {
  return (
    <>
      <path d={f.top} className={className} {...stroke} />
      <path d={f.right} className={className} {...stroke} />
      <path d={f.left} className={className} {...stroke} />
    </>
  );
}

/** Isometric line mark for "Solving Solutions": a block of cubes whose
 *  missing corner drops into place and lights up yellow. */
export function SolvingLineIcon({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden className={className}>
      {CELLS.map(([x, y, z]) => (
        <Cube key={`${x}${y}${z}`} f={faces(x, y, z)} className="fill-black stroke-current" />
      ))}
      <motion.g
        initial={{ y: 0 }}
        animate={reduced ? undefined : { y: [-14, -14, 0, 0, -14] }}
        transition={T}
      >
        <Cube f={PIECE} className="fill-black stroke-current" />
        {/* Yellow, shaded per face, fades in as it lands. */}
        <motion.g
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={reduced ? undefined : { opacity: [0, 0, 1, 1, 0] }}
          transition={T}
        >
          <path d={PIECE.top} className="fill-yellow stroke-current" {...stroke} />
          <path d={PIECE.right} className="fill-yellow stroke-current" fillOpacity={0.7} {...stroke} />
          <path d={PIECE.left} className="fill-yellow stroke-current" fillOpacity={0.45} {...stroke} />
        </motion.g>
      </motion.g>
    </svg>
  );
}
