"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Media } from "@/components/ui/Media";
import { strapiMedia } from "@/lib/cms/media";
import type { StrapiImage } from "@/lib/cms/types";
import { EASE_LUXE, EASE_CINEMA } from "@/components/motion/variants";

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
    <div ref={ref} className="w-full">
      <motion.div
        className="w-full aspect-case-photo overflow-hidden"
        initial={reduced ? false : { clipPath: "inset(100% 0 0 0)" }}
        animate={inView || reduced ? { clipPath: "inset(0% 0 0 0)" } : { clipPath: "inset(100% 0 0 0)" }}
        transition={{ duration: 1.2, ease: EASE_CINEMA }}
        whileHover={{ scale: 1.02 }}
      >
        <motion.div
          className="absolute inset-0"
          initial={reduced ? false : { scale: 1.08 }}
          animate={inView || reduced ? { scale: 1 } : { scale: 1.08 }}
          transition={{ duration: 1.4, ease: EASE_LUXE }}
        >
          <Media
            src={src}
            alt={image.alternativeText ?? ""}
            sizes="(max-width: 768px) 100vw, 1392px"
            className="object-cover"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
