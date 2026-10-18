"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useMotionValue, animate, motion, useInView } from "framer-motion";
import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { Reveal, RevealStagger, itemFadeUp } from "@/components/motion";
import { agencyLogos } from "@/config/agencyLogos";

export interface LogoEntry {
  src: string;
  alt: string;
}

const GRID_SIZE = 15;

const HALF_DURATION = 0.35;
const EASE_IN: [number, number, number, number] = [0.65, 0, 1, 0];
const EASE_OUT: [number, number, number, number] = [0, 0, 0.35, 1];
const MIN_DELAY = 1000;
const MAX_DELAY = 2600;
/** Wait for the stagger entrance to finish before the first flip. */
const ENTRANCE_DELAY = 1400;

/** Only one card flips at a time across the grid. */
const activeCards = new Set<number>();

const randomDelay = () => Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY);

function LogoCard({
  initial,
  cardId,
  live,
  claim,
}: {
  initial: LogoEntry;
  cardId: number;
  /** The grid is on screen and its entrance has played. */
  live: boolean;
  /** Reserves a logo that no other card is showing. */
  claim: (cardId: number) => LogoEntry;
}) {
  const rotY = useMotionValue(0);
  const [logo, setLogo] = useState(initial);
  const [incoming, setIncoming] = useState<LogoEntry | null>(null);
  const liveRef = useRef(live);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const schedule = useCallback((ms: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(function tryFlip() {
      if (!liveRef.current) return;
      if (activeCards.size > 0) {
        timeoutRef.current = setTimeout(tryFlip, 150);
        return;
      }
      activeCards.add(cardId);
      // The flip starts once this logo has loaded (hidden <Image> below).
      setIncoming(claim(cardId));
    }, ms);
  }, [cardId, claim]);

  // Flip only while the grid is in view; pause when it scrolls away.
  useEffect(() => {
    liveRef.current = live;
    if (live) schedule(ENTRANCE_DELAY + randomDelay());
    else if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [live, schedule]);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    activeCards.delete(cardId);
  }, [cardId]);

  const flip = (next: LogoEntry) => {
    animate(rotY, 90, {
      duration: HALF_DURATION,
      ease: EASE_IN,
      onComplete() {
        flushSync(() => {
          setLogo(next);
          setIncoming(null);
        });
        rotY.set(-90);
        animate(rotY, 0, {
          duration: HALF_DURATION,
          ease: EASE_OUT,
          onComplete() {
            activeCards.delete(cardId);
            if (liveRef.current) schedule(randomDelay());
          },
        });
      },
    });
  };

  return (
    <motion.div variants={itemFadeUp} className="min-w-0" style={{ perspective: "900px" }}>
      <motion.div
        className="relative flex aspect-5/4 w-full items-center justify-center rounded-xs border border-white/25 px-6"
        style={{ rotateY: rotY }}
      >
        <Image src={logo.src} alt={logo.alt} width={200} height={80} className="max-h-1/2 max-w-4/5 object-contain" />
        {incoming && (
          <Image
            key={incoming.src}
            src={incoming.src}
            alt=""
            aria-hidden
            width={200}
            height={80}
            loading="eager"
            className="invisible absolute"
            onLoad={() => flip(incoming)}
            onError={() => flip(incoming)}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

export function ClientLogos({ logos = agencyLogos }: { logos?: LogoEntry[] } = {}) {
  // One entry per brand, shuffled once per visit.
  const [pool, setPool] = useState(() => dedupe(logos));
  useEffect(() => setPool(shuffle(dedupe(logos))), [logos]);

  const initials = useMemo(
    () => Array.from({ length: GRID_SIZE }, (_, i) => pool[i % pool.length]!),
    [pool],
  );

  // What each card shows (or is about to show), so no logo appears twice.
  const shown = useRef<string[]>([]);
  useEffect(() => {
    shown.current = initials.map((l) => l.src);
  }, [initials]);

  const claim = useCallback(
    (cardId: number) => {
      const taken = new Set(shown.current);
      const free = pool.filter((l) => !taken.has(l.src));
      const next = free.length
        ? free[Math.floor(Math.random() * free.length)]!
        : pool[Math.floor(Math.random() * pool.length)]!;
      shown.current[cardId] = next.src;
      return next;
    },
    [pool],
  );

  const gridRef = useRef<HTMLDivElement>(null);
  const live = useInView(gridRef, { amount: 0.6 });

  return (
    <Section theme="dark">
      <div className="flex flex-col gap-15 py-20">
        <Reveal>
          <h2 className="text-hero-2 font-bold tracking-1 text-white">Our Agency Experience</h2>
        </Reveal>

        <div ref={gridRef}>
          <RevealStagger className="grid grid-cols-3 gap-4 lg:grid-cols-5" stagger={0.05}>
            {initials.map((initial, i) => (
              <LogoCard key={`${pool[0]?.src}-${i}`} cardId={i} initial={initial} live={live} claim={claim} />
            ))}
          </RevealStagger>
        </div>
      </div>
    </Section>
  );
}

function dedupe(logos: LogoEntry[]) {
  const seen = new Set<string>();
  return logos.filter((l) => {
    const key = l.alt.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function shuffle<T>(items: T[]) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}
