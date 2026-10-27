"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { ParallaxImage, Reveal } from "@/components/motion";
import { easeOutSoft } from "@/lib/motion";
import type { AboutContent } from "@/lib/cms/types";
import { aboutPhoto } from "./photos";
import { Eyebrow } from "./Eyebrow";

/**
 * About hero: the headline rises in line by line beside the intro (the CTA
 * lives in the header); below, three equal columns of photos with sharp corners.
 */
export function AboutHero({ hero }: { hero: AboutContent["hero"] }) {
  const reduced = useReducedMotion();
  const titleLines = hero.title.split("\n");
  const [first, second] = [aboutPhoto(hero.images[0], 0), aboutPhoto(hero.images[1], 1)];
  const third = hero.images[2]?.url ? aboutPhoto(hero.images[2], 2) : BOARD_PHOTO;

  return (
    <Section className="pt-header pb-20 md:pb-32">
      <div className="grid gap-10 pt-10 md:pt-16 lg:grid-cols-12 lg:items-end">
        {/* Badge + headline, each line rising out of its own mask */}
        <div className="flex flex-col lg:col-span-7">
          <Eyebrow immediate className="relative z-10 -mb-3">
            {hero.badge}
          </Eyebrow>
          <h1 className="text-5xl font-black leading-none text-space-grey sm:text-hero-1">
            {titleLines.map((line, i) => (
              <span key={i} className="-mb-2 block overflow-hidden pb-4">
                <motion.span
                  className="block"
                  initial={reduced ? false : { y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, ease: easeOutSoft, delay: 0.2 + i * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>

        {/* Intro (above the fold, so it reveals on mount) */}
        {hero.description && (
          <Reveal immediate delay={0.4} className="lg:col-span-5">
            <p className="text-xl text-black text-balance">{hero.description}</p>
          </Reveal>
        )}
      </div>

      <HeroCollage lead={third} first={first} second={second} />
    </Section>
  );
}

type Photo = { url: string; alt: string };

/** First column's photo until the CMS sets a third hero image. */
const BOARD_PHOTO: Photo = { url: "/images/careers/drive-4.webp", alt: "The MitchDesigns team planning on a sticky-note board" };

/** Slides a box from the top of its column to the bottom (or back) as `p`
 *  runs 0 → 1: top 0% → 100% while lifting by its own height. */
function useGlide(p: MotionValue<number>, from: 0 | 1) {
  const range = from === 0 ? ["0%", "100%"] : ["100%", "0%"];
  const lift = from === 0 ? ["0%", "-100%"] : ["-100%", "0%"];
  return { top: useTransform(p, [0, 1], range), y: useTransform(p, [0, 1], lift) };
}

/**
 * Three equal columns: the first photo starts aligned to the top of the tall
 * centre photo and the third photo to its bottom; scrolling through glides
 * them past each other until the alignment is reversed (and back again on
 * the way up). Phones simply stack them.
 */
function HeroCollage({ lead, first, second }: { lead: Photo; first: Photo; second: Photo }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  // Progress from the very top of the page (so it starts exactly aligned)
  // until the collage has scrolled up past the middle of the screen.
  const { scrollY } = useScroll();
  const [end, setEnd] = useState(1);
  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      setEnd(Math.max(1, top + el.offsetHeight * 0.6 - window.innerHeight * 0.5));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const progress = useTransform(scrollY, (y) => Math.min(1, Math.max(0, y / end)));
  const down = useGlide(progress, 0);
  const up = useGlide(progress, 1);
  const glide = wide && !reduced;

  const side = (box: React.ReactNode, style: ReturnType<typeof useGlide>, still: "top" | "bottom") => (
    <div className="relative">
      <motion.div
        className={glide ? "absolute inset-x-0" : still === "top" ? "md:absolute md:inset-x-0 md:top-0" : "md:absolute md:inset-x-0 md:bottom-0"}
        style={glide ? style : undefined}
      >
        {box}
      </motion.div>
    </div>
  );

  return (
    <div ref={ref} className="mt-16 grid grid-cols-1 gap-3 md:mt-24 md:grid-cols-3">
      {side(
        <ParallaxImage src={lead.url} alt={lead.alt} priority className="aspect-5/4" imageClassName="object-top" sizes="(max-width: 768px) 100vw, 33vw" />,
        down,
        "top",
      )}
      <ParallaxImage src={first.url} alt={first.alt} priority className="aspect-17/20" sizes="(max-width: 768px) 100vw, 33vw" />
      {side(
        <ParallaxImage src={second.url} alt={second.alt} className="aspect-10/9" sizes="(max-width: 768px) 100vw, 33vw" />,
        up,
        "bottom",
      )}
    </div>
  );
}
