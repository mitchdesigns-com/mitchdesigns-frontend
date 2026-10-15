"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Section } from "@/components/layout/Section";

const DEFAULT_DRIVES = [
  { label: "Open Communication" },
  { label: "Flat Hierarchies" },
  { label: "Full Ownership" },
  { label: "Innovative Culture" },
];

/** Fallback studio photos (from the Figma design), one per drive, used when
 *  a drive has no CMS `image`; each drive's label becomes its photo's description. */
const PHOTOS = [1, 2, 3, 4].map((n) => `/images/careers/drive-${n}.webp`);

/** Resting tilt (deg); alternate photos lean the other way. */
const TILT = 4;

function DrivePhoto({ src, label, lean, p }: { src: string; label: string; lean: 1 | -1; p: MotionValue<number> }) {
  // As the section scrolls through, each photo swings over to the opposite tilt.
  const rotate = useTransform(p, [0, 1], [lean * TILT, -lean * TILT]);
  return (
    <motion.div
      style={{ rotate }}
      className="relative aspect-22/25 min-w-3/4 shrink-0 snap-start overflow-hidden rounded-sm bg-card shadow-soft-lg sm:min-w-0 sm:flex-1 sm:shrink"
    >
      <Image src={src} alt={label} fill className="object-cover" sizes="(max-width: 640px) 75vw, 25vw" />
    </motion.div>
  );
}

type Props = { drives?: Array<{ label: string; image?: string | null }> };

/**
 * "Our Drive": four studio photos, tilted alternately (as in Figma), each
 * swinging to the opposite tilt as you scroll past — and back on the way up.
 */
export function OurDrive({ drives = DEFAULT_DRIVES }: Props = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // Progress from where the photos are first seen (page load, if they're
  // already on screen) until they've scrolled most of the way out.
  const { scrollY } = useScroll();
  const [range, setRange] = useState({ from: 0, to: 1 });
  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const from = Math.max(0, top - window.innerHeight);
      setRange({ from, to: Math.max(from + 1, top + el.offsetHeight - window.innerHeight * 0.15) });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const p = useTransform(scrollY, (y) => (reduced ? 0 : Math.min(1, Math.max(0, (y - range.from) / (range.to - range.from)))));

  return (
    <Section theme="dark" className="py-25">
      <div
        ref={ref}
        className="-mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto px-2 py-6 sm:snap-none sm:overflow-x-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {drives.map(({ label, image }, i) => (
          <DrivePhoto key={label} src={image ?? PHOTOS[i % PHOTOS.length]} label={label} lean={i % 2 ? 1 : -1} p={p} />
        ))}
      </div>
    </Section>
  );
}
