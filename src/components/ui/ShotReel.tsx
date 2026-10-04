"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import type { ReelShot } from "@/config/serviceReels";
import { easeInOutSoft, easeOutSoft } from "@/lib/motion";

/** How long each shot stays up (ms) — fast, social-reel pacing. */
const SHOT_MS = 550;

/**
 * Each shot is in one of three states. "in" rises into place from a soft
 * zoom + blur; the shot it replaces drops back ("out") underneath; every
 * other shot waits, already reset ("idle"), so the next entry starts clean.
 */
const shotVariants: Variants = {
  in: {
    opacity: 1,
    scale: 1,
    y: "0%",
    filter: "blur(0px)",
    zIndex: 2,
    transition: { duration: 0.38, ease: easeOutSoft },
  },
  out: {
    opacity: 0,
    scale: 0.94,
    y: "-2%",
    filter: "blur(0px)",
    zIndex: 1,
    transition: { duration: 0.3, ease: easeInOutSoft },
  },
  idle: {
    opacity: 0,
    scale: 1.08,
    y: "4%",
    filter: "blur(8px)",
    zIndex: 0,
    transition: { duration: 0 },
  },
};

/**
 * Rapid project montage: shots push in one after another with the project
 * name. Fills its (relative, sized) parent. Runs only while on screen;
 * reduced motion shows the first shot, still.
 */
export function ShotReel({ shots, sizes }: { shots: ReelShot[]; sizes: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const playing = inView && !reduced && shots.length > 1;

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setIndex((i) => {
        setPrev(i);
        return (i + 1) % shots.length;
      });
    }, SHOT_MS);
    return () => window.clearInterval(id);
  }, [playing, shots.length]);

  const current = shots[index];

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden bg-space-grey">
      {/* Every shot stays mounted (decoded once, no blank frame on repeat). */}
      {shots.map((s, i) => (
        <motion.div
          key={s.src}
          className="absolute inset-0"
          variants={shotVariants}
          initial={i === 0 ? "in" : "idle"}
          animate={i === index ? "in" : i === prev ? "out" : "idle"}
        >
          <Image
            src={s.src}
            alt={i === index ? s.alt : ""}
            fill
            sizes={sizes}
            priority={i === 0}
            loading={i === 0 ? undefined : "eager"}
            className="object-cover"
          />
        </motion.div>
      ))}

      {current && (
        <motion.span
          key={current.label + index}
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: easeOutSoft }}
          className="absolute bottom-4 left-4 z-10 rounded-pill bg-black/60 px-3 py-1.5 text-xs font-medium tracking-1 text-white uppercase backdrop-blur-sm"
        >
          {current.label}
        </motion.span>
      )}
    </div>
  );
}
