"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Media } from "@/components/ui/Media";
import { strapiMedia } from "@/lib/cms/media";
import type { StrapiImage } from "@/lib/cms/types";
import { EASE_LUXE } from "@/components/motion/variants";
import { useReveal } from "@/components/motion/useReveal";
import { useMediaAspect } from "./useMediaAspect";

type Props = {
  image: StrapiImage;
  poster?: StrapiImage | null;
};

export function SingleImageInRow({ image, poster }: Props) {
  const { ref, inView } = useReveal();
  const reduced = useReducedMotion();
  const { aspect, onSize } = useMediaAspect(image, poster);

  const src = strapiMedia(image.url);
  if (!src) return null;

  return (
    <div ref={ref} className="w-full overflow-hidden">
      <motion.div
        className="relative w-full"
        style={{ aspectRatio: aspect }}
        initial={reduced ? false : { opacity: 0, scale: 1.04 }}
        animate={inView || reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
        transition={{ duration: 0.9, ease: EASE_LUXE }}
        whileHover={{ scale: 1.02 }}
      >
        <Media
          src={src}
          alt={image.alternativeText ?? ""}
          mime={image.mime}
          poster={strapiMedia(poster?.url)}
          onSize={onSize}
          sizes="(max-width: 768px) 100vw, 1392px"
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
