"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Marquee } from "@/components/ui/Marquee";
import type { AboutContent, AboutImage } from "@/lib/cms/types";

// Strip geometry: cards share a width and alternate tall / short; as the
// section scrolls past, the tall ones shrink and the short ones grow until
// the rhythm has reversed (and back again on the way up).
const TALL = 420;
const SHORT = 294;
const CARD_GAP = 20; // px between cards

// When no CMS photos are set yet, fill the strip by repeating these.
const FALLBACK_PHOTOS: AboutImage[] = [
  { url: "/images/about/about-1.webp", alt: "" },
  { url: "/images/about/about-2.webp", alt: "" },
];
const FALLBACK_COUNT = 6;

function PhotoCard({ photo, tall, p }: { photo: AboutImage; tall: boolean; p: MotionValue<number> }) {
  const height = useTransform(p, [0, 1], tall ? [TALL, SHORT] : [SHORT, TALL]);
  return (
    <motion.div className="relative w-[286px] shrink-0 overflow-hidden bg-space-grey mt-auto" style={{ height }}>
      <Image src={photo.url} alt={photo.alt ?? ""} fill className="object-cover" sizes="286px" />
    </motion.div>
  );
}

export function InnovateMarquee({
  innovate,
}: {
  innovate: AboutContent["innovate"];
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: stripRef, offset: ["start end", "end start"] });
  // Ease in/out of the swap, holding a beat at each end.
  const swap = useTransform(scrollYProgress, [0.15, 0.85], reduced ? [0, 0] : [0, 1], { clamp: true });
  const slots: AboutImage[] = innovate.photos.length
    ? innovate.photos
    : Array.from(
        { length: FALLBACK_COUNT },
        (_, i) => FALLBACK_PHOTOS[i % FALLBACK_PHOTOS.length],
      );
  // An even count keeps tall / short alternating across the marquee's seam.
  const strip = slots.length % 2 ? [...slots, ...slots] : slots;

  return (
    <Section theme="dark" bleed className="overflow-hidden">
      {/* Scrolling headline — scroll down → left, up → right */}
      <div className="py-10 overflow-hidden">
        <Marquee gap={120}>
          <span
            className="shrink-0 font-bold text-innovate leading-none bg-gradient-to-t from-black to-yellow bg-clip-text text-transparent whitespace-nowrap"
            aria-hidden
          >
            {innovate.text}
          </span>
        </Marquee>
        <p className="sr-only">{innovate.text}</p>
      </div>

      {/* Photo strip — opposite of the headline: scroll down → right, up → left */}
      {/* The strip keeps the tall height and sits on its bottom edge, so the
          swap never shifts the page. */}
      <div ref={stripRef} className="relative flex items-end pb-20 pt-12">
        <div className="flex w-full flex-col justify-end" style={{ minHeight: TALL }}>
          <Marquee direction="right" gap={CARD_GAP}>
            {strip.map((photo, i) => (
              <PhotoCard key={i} photo={photo} tall={i % 2 === 0} p={swap} />
            ))}
          </Marquee>
        </div>
      </div>
    </Section>
  );
}
