"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { strapiMedia } from "@/lib/cms/media";
import type { CaseStudy } from "@/lib/cms/types";
import { staggerChildren, itemFadeUp, scaleIn } from "@/components/motion/variants";

type Props = {
  study: Pick<CaseStudy, "title" | "services" | "tagline" | "excerpt" | "websiteUrl" | "cover">;
};

export function CaseStudyHero({ study }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col gap-8"
      variants={staggerChildren(0.12, 0.1)}
      initial={reduced ? "visible" : "hidden"}
      animate="visible"
    >
      <motion.div
        variants={itemFadeUp}
        className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="flex flex-col gap-3">
          <h1 className="text-hero-3 font-black text-fg md:text-hero-2 lg:text-hero-1">{study.title}</h1>

          {study.services.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {study.services.map((service, i) => (
                <span key={service} className="contents">
                  {i > 0 && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-fg-muted shrink-0"
                      aria-hidden
                    />
                  )}
                  <span className="text-base text-fg-muted font-medium leading-5">
                    {service}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>

        {study.websiteUrl && (
          <a
            href={study.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-9 py-6 rounded-pill bg-space-grey text-white text-base font-medium shrink-0"
          >
            Visit Website
            <ArrowRight size={20} />
          </a>
        )}
      </motion.div>

      <motion.hr variants={itemFadeUp} className="border-t border-white" />

      <motion.div variants={itemFadeUp} className="flex flex-col gap-3">
        {study.tagline && (
          <p className="text-xl font-medium text-fg text-balance">
            {study.tagline}
          </p>
        )}
        {study.excerpt && (
          <p className="text-base text-grey-200 leading-6 max-w-3xl text-balance">
            {study.excerpt}
          </p>
        )}
      </motion.div>

      {strapiMedia(study.cover?.url) && (
        <motion.div variants={itemFadeUp} className="relative w-full aspect-video overflow-hidden rounded-card">
          <motion.div
            className="absolute inset-0"
            variants={scaleIn}
            transition={{ duration: 1.2 }}
          >
            <Image
              src={strapiMedia(study.cover.url)!}
              alt={study.cover.alternativeText ?? study.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1392px"
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
