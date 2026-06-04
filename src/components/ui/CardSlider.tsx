"use client";

import { useRef, useState, useCallback, Children, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "@/components/icons/ArrowRight";
import {
  staggerChildren,
  itemFadeUp,
  REVEAL_VIEWPORT,
} from "@/components/motion";

type CardSliderProps = {
  /** Each child is rendered as a slide and gets the fade-up reveal. */
  children: ReactNode;
  /** Pixels scrolled per arrow click. Set to card width + gap. */
  scrollStep?: number;
  className?: string;
};

/**
 * Horizontal drag/scroll carousel with staggered reveal and desktop nav arrows.
 * Mobile uses native touch scroll; arrows are hidden below `sm`.
 */
export function CardSlider({
  children,
  scrollStep = 346,
  className,
}: CardSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * scrollStep, behavior: "smooth" });
  };

  const reduced = useReducedMotion();
  const inView = useInView(trackRef, REVEAL_VIEWPORT);

  return (
    <div className={`relative ${className ?? ""}`}>
      <motion.div
        ref={trackRef}
        onScroll={updateArrows}
        className="bleed-carousel flex gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        variants={staggerChildren(0.1)}
        initial={reduced ? "visible" : "hidden"}
        animate={inView || reduced ? "visible" : "hidden"}
      >
        {Children.map(children, (child) => (
          <motion.div variants={itemFadeUp} className="shrink-0">
            {child}
          </motion.div>
        ))}
      </motion.div>

      {/* Nav arrows — desktop only; mobile uses touch scroll */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden items-center sm:flex">
        <div className="pointer-events-auto flex gap-2">
          {canScrollLeft && (
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Previous"
              className="grid size-[72px] place-items-center rounded-full bg-yellow text-black transition-opacity hover:opacity-90 lg:size-[100px]"
            >
              <ArrowRight size={40} className="rotate-180" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scrollBy(1)}
              aria-label="Next"
              className="grid size-[72px] place-items-center rounded-full bg-yellow text-black transition-opacity hover:opacity-90 lg:size-[100px]"
            >
              <ArrowRight size={40} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
