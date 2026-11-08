"use client";

import { Fragment, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Parallax, ParallaxImage, Reveal } from "@/components/motion";
import { easeOutSoft } from "@/lib/motion";
import type { AboutContent, RichText } from "@/lib/cms/types";
import { Eyebrow } from "./Eyebrow";

type InlineNode = { type: "text"; text: string; bold?: boolean; italic?: boolean; underline?: boolean };
/** A styled run inside a word ("2005" bold, then "," plain). */
type Part = { text: string; bold?: boolean; underline?: boolean };
/** One word as the reader sees it: runs with no space between them. */
type Word = Part[];

/**
 * The story title (plain text or Strapi blocks) as a flat list of words.
 * Sentence case, regular weight: only the words marked bold in the CMS stand
 * out. CMS italics are ignored. Punctuation stuck to a styled word ("2005"
 * then ", we've") stays in the same word, so no space appears before it.
 */
function titleWords(content: RichText): Word[] {
  if (!content) return [];
  let nodes: Part[];
  if (typeof content === "string") nodes = [{ text: content }];
  else if (!Array.isArray(content)) return [];
  else
    nodes = (content as Array<{ children?: InlineNode[] }>).flatMap((block) => [
      ...(block.children ?? []).map((n) => ({ text: n.text, bold: n.bold, underline: n.underline })),
      { text: " " }, // blocks never run into each other
    ]);
  const words: Word[] = [];
  let joined = false; // last token ended without whitespace
  for (const n of nodes) {
    for (const token of n.text.split(/(\s+)/)) {
      if (!token) continue;
      if (/^\s+$/.test(token)) {
        joined = false;
        continue;
      }
      const part = { text: token, bold: n.bold, underline: n.underline };
      if (joined && words.length) words[words.length - 1].push(part);
      else words.push([part]);
      joined = true;
    }
  }
  // Only the first word is forced to a capital; the rest keeps the CMS casing
  // (so "Egypt" and "MENA" stay as written).
  const first = words[0]?.[0];
  if (first) first.text = first.text.charAt(0).toUpperCase() + first.text.slice(1);
  return words;
}

function PartText({ part }: { part: Part }) {
  let el: React.ReactNode = part.text;
  if (part.bold) el = <strong className="font-black">{el}</strong>;
  if (part.underline) el = <u>{el}</u>;
  return el;
}

/** One word of the statement, inked in as the scroll reaches it. */
function InkWord({ word, p, from, to }: { word: Word; p: MotionValue<number>; from: number; to: number }) {
  const opacity = useTransform(p, [from, to], [0.18, 1]);
  return (
    <motion.span style={{ opacity }}>
      {word.map((part, i) => (
        <PartText key={i} part={part} />
      ))}{" "}
    </motion.span>
  );
}

const STORY_PHOTOS = [
  { url: "/images/studio/about/story-office.webp", alt: "The MitchDesigns studio" },
  { url: "/images/studio/about/story-desk.webp", alt: "A MitchDesigns developer focused at his desk" },
  { url: "/images/studio/about/strip-presenting.webp", alt: "A MitchDesigns strategist presenting to the team" },
  { url: "/images/studio/about/strip-keyboard.webp", alt: "Hands on a keyboard in the MitchDesigns studio" },
];

type Photo = { url: string; alt: string };

/** Where the text sits from a photo: x 1 = to its right, y 1 = below it. */
type Toward = { x: 1 | -1; y: 1 | -1 };

const HOVER_EASE = { duration: 0.9, ease: easeOutSoft };

/**
 * A story photo. On hover the whole frame grows (the image itself isn't
 * zoomed), turns to face the text and glides toward it. The hover target is
 * the still outer box, so the moving frame never slips out from under the
 * pointer. Mouse only; still for reduced motion.
 */
