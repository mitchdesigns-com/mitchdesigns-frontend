"use client";

import { BookingIcon } from "@/components/ui/BookingIcon";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
import { Reveal, useReveal } from "@/components/motion";

/**
 * "We Got You" for pages that speak to several audiences: the shared headline
 * and intro, then a toggle (e.g. B2C · Food & Beverage · B2B). Under it, one
 * stage: the audience's 3D icon floats big in the centre with its message
 * below. Without icons it falls back to the section's photos.
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
  icons = [],
}: WeGotYouProps & {
  /** One 3D icon per audience tab, in tab order. */
  icons?: { src: string; alt: string }[];
}) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const { ref: stageRef, inView: stageIn } = useReveal({ margin: "-25% 0px" });
  const tab = tabs[active];
  // Without icons: one photo per audience, cycling the section's story (or its image).
  const shots = icons.length ? icons : story?.length ? story : [{ src: image, alt: imageAlt ?? "" }];
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
        <Reveal delay={0.2}>
          <RichText content={description} className="max-w-3xl text-xl font-medium text-black text-balance md:text-2xl" />
        </Reveal>

        {/* Audience toggle: phones scroll it sideways on one line */}
        <Reveal delay={0.35} className="flex justify-center self-stretch md:self-auto">
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
                i === active ? "border-black bg-black text-yellow" : "border-black/15 text-black hover:bg-black/5",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        </Reveal>
      </div>

      {tab && (
        <Reveal className="mt-12 md:mt-16">
        <div ref={stageRef} className="relative overflow-hidden rounded-card bg-panel-cool px-6 py-12 md:px-16 md:py-16">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              id="audience-panel"
              role="tabpanel"
              aria-labelledby={`audience-tab-${active}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative mx-auto flex max-w-2xl flex-col items-center gap-5 text-center"
            >
              {icons.length ? (
                <div className="relative w-48 md:w-64 lg:w-72">
                  {/* Yellow glow under the icon */}
                  <div aria-hidden className="absolute inset-x-1/6 bottom-0 h-1/3 rounded-full bg-yellow blur-2xl" />
                  <motion.div
                    className="relative aspect-square"
                    // Pops in once the stage is in view, and again on every switch.
                    initial={reduced ? false : { scale: 0.4, rotate: -14, y: 40 }}
                    animate={stageIn || reduced ? { scale: 1, rotate: 0, y: 0 } : { scale: 0.4, rotate: -14, y: 40 }}
                    transition={{ type: "spring", stiffness: 220, damping: 14 }}
                  >
                    <motion.div
                      className="relative size-full"
                      animate={reduced ? undefined : { y: [0, -12, 0], rotate: [0, 2, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    >
                      <Image quality={90} src={shot.src} alt={shot.alt} fill priority={active === 0} className="object-contain drop-shadow-xl" sizes="18rem" />
                    </motion.div>
                  </motion.div>
                </div>
              ) : (
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-card shadow-soft-lg">
                  <Image quality={90} src={shot.src} alt={shot.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 42rem" />
                </div>
              )}

              {tab.logo && (
                <Image
                  src={tab.logo}
                  alt={tab.logoAlt || tab.label}
                  width={180}
                  height={40}
                  unoptimized
                  // The wordmark is wide, so it stays small and gets room above the title.
                  className="mt-2 h-6 w-auto md:h-7"
                />
              )}
              <motion.div
                className="flex flex-col items-center gap-4"
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.4, ease: easeOutSoft }}
              >
                <h3 className="text-hero-5 font-bold text-black text-balance">{tab.title}</h3>
                <RichText content={tab.description} className="text-lg text-black text-balance md:text-xl" />
                {cta && (
                  <HeaderCtaInView active={isLeadsHref(cta.href)}>
                    <Button asChild size="lg" className="mt-2">
                      <Link href={cta.href} className="group">
                        <BookingIcon href={cta.href} />
                        {cta.label}
                        <ArrowRight size={20} />
                      </Link>
                    </Button>
                  </HeaderCtaInView>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
        </Reveal>
      )}
    </Section>
  );
}
