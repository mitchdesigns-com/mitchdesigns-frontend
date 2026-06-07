'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { easeOutSoft } from '@/lib/motion';
import { VideoLightbox } from './VideoLightbox';

const DOTS_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect width='25' height='25' fill='%231d1d1b'/%3E%3C/svg%3E")`;

// ─── Floating card definitions ─────────────────────────────────────────────────
import type { CSSProperties } from 'react';
import { Hero } from './Hero';

const PREVIEW_VIDEOS = [
  '/videos/hero-preview-1.mp4',
  '/videos/hero-preview-2.mp4',
  '/videos/hero-preview-3.mp4',
];

const FULL_VIDEOS = [
  '/videos/hero-full-1.mp4',
  '/videos/hero-full-2.mp4',
  '/videos/hero-full-3.mp4',
];

type CardDef = {
  id: number;
  label: string;
  sub: string;
  video: string;
  fullVideo: string;
  depth: number;
  pos: CSSProperties;
  centered?: boolean;
  rotate: number;
  width: number;
  aspectRatio: string;
  bg: string;
  border: string;
  baseZ?: number;
};

// baseZ controls stacking relative to the Hero text (which is z-10 via Section).
// Edge cards: baseZ 10 (above text on hover). Center cards: baseZ 2–4 (behind text).
const CARDS: CardDef[] = [
  // ── Outer / edge ──────────────────────────────────────────────────────────────
  {
    id: 1,
    label: 'Mountain View',
    sub: 'Website Design',
    video: PREVIEW_VIDEOS[0],
    fullVideo: FULL_VIDEOS[0],
    depth: 0.038,
    pos: { left: '2%', top: '10%' },
    rotate: -10,
    width: 190,
    aspectRatio: '3/4',
    bg: '#0b0f1a',
    border: '#ffdb00',
  },
  {
    id: 2,
    label: 'Real Estate',
    sub: 'Mobile App',
    video: PREVIEW_VIDEOS[1],
    fullVideo: FULL_VIDEOS[1],
    depth: 0.065,
    pos: { right: '3%', top: '8%' },
    rotate: 9,
    width: 165,
    aspectRatio: '3/4',
    bg: '#120d1c',
    border: '#a855f7',
  },
  {
    id: 3,
    label: 'Orderbase',
    sub: 'SaaS Product',
    video: PREVIEW_VIDEOS[2],
    fullVideo: FULL_VIDEOS[2],
    depth: 0.028,
    pos: { left: '0%', bottom: '12%' },
    rotate: 7,
    width: 230,
    aspectRatio: '16/9',
    bg: '#0b1710',
    border: '#22c55e',
  },
  {
    id: 4,
    label: 'Travel Booking',
    sub: 'Product Design',
    video: PREVIEW_VIDEOS[0],
    fullVideo: FULL_VIDEOS[0],
    depth: 0.052,
    pos: { right: '2%', bottom: '16%' },
    rotate: -7,
    width: 200,
    aspectRatio: '16/9',
    bg: '#1a0e08',
    border: '#f97316',
  },
  // ── Top / bottom center ────────────────────────────────────────────────────────
  {
    id: 5,
    label: 'Brand Identity',
    sub: 'Visual Design',
    video: PREVIEW_VIDEOS[1],
    fullVideo: FULL_VIDEOS[1],
    depth: 0.044,
    pos: { left: '50%', top: '3%' },
    centered: true,
    rotate: -4,
    width: 170,
    aspectRatio: '4/3',
    bg: '#0a1015',
    border: '#06b6d4',
    baseZ: 2,
  },
  {
    id: 6,
    label: 'E-Commerce',
    sub: 'Web Platform',
    video: PREVIEW_VIDEOS[2],
    fullVideo: FULL_VIDEOS[2],
    depth: 0.035,
    pos: { left: '50%', bottom: '8%' },
    centered: true,
    rotate: 3,
    width: 240,
    aspectRatio: '16/9',
    bg: '#150f05',
    border: '#facc15',
    baseZ: 2,
  },
  // ── Inner / near-center ────────────────────────────────────────────────────────
  {
    id: 7,
    label: 'Fintech App',
    sub: 'Mobile Design',
    video: PREVIEW_VIDEOS[0],
    fullVideo: FULL_VIDEOS[0],
    depth: 0.055,
    pos: { left: '16%', top: '42%' },
    rotate: -6,
    width: 150,
    aspectRatio: '3/4',
    bg: '#050f1a',
    border: '#38bdf8',
    baseZ: 3,
  },
  {
    id: 8,
    label: 'Healthcare',
    sub: 'Web App',
    video: PREVIEW_VIDEOS[1],
    fullVideo: FULL_VIDEOS[1],
    depth: 0.06,
    pos: { right: '15%', top: '40%' },
    rotate: 6,
    width: 150,
    aspectRatio: '3/4',
    bg: '#0f0a1a',
    border: '#f472b6',
    baseZ: 3,
  },
  {
    id: 9,
    label: 'Food Delivery',
    sub: 'Mobile App',
    video: PREVIEW_VIDEOS[2],
    fullVideo: FULL_VIDEOS[2],
    depth: 0.07,
    pos: { left: '7%', top: '45%' },
    rotate: 11,
    width: 130,
    aspectRatio: '3/4',
    bg: '#1a0a05',
    border: '#fb923c',
    baseZ: 2,
  },
  {
    id: 10,
    label: 'EdTech Platform',
    sub: 'Web Design',
    video: PREVIEW_VIDEOS[0],
    fullVideo: FULL_VIDEOS[0],
    depth: 0.042,
    pos: { right: '6%', top: '48%' },
    rotate: -10,
    width: 130,
    aspectRatio: '3/4',
    bg: '#081510',
    border: '#4ade80',
    baseZ: 2,
  },
];

