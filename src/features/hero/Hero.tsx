"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { easeOutSoft, fadeUp, stagger } from "@/lib/motion";
import { DEFAULT_ROTATING_WORDS, RotatingWord } from "./RotatingWord";

type HeroProps = {
  eyebrow?: string;
  /** Static lead-in copy that precedes the rotating keyword. */
  headline: string;
  /** Yellow keyword that cycles. Defaults to the Figma V10 set. */
  rotatingWords?: readonly string[];
  /** Per-word dwell time before swapping, in ms. */
  rotationInterval?: number;
  /** Render without the dark surface fill (for heroes with their own backdrop). */
  transparent?: boolean;
};

export function Hero({
  eyebrow,
  headline,
  rotatingWords = DEFAULT_ROTATING_WORDS,
  rotationInterval = 2400,
  transparent = false,
}: HeroProps) {
  return (
    <Section
      theme="dark"
      className={`pt-30 pb-5 md:pt-34${transparent ? " bg-transparent" : ""}`}
    >
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
          className="mt-[10px] font-black tracking-[0.01em] text-white text-balance text-[1.5rem] leading-[1.15] sm:text-[2.75rem] sm:leading-[1.05] md:text-[4.5rem] md:leading-[1.08] lg:text-hero-1 relative z-30"
        >
          {headline}{" "}
          <RotatingWord words={rotatingWords} interval={rotationInterval} />
        </motion.h1>
      </motion.div>
    </Section>
  );
}
