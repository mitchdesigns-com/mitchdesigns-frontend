"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Media } from "@/components/ui/Media";
import { strapiMedia } from "@/lib/cms/media";
import type { StrapiImage } from "@/lib/cms/types";
import { EASE_LUXE } from "@/components/motion/variants";
import { useReveal } from "@/components/motion/useReveal";
import { useMediaAspect } from "./useMediaAspect";

type Props = {
  left: StrapiImage;
  right: StrapiImage;
};

export function TwoImagesInRow({ left, right }: Props) {
  const { ref, inView } = useReveal();
  const reduced = useReducedMotion();
  // Both halves share one shape (as in Figma): the side whose size Strapi
  // knows (an image), else the left side measured on load.
  const hasSize = (m: StrapiImage) => Boolean(m.width && m.height);
  const sizeFromRight = !hasSize(left) && hasSize(right);
  const { aspect, onSize } = useMediaAspect(sizeFromRight ? right : left);

  const leftSrc = strapiMedia(left.url);
  const rightSrc = strapiMedia(right.url);

  return (
    <div ref={ref} className="flex flex-col gap-6 md:flex-row md:gap-10">
      {leftSrc && (
        <div className="w-full flex-1 overflow-hidden">
          <motion.div
            className="relative"
            style={{ aspectRatio: aspect }}
            initial={reduced ? false : { opacity: 0, x: -40, scale: 1.05 }}
            animate={inView || reduced ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -40, scale: 1.05 }}
            transition={{ duration: 0.9, ease: EASE_LUXE }}
            whileHover={{ scale: 1.02 }}
          >
            <Media
              src={leftSrc}
              alt={left.alternativeText ?? ""}
              mime={left.mime}
              onSize={sizeFromRight ? undefined : onSize}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      )}
      {rightSrc && (
        <div className="w-full flex-1 overflow-hidden">
          <motion.div
            className="relative"
            style={{ aspectRatio: aspect }}
            initial={reduced ? false : { opacity: 0, x: 40, scale: 1.05 }}
            animate={inView || reduced ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 40, scale: 1.05 }}
            transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Media
              src={rightSrc}
              alt={right.alternativeText ?? ""}
              mime={right.mime}
              onSize={sizeFromRight ? onSize : undefined}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
