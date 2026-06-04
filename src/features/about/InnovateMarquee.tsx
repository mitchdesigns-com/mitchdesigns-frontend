"use client";

import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { Marquee } from "@/components/ui/Marquee";
import type { AboutContent, AboutImage } from "@/lib/cms/types";

// Strip geometry. All cards share a fixed width; height comes from each
// image's aspect ratio (Strapi width/height), clamped to [MIN, MAX].
const CARD_WIDTH = 286;
const MIN_HEIGHT = 294;
const MAX_HEIGHT = 470;
const CARD_GAP = 20; // px between cards

// When no CMS photos are set yet, fill the strip by repeating these — heights
// alternate 470/294 to show the variable-height behaviour.
const FALLBACK_PHOTOS: AboutImage[] = [
  { url: "/images/about/about-1.webp", alt: "", width: CARD_WIDTH, height: 470 },
  { url: "/images/about/about-2.webp", alt: "", width: CARD_WIDTH, height: 294 },
];
const FALLBACK_COUNT = 6;

function cardHeight(photo: AboutImage): number {
  if (photo.width && photo.height) {
    const h = Math.round(CARD_WIDTH * (photo.height / photo.width));
    return Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, h));
  }
  return MAX_HEIGHT;
}

function PhotoCard({ photo }: { photo: AboutImage }) {
  const h = cardHeight(photo);
  return (
    <div
      className="relative w-[286px] shrink-0 overflow-hidden rounded-sm bg-space-grey mt-auto"
      style={{ height: h }}
    >
      <Image
        src={photo.url}
        alt={photo.alt ?? ""}
        fill
        className="object-cover"
        sizes="286px"
      />
    </div>
  );
}

export function InnovateMarquee({
  innovate,
}: {
  innovate: AboutContent["innovate"];
}) {
  const slots: AboutImage[] = innovate.photos.length
    ? innovate.photos
    : Array.from(
        { length: FALLBACK_COUNT },
        (_, i) => FALLBACK_PHOTOS[i % FALLBACK_PHOTOS.length],
      );

  return (
    <Section theme="dark" bleed className="overflow-hidden">
      {/* Scrolling headline — scroll down → left, up → right */}
      <div className="py-10 overflow-hidden">
        <Marquee gap={120}>
          <span
            className="shrink-0 font-bold text-jumbo leading-none bg-gradient-to-t from-black to-yellow bg-clip-text text-transparent whitespace-nowrap"
            aria-hidden
          >
            {innovate.text}
          </span>
        </Marquee>
        <p className="sr-only">{innovate.text}</p>
      </div>

      {/* Photo strip — opposite of the headline: scroll down → right, up → left */}
      <div className="relative pb-20 pt-12">
        <Marquee direction="right" gap={CARD_GAP}>
          {slots.map((photo, i) => (
            <PhotoCard key={i} photo={photo} />
          ))}
        </Marquee>
      </div>
    </Section>
  );
}
