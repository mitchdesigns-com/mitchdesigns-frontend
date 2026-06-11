"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { easeOutSoft, fadeUp, stagger } from "@/lib/motion";

const DEFAULT_WORDS = ["Convert", "Engage", "Interact", "Succeed", "Grow"];

const COVERS = [
  { src: "/images/case-studies/el-gouna.webp", alt: "El Gouna website design" },
  { src: "/images/case-studies/lychee.webp", alt: "Lychee brand website" },
  { src: "/images/case-studies/sally-helmy.webp", alt: "Sally Helmy website" },
];

type EditorialHeroProps = {
  eyebrow?: string;
  headline?: string;
  rotatingWords?: string[];
};

/**
 * Hero option — "Editorial". Flat brand-yellow split: statement typography
 * with the rotating keyword on the left, a self-cycling deck of real work
 * on the right.
 */
export function EditorialHero({
  eyebrow = "MitchDesigns — Website & Mobile App Design Company Based in Egypt",
  headline = "Start Building Digital Experiences that",
  rotatingWords,
}: EditorialHeroProps) {
  const words = rotatingWords && rotatingWords.length ? rotatingWords : DEFAULT_WORDS;
  const [wordIndex, setWordIndex] = useState(0);
  const [coverIndex, setCoverIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setWordIndex((i) => (i + 1) % words.length),
      2400,
    );
    return () => window.clearInterval(id);
  }, [words.length]);

  useEffect(() => {
    const id = window.setInterval(
      () => setCoverIndex((i) => (i + 1) % COVERS.length),
      3200,
    );
    return () => window.clearInterval(id);
  }, []);

  const word = words[wordIndex];

  return (
    <Section
      className="flex flex-col justify-center bg-bej text-black"
      style={{ minHeight: "100svh" }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger(0.08)}
        className="grid items-center gap-12 py-28 lg:grid-cols-2 lg:gap-16"
      >
        <div>
          <motion.p
            variants={fadeUp}
            className="text-sm font-bold uppercase tracking-1 text-black/60 text-balance"
          >
            {eyebrow}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-6 font-black uppercase leading-none tracking-tight text-hero-4 sm:text-hero-2 xl:text-hero-1"
          >
            {headline}
            <span
              aria-live="polite"
              aria-atomic="true"
              className="relative mt-2 block overflow-hidden"
              style={{ height: "1.15em" }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={word}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.5, ease: easeOutSoft }}
                  className="block font-serif font-medium normal-case italic"
                >
                  <span className="bg-yellow px-3">{word}.</span>
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-120 text-lg text-black/65 text-balance"
          >
            No templates, no shortcuts — custom websites, apps and platforms
            built in-house since 2005.
          </motion.p>
        </div>

        <motion.div variants={fadeUp} className="relative">
          <div className="relative aspect-video overflow-hidden border border-black/10 bg-black">
            <AnimatePresence initial={false}>
              <motion.div
                key={coverIndex}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: easeOutSoft }}
                className="absolute inset-0"
              >
                <Image
                  src={COVERS[coverIndex].src}
                  alt={COVERS[coverIndex].alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                  priority={coverIndex === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-bold uppercase tracking-1 text-black/55">
            <span>Selected work</span>
            <span>
              {String(coverIndex + 1).padStart(2, "0")} /{" "}
              {String(COVERS.length).padStart(2, "0")}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
}
