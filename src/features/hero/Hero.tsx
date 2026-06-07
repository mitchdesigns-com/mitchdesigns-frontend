"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Section } from "@/components/layout/Section";
import { easeOutSoft, fadeUp, stagger } from "@/lib/motion";

type HeroProps = {
  eyebrow?: string;
  /** Static lead-in copy that precedes the rotating keyword. */
  headline: string;
  /** Yellow keyword that cycles. Defaults to the Figma V10 set. */
  rotatingWords?: readonly string[];
  /** Per-word dwell time before swapping, in ms. */
  rotationInterval?: number;
};

const DEFAULT_WORDS = [
  "Convert",
  "Engage",
  "Interact",
  "Succeed",
  "Grow",
] as const;

export function Hero({
  eyebrow,
  headline,
  rotatingWords = DEFAULT_WORDS,
  rotationInterval = 2400,
}: HeroProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (rotatingWords.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % rotatingWords.length),
      rotationInterval,
    );
    return () => window.clearInterval(id);
  }, [rotatingWords.length, rotationInterval]);

  const word = rotatingWords[index];

  return (
    <Section theme="dark" className="pt-30 pb-5 md:pt-34">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger(0.08)}
      >
        {eyebrow ? (
          <motion.p
            variants={fadeUp}
            className="text-sm font-normal uppercase tracking-[0.01em] text-grey-500 relative z-30"
          >
            {eyebrow}
          </motion.p>
        ) : null}

        {/* Transform-only entrance (opacity stays 1) so this LCP element
            paints in the SSR HTML instead of waiting for hydration. */}
        <motion.h1
          variants={{ hidden: { opacity: 1, y: 24 }, visible: { opacity: 1, y: 0 } }}
          transition={{ ease: easeOutSoft }}
          className="mt-[10px] font-black tracking-[0.01em] text-white text-[2.75rem] leading-[1.05] md:text-[4.5rem] md:leading-[1.08] lg:text-hero-1 relative z-30"
        >
          {headline}{" "}
          <span
            aria-live="polite"
            aria-atomic="true"
            className="relative inline-flex align-baseline overflow-hidden h-[1.1em] min-w-[5ch]"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={word}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.55, ease: easeOutSoft }}
                className="inline-block whitespace-nowrap text-yellow"
              >
                {word}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>
      </motion.div>
    </Section>
  );
}
