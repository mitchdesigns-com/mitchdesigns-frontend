"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/cn";

/** Narrow screens stack layers vertically, so big speed differences would
 *  slide them over each other — there they only drift gently. */
function useSpeedScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setScale(mq.matches ? 0.25 : 1);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return scale;
}

/**
 * Moves its content at its own scroll speed while it crosses the viewport —
 * `speed` px down at the start and the same up at the end (negative reverses
 * it), so stacked layers with different speeds read as depth. Still for
 * reduced motion.
 */
export function Parallax({
  children,
  speed = 60,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const k = useSpeedScale();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [speed * k, -speed * k]);
  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

/**
 * A photo that drifts inside its frame as you scroll (the frame stays put,
 * the image moves slower than the page), with an optional slow zoom-out.
 * The frame's size comes from `className` (e.g. an aspect ratio).
 */
export function ParallaxImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  drift = 12,
  zoom = 0.12,
  priority,
  imageClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  /** How far the image travels inside the frame, in % of its height. */
  drift?: number;
  /** Extra scale at the start, easing back to 1 as it scrolls through. */
  zoom?: number;
  priority?: boolean;
  /** Extra classes on the image, e.g. `object-top` to keep faces in frame. */
  imageClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : [`${-drift / 2}%`, `${drift / 2}%`]);
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1 + zoom + drift / 100, 1 + drift / 100]);
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <Image src={src} alt={alt} fill sizes={sizes} className={cn("object-cover", imageClassName)} priority={priority} />
      </motion.div>
    </div>
  );
}
