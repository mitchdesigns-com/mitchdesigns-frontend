"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import type { ReelShot } from "@/config/serviceReels";
import { easeInOutSoft, easeOutSoft } from "@/lib/motion";

/** How long each shot stays up (ms) — fast, social-reel pacing. */
const SHOT_MS = 550;

/** An animated item: a component that plays while `active`, for `ms`. */
export type ReelBeat = {
  key: string;
  label: string;
  backdrop: string;
  ms: number;
  Beat: ComponentType<{ active: boolean }>;
};
export type ReelItem = ReelShot | ReelBeat;
const isBeat = (item: ReelItem): item is ReelBeat => "Beat" in item;

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
 * name. Fills its (relative, sized) parent; each shot shows whole (contained)
 * on its own backdrop colour, so no widget is ever cut at the box edge. Runs
 * only while on screen; reduced motion shows the first shot, still.
 */
export function ShotReel({ shots, sizes }: { shots: ReelItem[]; sizes: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const playing = inView && !reduced && shots.length > 1;

  // Static shots flash by; animated beats hold for their own length.
  const current = shots[index];
  const holdMs = current && isBeat(current) ? current.ms : SHOT_MS;
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      setPrev(index);
      setIndex((index + 1) % shots.length);
    }, holdMs);
    return () => window.clearTimeout(id);
  }, [playing, index, holdMs, shots.length]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden bg-space-grey">
      {/* Every shot stays mounted (decoded once, no blank frame on repeat). */}
      {shots.map((s, i) => (
        <motion.div
          key={isBeat(s) ? s.key : s.src}
          className="absolute inset-0"
          // Whole shot, never cropped; its own backdrop fills the rest.
          style={{ backgroundColor: s.backdrop }}
          variants={shotVariants}
          initial={i === 0 ? "in" : "idle"}
          animate={i === index ? "in" : i === prev ? "out" : "idle"}
        >
          {isBeat(s) ? (
            <s.Beat active={playing && i === index} />
          ) : (
            <Image
              src={s.src}
              alt={i === index ? s.alt : ""}
              fill
              sizes={sizes}
              priority={i === 0}
              loading={i === 0 ? undefined : "eager"}
              className={s.cover ? "object-cover" : "object-contain"}
            />
          )}
        </motion.div>
      ))}

      {current?.label && (
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
