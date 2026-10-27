"use client";

import { useState } from "react";
import type { StrapiImage } from "@/lib/cms/types";

/** Gallery frames fall back to 3:2 until the media's real shape is known. */
const DEFAULT_ASPECT = 3 / 2;

const ratioOf = (m?: StrapiImage | null) =>
  m?.width && m?.height ? m.width / m.height : null;

/**
 * Aspect ratio for a case-study gallery frame, so each image or video shows
 * at the shape it was designed (Figma sections aren't all 3:2). Uses the
 * Strapi width/height, else the poster's, else measures the file on load
 * (Strapi stores no dimensions for videos).
 */
export function useMediaAspect(media: StrapiImage, poster?: StrapiImage | null) {
  const [measured, setMeasured] = useState<number | null>(null);
  const aspect = measured ?? ratioOf(media) ?? ratioOf(poster) ?? DEFAULT_ASPECT;
  const onSize = (w: number, h: number) => {
    if (w && h) setMeasured(w / h);
  };
  return { aspect, onSize };
}
