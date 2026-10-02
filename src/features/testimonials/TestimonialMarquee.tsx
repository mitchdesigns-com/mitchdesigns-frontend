"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMotionValue, useSpring } from "framer-motion";
import { LiquidCursor } from "@/components/ui/LiquidCursor";
import { useDragScrub } from "@/components/ui/useDragScrub";
import { cn } from "@/lib/cn";
import { Marquee } from "@/components/ui/Marquee";
import { Section } from "@/components/layout/Section";
import { strapiMedia } from "@/lib/cms/media";
import type { Testimonial } from "@/lib/cms/types";
import { HeartBurst } from "./HeartBurst";
import { GoogleBadge } from "@/components/icons/GoogleBadge";
import { Reveal } from "@/components/motion";

type TestimonialMarqueeProps = {
  testimonials: Array<Testimonial & { id: number }>;
};

// Below `sm` the cards shrink to a compact size so 2–3 fit on screen.
function ReviewCard({ t, compact }: { t: Testimonial & { id: number }; compact: boolean }) {
  const logo = strapiMedia(t.companyLogo?.url);

  return (
    <article className="flex w-card-review-sm shrink-0 flex-col justify-between rounded-card-sm border border-card-border bg-card p-3.5 sm:w-card-review sm:rounded-card-md sm:p-5">
      <div className="flex flex-col gap-3 sm:gap-8 md:gap-5">
        {/* Header: name/role + Google badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-0.5 sm:gap-1">
            <p className="text-sm font-medium leading-snug text-grey-200 text-balance sm:text-base">
              {t.author}
            </p>
            <p className="text-xs leading-snug text-grey-500 text-balance">
              {t.role} of {t.company}
            </p>
          </div>
          {t.googleReview && (
            <span className="shrink-0">
              <GoogleBadge size={compact ? 16 : 24} />
            </span>
          )}
        </div>

        {/* Quote */}
        <div className="flex flex-col gap-1 sm:py-2.5">
          <span className="font-sans text-3xl leading-none text-grey-200 sm:text-5xl" aria-hidden>
            &ldquo;
          </span>
          <p className="text-review-sm leading-[1.3] text-grey-200 text-balance sm:text-lg">
            {t.quote}&rdquo;
          </p>
        </div>
      </div>

      {/* Company logo */}
      {logo && (
        <Image
          src={logo}
          alt={t.company}
          width={120}
          height={28}
          className="mt-3 h-5 w-auto object-contain object-left sm:mt-4 sm:h-7"
        />
      )}
    </article>
  );
}

export function TestimonialMarquee({ testimonials }: TestimonialMarqueeProps) {
  // Compact cards + tighter gap on phones (the Marquee gap is a px value).
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const gap = compact ? 14 : 40;

  // Desktop: the elastic drag cursor follows the pointer over the rows.
  const [finePointer, setFinePointer] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFinePointer(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const rowsRef = useRef<HTMLDivElement>(null);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const [hovering, setHovering] = useState(false);

  // One drag / swipe over the rows scrubs both at once, in opposite
  // directions (like the scroll drift). A soft spring makes them glide just
  // behind the pointer rather than jumping with every mouse move.
  const { offset: scrub, dragging, bind } = useDragScrub(rowsRef);
  const scrubSmooth = useSpring(scrub, { stiffness: 140, damping: 24, mass: 0.6 });

  function trackCursor(e: React.MouseEvent) {
    const rect = rowsRef.current?.getBoundingClientRect();
    if (!rect) return;
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  }

  return (
    <Section theme="dark" bleed className="overflow-hidden py-20">
      {/* Header */}
      <Reveal className="container-page mb-10 flex flex-col items-center gap-3.5 text-center">
        <h2 className="relative inline-flex items-center text-hero-3 font-bold text-white">
          Loved By Clients
          <span className="absolute -right-8 -top-1 rotate-15">
            <HeartBurst />
          </span>
        </h2>
        <p className="max-w-lg text-base text-white text-balance">
          Hear it from the brands and people who trusted us — genuine feedback that tells our story better than we can.
        </p>
      </Reveal>

      {/* Marquee rows — both use all testimonials so neither row ever runs short.
          Drag / swipe anywhere over them to browse every testimonial. */}
      <div
        ref={rowsRef}
        className={cn(
          "relative flex touch-pan-y select-none flex-col gap-4 sm:gap-10",
          finePointer && "cursor-none",
        )}
        {...bind}
        onMouseEnter={(e) => {
          trackCursor(e);
          setHovering(true);
        }}
        onMouseMove={trackCursor}
        onMouseLeave={() => setHovering(false)}
      >
        <Marquee gap={gap} offset={scrubSmooth}>
          {testimonials.map((t) => (
            <ReviewCard key={`a-${t.id}`} t={t} compact={compact} />
          ))}
        </Marquee>
        <Marquee gap={gap} direction="right" offset={scrubSmooth}>
          {testimonials.map((t) => (
            <ReviewCard key={`b-${t.id}`} t={t} compact={compact} />
          ))}
        </Marquee>

        {/* Edge fade gradients — desktop only */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-72 sm:block"
          style={{ background: "linear-gradient(to right, #07020d 30%, transparent)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-72 sm:block"
          style={{ background: "linear-gradient(to left, #07020d 30%, transparent)" }}
          aria-hidden
        />

        {finePointer && (
          <LiquidCursor
            x={cursorX}
            y={cursorY}
            visible={hovering}
            pressed={dragging}
          />
        )}
      </div>
    </Section>
  );
}
