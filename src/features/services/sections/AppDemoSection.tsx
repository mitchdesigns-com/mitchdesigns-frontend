"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, type TargetAndTransition } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { SparklesIcon } from "@/components/icons/SparklesIcon";
import { ScooterIcon } from "@/components/icons/ScooterIcon";
import { cn } from "@/lib/cn";
import { easeOutSoft } from "@/lib/motion";
import type { FlowStep } from "./appFlow/screens";

/** How long each feature plays before the next (ms). */
const SCENE_MS = 4600;
/** After a visitor picks a feature, autoplay waits this long (ms). */
const PAUSE_AFTER_PICK_MS = 9000;
/** The phone's playful move takes this long; the feature plays inside it after (s). */
const MOVE_S = 0.9;
const PRODUCT = "/images/services/ecommerce-beats/sally-card-1.webp";

/** Resting pose: the phone turned to look left, toward the copy. */
const POSE = { rotateY: -24, rotateX: 8, rotateZ: 3, x: 0, y: 0, scale: 1 };

/**
 * One playful move per feature, starting and ending at the resting pose
 * (jump, wiggle, shake, spin, flip, pop, slide, look around).
 */
const MOVES: TargetAndTransition[] = [
  { y: [0, -56, 0, -16, 0], rotateZ: [3, -2, 3, 1, 3] },
  { rotateZ: [3, -9, 11, -5, 3] },
  { x: [0, -14, 14, -10, 10, 0], rotateZ: [3, 0, 6, 1, 4, 3] },
  { rotateY: [-24, 336] },
  { rotateX: [8, -28, 14, 8] },
  { scale: [1, 0.86, 1.08, 1] },
  { x: [0, 48, -24, 0], rotateY: [-24, -8, -36, -24] },
  { rotateY: [-24, -48, -6, -24], y: [0, -20, -10, 0] },
];

/** The yellow squares behind the phone (our logo's square, scattered). */
const SQUARES = [
  { size: "w-3/5", x: 20, y: 20, r: -6 },
  { size: "w-1/5", x: 6, y: 8, r: 12 },
  { size: "w-1/6", x: 78, y: 10, r: -14 },
  { size: "w-1/8", x: 84, y: 64, r: 20 },
  { size: "w-1/5", x: 4, y: 70, r: -10 },
  { size: "w-1/12", x: 62, y: 86, r: 30 },
];

/**
 * eCommerce "your brand deserves an app": a coded phone, turned in 3D on a
 * scatter of yellow squares, shows one app feature at a time (points, wallet,
 * push, Apple Pay, cards, saved cards, tracking, smart AI). Each feature opens
 * with a playful move of the phone, then plays inside it. The feature chips
 * fill yellow as they play; clicking one jumps there.
 * Copy (eyebrow, title, chip names and lines) comes from the CMS `process` steps.
 */
