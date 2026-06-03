"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Media } from "@/components/ui/Media";
import { strapiMedia } from "@/lib/cms/media";
import type { StrapiImage } from "@/lib/cms/types";
import { EASE_LUXE } from "@/components/motion/variants";

type Props = {
  image: StrapiImage;
};

export function SingleImageInRow({ image }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  const src = strapiMedia(image.url);
  if (!src) return null;

  return (
    <div ref={ref} className="w-full overflow-hidden">
      <motion.div
        className="relative w-full aspect-case-photo"
        initial={reduced ? false : { opacity: 0, scale: 1.04 }}
        animate={inView || reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
        transition={{ duration: 0.9, ease: EASE_LUXE }}
        whileHover={{ scale: 1.02 }}
      >
        <Media
          src={src}
          alt={image.alternativeText ?? ""}
          sizes="(max-width: 768px) 100vw, 1392px"
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
