"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Hero } from "@/features/hero";
import { VideoLightbox } from "@/features/hero/VideoLightbox";

const BG_VIDEO = "/videos/hero-full-1.mp4";
const FULL_VIDEO = "/videos/hero-full-3.mp4";

type SpotlightHeroProps = {
  eyebrow?: string;
  headline?: string;
  rotatingWords?: string[];
};

/**
 * Hero option — "Spotlight". Full-bleed showreel footage sunk into darkness;
 * the cursor carries a soft light that reveals the film underneath the copy.
 */
export function SpotlightHero({ eyebrow, headline, rotatingWords }: SpotlightHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) return;
    const id = window.setTimeout(() => setVideoReady(true), 600);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const light = lightRef.current;
    if (!section || !light) return;
    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      light.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      light.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    section.addEventListener("mousemove", onMove);
    return () => section.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        data-theme="dark"
        className="relative flex flex-col justify-center overflow-hidden"
        style={{ minHeight: "100svh", background: "#060606" }}
      >
        {/* Showreel footage, sunk into the dark */}
        {videoReady && (
          <video
            src={BG_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            className="absolute inset-0 size-full object-cover"
            style={{ filter: "saturate(0.35) brightness(0.38)" }}
          />
        )}

        {/* Cursor spotlight — brightens the film around the pointer */}
        <div
          ref={lightRef}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            // CSS vars are set from mousemove without re-rendering
            ["--mx" as string]: "50%",
            ["--my" as string]: "30%",
            background:
              "radial-gradient(circle 360px at var(--mx) var(--my), rgba(255,219,0,0.14) 0%, rgba(255,255,255,0.05) 35%, transparent 70%)",
          }}
        />

        {/* Bottom fade so the next section seats cleanly */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
          style={{ background: "linear-gradient(to top, #060606, transparent)" }}
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
          <div className="container-page pb-12 pt-8">
            <button
              type="button"
              onClick={() => setLightbox(true)}
              className="inline-flex items-center gap-3 rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-yellow hover:text-yellow"
            >
              <span
                aria-hidden
                className="inline-flex size-2 animate-pulse rounded-full bg-yellow"
              />
              Watch the showreel
            </button>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <VideoLightbox
            key="reel"
            src={FULL_VIDEO}
            alt="MitchDesigns showreel"
            onClose={() => setLightbox(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
