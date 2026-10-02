"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { easeOutSoft } from "@/lib/motion";

/** Figma V10 keyword set — used when the CMS provides no rotating words. */
export const DEFAULT_ROTATING_WORDS = [
  "Convert",
  "Engage",
  "Interact",
  "Succeed",
  "Grow",
] as const;

// Compact swap: letters of the outgoing word roll up and blur out while the
// incoming word's letters rise in and sharpen, staggered left to right. The two
// overlap (no "wait"), so the change reads as one continuous roll.
const letterVariants: Variants = {
  enter: { y: "0.9em", opacity: 0, filter: "blur(6px)" },
  center: (i: number) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { delay: 0.08 + i * 0.035, duration: 0.5, ease: easeOutSoft },
  }),
  exit: (i: number) => ({
    y: "-0.9em",
    opacity: 0,
    filter: "blur(6px)",
    transition: { delay: i * 0.025, duration: 0.32, ease: [0.4, 0, 1, 1] },
  }),
};

/**
 * Yellow hero keyword that slides to the next word every `interval` ms.
 * `compact` sits on the text line like a normal word (no extra line height —
 * for tight display leading) and holds the width of the longest word, so the
 * headline never re-wraps as words change.
 */
export function RotatingWord({
  words = DEFAULT_ROTATING_WORDS,
  interval = 2400,
  compact = false,
}: {
  words?: readonly string[];
  interval?: number;
  compact?: boolean;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval,
    );
    return () => window.clearInterval(id);
  }, [words.length, interval]);

  const word = words[index];

  const slide = (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={word}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "-100%", opacity: 0 }}
        transition={{ duration: 0.55, ease: easeOutSoft }}
        className={
          compact
            ? "col-start-1 row-start-1 inline-block whitespace-nowrap text-yellow"
            : "inline-flex items-end min-h-[1.3em] whitespace-nowrap leading-none text-yellow"
        }
      >
        {word}
      </motion.span>
    </AnimatePresence>
  );

  if (compact) {
    const roll = (
      <AnimatePresence initial={false}>
        <motion.span
          key={word}
          initial="enter"
          animate="center"
          exit="exit"
          className="col-start-1 row-start-1 inline-flex whitespace-nowrap text-yellow"
        >
          <span className="sr-only">{word}</span>
          {word.split("").map((char, i) => (
            <motion.span
              key={i}
              aria-hidden
              custom={i}
              variants={letterVariants}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    );
    return (
      <span
        aria-live="polite"
        aria-atomic="true"
        className="relative inline-grid"
        // Mask to the word's own line so the slide never crosses its neighbours.
        style={{ clipPath: "inset(-0.05em -0.3em -0.15em -0.3em)" }}
      >
        {/* Invisible sizers, all stacked in one cell: the cell takes the
            widest *rendered* word (not the longest by letters) and the first
            provides the baseline. */}
        {words.map((w) => (
          <span
            key={w}
            aria-hidden
            className="invisible col-start-1 row-start-1 whitespace-nowrap"
          >
            {w}
          </span>
        ))}
        {roll}
      </span>
    );
  }

  return (
    <span
      aria-live="polite"
      aria-atomic="true"
      className="relative inline-flex items-end align-bottom pb-[0.05em] min-w-[5ch]"
      // Mask to the word's own line so the slide in/out never crosses the
      // line above (clip-path, unlike overflow, leaves the baseline alone).
      style={{ clipPath: "inset(0.2em -0.3em -0.2em -0.3em)" }}
    >
      {slide}
    </span>
  );
}
