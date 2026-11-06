"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { cn } from "@/lib/cn";
import { easeOutSoft } from "@/lib/motion";
import type { FlowStep } from "./appFlow/screens";

/** How long each scene plays before the next (ms). */
const SCENE_MS = 4200;
/** After a visitor picks a scene, autoplay waits this long (ms). */
const PAUSE_AFTER_PICK_MS = 9000;
const PRODUCT = "/images/services/ecommerce-beats/sally-card-1.webp";

/**
 * eCommerce "your brand deserves an app": a coded phone plays the app live on
 * a yellow disc, scene by scene (add to cart, one-tap reorder, a push landing,
 * points counting up, Apple Pay checkout), while the reasons sit beside it as
 * pills. The active pill fills as its scene plays; clicking one jumps there.
 * Copy (eyebrow, title, reasons) comes from the CMS `process` steps.
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

  return (
    <Section className="overflow-hidden py-16 md:py-20">
      <div ref={ref} className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        {/* Reasons */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            {eyebrow && <p className="text-sm font-medium uppercase tracking-1 text-fg-muted">{eyebrow}</p>}
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
                  "relative overflow-hidden rounded-pill border px-5 py-2.5 text-base font-semibold transition-colors duration-300",
                  i === active ? "border-black text-black" : "border-black/15 text-black hover:border-black/40",
                )}
              >
                {/* Fills while this scene plays */}
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

        {/* The phone, playing the app */}
        <div className="relative flex justify-center">
          <div aria-hidden className="absolute top-1/2 left-1/2 aspect-square w-11/12 max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow" />
          <div aria-hidden className="relative aspect-9/19 w-60 rounded-phone bg-black p-2.5 shadow-soft-lg md:w-64">
            <div className="relative size-full overflow-hidden rounded-phone-screen bg-white">
              <div className="absolute top-2 left-1/2 z-20 h-5 w-20 -translate-x-1/2 rounded-pill bg-black" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.35, ease: easeOutSoft }}
                >
                  {SCENES[active % SCENES.length]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ── Scenes (decorative mock UI) ─────────────────────────────────────────────

const later = (s: number) => ({ delay: s, duration: 0.45, ease: easeOutSoft });

function Screen({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex size-full flex-col gap-3 px-4 pt-10 pb-5 text-black">
      <p className="text-sm font-bold">{title}</p>
      {children}
    </div>
  );
}

/** 1. Shop: the product, tapped into the cart. */
function ShopScene() {
  return (
    <Screen title="Flowers">
      <div className="relative flex-1 overflow-hidden rounded-card-sm bg-white">
        {/* Cropped to the bouquet (the source card carries its own text). */}
        <Image src={PRODUCT} alt="" fill className="scale-150 object-cover" style={{ objectPosition: "50% 38%" }} sizes="16rem" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">The King</span>
        <span className="text-sm font-semibold text-black/60">3,250 EGP</span>
      </div>
      <motion.div
        className="relative flex items-center justify-center rounded-pill bg-black py-3 text-sm font-semibold text-white"
        animate={{ scale: [1, 1, 0.94, 1] }}
        transition={{ times: [0, 0.45, 0.55, 0.7], duration: 2.2 }}
      >
        <motion.span initial={{ opacity: 1 }} animate={{ opacity: [1, 1, 0] }} transition={{ times: [0, 0.55, 0.6], duration: 2.2 }} className="inline-block">
          Add to cart
        </motion.span>
        <motion.span className="absolute" initial={{ opacity: 0 }} animate={{ opacity: [0, 0, 1] }} transition={{ times: [0, 0.62, 0.72], duration: 2.2 }}>
          Added ✓
        </motion.span>
      </motion.div>
      <motion.div
        className="absolute top-10 right-4 flex size-7 items-center justify-center rounded-full bg-yellow text-xs font-bold"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ delay: 1.3, duration: 0.5 }}
      >
        1
      </motion.div>
    </Screen>
  );
}

