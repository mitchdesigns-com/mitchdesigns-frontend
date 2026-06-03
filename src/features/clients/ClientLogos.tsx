"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useMotionValue, animate, motion } from "framer-motion";
import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { Reveal, RevealStagger, itemFadeUp } from "@/components/motion";
import { fixtureClientLogos } from "@/lib/cms/fixtures";

export interface LogoEntry {
  src: string;
  alt: string;
}

const fallbackLogos: LogoEntry[] = fixtureClientLogos.map((item) => ({
  src: item.logo.url,
  alt: item.logo.alternativeText ?? item.name,
}));

const GRID_SIZE = 15;

const HALF_DURATION = 0.55;
const EASE_IN: [number, number, number, number] = [0.65, 0, 1, 0];
const EASE_OUT: [number, number, number, number] = [0, 0, 0.35, 1];
const MIN_DELAY = 2000;
const MAX_DELAY = 4500;

function pickNext(pool: LogoEntry[], exclude: LogoEntry): LogoEntry {
  const candidates = pool.length > 1 ? pool.filter((l) => l !== exclude) : pool;
  return candidates[Math.floor(Math.random() * candidates.length)]!;
}

function buildInitial(pool: LogoEntry[]): LogoEntry[] {
  return Array.from({ length: GRID_SIZE }, (_, i) => pool[i % pool.length]!);
}

let activeCard: number | null = null;

function LogoCard({
  pool,
  initial,
  cardId,
}: {
  pool: LogoEntry[];
  initial: LogoEntry;
  cardId: number;
}) {
  const rotY = useMotionValue(0);
  const [logo, setLogo] = useState(initial);
  const nextLogoRef = useRef<LogoEntry>(pickNext(pool, initial));
  const mountedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    mountedRef.current = true;

    const getRandomDelay = () =>
      Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY);

    const tryFlip = () => {
      if (!mountedRef.current) return;

      if (activeCard !== null) {
        timeoutRef.current = setTimeout(tryFlip, 250);
        return;
      }

      activeCard = cardId;

      animate(rotY, 90, {
        duration: HALF_DURATION,
        ease: EASE_IN,
        onComplete() {
          if (!mountedRef.current) return;
          const incoming = nextLogoRef.current;
          flushSync(() => setLogo(incoming));
          nextLogoRef.current = pickNext(pool, incoming);
          if (!mountedRef.current) return;
          rotY.set(-90);
          animate(rotY, 0, {
            duration: HALF_DURATION,
            ease: EASE_OUT,
            onComplete() {
              if (!mountedRef.current) return;
              activeCard = null;
              timeoutRef.current = setTimeout(tryFlip, getRandomDelay());
            },
          });
        },
      });
    };

    timeoutRef.current = setTimeout(tryFlip, getRandomDelay());

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (activeCard === cardId) activeCard = null;
    };
  }, [cardId, pool, rotY]);

  return (
    <motion.div
      variants={itemFadeUp}
      className="min-w-0"
      style={{ perspective: "900px" }}
    >
      <motion.div
        className="flex h-[110px] w-full items-center justify-center rounded-[4px] border border-[#414141] px-6 sm:h-[150px] lg:h-[200px]"
        style={{ rotateY: rotY }}
      >
        <Image src={logo.src} alt={logo.alt} width={200} height={80} className="max-h-[50%] max-w-[65%] object-contain" />
      </motion.div>
    </motion.div>
  );
}

function LogoGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4 lg:grid-cols-5">
      {Array.from({ length: GRID_SIZE }).map((_, i) => (
        <div
          key={i}
          className="h-[110px] rounded-[4px] border border-[#414141] animate-pulse bg-white/5 sm:h-[150px] lg:h-[200px]"
        />
      ))}
    </div>
  );
}

export function ClientLogos() {
  const [logos, setLogos] = useState<LogoEntry[] | null>(null);

  useEffect(() => {
    fetch("/api/client-logos")
      .then((r) => r.json())
      .then((data: LogoEntry[]) => setLogos(data.length >= GRID_SIZE ? data : fallbackLogos))
      .catch(() => setLogos(fallbackLogos));
  }, []);

  const pool = logos ?? fallbackLogos;
  const initials = useMemo(() => buildInitial(pool), [pool]);

  return (
    <Section theme="dark">
      <div className="flex flex-col gap-[60px] py-20">
        <Reveal>
          <h2 className="text-hero-2 font-bold tracking-[0.01em] text-white">
            Our <span className="text-yellow">Agency</span> Experience
          </h2>
        </Reveal>

        {logos === null ? (
          <LogoGridSkeleton />
        ) : (
          <RevealStagger
            className="grid grid-cols-3 gap-4 lg:grid-cols-5"
            stagger={0.05}
          >
            {initials.map((initial, i) => (
              <LogoCard key={i} cardId={i} pool={pool} initial={initial} />
            ))}
          </RevealStagger>
        )}
      </div>
    </Section>
  );
}