export function AppDemoSection({ eyebrow, title, steps }: { eyebrow?: string; title: string; steps: FlowStep[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [pausedUntil, setPausedUntil] = useState(0);
  const playing = inView && !reduced;

  useEffect(() => {
    if (!playing) return;
    const wait = Math.max(SCENE_MS, pausedUntil - Date.now());
    const t = window.setTimeout(() => setActive((i) => (i + 1) % steps.length), wait);
    return () => window.clearTimeout(t);
  }, [active, playing, pausedUntil, steps.length]);

  const pick = (i: number) => {
    setActive(i);
    setPausedUntil(Date.now() + PAUSE_AFTER_PICK_MS);
  };
  const step = steps[active];
  const move = MOVES[active % MOVES.length];

  return (
    <Section className="overflow-hidden py-16 md:py-20">
      <div ref={ref} className="grid items-center gap-12 md:min-h-stage md:grid-cols-2 md:gap-16">
        {/* Features */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            {eyebrow && <p className="text-sm font-medium uppercase tracking-1 text-black text-balance">{eyebrow}</p>}
            <h2 className="text-hero-3 text-left font-bold text-balance">{title}</h2>
          </div>
          <div role="tablist" aria-label={title} className="flex flex-wrap gap-2">
            {steps.map((s, i) => (
              <button
                key={s.title}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => pick(i)}
                className={cn(
                  "relative overflow-hidden rounded-pill px-5 py-2.5 text-base font-semibold text-black transition-colors duration-300",
                  i < active ? "bg-yellow" : "bg-panel hover:bg-panel-mid",
                )}
              >
                {/* Fills while this feature plays, then stays yellow */}
                {i === active && (
                  <motion.span
                    key={`${active}-${pausedUntil}`}
                    aria-hidden
                    className="absolute inset-y-0 left-0 bg-yellow"
                    initial={{ width: playing ? "0%" : "100%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: playing ? Math.max(SCENE_MS, pausedUntil - Date.now()) / 1000 : 0, ease: "linear" }}
                  />
                )}
                <span className="relative">{s.title}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={active}
              aria-live="polite"
              className="max-w-md text-xl text-black text-balance"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: easeOutSoft }}
            >
              {step?.description}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* The stage: squares, and the phone in 3D */}
        <div aria-hidden className="relative mx-auto aspect-square w-full max-w-xl">
          {SQUARES.map((q, k) => {
            // Each feature reshuffles the squares a little.
            const dx = Math.sin((active + 1) * (k + 2)) * 5;
            const dy = Math.cos((active + 1) * (k + 3)) * 5;
            return (
              <motion.div
                key={k}
                className={cn("absolute aspect-square bg-yellow", q.size)}
                style={{ left: `${q.x}%`, top: `${q.y}%` }}
                animate={reduced ? { rotate: q.r } : { x: `${dx * 2.5}%`, y: `${dy * 2.5}%`, rotate: q.r + dx * 3 }}
                transition={{ type: "spring", stiffness: 120, damping: 14, delay: k * 0.04 }}
              />
            );
          })}

          <div className="perspective-stage absolute inset-0 flex items-center justify-center">
            {/* Idle float */}
            <motion.div
              className="preserve-3d"
              animate={reduced ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                key={reduced ? "still" : active}
                className="preserve-3d relative aspect-9/19 w-48 lg:w-56"
                initial={POSE}
                animate={reduced ? POSE : { ...POSE, ...move }}
                transition={{ duration: MOVE_S, ease: easeOutSoft }}
              >
                {/* Body thickness: stacked layers behind the screen */}
                {[14, 11, 8, 5, 2].map((z) => (
                  <div key={z} className="absolute inset-0 rounded-phone bg-black" style={{ transform: `translateZ(-${z}px)` }} />
                ))}
                <div className="absolute inset-0 rounded-phone bg-black p-2.5 shadow-soft-lg">
                  <div className="relative size-full overflow-hidden rounded-phone-screen bg-white">
                    <div className="absolute top-2 left-1/2 z-20 h-5 w-20 -translate-x-1/2 rounded-pill bg-black" />
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={active}
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {SCENES[active % SCENES.length]}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ── Scenes (decorative mock UI, each plays after the phone's move) ──────────

/** Delay after the phone's move. */
const after = (s = 0) => ({ delay: MOVE_S + s, duration: 0.45, ease: easeOutSoft });
const springAfter = (s = 0) => ({ delay: MOVE_S + s, type: "spring" as const, stiffness: 260, damping: 18 });

/** A number that counts from `from` to `to` once the move is done. */
function useCount(from: number, to: number, startS: number, durS = 1.1) {
  const [n, setN] = useState(from);
  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - t0 - startS * 1000) / (durS * 1000)));
      setN(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, startS, durS]);
  return n.toLocaleString("en-US");
}

function Screen({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex size-full flex-col gap-3 px-4 pt-10 pb-5 text-black", className)}>
      <p className="text-sm font-bold">{title}</p>
      {children}
    </div>
  );
}

function Product({ className, pos = "50% 38%" }: { className?: string; pos?: string }) {
  return (
    <div className={cn("relative shrink-0 overflow-hidden bg-white", className)}>
      <Image src={PRODUCT} alt="" fill className="scale-150 object-cover" style={{ objectPosition: pos }} sizes="8rem" />
    </div>
  );
}

/** A button that gets pressed, then shows its done label. */
function PressButton({ label, done, at, className }: { label: string; done: string; at: number; className?: string }) {
  return (
    <motion.div
      className={cn("relative flex items-center justify-center rounded-pill py-3 text-sm font-bold", className)}
      animate={{ scale: [1, 0.92, 1] }}
      transition={{ delay: MOVE_S + at, duration: 0.35 }}
    >
      <motion.span initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: MOVE_S + at + 0.2, duration: 0.15 }}>
        {label}
      </motion.span>
      <motion.span className="absolute" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={springAfter(at + 0.3)}>
        {done}
      </motion.span>
    </motion.div>
  );
}

/** 1. Points: an order earns points, coins fly up, the count climbs. */
function PointsScene() {
  const points = useCount(1240, 1490, MOVE_S + 0.4);
  return (
    <Screen title="Rewards">
      <div className="relative flex flex-col gap-1 rounded-card-sm bg-black p-4 text-white">
        <p className="text-xs">Your points</p>
        <p className="text-3xl font-bold tabular-nums">{points}</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-pill bg-white/15">
          <motion.div className="h-full rounded-pill bg-yellow" initial={{ width: "55%" }} animate={{ width: "80%" }} transition={after(0.4)} />
        </div>
        {[0, 1, 2, 3].map((c) => (
          <motion.span
            key={c}
            className="absolute bottom-2 size-4 rounded-full bg-yellow"
            style={{ left: `${30 + c * 14}%` }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -80 - c * 10, opacity: [0, 1, 0] }}
            transition={{ delay: MOVE_S + 0.2 + c * 0.12, duration: 0.9, ease: "easeOut" }}
          />
        ))}
      </div>
      <motion.div className="self-start rounded-pill bg-yellow px-3 py-1.5 text-xs font-bold" initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={after(0.5)}>
        +250 points
      </motion.div>
      <div className="flex flex-col gap-2">
        {["Free delivery at 2,000", "Gold member perks"].map((t, i) => (
          <motion.div key={t} className="rounded-card-sm bg-panel px-3 py-3 text-xs font-semibold" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={after(0.8 + i * 0.1)}>
            {t}
          </motion.div>
        ))}
      </div>
    </Screen>
  );
}

/** 2. Wallet: a refund lands, the balance counts up. */
function WalletScene() {
  const balance = useCount(450, 750, MOVE_S + 0.6);
  return (
    <Screen title="Wallet">
      <motion.div
        className="flex flex-col gap-1 rounded-card-sm bg-yellow p-4"
        initial={{ rotateX: 0 }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ delay: MOVE_S + 0.6, duration: 0.4 }}
      >
        <p className="text-xs font-semibold">Balance</p>
        <p className="text-3xl font-bold tabular-nums">{balance} EGP</p>
      </motion.div>
      {[
        ["Refund, order 1042", "+300"],
        ["Cashback", "+25"],
      ].map(([t, v], i) => (
        <motion.div
          key={t}
          className="flex items-center justify-between rounded-card-sm bg-panel px-3 py-3 text-xs"
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={springAfter(0.1 + i * 0.25)}
        >
          <span className="font-semibold">{t}</span>
          <span className="font-bold">{v} EGP</span>
        </motion.div>
      ))}
      <PressButton label="Pay with wallet" done="Paid ✓" at={1.8} className="mt-auto bg-black text-white" />
    </Screen>
  );
}

