"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { useHeaderCtaInView } from "@/components/layout/HeaderCtaInView";
import { isLeadsHref } from "@/config/nav";
import { fadeUp, stagger } from "@/lib/motion";
import type { ServiceHeroProps } from "@/lib/cms/types";
import { RichText } from "@/components/ui/RichText";
import { ShotReel } from "@/components/ui/ShotReel";
import type { ReelShot } from "@/config/serviceReels";

function renderTitle(title: string, titleHighlights: string[] = []) {
  if (!titleHighlights.length) {
    return title;
  }
  const words = title.split(/\s+/);
  return words.map((word, i) => {
    const bare = word.replace(/[.,!?;:]+$/, "");
    const trail = word.slice(bare.length);
    const highlighted = titleHighlights.includes(bare);
    return (
      <Fragment key={i}>
        {highlighted ? <span className="text-accent">{bare}</span> : bare}
        {trail}
        {i < words.length - 1 ? " " : ""}
      </Fragment>
    );
  });
}

export function ServiceHero({
  title,
  titleHighlights,
  subTitle,
  description,
  image,
  imageAlt,
  cta,
  reverseLayout = false,
  reel,
  scene,
  bleedScene = false,
}: ServiceHeroProps & {
  /** Fast project montage shown instead of the CMS image (front-end only). */
  reel?: ReelShot[];
  /** Coded animated scene shown instead of the CMS image (front-end only). */
  scene?: ReactNode;
  /** Give `scene` the reel's full-bleed treatment (it's a looping reel too). */
  bleedScene?: boolean;
}) {
  // Swap to a local fallback image if the CMS image fails to load.
  const [imgSrc, setImgSrc] = useState(image);
  const ctaRef = useHeaderCtaInView<HTMLDivElement>(isLeadsHref(cta?.href));
  // Looping reels run the hero's full height, out to the page edge, square;
  // the coded scenes and CMS images stay a rounded card beside the copy.
  const bleed = !!reel?.length || (!!scene && bleedScene);
  return (
    <Section
      className={bleed ? "pt-32 pb-16 md:flex md:min-h-svh md:items-center md:py-32" : "pt-32 pb-16 md:pb-24"}
      theme="dark"
    >
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        animate="visible"
        className={`flex flex-col gap-12 md:flex-row md:items-center ${reverseLayout ? "md:flex-row-reverse" : ""}`}
      >
        <div className={bleed ? "space-y-6 md:w-1/2 md:pr-12" : "flex-1 space-y-6"}>
          {subTitle && (
            <motion.p
              variants={fadeUp}
              className="whitespace-nowrap text-sm font-medium uppercase tracking-[0.18em] text-fg-muted"
            >
              {subTitle}
            </motion.p>
          )}
          <motion.h1
            variants={fadeUp}
            className="text-hero-3 font-bold md:text-hero-2"
          >
            {renderTitle(title, titleHighlights)}
          </motion.h1>
          <motion.div variants={fadeUp}>
            <RichText content={description} className="max-w-xl text-lg text-fg-muted" />
          </motion.div>
          {cta && (
            <motion.div variants={fadeUp} ref={ctaRef}>
              <Button asChild size="lg">
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            </motion.div>
          )}
        </div>
        <motion.div
          variants={fadeUp}
          className={
            bleed
              ? `relative -mx-4 aspect-video overflow-hidden md:absolute md:inset-y-0 md:mx-0 md:aspect-auto md:w-1/2 ${reverseLayout ? "md:left-0" : "md:right-0"}`
              : "relative min-h-72 flex-1 overflow-hidden rounded-card md:min-h-112"
          }
        >
          {scene ? (
            scene
          ) : reel?.length ? (
            <ShotReel shots={reel} sizes="(max-width: 768px) 100vw, 50vw" />
          ) : image && (
            <Image
              src={imgSrc ?? image}
              alt={imageAlt ?? ""}
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              onError={() => setImgSrc("/images/404.webp")}
            />
          )}
        </motion.div>
      </motion.div>
    </Section>
  );
}
