"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, type TargetAndTransition } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { SparklesIcon } from "@/components/icons/SparklesIcon";
import { ScooterIcon } from "@/components/icons/ScooterIcon";
import { BellIcon } from "@/components/icons/BellIcon";
import { CardIcon } from "@/components/icons/CardIcon";
import { MapPinIcon } from "@/components/icons/MapPinIcon";
import { Star } from "@/components/icons/Star";
import { Tick } from "@/components/icons/Tick";
import { cn } from "@/lib/cn";
import { easeOutSoft } from "@/lib/motion";
import type { FlowStep } from "./appFlow/screens";

/** How long each feature plays before the next (ms). */
const SCENE_MS = 4600;
/** Scenes that need longer (index → ms): Apple Pay's sheet, scan and tick. */
const SCENE_MS_AT: Record<number, number> = { 3: 5600 };
const sceneMs = (i: number) => SCENE_MS_AT[i] ?? SCENE_MS;
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

/** Where the pop-out tokens land around the phone (% of the stage). */
const SLOTS = [
  { left: "6%", top: "22%", r: -8 },
  { left: "70%", top: "40%", r: 6 },
  { left: "10%", top: "70%", r: 4 },
];

/** Three tokens per feature that burst out from behind the phone. */
const TOKENS: ReactNode[][] = [
  [<><Star size={16} filled /> +250</>, <>Gold</>, <><Star size={16} filled /> 1,490</>],
  [<>+300 EGP</>, <>Refund</>, <>Cashback</>],
  [<><BellIcon size={16} /> 20% off</>, <>Now</>, <><BellIcon size={16} /> 2</>],
  [<>Paid <Tick size={16} /></>, <>1 second</>, <>Pay</>],
  [<><CardIcon size={16} /> 4242</>, <>Secure</>, <>Visa</>],
  [<>1 tap</>, <><CardIcon size={16} /> Saved</>, <>Reorder</>],
  [<><ScooterIcon size={16} /> 12 min</>, <><MapPinIcon size={16} /> Home</>, <>On the way</>],
  [<><SparklesIcon size={16} /> Smart pick</>, <>Swap</>, <>In stock <Tick size={16} /></>],
];

/**
 * eCommerce "your brand deserves an app": a coded phone, turned in 3D on a
 * yellow disc that ripples on every feature, shows one app feature at a time (points, wallet,
 * push, Apple Pay, cards, saved cards, tracking, smart AI). Each feature opens
 * with a playful move of the phone, then plays inside it. The feature chips
 * fill yellow as they play; clicking one jumps there.
 * Copy (eyebrow, title, chip names and lines) comes from the CMS `process` steps.
 */
