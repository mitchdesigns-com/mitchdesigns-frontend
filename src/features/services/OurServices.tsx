"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  useMotionValue,
  motion,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Reveal, RevealStagger, itemFadeUp } from "@/components/motion";
import { Close } from "@/components/icons/Close";
import type { Service as CmsService, RichText } from "@/lib/cms/types";
import { RichText as RichTextRenderer } from "@/components/ui/RichText";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { noOrphan } from "@/lib/noOrphan";
import { strapiMedia } from "@/lib/cms/media";

interface ServiceItem {
  num: string;
  label: string;
  description: string;
  body: RichText;
  href: string;
  imgSrc: string;
  hoverLogo: { src: string; alt: string } | null;
}

function toServiceItem(s: CmsService, index: number): ServiceItem {
  return {
    num: String(index + 1).padStart(2, "0"),
    label: s.title,
    description: s.tagline,
    body: s.description,
    href: `/services/${s.slug}`,
    // Our own team photographed doing each service (front-end only).
    imgSrc: `/images/studio/services/${s.slug}.webp`,
    hoverLogo: s.hoverLogo?.url
      ? { src: strapiMedia(s.hoverLogo.url) ?? s.hoverLogo.url, alt: s.hoverLogo.alternativeText ?? "" }
      : null,
  };
}

// True only with a real hover-capable pointer (excludes touch) AND room for the
// hover layout: below md the title and the side description share too narrow a
// row and print over each other (e.g. a desktop window or device mockup at
// phone width), so narrow screens use the tap-to-open accordion instead.
function useHasHover() {
  const [hasHover, setHasHover] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 48rem)",
    );
    setHasHover(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setHasHover(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return hasHover;
}

/** Panel copy steps in under the photo's entrance. */
const PANEL_ITEM = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 26 } },
};

interface ServiceRowProps {
  service: ServiceItem;
  isOpen: boolean;
  onToggle: () => void;
}

