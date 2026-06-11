"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Hero } from "@/features/hero";
import { Button } from "@/components/ui/Button";

type AuroraHeroProps = {
  eyebrow?: string;
  headline?: string;
  rotatingWords?: string[];
};

type Blob = {
  size: string;
  color: string;
  from: Record<string, string>;
  drift: { x: number[]; y: number[] };
  duration: number;
  /** How strongly the blob follows the cursor; negative moves opposite. */
  depth: number;
};

const BLOBS: Blob[] = [
  {
    size: "55vw",
    color: "rgba(255,219,0,0.16)",
    from: { top: "-15%", left: "-10%" },
    drift: { x: [0, 120, -40, 0], y: [0, 60, 140, 0] },
    duration: 26,
    depth: 0.10,
  },
  {
    size: "45vw",
    color: "rgba(168,85,247,0.13)",
    from: { top: "20%", right: "-12%" },
    drift: { x: [0, -140, 30, 0], y: [0, 80, -60, 0] },
    duration: 32,
    depth: -0.14,
  },
  {
    size: "40vw",
    color: "rgba(56,189,248,0.10)",
    from: { bottom: "-20%", left: "30%" },
    drift: { x: [0, 90, -110, 0], y: [0, -70, 40, 0] },
    duration: 38,
    depth: 0.07,
  },
];

function AuroraBlob({
  blob,
  springX,
  springY,
}: {
  blob: Blob;
  springX: ReturnType<typeof useMotionValue<number>>;
  springY: ReturnType<typeof useMotionValue<number>>;
}) {
  const px = useTransform(springX, (v) => v * blob.depth);
  const py = useTransform(springY, (v) => v * blob.depth);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute"
      style={{ x: px, y: py, ...blob.from }}
    >
      <motion.div
        className="rounded-full"
        style={{
          width: blob.size,
          height: blob.size,
          background: `radial-gradient(circle at 35% 35%, ${blob.color}, transparent 65%)`,
          filter: "blur(60px)",
        }}
        animate={blob.drift}
        transition={{
          duration: blob.duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

/**
 * Hero option — "Aurora". The V1 headline floating over drifting gradient
 * light fields that lean toward the cursor — calm, premium, zero media weight.
 */
export function AuroraHero({ eyebrow, headline, rotatingWords }: AuroraHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Cursor offset from section center; springs smooth the blob parallax.
  const relX = useMotionValue(0);
  const relY = useMotionValue(0);
  const springX = useSpring(relX, { stiffness: 45, damping: 17 });
  const springY = useSpring(relY, { stiffness: 45, damping: 17 });

  useEffect(() => {
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!section) return;
    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      relX.set(e.clientX - (rect.left + rect.width / 2));
      relY.set(e.clientY - (rect.top + rect.height / 2));
      glow?.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      glow?.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    section.addEventListener("mousemove", onMove);
    return () => section.removeEventListener("mousemove", onMove);
  }, [relX, relY]);

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      className="relative flex flex-col justify-center overflow-hidden"
      style={{ minHeight: "100svh", background: "#060606" }}
    >
      {BLOBS.map((blob, i) => (
        <AuroraBlob key={i} blob={blob} springX={springX} springY={springY} />
      ))}

      {/* Tight glow riding directly under the cursor */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          ["--mx" as string]: "50%",
          ["--my" as string]: "35%",
          background:
            "radial-gradient(circle 220px at var(--mx) var(--my), rgba(255,219,0,0.09), transparent 70%)",
        }}
      />

      {/* Fine grain so the gradients don't band */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="relative z-10">
        <Hero
          transparent
          eyebrow={eyebrow}
          headline={headline ?? "Start Building Digital Experiences that"}
          rotatingWords={
            rotatingWords && rotatingWords.length ? rotatingWords : undefined
          }
        />
        <div className="container-page flex flex-wrap items-center gap-4 pb-16 pt-8">
          <Button asChild size="lg">
            <Link href="/quote">Start a project</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Link href="/case-studies">See our work</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