/** 3. Push: notifications drop onto the lock screen, one after another. */
function PushScene() {
  const notes = [
    ["Your favourites are back", "20% off for you this weekend"],
    ["Left something behind?", "Your cart is waiting"],
  ];
  return (
    <div className="flex size-full flex-col items-center bg-black px-3 pt-16 text-white">
      <p className="text-4xl font-bold tabular-nums">9:41</p>
      <p className="text-xs">Friday</p>
      <div className="mt-8 flex w-full flex-col gap-2">
        {notes.map(([t, d], i) => (
          <motion.div
            key={t}
            className="w-full rounded-card-sm bg-white/15 p-3 backdrop-blur"
            initial={{ y: -90, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={springAfter(0.1 + i * 0.9)}
          >
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-sm bg-yellow text-xs font-black text-black">M</span>
              <span className="text-xs font-semibold">Your Store</span>
              <span className="ml-auto text-xs">now</span>
            </div>
            <p className="mt-2 text-xs font-semibold">{t}</p>
            <p className="text-xs">{d}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** 4. Apple Pay: the sheet slides up, double click, paid. */
function ApplePayScene() {
  return (
    <Screen title="Checkout">
      <div className="flex items-center gap-3 rounded-card-sm bg-panel p-3">
        <Product className="size-12 rounded-sm" />
        <div className="flex-1 text-xs">
          <p className="font-bold">The King</p>
          <p>3,250 EGP</p>
        </div>
      </div>
      <motion.div
        className="mt-auto flex flex-col gap-3 rounded-card bg-black p-4 text-white"
        initial={{ y: 160 }}
        animate={{ y: 0 }}
        transition={{ delay: MOVE_S, type: "spring", stiffness: 200, damping: 22 }}
      >
        <p className="text-sm font-bold">Apple Pay</p>
        <div className="flex justify-between text-xs"><span>Pay Your Store</span><span>3,250 EGP</span></div>
        <PressButton label="Double click to pay" done="Paid ✓" at={1.3} className="bg-white text-black" />
      </motion.div>
    </Screen>
  );
}

/** 5. Credit card: the card flips in, the number types out, paid. */
function CardScene() {
  const digits = "4242";
  return (
    <Screen title="Pay by card">
      <motion.div
        className="flex aspect-8/5 flex-col justify-between rounded-card-sm bg-black p-4 text-white"
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={after(0)}
      >
        <span className="h-5 w-7 rounded-sm bg-yellow" />
        <p className="text-xs font-semibold whitespace-nowrap tabular-nums">
          •••• •••• ••••{" "}
          {digits.split("").map((d, i) => (
            <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: MOVE_S + 0.5 + i * 0.15 }}>
              {d}
            </motion.span>
          ))}
        </p>
        <div className="flex justify-between text-xs"><span>NOUR SAMIR</span><span>08/29</span></div>
      </motion.div>
      <motion.div className="flex items-center gap-2 text-xs font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={after(1.2)}>
        <span className="flex size-4 items-center justify-center rounded-sm bg-yellow text-xs">✓</span>
        Secure payment
      </motion.div>
      <PressButton label="Pay 3,250 EGP" done="Paid ✓" at={1.6} className="mt-auto bg-yellow" />
    </Screen>
  );
}

/** 6. Saved cards: last order, the saved card already there, reorder in one tap. */
function SavedCardScene() {
  return (
    <Screen title="My orders">
      {["The King", "Spring Box"].map((name, i) => (
        <motion.div key={name} className="flex items-center gap-3 rounded-card-sm bg-panel p-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={after(i * 0.12)}>
          <Product className="size-12 rounded-sm" pos={i ? "30% 30%" : "50% 38%"} />
          <div className="flex-1">
            <p className="text-xs font-bold">{name}</p>
            <p className="text-xs">Delivered</p>
          </div>
        </motion.div>
      ))}
      <motion.div
        className="mt-auto flex items-center gap-2 rounded-card-sm border border-black px-3 py-2.5 text-xs font-semibold"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={springAfter(0.5)}
      >
        <span className="h-3 w-5 rounded-sm bg-black" />
        Visa 4242 saved
      </motion.div>
      <PressButton label="Reorder" done="Ordered again ✓" at={1.5} className="bg-yellow" />
    </Screen>
  );
}

/** 7. Order tracking: the scooter rides the route, steps tick off. */
function TrackingScene() {
  const stops = ["Confirmed", "Packed", "On the way", "Delivered"];
  return (
    <Screen title="Track order">
      <div className="relative h-28 overflow-hidden rounded-card-sm bg-panel">
        <div className="absolute top-1/2 right-6 left-6 h-1 -translate-y-1/2 rounded-pill bg-black/10" />
        <motion.div className="absolute top-1/2 left-6 h-1 -translate-y-1/2 rounded-pill bg-black" initial={{ width: "0%" }} animate={{ width: "70%" }} transition={{ delay: MOVE_S, duration: 2.2, ease: "easeInOut" }} />
        <motion.div
          className="absolute top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-yellow"
          initial={{ left: "4%" }}
          animate={{ left: "68%", y: [0, -3, 0, -3, 0] }}
          transition={{ delay: MOVE_S, duration: 2.2, ease: "easeInOut" }}
        >
          <ScooterIcon size={18} />
        </motion.div>
        <span className="absolute top-1/2 right-4 size-3 -translate-y-1/2 rounded-full border-2 border-black bg-white" />
      </div>
      <div className="flex flex-col gap-2">
        {stops.map((s, i) => (
          <div key={s} className="flex items-center gap-2 text-xs font-semibold">
            <motion.span
              className="size-4 rounded-full border-2 border-black"
              initial={{ backgroundColor: "#ffffff" }}
              animate={{ backgroundColor: i < 3 ? "#ffdb00" : "#ffffff" }}
              transition={{ delay: MOVE_S + 0.3 + i * 0.6 }}
            />
            {s}
          </div>
        ))}
      </div>
      <motion.p className="mt-auto rounded-pill bg-black py-3 text-center text-sm font-bold text-white" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={after(1.4)}>
        Arriving in 12 min
      </motion.p>
    </Screen>
  );
}

/** 8. Smart AI: an item runs out, AI swaps in the closest match. */
function SmartScene() {
  return (
    <Screen title="Your cart">
      <motion.div
        className="flex items-center gap-3 rounded-card-sm bg-panel p-3"
        animate={{ x: [0, -6, 6, -4, 0] }}
        transition={{ delay: MOVE_S + 0.2, duration: 0.5 }}
      >
        <Product className="size-12 rounded-sm" />
        <div className="flex-1 text-xs">
          <p className="font-bold line-through">The King</p>
          <p className="font-semibold">Out of stock</p>
        </div>
      </motion.div>
      <motion.div
        className="flex flex-col gap-3 rounded-card-sm bg-yellow p-3"
        initial={{ scale: 0.6, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={springAfter(0.8)}
      >
        <div className="flex items-center gap-2 text-xs font-bold">
          <motion.span animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.3, 1] }} transition={{ delay: MOVE_S + 1, duration: 0.8 }}>
            <SparklesIcon size={16} />
          </motion.span>
          Smart pick for you
        </div>
        <div className="flex items-center gap-3">
          <Product className="size-12 rounded-sm" pos="30% 30%" />
          <div className="flex-1 text-xs">
            <p className="font-bold">Spring Box</p>
            <p>Same style, same price</p>
          </div>
        </div>
      </motion.div>
      <PressButton label="Swap item" done="Swapped ✓" at={2} className="mt-auto bg-black text-white" />
    </Screen>
  );
}

const SCENES = [
  <PointsScene key="points" />,
  <WalletScene key="wallet" />,
  <PushScene key="push" />,
  <ApplePayScene key="applepay" />,
  <CardScene key="card" />,
  <SavedCardScene key="saved" />,
  <TrackingScene key="tracking" />,
  <SmartScene key="smart" />,
];
