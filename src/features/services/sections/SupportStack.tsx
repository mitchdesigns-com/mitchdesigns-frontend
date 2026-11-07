"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion";
import { RichText } from "@/components/ui/RichText";
import type { SupportSectionProps } from "@/lib/cms/types";
import { cn } from "@/lib/cn";
import { SparklesIcon } from "@/components/icons/SparklesIcon";

/** Card skins, cycled: yellow, black, white, grey. */
const SKINS = [
  { card: "bg-yellow text-black", muted: "text-black/70", badge: "bg-black text-yellow" },
  { card: "bg-black text-white", muted: "text-grey-500", badge: "bg-yellow text-black" },
  { card: "bg-white text-black", muted: "text-fg-muted", badge: "bg-yellow text-black" },
  { card: "bg-space-grey text-white", muted: "text-grey-500", badge: "bg-yellow text-black" },
];
/** Each card pins this much lower than the one before, so the stack shows. */
const STEP_PX = 28;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The support reasons as a scroll stack: each card pins under the header and
 * the next one slides up over it, while the ones underneath ease back a little.
 * Same CMS content as `SupportSection` (title, description, cards).
 */
export function SupportStack({ title, description, cards }: SupportSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <Section theme="beige" className="py-20 md:py-28">
      <div className="space-y-12 md:space-y-16">
        <Reveal>
          <SectionHeader title={title} description={description} align="center" />
        </Reveal>
        <div ref={ref} className="flex flex-col gap-6 md:gap-10">
          {cards.map((card, i) => (
            <StackCard key={card.title} card={card} index={i} total={cards.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function StackCard({
  card,
  index,
  total,
  progress,
}: {
  card: SupportSectionProps["cards"][number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduced = useReducedMotion();
  const skin = SKINS[index % SKINS.length];
  // Once the cards after it start covering it, it eases back.
  const scale = useTransform(progress, [index / total, 1], reduced ? [1, 1] : [1, 1 - (total - index) * 0.04]);

  return (
    <div className="sticky" style={{ top: `calc(var(--spacing-header) + ${index * STEP_PX}px)` }}>
      <motion.article
        style={{ scale, transformOrigin: "top center" }}
        className={cn(
          "flex flex-col gap-8 rounded-card p-8 shadow-soft-lg md:min-h-96 md:flex-row md:items-center md:gap-16 md:p-14",
          skin.card,
        )}
      >
        <span className="text-hero-2 font-bold leading-none tabular-nums md:w-2/5 md:text-hero-1">{pad(index + 1)}</span>
        <div className="flex flex-col gap-4 md:w-3/5">
          {card.label && (
            // CMS badge (e.g. Trending): a pill with a gentle sparkle.
            <span className={cn("inline-flex items-center gap-1.5 self-start rounded-pill px-3 py-1 text-sm font-semibold", skin.badge)}>
              <motion.span
                className="inline-flex"
                animate={reduced ? undefined : { rotate: [0, 14, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.2 }}
              >
                <SparklesIcon size={16} />
              </motion.span>
              {card.label}
            </span>
          )}
          <h3 className="text-hero-5 font-bold text-balance md:text-hero-3">{card.title}</h3>
          <RichText content={card.description} className={cn("text-lg text-balance md:text-2xl", skin.muted)} />
        </div>
      </motion.article>
    </div>
  );
}
