"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { HeaderCtaInView } from "@/components/layout/HeaderCtaInView";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { RichText } from "@/components/ui/RichText";
import { isLeadsHref } from "@/config/nav";
import { cn } from "@/lib/cn";
import { easeOutSoft } from "@/lib/motion";
import type { WeGotYouProps } from "@/lib/cms/types";
import { HighlightTitle } from "./WeGotYouOrbit";

/**
 * "We Got You" for pages that speak to several audiences: the shared headline
 * and intro, then a toggle (e.g. B2C · Food & Beverage · B2B) that swaps a
 * message, an optional brand logo (Orderbase) and a photo for each one.
 */
export function WeGotYouTabs({
  title,
  titleTag = "h2",
  titleHighlights,
  label,
  description,
  image,
  imageAlt,
  story,
  cta,
  theme = "light",
  tabs = [],
}: WeGotYouProps) {
  const [active, setActive] = useState(0);
  const tab = tabs[active];
  // One photo per audience, cycling the section's story (or its image).
  const shots = story?.length ? story : [{ src: image, alt: imageAlt ?? "" }];
  const shot = shots[active % shots.length];

  return (
    <Section theme={theme} className="py-20 md:py-28">
      <div className="flex flex-col items-center gap-8 text-center">
        {label && (
          <span className="inline-flex -rotate-4 rounded-pill bg-yellow px-4 py-1.5 text-base font-bold text-black">
            {label}
          </span>
        )}
        <HighlightTitle title={title} highlights={titleHighlights} Tag={titleTag} />
        <RichText content={description} className="max-w-3xl text-xl font-medium text-black text-balance md:text-2xl" />

        {/* Audience toggle: phones scroll it sideways on one line */}
        <div
          role="tablist"
          aria-label="Who we build for"
          className="-mx-(--container-padding) flex gap-2 self-stretch overflow-x-auto px-(--container-padding) scrollbar-none md:mx-0 md:self-auto md:overflow-visible md:rounded-pill md:bg-panel md:p-1.5"
        >
          {tabs.map((t, i) => (
            <button
              key={t.label}
              type="button"
              role="tab"
              id={`audience-tab-${i}`}
              aria-selected={i === active}
              aria-controls="audience-panel"
              onClick={() => setActive(i)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-pill border px-5 py-2.5 text-base font-semibold transition-colors duration-200 md:border-transparent md:px-6 md:py-3",
                i === active ? "border-black bg-black text-yellow" : "border-black/15 text-black/60 hover:text-black",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            id="audience-panel"
            role="tabpanel"
            aria-labelledby={`audience-tab-${active}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: easeOutSoft }}
            className="mt-12 grid items-center gap-10 md:mt-16 md:grid-cols-2 md:gap-16"
          >
            <div className="flex flex-col items-start gap-5">
              {tab.logo && (
                <Image
                  src={tab.logo}
                  alt={tab.logoAlt || tab.label}
                  width={180}
                  height={40}
                  unoptimized
                  className="h-14 w-auto"
                />
              )}
              <h3 className="text-hero-5 font-bold text-black text-balance">{tab.title}</h3>
              <RichText content={tab.description} className="text-lg text-black/75 text-balance md:text-xl" />
              {cta && (
                <HeaderCtaInView active={isLeadsHref(cta.href)}>
                  <Button asChild size="lg" className="mt-2">
                    <Link href={cta.href}>
                      {cta.label}
                      <ArrowRight size={20} />
                    </Link>
                  </Button>
                </HeaderCtaInView>
              )}
            </div>
            <div className="relative aspect-4/3 overflow-hidden rounded-card shadow-soft-lg">
              <Image src={shot.src} alt={shot.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </Section>
  );
}
