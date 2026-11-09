"use client";

import { BookingIcon } from "@/components/ui/BookingIcon";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { useHeaderCtaInView } from "@/components/layout/HeaderCtaInView";
import { isLeadsHref } from "@/config/nav";
import { fadeUp, stagger } from "@/lib/motion";
import type { ServiceHeroProps } from "@/lib/cms/types";
import { RichText } from "@/components/ui/RichText";
import { ShotReel } from "@/components/ui/ShotReel";
import type { ReelShot } from "@/config/serviceReels";
import { noOrphan } from "@/lib/noOrphan";

function renderTitle(title: string, titleHighlights: string[] = []) {
  if (!titleHighlights.length) {
    return noOrphan(title);
  }
  // Same no-orphan rule as plain titles: glue the last two words when it fits.
  const glue = noOrphan(title).includes("\u00a0");
  const words = title.split(/\s+/);
  return words.map((word, i) => {
    const bare = word.replace(/[.,!?;:]+$/, "");
    const trail = word.slice(bare.length);
    const highlighted = titleHighlights.includes(bare);
    return (
      <Fragment key={i}>
        {highlighted ? <span className="text-accent">{bare}</span> : bare}
        {trail}
        {i < words.length - 1 ? (glue && i === words.length - 2 ? "\u00a0" : " ") : ""}
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
  sceneUnderCopy = false,
  switcher,
}: ServiceHeroProps & {
  /** Row for jumping to the other service pages, shown above the eyebrow. */
  switcher?: ReactNode;
  /** Fast project montage shown instead of the CMS image (front-end only). */
  reel?: ReelShot[];
  /** Coded animated scene shown instead of the CMS image (front-end only). */
  scene?: ReactNode;
  /** Give `scene` the reel's full-bleed treatment (it's a looping reel too). */
  bleedScene?: boolean;
  /** With `bleedScene`: the scene takes more of the width and may pass under
   *  the copy (which stays on top). */
  sceneUnderCopy?: boolean;
}) {
  // Swap to a local fallback image if the CMS image fails to load.
  const [imgSrc, setImgSrc] = useState(image);
  const ctaRef = useHeaderCtaInView<HTMLDivElement>(isLeadsHref(cta?.href));
  // Looping reels run the hero's full height, out to the page edge, square;
  // the coded scenes and CMS images stay a rounded card beside the copy.
  const bleed = !!reel?.length || (!!scene && bleedScene);
  return (
    <Section
      bleed
      className={bleed ? "pt-32 pb-16 md:flex md:min-h-svh md:flex-col md:pb-32" : "pt-32 pb-16 md:pb-24"}
      theme="dark"
    >
      <div className={cn("container-page", bleed && "md:flex md:flex-1 md:flex-col")}>
      {/* Service switcher: pinned to the top of the hero, outside the
          vertically-centred copy, so it sits in the same spot on every page. */}
      {switcher && <div className="mb-10 md:w-1/2 md:pr-12">{switcher}</div>}
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        animate="visible"
        className={cn(
          "flex flex-col gap-12 md:flex-row md:items-center",
          bleed && "md:flex-1",
          reverseLayout && "md:flex-row-reverse",
        )}
      >
        <div
          className={cn(
            bleed ? "min-w-0 space-y-6 md:w-1/2 md:pr-12" : "min-w-0 flex-1 space-y-6",
            bleed && sceneUnderCopy && "relative z-10",
          )}
        >
          {subTitle && (
            <motion.p
              variants={fadeUp}
              className="text-balance text-sm font-medium uppercase tracking-[0.18em] text-fg-muted"
            >
              {subTitle}
            </motion.p>
          )}
          <motion.h1
            variants={fadeUp}
            className="text-hero-3 text-left font-bold text-balance md:text-hero-2"
          >
            {renderTitle(title, titleHighlights)}
          </motion.h1>
          <motion.div variants={fadeUp}>
            <RichText content={description} className="text-lg text-fg-muted text-balance" checkList />
          </motion.div>
          {cta && (
            <motion.div variants={fadeUp} ref={ctaRef}>
              <Button asChild size="lg">
                <Link href={cta.href} className="group">
                  <BookingIcon href={cta.href} />
                  {cta.label}
                </Link>
              </Button>
            </motion.div>
          )}
        </div>
        <motion.div
          variants={fadeUp}
          className={
            bleed
              ? `relative -mx-4 aspect-video overflow-hidden md:absolute md:inset-y-0 md:mx-0 md:aspect-auto ${sceneUnderCopy ? "md:w-3/5 md:mask-scene-fade" : "md:w-1/2"} ${reverseLayout ? "md:left-0" : "md:right-0"}`
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
      </div>
    </Section>
  );
}