// ─── FloatingCard ──────────────────────────────────────────────────────────────
function FloatingCard({
  card,
  rawX,
  rawY,
  videosReady,
  onClickVideo,
}: {
  card: CardDef;
  rawX: ReturnType<typeof useMotionValue<number>>;
  rawY: ReturnType<typeof useMotionValue<number>>;
  videosReady: boolean;
  onClickVideo: (src: string, label: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const px = useTransform(rawX, (v) => v * card.depth);
  const py = useTransform(rawY, (v) => v * card.depth);

  return (
    <motion.div
      style={{
        position: 'absolute',
        x: px,
        y: py,
        ...card.pos,
        ...(card.centered ? { marginLeft: `${-card.width / 2}px` } : {}),
        zIndex: hovered ? 20 : (card.baseZ ?? 10),
        cursor: 'pointer',
      }}
      animate={{
        rotate: hovered ? 0 : card.rotate,
        scale: hovered ? 1.06 : 1,
      }}
      transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onClickVideo(card.fullVideo, card.label)}
    >
      {/* Card body */}
      <div
        style={{
          width: card.width,
          aspectRatio: card.aspectRatio,
          background: card.bg,
          borderRadius: 16,
          border: `1.5px solid`,
          borderColor: hovered ? card.border : 'rgba(255,255,255,0.08)',
          boxShadow: hovered
            ? `0 0 32px 0 ${card.border}44, 0 16px 48px rgba(0,0,0,0.6)`
            : '0 8px 32px rgba(0,0,0,0.5)',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {/* Project video preview — mounted only once the browser is idle so
            the heavy autoplay videos don't compete with the LCP hero text. */}
        {videosReady && (
        <video
          src={card.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: hovered ? 0.9 : 0.5,
            transition: 'opacity 0.3s ease',
          }}
        />
        )}

        {/* Decorative grid lines */}
        <svg
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.15,
          }}
        >
          <defs>
            <pattern
              id={`grid-${card.id}`}
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${card.id})`} />
        </svg>

        {/* Play icon — shown on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1.5px solid ${card.border}`,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M4 2.5l9 5.5-9 5.5V2.5z" fill="white" />
            </svg>
          </div>
        </motion.div>

        {/* Accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: card.border,
            opacity: hovered ? 1 : 0.4,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Label overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.25, ease: easeOutSoft }}
          style={{
            position: 'relative',
            padding: '10px 12px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
          }}
        >
          <p
            style={{
              margin: 0,
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.01em',
              lineHeight: 1.2,
            }}
          >
            {card.label}
          </p>
          <p
            style={{
              margin: 0,
              color: card.border,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {card.sub}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Custom cursor ─────────────────────────────────────────────────────────────
function Cursor({
  rawX,
  rawY,
  hovering,
}: {
  rawX: ReturnType<typeof useMotionValue<number>>;
  rawY: ReturnType<typeof useMotionValue<number>>;
  hovering: boolean;
}) {
  // Track position relative to the section (not the viewport)
  const cx = useSpring(rawX, { stiffness: 300, damping: 30 });
  const cy = useSpring(rawY, { stiffness: 300, damping: 30 });

  return (
    <motion.div
      aria-hidden
      style={{
        position: 'absolute',
        left: cx,
        top: cy,
        translateX: '-50%',
        translateY: '-50%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
      animate={{
        width: hovering ? 56 : 24,
        height: hovering ? 56 : 24,
        opacity: hovering ? 0.7 : 0.4,
      }}
      transition={{ type: 'spring', stiffness: 250, damping: 24 }}
      className="rounded-full border border-yellow"
    />
  );
}

// ─── CreativeHero ──────────────────────────────────────────────────────────────
type CreativeHeroProps = {
  eyebrow?: string;
  headline?: string;
  rotatingWords?: string[];
};

export function CreativeHero({
  eyebrow = "MitchDesigns — Website & Mobile App Design Company Based in Egypt",
  headline = "Start Building Digital Experiences that",
  rotatingWords,
}: CreativeHeroProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [cardHovered, setCardHovered] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; label: string } | null>(null);

  // Hold off mounting the (heavy) preview videos until the browser is idle, so
  // ~11 MB of autoplay video doesn't compete with the LCP hero text for bandwidth.
  const [videosReady, setVideosReady] = useState(false);
  useEffect(() => {
    // Skip the heavy autoplay preview videos on small screens entirely — saves
    // ~11 MB on mobile; the cards keep their dark background + grid lines.
    if (window.matchMedia("(max-width: 1023px)").matches) return;
    const supportsRic = typeof window.requestIdleCallback === "function";
    const handle = supportsRic
      ? window.requestIdleCallback(() => setVideosReady(true), { timeout: 2500 })
      : window.setTimeout(() => setVideosReady(true), 1200);
    return () => {
      if (supportsRic) window.cancelIdleCallback(handle as number);
      else window.clearTimeout(handle as number);
    };
  }, []);

  // Section-relative cursor position (for the visual cursor ring)
  const curX = useMotionValue(-200);
  const curY = useMotionValue(-200);

  // Cursor offset from section center (for parallax — range roughly ±viewport/2)
  const relX = useMotionValue(0);
  const relY = useMotionValue(0);

  // Smooth spring for parallax
  const springX = useSpring(relX, { stiffness: 50, damping: 18 });
  const springY = useSpring(relY, { stiffness: 50, damping: 18 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      // Position relative to section top-left (for absolute cursor)
      curX.set(e.clientX - rect.left);
      curY.set(e.clientY - rect.top + section.scrollTop);
      // Offset from center (for parallax)
      relX.set(e.clientX - (rect.left + rect.width / 2));
      relY.set(e.clientY - (rect.top + rect.height / 2));
    };

    const onLeave = () => {
      curX.set(-200);
      curY.set(-200);
    };

    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    return () => {
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
    };
  }, [curX, curY, relX, relY]);

  return (
    <>
    <section
      ref={sectionRef}
        data-theme="dark"
        className="relative overflow-hidden"
        style={{ minHeight: '100svh', background: '#060606' }}
      >
        <Cursor rawX={curX} rawY={curY} hovering={cardHovered} />
        {/* Dots pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{ backgroundImage: DOTS_BG, backgroundSize: '50px 50px' }}
        />

        {/* Radial gradient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,219,0,0.04) 0%, transparent 70%)',
          }}
        />

        {/* Floating cards */}
        <div
          aria-hidden
          onMouseEnter={() => setCardHovered(true)}
          onMouseLeave={() => setCardHovered(false)}
          className="pointer-events-none absolute inset-0"
          style={{ pointerEvents: 'none' }}
        >
          {CARDS.map((card) => (
            <div
              key={card.id}
              style={{ pointerEvents: 'auto' }}
              onMouseEnter={() => setCardHovered(true)}
              onMouseLeave={() => setCardHovered(false)}
            >
              <FloatingCard
                card={card}
                rawX={springX}
                rawY={springY}
                videosReady={videosReady}
                onClickVideo={(src, label) => setLightbox({ src, label })}
              />
            </div>
          ))}
        </div>

        <div>
          <Hero
            eyebrow={eyebrow}
            headline={headline}
            rotatingWords={
              rotatingWords && rotatingWords.length ? rotatingWords : undefined
            }
          />
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <VideoLightbox
            key="lightbox"
            src={lightbox.src}
            alt={lightbox.label}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
