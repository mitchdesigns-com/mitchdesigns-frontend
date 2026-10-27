"use client";

import { motion } from "framer-motion";
import { Media, isVideo } from "@/components/ui/Media";
import { listCover } from "./listCovers";
import Link from "next/link";
import { strapiMedia } from "@/lib/cms/media";
import { staggerChildren, itemFadeUp } from "@/components/motion/variants";
import { useReveal } from "@/components/motion/useReveal";
import type { CaseStudy } from "@/lib/cms/types";

type Study = Pick<
  CaseStudy,
  "slug" | "title" | "tagline" | "services" | "cover" | "listCover" | "featuredThumbnail"
> & { id: number };

type Props = {
  studies: Study[];
};

function RelatedCard({ study }: { study: Study }) {
  // Card image, never the hero: `cover` may be the case study's hero video.
  const card =
    [study.listCover, study.featuredThumbnail].find((m) => m?.url) ??
    (study.cover && !isVideo(study.cover.url, study.cover.mime) ? study.cover : null);
  const coverSrc = strapiMedia(card?.url) ?? listCover(study.slug) ?? null;

  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className="group flex flex-col gap-10 w-full"
    >
      <div className="relative w-full aspect-case-photo overflow-hidden rounded-2xs">
        {coverSrc ? (
          <Media
            src={coverSrc}
            mime={card?.mime}
            alt={card?.alternativeText ?? study.title}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 bg-img-placeholder" />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-hero-3 font-bold text-black leading-tight">{study.title}</p>
        {study.tagline && (
          <p className="text-xl font-medium text-black text-balance">{study.tagline}</p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {study.services.map((service, i) => (
            <span key={service} className="contents">
              {i > 0 && (
                <span className="size-[3px] shrink-0 rounded-full bg-space-grey" aria-hidden />
              )}
              <span className="text-sm font-medium text-space-grey">{service}</span>
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function RelatedProjects({ studies }: Props) {
  const { ref, inView } = useReveal<HTMLElement>();

  if (!studies.length) return null;

  return (
    <section ref={ref} className="bg-yellow py-24 lg:py-32">
      <motion.div
        className="container-page flex flex-col gap-16"
        variants={staggerChildren(0.12)}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.h2 variants={itemFadeUp} className="text-hero-2 font-bold text-black">
          Related Projects
        </motion.h2>

        <motion.div
          variants={staggerChildren(0.15)}
          className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-10"
        >
          {studies.map((study) => (
            <motion.div key={study.id} variants={itemFadeUp}>
              <RelatedCard study={study} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
