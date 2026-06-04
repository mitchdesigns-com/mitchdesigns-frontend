"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import OrderBaseLogo from "./OrderBaseLogo";

export interface HeroProps {
  title: string;
  titleHighlight?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  image?: string;
  imageAlt?: string;
}

export function Hero({
  title,
  titleHighlight,
  description,
  primaryCtaLabel = "Contact Sales",
  primaryCtaHref = "#",
  secondaryCtaLabel = "See How It Works",
  secondaryCtaHref = "#",
  image,
  imageAlt = "Orderbase dashboard",
}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Flatten the 3D tilt as user scrolls: rotateX 26.5° → 0°, scale 0.912 → 1
  // Completes at 45% scroll so it's flat well before the section exits
  const rotateX = useTransform(scrollYProgress, [0, 0.45], [26.4955, 0]);
  const scale   = useTransform(scrollYProgress, [0, 0.45], [0.911682, 1]);
  // Subtle upward drift continues through the full scroll
  const imageY  = useTransform(scrollYProgress, [0, 1], ["0px", "-60px"]);

  return (
    // Outer wrapper is taller than the viewport so there's scroll room for the tilt animation
    <section
      ref={sectionRef}
      data-theme="dark"
      className="relative bg-black"
    >
      {/* Sticky inner — stays pinned while user scrolls through the tilt animation */}
      <div className="sticky top-0 h-dvh overflow-hidden flex flex-col">

        {/* Red glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-[50%]"
          style={{
            left: -233,
            top: 669,
            width: 2311,
            height: 981,
            background: "linear-gradient(to top, #e72b29 0%, #000 100%)",
            filter: "blur(200px)",
            opacity: 0.7,
          }}
        />

        {/* ── Above-fold content ── */}
        <div className="relative z-10 flex flex-col items-center gap-6 px-[3.75rem] pt-10 shrink-0">

          {/* Logo + text block */}
          <div className="flex flex-col items-center gap-1">
            <OrderBaseLogo />

            <motion.div
              className="flex flex-col items-center gap-3 text-center"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <h1 className="text-hero-ob font-medium text-white text-balance max-w-[782px]">
                {title}
                {titleHighlight && (
                  <>
                    {" "}
                    <span className="text-orderbase-red">{titleHighlight}</span>
                  </>
                )}
              </h1>

              <p className="text-lg font-medium text-white/70 text-balance max-w-[580px]">
                {description}
              </p>
            </motion.div>
          </div>

          {/* CTAs */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          >
            <a
              href={primaryCtaHref}
              className="inline-flex items-center justify-center rounded-pill bg-orderbase-red px-8 py-3.5 text-lg font-medium text-white"
            >
              {primaryCtaLabel}
            </a>
            <a
              href={secondaryCtaHref}
              className="inline-flex items-center justify-center gap-2 rounded-pill border border-white px-8 py-3.5 text-lg font-medium text-white"
            >
              {secondaryCtaLabel}
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M4.5 10h11m0 0-4.5-4.5m4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </motion.div>
        </div>

        {/* ── Dashboard screenshot — peeks at viewport bottom, 3D tilt flattens on scroll ── */}
        <div
          className="relative z-10 flex justify-center px-[3.75rem] pt-5 flex-1 min-h-0"
          style={{ perspective: "1200px" }}
        >
          <motion.div
            className="w-full max-w-[1048px] self-start"
            style={{ y: imageY, rotateX, scale }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          >
            {image ? (
              <img src={image} alt={imageAlt} className="w-full rounded-card" />
            ) : (
              <div className="w-full aspect-[1048/1124] rounded-card bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="text-white/30 text-sm">Dashboard screenshot</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll height for the tilt animation — extra viewport height gives the scroll room */}
      <div className="h-dvh" aria-hidden />
    </section>
  );
}
