"use client";

import { Fragment, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Parallax, ParallaxImage, Reveal } from "@/components/motion";
import type { AboutContent, RichText } from "@/lib/cms/types";
import { Eyebrow } from "./Eyebrow";

type InlineNode = { type: "text"; text: string; bold?: boolean; italic?: boolean; underline?: boolean };
type Word = { text: string; bold?: boolean; italic?: boolean; underline?: boolean };

// Used only when the CMS title has no bold words: where and since when.
const DEFAULT_EMPHASIS = new Set(["2005", "egypt", "mena"]);

/**
 * The story title (plain text or Strapi blocks) as a flat list of words.
 * Sentence case, regular weight: only bold words from the CMS (or the two
 * default ones) stand out. CMS italics are ignored.
 */
function titleWords(content: RichText): Word[] {
  if (!content) return [];
  let words: Word[];
  if (typeof content === "string") words = content.split(/\s+/).filter(Boolean).map((text) => ({ text }));
  else if (!Array.isArray(content)) return [];
  else
    words = (content as Array<{ children?: InlineNode[] }>).flatMap((block) =>
      (block.children ?? []).flatMap((n) =>
        n.text.split(/\s+/).filter(Boolean).map((text) => ({ text, bold: n.bold, underline: n.underline })),
      ),
    );
  if (!words.some((w) => w.bold))
    words = words.map((w) => ({ ...w, bold: DEFAULT_EMPHASIS.has(w.text.toLowerCase().replace(/[^a-z0-9]/g, "")) }));
  // Only the first word is forced to a capital; the rest keeps the CMS casing
  // (so "Egypt" and "MENA" stay as written).
  return words.map((w, i) => (i === 0 ? { ...w, text: w.text.charAt(0).toUpperCase() + w.text.slice(1) } : w));
}

/** One word of the statement, inked in as the scroll reaches it. */
function InkWord({ word, p, from, to }: { word: Word; p: MotionValue<number>; from: number; to: number }) {
  const opacity = useTransform(p, [from, to], [0.18, 1]);
  let el: React.ReactNode = word.text;
  if (word.bold) el = <strong className="font-black">{el}</strong>;
  if (word.underline) el = <u>{el}</u>;
  return <motion.span style={{ opacity }}>{el} </motion.span>;
}

const STORY_PHOTOS = [
  { url: "/images/studio/about/story-office.webp", alt: "The MitchDesigns studio" },
  { url: "/images/studio/about/story-desk.webp", alt: "A MitchDesigns developer focused at his desk" },
];

function StoryCard({ card, index }: { card: AboutContent["story"]["cards"][number]; index: number }) {
  // The CMS image, or our studio shoot until one is set.
  const fallback = STORY_PHOTOS[index % STORY_PHOTOS.length];
  const photo = card.image?.url ? { url: card.image.url, alt: card.image.alt ?? fallback.alt } : fallback;
  return (
    <div className="flex w-full max-w-60 flex-col gap-4">
      <ParallaxImage src={photo.url} alt={photo.alt} className="aspect-4/3" sizes="240px" drift={10} zoom={0.08} />
      <p className="text-base text-black text-balance">{card.body}</p>
    </div>
  );
}

/**
 * Our Story (yellow): the big statement writes itself in word by word as
 * you scroll, while the two story cards float past at different speeds on
 * either side.
 */
export function AboutStory({ story }: { story: AboutContent["story"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "center 0.45"] });
  const words = titleWords(story.title);
  const [topCard, bottomCard] = story.cards;

  return (
    <Section className="overflow-hidden bg-yellow py-24 md:py-32">
      <div ref={ref} className="relative flex flex-col gap-12 md:gap-0">
        {topCard && (
          <Parallax speed={-60} className="flex justify-end md:-mb-24">
            <StoryCard card={topCard} index={0} />
          </Parallax>
        )}

        <Reveal className="relative z-10 flex flex-col items-center gap-4 text-center">
          <Eyebrow tone="dark">{story.eyebrow}</Eyebrow>
          <h2 className="max-w-3xl text-hero-3 text-black lg:text-story">
            {reduced
              ? words.map((w, i) => <Fragment key={i}>{w.text} </Fragment>)
              : words.map((w, i) => (
                  <InkWord key={i} word={w} p={scrollYProgress} from={i / words.length} to={(i + 1.5) / words.length} />
                ))}
          </h2>
        </Reveal>

        {bottomCard && (
          <Parallax speed={40} className="flex md:-mt-24">
            <StoryCard card={bottomCard} index={1} />
          </Parallax>
        )}
      </div>
    </Section>
  );
}