/** 2. Reorder: last week's order, again in one tap. */
function ReorderScene() {
  return (
    <Screen title="My orders">
      {["The King", "Spring Box"].map((name, i) => (
        <motion.div key={name} className="flex items-center gap-3 rounded-card-sm bg-panel p-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={later(0.15 * i)}>
          <div className="relative size-12 shrink-0 overflow-hidden rounded-sm bg-white">
            <Image src={PRODUCT} alt="" fill className="scale-150 object-cover" style={{ objectPosition: "50% 38%" }} sizes="3rem" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold">{name}</p>
            <p className="text-xs text-black/50">Delivered</p>
          </div>
        </motion.div>
      ))}
      <motion.div
        className="relative mt-auto flex items-center justify-center gap-2 rounded-pill bg-yellow py-3 text-sm font-bold"
        animate={{ scale: [1, 0.94, 1] }}
        transition={{ delay: 1.2, duration: 0.4 }}
      >
        <motion.span initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 1.5, duration: 0.15 }}>Reorder</motion.span>
        <motion.span className="absolute" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={later(1.6)}>Ordered again ✓</motion.span>
      </motion.div>
    </Screen>
  );
}

/** 3. Push: a notification drops onto the lock screen. */
function PushScene() {
  return (
    <div className="flex size-full flex-col items-center bg-black px-3 pt-16 text-white">
      <p className="text-4xl font-bold tabular-nums">9:41</p>
      <p className="text-xs text-white/60">Friday</p>
      <motion.div
        className="mt-8 w-full rounded-card-sm bg-white/15 p-3 backdrop-blur"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-sm bg-yellow text-xs font-black text-black">M</span>
          <span className="text-xs font-semibold">Your Store</span>
          <span className="ml-auto text-xs text-white/50">now</span>
        </div>
        <p className="mt-2 text-xs font-semibold">Your favourites are back</p>
        <p className="text-xs text-white/70">20% off for you this weekend</p>
      </motion.div>
    </div>
  );
}

/** 4. Loyalty: points count up, the next reward fills. */
function LoyaltyScene() {
  const [points, setPoints] = useState(1240);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - start - 600) / 1200));
      setPoints(Math.round(1240 + 250 * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <Screen title="Rewards">
      <div className="flex flex-col gap-1 rounded-card-sm bg-black p-4 text-white">
        <p className="text-xs text-white/60">Your points</p>
        <p className="text-3xl font-bold tabular-nums">{points.toLocaleString("en-US")}</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-pill bg-white/15">
          <motion.div className="h-full rounded-pill bg-yellow" initial={{ width: "62%" }} animate={{ width: "75%" }} transition={later(0.6)} />
        </div>
        <p className="text-xs text-white/60">510 to your next free delivery</p>
      </div>
      <motion.div className="self-start rounded-pill bg-yellow px-3 py-1.5 text-xs font-bold" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={later(1.6)}>
        +250 points
      </motion.div>
      <div className="flex flex-col gap-2">
        {["Wallet balance", "Gold member"].map((t) => (
          <div key={t} className="rounded-card-sm bg-panel px-3 py-3 text-xs font-semibold">{t}</div>
        ))}
      </div>
    </Screen>
  );
}

/** 5. Checkout: Apple Pay slides up, paid. */
function CheckoutScene() {
  return (
    <Screen title="Checkout">
      <div className="flex flex-col gap-2 rounded-card-sm bg-panel p-3 text-xs">
        <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">3,250 EGP</span></div>
        <div className="flex justify-between"><span>Delivery</span><span className="font-semibold">Free</span></div>
      </div>
      <motion.div
        className="mt-auto flex flex-col gap-3 rounded-card bg-black p-4 text-white"
        initial={{ y: 120 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 22 }}
      >
        <p className="text-sm font-bold">Apple Pay</p>
        <div className="flex justify-between text-xs text-white/70"><span>Pay Your Store</span><span>3,250 EGP</span></div>
        <motion.div
          className="relative flex items-center justify-center rounded-pill bg-white py-2.5 text-xs font-bold text-black"
          initial={{ opacity: 1 }}
          animate={{ backgroundColor: ["#ffffff", "#ffffff", "#ffdb00"] }}
          transition={{ times: [0, 0.6, 1], duration: 2.4 }}
        >
          <motion.span initial={{ opacity: 1 }} animate={{ opacity: [1, 1, 0] }} transition={{ times: [0, 0.6, 0.65], duration: 2.4 }}>Double-click to pay</motion.span>
          <motion.span className="absolute" initial={{ opacity: 0 }} animate={{ opacity: [0, 0, 1] }} transition={{ times: [0, 0.7, 0.8], duration: 2.4 }}>Paid ✓</motion.span>
        </motion.div>
      </motion.div>
    </Screen>
  );
}

const SCENES = [<ShopScene key="shop" />, <ReorderScene key="reorder" />, <PushScene key="push" />, <LoyaltyScene key="loyalty" />, <CheckoutScene key="checkout" />];
