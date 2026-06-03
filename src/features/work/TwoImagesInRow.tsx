"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Media } from "@/components/ui/Media";
import { strapiMedia } from "@/lib/cms/media";
import type { StrapiImage } from "@/lib/cms/types";
import { EASE_LUXE } from "@/components/motion/variants";
import { useReveal } from "@/components/motion/useReveal";

type Props = {
  left: StrapiImage;
  right: StrapiImage;
};

export function TwoImagesInRow({ left, right }: Props) {
  const { ref, inView } = useReveal();
  const reduced = useReducedMotion();

  const leftSrc = strapiMedia(left.url);
  const rightSrc = strapiMedia(right.url);

  return (
    <div ref={ref} className="flex flex-col gap-6 md:flex-row md:gap-10">
      {leftSrc && (
        <div className="w-full flex-1 overflow-hidden">
          <motion.div
            className="relative aspect-case-photo"
            initial={reduced ? false : { opacity: 0, x: -40, scale: 1.05 }}
            animate={inView || reduced ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -40, scale: 1.05 }}
            transition={{ duration: 0.9, ease: EASE_LUXE }}
            whileHover={{ scale: 1.02 }}
          >
            <Media
              src={leftSrc}
              alt={left.alternativeText ?? ""}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      )}
      {rightSrc && (
        <div className="w-full flex-1 overflow-hidden">
          <motion.div
            className="relative aspect-case-photo"
            initial={reduced ? false : { opacity: 0, x: 40, scale: 1.05 }}
            animate={inView || reduced ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 40, scale: 1.05 }}
            transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Media
              src={rightSrc}
              alt={right.alternativeText ?? ""}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