export function AppDemoSection({
  eyebrow,
  title,
  steps,
  logo,
}: {
  eyebrow?: string;
  title: string;
  steps: FlowStep[];
  /** Platform wordmark shown above the eyebrow (e.g. Orderbase). */
  logo?: { src: string; alt: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [pausedUntil, setPausedUntil] = useState(0);
  const playing = inView && !reduced;

  useEffect(() => {
    if (!playing) return;
    const wait = Math.max(sceneMs(active), pausedUntil - Date.now());
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
      <div ref={ref} className="grid items-center gap-12 md:min-h-stage md:grid-cols-12 md:gap-10 lg:gap-16">
        {/* Features */}
        <div className="flex flex-col gap-8 md:col-span-5">
          <div className="flex flex-col gap-4">
            {logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo.src} alt={logo.alt} className="mb-2 h-6 w-auto self-start md:h-7" />
            )}
            {eyebrow && <p className="text-sm font-medium uppercase tracking-1 text-black text-balance">{eyebrow}</p>}
            <h2 className="text-hero-3 text-left font-bold text-balance">{title}</h2>
          </div>
          <div role="tablist" aria-label={title} className="flex flex-wrap gap-2">
            {steps.map((s, i) => (
              <Fragment key={s.title}>
              <button
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => pick(i)}
                className={cn(
                  "relative overflow-hidden rounded-pill px-4 py-2.5 text-base font-semibold whitespace-nowrap text-black transition-colors duration-300",
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
                    transition={{ duration: playing ? Math.max(sceneMs(active), pausedUntil - Date.now()) / 1000 : 0, ease: "linear" }}
                  />
                )}
                <span className="relative">{s.title}</span>
              </button>
              {/* Two even rows on desktop (4 + 4) */}
              {i === Math.ceil(steps.length / 2) - 1 && <span aria-hidden className="hidden basis-full lg:block" />}
              </Fragment>
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

        {/* The stage: a yellow disc with a ripple on every feature, tokens popping out, the phone in 3D */}
        <div aria-hidden className="relative mx-auto aspect-square w-full max-w-3xl md:col-span-7">
          <div className="absolute inset-1/12 rounded-full bg-yellow" />
          {!reduced &&
            [0, 1].map((k) => (
              <motion.div
                key={`${active}-${k}`}
                className="absolute inset-1/12 rounded-full border-2 border-yellow"
                initial={{ scale: 1, opacity: 0.9 }}
                animate={{ scale: 1.35, opacity: 0 }}
                transition={{ delay: 0.15 + k * 0.35, duration: 1.6, ease: "easeOut" }}
              />
            ))}
          {/* Ground shadow */}
          <div className="absolute bottom-1/12 left-1/2 h-6 w-2/5 -translate-x-1/2 rounded-full bg-black/25 blur-xl" />

          <div className="perspective-stage absolute inset-0 flex items-center justify-center">
            {/* Idle float */}
            <motion.div
              className="preserve-3d"
              animate={reduced ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                key={reduced ? "still" : active}
                className="preserve-3d relative aspect-9/19 w-56 md:w-60 lg:w-72"
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

          {/* Tokens burst out from behind the phone, then float */}
          <AnimatePresence>
            {(TOKENS[active % TOKENS.length] ?? []).map((t, k) => (
              <motion.div
                key={`${active}-${k}`}
                className="absolute"
                style={{ left: SLOTS[k].left, top: SLOTS[k].top, zIndex: k === 1 ? 10 : 0 }}
                initial={reduced ? false : { x: k === 1 ? "-120%" : "120%", y: 0, scale: 0.2, opacity: 0, rotate: 0 }}
                animate={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: SLOTS[k].r }}
                exit={{ scale: 0.6, opacity: 0, transition: { duration: 0.2 } }}
                transition={{ delay: MOVE_S * 0.6 + k * 0.12, type: "spring", stiffness: 220, damping: 15 }}
              >
                <motion.div
                  className="flex items-center gap-1.5 rounded-pill bg-white px-4 py-2.5 text-sm font-bold whitespace-nowrap text-black shadow-soft-lg lg:px-5 lg:py-3 lg:text-base"
                  animate={reduced ? undefined : { y: [0, -8, 0] }}
                  transition={{ duration: 3 + k * 0.6, repeat: Infinity, ease: "easeInOut", delay: k * 0.4 }}
                >
                  {t}
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
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
      className={cn("relative flex items-center justify-center rounded-pill py-3 text-sm font-bold whitespace-nowrap", className)}
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

/**
 * 4. Apple Pay: tap Buy, the screen dims and the pay sheet springs up with the
 * card, the side button pulses twice (double click), Face ID scans, a tick
 * pops and the order is done.
 */
function ApplePayScene() {
  const t = (s: number) => MOVE_S + s;
  return (
    <div className="relative size-full overflow-hidden">
      {/* The product page underneath */}
      <Screen title="The King">
        <Product className="aspect-square w-full rounded-card-sm" />
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold">The King</span>
          <span className="font-semibold">3,250 EGP</span>
        </div>
        <motion.div
          className="flex items-center justify-center gap-1 rounded-pill bg-black py-3 text-sm font-bold whitespace-nowrap text-white"
          animate={{ scale: [1, 0.9, 1] }}
          transition={{ delay: t(0), duration: 0.3 }}
        >
          Buy with Apple Pay
        </motion.div>
      </Screen>

      {/* Dim */}
      <motion.div className="absolute inset-0 bg-black" initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} transition={{ delay: t(0.2), duration: 0.3 }} />

      {/* Side button hint: two pulses on the right edge = double click */}
      <motion.div
        className="absolute top-1/5 right-0 flex items-center gap-1.5"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: [0, 1, 1, 0], x: 0 }}
        transition={{ delay: t(0.6), duration: 1.3, times: [0, 0.15, 0.85, 1] }}
      >
        <span className="rounded-pill bg-white px-2 py-1 text-xs font-bold whitespace-nowrap text-black">Double click</span>
        <motion.span
          className="h-10 w-1.5 rounded-l-pill bg-yellow"
          animate={{ scaleX: [1, 1.8, 1, 1.8, 1], opacity: [0.7, 1, 0.7, 1, 0.7] }}
          transition={{ delay: t(0.9), duration: 0.6, times: [0, 0.25, 0.5, 0.75, 1] }}
        />
      </motion.div>

      {/* The pay sheet */}
      <motion.div
        className="absolute inset-x-1.5 bottom-1.5 flex flex-col gap-3 rounded-card bg-white p-4 text-black shadow-soft-lg"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ delay: t(0.25), type: "spring", stiffness: 210, damping: 22 }}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold">Apple Pay</span>
          <span className="flex size-5 items-center justify-center rounded-full bg-panel text-xs">✕</span>
        </div>

        {/* Card, sliding in from a little stack */}
        <div className="relative h-16">
          <motion.div className="absolute inset-x-3 top-0 h-full rounded-card-sm bg-black" initial={{ y: 0 }} animate={{ y: -6 }} transition={{ delay: t(0.5) }} />
          <motion.div
            className="absolute inset-0 flex flex-col justify-between rounded-card-sm bg-yellow p-2.5"
            initial={{ x: "-110%", rotate: -8 }}
            animate={{ x: 0, rotate: 0 }}
            transition={{ delay: t(0.45), type: "spring", stiffness: 240, damping: 18 }}
          >
            <span className="h-2.5 w-4 rounded-sm bg-black" />
            <span className="text-xs font-bold tabular-nums">•••• 4242</span>
          </motion.div>
        </div>

        <div className="flex justify-between text-xs">
          <span>Pay Your Store</span>
          <span className="font-bold">3,250 EGP</span>
        </div>

        {/* Face ID: brackets scan, then turn into a tick */}
        <div className="relative flex h-14 items-center justify-center">
          <motion.div
            className="relative size-11"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 0.85, 0.6] }}
            transition={{ delay: t(1.6), duration: 0.9, times: [0, 0.2, 0.7, 1] }}
          >
            {["top-0 left-0 border-t-2 border-l-2 rounded-tl-lg", "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg", "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg", "bottom-0 right-0 border-r-2 border-b-2 rounded-br-lg"].map((c) => (
              <span key={c} className={cn("absolute size-3 border-black", c)} />
            ))}
            <motion.span
              className="absolute inset-x-1 h-0.5 rounded-pill bg-yellow"
              initial={{ top: "15%" }}
              animate={{ top: ["15%", "85%", "15%"] }}
              transition={{ delay: t(1.7), duration: 0.7 }}
            />
          </motion.div>
          <motion.div
            className="absolute flex size-11 items-center justify-center rounded-full bg-yellow"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.25, 1] }}
            transition={{ delay: t(2.45), duration: 0.45 }}
          >
            <Tick size={22} />
          </motion.div>
          {/* Burst */}
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <motion.span
              key={deg}
              className="absolute size-1.5 rounded-full bg-yellow"
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], x: Math.cos((deg * Math.PI) / 180) * 34, y: Math.sin((deg * Math.PI) / 180) * 34 }}
              transition={{ delay: t(2.5), duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </div>

        <motion.p
          className="text-center text-xs font-bold"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: t(2.7) }}
        >
          Done
        </motion.p>
      </motion.div>
    </div>
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
