"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { VideoLightbox } from "./VideoLightbox";
import { LEADS_URL } from "@/config/nav";

// TODO: replace preview/video with real assets
const CARDS = [
  {
    alt: "Mountain View — website design",
    previewSrc: "/videos/hero-preview-1.mp4",
    videoSrc: "/videos/hero-full-1.mp4",
    fanRotate: -12,
    zIndex: 30,
  },
  {
    alt: "Real estate app — mobile design",
    previewSrc: "/videos/hero-preview-2.mp4",
    videoSrc: "/videos/hero-full-2.mp4",
    fanRotate: 6,
    zIndex: 20,
  },
  {
    alt: "Travel booking — product design",
    previewSrc: "/videos/hero-preview-3.mp4",
    videoSrc: "/videos/hero-full-3.mp4",
    fanRotate: -6,
    zIndex: 10,
  },
] as const;

const SPREAD_X = ["0vw", "82vw", "164vw"] as const;

const DOTS_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect width='25' height='25' fill='%231d1d1b'/%3E%3C/svg%3E")`;


export function HeroSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null,
  );

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const cardWidth = useTransform(scrollYProgress, [0, 0.5], ["40vw", "79vw"]);

  const rotate0 = useTransform(scrollYProgress, [0, 0.5], [-12, 0]);
  const rotate1 = useTransform(scrollYProgress, [0, 0.5], [6, 0]);
  const rotate2 = useTransform(scrollYProgress, [0, 0.5], [-6, 0]);
  const rotations = [rotate0, rotate1, rotate2];

  const x0 = useTransform(scrollYProgress, [0, 0.5], ["0vw", SPREAD_X[0]]);
  const x1 = useTransform(scrollYProgress, [0, 0.5], ["0vw", SPREAD_X[1]]);
  const x2 = useTransform(scrollYProgress, [0, 0.5], ["0vw", SPREAD_X[2]]);
  const xs = [x0, x1, x2];

  const groupX = useTransform(
    scrollYProgress,
    [0.5, 0.75, 1],
    ["0vw", "-82vw", "-164vw"],
  );

  const ctaOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <>
      <div ref={wrapperRef} style={{ height: "300vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden bg-black">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{ backgroundImage: DOTS_BG, backgroundSize: "50px 50px" }}
          />

          <motion.div
            style={{ x: groupX }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {CARDS.map((card, i) => (
              <motion.div
                key={card.previewSrc}
                style={{
                  x: xs[i],
                  rotate: rotations[i],
                  zIndex: card.zIndex,
                  position: "absolute",
                }}
              >
                <motion.button
                  type="button"
                  style={{
                    width: cardWidth,
                    maxHeight: "var(--height-hero-card-max)",
                  }}
                  className="aspect-video overflow-hidden rounded-[30px] border-[3px] border-space-grey"
                  onClick={() =>
                    setLightbox({ src: card.videoSrc, alt: card.alt })
                  }
                  aria-label={`Watch ${card.alt} video`}
                >
                  <video
                    src={card.previewSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                    aria-label={card.alt}
                  />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            style={{ opacity: ctaOpacity }}
            className="absolute bottom-20 left-0 right-0 flex justify-center"
          >
            <Button asChild size="lg">
              <Link href={LEADS_URL}>Get Detailed Proposal →</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <VideoLightbox
            src={lightbox.src}
            alt={lightbox.alt}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
