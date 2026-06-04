"use client";

import { useRef, useState, useLayoutEffect } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/cn";

type MarqueeProps = React.HTMLAttributes<HTMLDivElement> & {
  direction?: "left" | "right";
  gap?: number; // px between items
};

// How far the strip travels per px of page scroll.
const SCROLL_RATIO = 0.6;

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  if (range <= 0) return min;
  return ((((v - min) % range) + range) % range) + min;
}

export function Marquee({
  direction = "left",
  gap = 48,
  className,
  children,
  ...props
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chunkRef = useRef<HTMLDivElement>(null);
  const [chunkWidth, setChunkWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // Measure one chunk (content + trailing gap) for the loop width, and the
  // container so we render enough copies to always span the viewport.
  useLayoutEffect(() => {
    const chunk = chunkRef.current;
    const container = containerRef.current;
    if (!chunk || !container) return;
    const measure = () => {
      setChunkWidth(chunk.offsetWidth);
      setContainerWidth(container.offsetWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(chunk);
    ro.observe(container);
    return () => ro.disconnect();
  }, [children, gap]);

  // Enough copies that the track always overflows the container — otherwise a
  // short set (e.g. 3 photos on a wide screen) leaves a gap as it scrolls.
  const copies =
    chunkWidth > 0 ? Math.max(2, Math.ceil(containerWidth / chunkWidth) + 1) : 2;

  // Scroll-direction driven: scrolling down slides the strip in its base
  // direction, scrolling up reverses it. `direction="right"` flips the base.
  const { scrollY } = useScroll();
  const smooth = useSpring(scrollY, { damping: 40, stiffness: 200, mass: 0.5 });
  const dir = direction === "right" ? -1 : 1;
  const x = useTransform(smooth, (s) =>
    chunkWidth ? `${wrap(-chunkWidth, 0, -s * SCROLL_RATIO * dir)}px` : "0px",
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <motion.div className="flex w-max" style={{ x }}>
        {Array.from({ length: copies }, (_, i) => (
          <div
            key={i}
            ref={i === 0 ? chunkRef : undefined}
            className="flex shrink-0"
            aria-hidden={i > 0}
            style={{ gap: `${gap}px`, paddingRight: `${gap}px` }}
          >
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