function StoryPhoto({ photo, toward }: { photo: Photo; toward: Toward }) {
  const reduced = useReducedMotion();
  const variants = {
    rest: { scale: 1, x: 0, y: 0, rotateX: 0, rotateY: 0, transition: HOVER_EASE },
    hover: reduced
      ? {}
      : {
          scale: 1.2,
          x: toward.x * 28,
          y: toward.y * 20,
          rotateY: toward.x * 16,
          rotateX: -toward.y * 10,
          transition: HOVER_EASE,
        },
  };
  return (
    <motion.div
      className="group relative w-full max-w-72 perspective-midrange"
      initial="rest"
      animate="rest"
      whileHover="hover"
    >
      <motion.div
        variants={variants}
        className="transform-3d shadow-none transition-shadow duration-700 ease-out-soft group-hover:shadow-2xl"
      >
        <ParallaxImage src={photo.url} alt={photo.alt} className="aspect-4/3" sizes="360px" drift={10} zoom={0.08} />
      </motion.div>
    </motion.div>
  );
}

/**
 * Our Story (yellow): the statement and the paragraphs under it write
 * themselves in word by word as you scroll, all in one style, and four
 * photos float past at different speeds, each growing, turning and gliding toward the text on hover.
 */
export function AboutStory({ story }: { story: AboutContent["story"] }) {
  const textRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: textRef, offset: ["start 0.85", "end 0.6"] });
  // Photos come from the cards' images (CMS first, studio shoot as fallback).
  const photos: Photo[] = STORY_PHOTOS.map((fallback, i) => {
    const img = story.cards[i]?.image;
    return img?.url ? { url: img.url, alt: img.alt ?? fallback.alt } : fallback;
  });
  // The statement, then each card's text, all set the same way: same size,
  // weight and CMS bold words, inked in as one continuous read.
  const blocks = [story.title, ...story.cards.map((c) => c.body)]
    .map(titleWords)
    .filter((words) => words.length > 0);
  const total = blocks.reduce((n, words) => n + words.length, 0);
  const offsets = blocks.map((_, b) => blocks.slice(0, b).reduce((n, words) => n + words.length, 0));
  const [heading, ...paragraphs] = blocks;

  const renderWords = (words: Word[], start: number) =>
    reduced
      ? words.map((w, i) => <Fragment key={i}>{w.map((part, j) => <PartText key={j} part={part} />)} </Fragment>)
      : words.map((w, i) => (
          <InkWord key={i} word={w} p={scrollYProgress} from={(start + i) / total} to={(start + i + 1.5) / total} />
        ));

  return (
    <Section className="overflow-hidden bg-yellow py-24 md:py-32">
      <div className="relative flex flex-col gap-16 md:gap-32">
        <div className="mx-auto flex w-full max-w-6xl justify-between gap-4">
          <Parallax speed={-40} className="relative flex w-full justify-start md:justify-center md:pt-16 hover:z-20">
            <StoryPhoto photo={photos[0]} toward={{ x: 1, y: 1 }} />
          </Parallax>
          <Parallax speed={-60} className="relative flex w-full justify-end md:justify-center md:pt-24 hover:z-20">
            <StoryPhoto photo={photos[1]} toward={{ x: -1, y: 1 }} />
          </Parallax>
        </div>

        <Reveal className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <Eyebrow tone="dark">{story.eyebrow}</Eyebrow>
          <div ref={textRef} className="flex flex-col gap-8">
            {heading && <h2 className="text-hero-3 text-black lg:text-story">{renderWords(heading, 0)}</h2>}
            {paragraphs.map((words, i) => (
              <p key={i} className="text-hero-3 text-black text-balance lg:text-story">
                {renderWords(words, offsets[i + 1])}
              </p>
            ))}
          </div>
        </Reveal>

        <div className="mx-auto flex w-full max-w-6xl justify-between gap-4">
          <Parallax speed={40} className="relative flex w-full justify-start md:justify-center md:pt-24 hover:z-20">
            <StoryPhoto photo={photos[2]} toward={{ x: 1, y: -1 }} />
          </Parallax>
          <Parallax speed={60} className="relative flex w-full justify-end md:justify-center hover:z-20">
            <StoryPhoto photo={photos[3]} toward={{ x: -1, y: -1 }} />
          </Parallax>
        </div>
      </div>
    </Section>
  );
}