function ServiceRow({ service, isOpen, onToggle }: ServiceRowProps) {
  const { num, label, description, body, href, imgSrc, hoverLogo } = service;

  const canHover = useHasHover();
  const [isHovered, setIsHovered] = useState(false);
  const hovering = canHover && isHovered;
  const active = hovering || isOpen;
  const charVariant = hovering && !isOpen ? "hovered" : "idle";

  const rowRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  // The image floats just left of the tagline and drifts a little with the
  // cursor, never far enough to cover the tagline.
  const imgX = useTransform(mouseXSpring, [-0.5, 0.5], [-24, 8]);
  const imgY = useTransform(mouseYSpring, [-0.5, 0.5], [-16, 16]);

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    if (!canHover || isOpen) return;
    const rect = rowRef.current!.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseEnter() {
    if (canHover && !isOpen) setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      variants={itemFadeUp}
      className="relative border-t border-white/10 last:border-b "
      style={{ overflow: "visible" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* White bg — bleeds edge-to-edge, scaleX from center */}
      <motion.div
        aria-hidden
        initial={{ scaleX: 0, scaleY: 0 }}
        animate={{ scaleX: active ? 1 : 0, scaleY: active ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="pointer-events-none absolute bg-white"
        style={{
          top: 0,
          bottom: 0,
          left: "50%",
          translateX: "-50%",
          width: "100vw",
          transformOrigin: "center",
          zIndex: 0,
        }}
      />

      {/* Row header */}
      <button
        ref={rowRef}
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        onMouseMove={handleMouseMove}
        className="relative z-10 flex w-full items-center justify-between gap-6 px-0 py-6 text-left md:px-10 md:py-10"
        style={{ overflow: "visible" }}
      >
        {/* Number + label — always one line */}
        <div className="flex min-w-0 items-center gap-5 md:gap-15">
          <span
            className={`shrink-0 text-base font-bold tabular-nums transition-colors duration-300 md:text-3xl ${active ? "text-black" : "text-fg-muted"}`}
          >
            {num}
          </span>

          <motion.span
            animate={charVariant}
            variants={{ idle: { x: 0 }, hovered: { x: -16 } }}
            transition={{
              type: "spring",
              staggerChildren: 0.08,
              delayChildren: 0.05,
            }}
            className={`block whitespace-nowrap font-black transition-colors duration-300 text-service md:text-service-md ${active ? "text-black" : "text-fg-muted"}`}
          >
            {label.split(" ").map((word, i) => (
              <motion.span
                key={i}
                variants={{ idle: { x: 0 }, hovered: { x: 16 } }}
                transition={{ type: "spring" }}
                className="inline-block"
              >
                {word}{"\u00A0"}
              </motion.span>
            ))}
          </motion.span>
        </div>

        {/* Hover: description on the right, image floating just left of it */}
        {canHover && !isOpen && (
          <div className="relative w-56 shrink-0 lg:w-72">
            <motion.div
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-start gap-3"
            >
              {hoverLogo && (
                <Image src={hoverLogo.src} alt={hoverLogo.alt} width={155} height={27} unoptimized className="h-7 w-auto" />
              )}
              <p className="text-balance text-lg text-black">{noOrphan(description)}</p>
            </motion.div>

            <motion.div
              style={{ x: imgX, y: imgY, translateY: "-50%", aspectRatio: "170 / 245" }}
              initial={{ scale: 0, opacity: 0, rotate: "-5deg" }}
              animate={{
                scale: isHovered ? 1 : 0,
                rotate: isHovered ? "5deg" : "-5deg",
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-full z-20 mr-10 w-44 overflow-hidden rounded-2xl shadow-soft-lg"
            >
              <Image quality={100}
                src={imgSrc}
                alt={`${label} | MitchDesigns service`}
                width={176}
                height={253}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        )}

        {/* Open: close button */}
        {isOpen && (
          <button
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            // Phones: hidden, so the one-line title keeps its width; tapping
            // the row again closes it.
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-black/40 transition-colors hover:text-black md:flex"
          >
            <Close size={22} />
          </button>
        )}

      </button>

      {/* Expanding panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="relative z-10 overflow-hidden"
          >
            {/* Photo beside a short, bold story and one way on: the service page. */}
            <div className="flex flex-col gap-6 px-0 pb-8 sm:flex-row sm:items-center sm:gap-10 md:px-10 md:pb-12 lg:gap-16">
              <motion.div
                className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-card-sm sm:aspect-3/4 sm:w-56 lg:w-72"
                initial={{ opacity: 0, scale: 0.94, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.05 }}
              >
                <Image quality={100} src={imgSrc} alt={`${label} | MitchDesigns service`} fill sizes="(min-width: 1024px) 18rem, (min-width: 640px) 14rem, 100vw" className="object-cover" />
              </motion.div>
              <motion.div
                className="flex max-w-xl flex-col items-start gap-5"
                initial="hidden"
                animate="shown"
                variants={{ shown: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } } }}
              >
                {description && (
                  <motion.p variants={PANEL_ITEM} className="text-2xl font-bold leading-tight text-black text-balance md:text-hero-5">
                    {noOrphan(description)}
                  </motion.p>
                )}
                <motion.div variants={PANEL_ITEM}>
                  <RichTextRenderer content={body} className="text-lg leading-relaxed text-grey-600 text-balance" />
                </motion.div>
                <motion.div variants={PANEL_ITEM}>
                  <Link
                    href={href}
                    className="group inline-flex items-center gap-3 whitespace-nowrap rounded-pill bg-black py-3 pr-3 pl-7 text-base font-medium text-white transition-colors hover:bg-space-grey"
                  >
                    Learn more
                    <span className="flex size-9 items-center justify-center rounded-full bg-yellow text-black transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRight size={18} />
                    </span>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface OurServicesProps {
  services: CmsService[];
}

export function OurServices({ services }: OurServicesProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = services.map(toServiceItem);

  return (
    <Section theme="dark" bleed>
      <div className="container-page pt-20 pb-0 md:pb-20">
        <Reveal className="mb-15 flex flex-col items-start">
          <div
            className="mb-2 inline-flex items-center rounded-full bg-yellow px-3 py-1 text-base font-bold text-black"
            style={{ rotate: "-4deg" }}
          >
            Our Services
          </div>
          <h2 className="text-hero-2 font-bold text-white">I want to..</h2>
        </Reveal>

        <RevealStagger className="overflow-visible" stagger={0.08}>
          {items.map((s, i) => (
            <ServiceRow
              key={s.num}
              service={s}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </RevealStagger>
      </div>
    </Section>
  );
}
