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

interface ServiceItem {
  num: string;
  label: string;
  description: string;
  body: RichText;
  href: string;
  imgSrc: string;
}

function toServiceItem(s: CmsService, index: number): ServiceItem {
  return {
    num: `(${String(index + 1).padStart(2, "0")})`,
    label: s.title,
    description: s.tagline,
    body: s.description,
    href: `/services/${s.slug}`,
    imgSrc: `/images/services/${s.slug}.webp`,
  };
}

// True only on devices with a real hover-capable pointer (excludes touch).
function useHasHover() {
  const [hasHover, setHasHover] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setHasHover(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setHasHover(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return hasHover;
}

interface ServiceRowProps {
  service: ServiceItem;
  isOpen: boolean;
  onToggle: () => void;
}

function ServiceRow({ service, isOpen, onToggle }: ServiceRowProps) {
  const { num, label, description, body, href, imgSrc } = service;

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
  const imgTop = useTransform(mouseYSpring, [0.5, -0.5], ["40%", "60%"]);
  const imgLeft = useTransform(mouseXSpring, [0.5, -0.5], ["70%", "60%"]);

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
        className="relative z-10 flex w-full items-center justify-between px-5 py-7 text-left md:px-10 md:py-10"
        style={{ overflow: "visible" }}
      >
        {/* Number + label */}
        <div className="flex items-center gap-5 md:gap-15">
          <span
            className={`shrink-0 font-medium text-base transition-colors duration-300 ${active ? "text-black" : "text-fg-muted"}`}
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
            className={`block font-black transition-colors duration-300 text-display ${active ? "text-black" : "text-fg-muted"}`}
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

        {/* Hover: description */}
        {canHover && !isOpen && (
          <motion.p
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-balance max-w-56 text-lg text-black"
          >
            {description}
          </motion.p>
        )}

        {/* Open: close button */}
        {isOpen && (
          <button
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-black/40 transition-colors hover:text-black"
          >
            <Close size={22} />
          </button>
        )}

        {/* Hover: mouse-following image */}
        {canHover && !isOpen && (
          <motion.div
            style={{
              top: imgTop,
              left: imgLeft,
              translateX: "-50%",
              translateY: "-50%",
              aspectRatio: "170 / 245",
            }}
            initial={{ scale: 0, opacity: 0, rotate: "-5deg" }}
            animate={{
              scale: isHovered ? 1 : 0,
              rotate: isHovered ? "5deg" : "-5deg",
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            aria-hidden
            className="pointer-events-none absolute z-20 w-44 overflow-hidden rounded-2xl shadow-soft-lg"
          >
            <Image
              src={imgSrc}
              alt={`${label} — MitchDesigns service`}
              width={176}
              height={253}
              className="h-full w-full object-cover"
            />
          </motion.div>
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
            <div className="flex gap-10 px-5 pb-6 md:px-10 md:pb-10">
              <div
                className="relative hidden w-88 shrink-0 overflow-hidden rounded-2xl lg:block"
                style={{ aspectRatio: "345 / 519" }}
              >
                <Image src={imgSrc} alt={`${label} — MitchDesigns service`} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between gap-16">
                <RichTextRenderer content={body} className="text-lg leading-[1.4] text-black" />
                <div className="flex flex-wrap items-center justify-end gap-4 self-end">
                  <Link
                    href="/quote"
                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-yellow px-6 py-4 text-base font-medium text-black transition-opacity hover:opacity-80 md:px-9"
                  >
                    Get Detailed Proposal
                  </Link>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-space-grey px-6 py-4 text-base font-medium text-white transition-opacity hover:opacity-80 md:px-9"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
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
