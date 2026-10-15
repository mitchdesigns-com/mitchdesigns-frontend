"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { easeInOutSoft, easeOutSoft } from "@/lib/motion";
import { BeatFrame, WIDE, pct, useBeatSteps } from "./BeatFrame";

const SRC = "/images/services/ecommerce-beats";
/** Abu Auf's own tracker colours (sampled from the design). */
const ARC = "#3c6f2d";
const RING = "#bfd6ba";
const FILL = "#e8f4e7";
// Parts of the real tracker, % of the cut card.
const PREP = { left: 57.03, top: 39.94, width: 10.3, height: 38.41 };
const ONWAY = { left: 33.85, top: 41.77, width: 9.32, height: 34.76 };
const BAR = { left: 43.83, top: 57.01, width: 12.43, height: 4.27 };
const BADGE = { left: 56.62, top: 38.1, width: 2.53, height: 9.45 };
const LABEL_ONWAY = { left: 34.42, top: 79.27, width: 8.34, height: 8.23 };
const LABEL_PREP = { left: 57.07, top: 79.27, width: 8.91, height: 8.23 };
const centre = (b: typeof PREP) => ({ x: b.left + b.width / 2, y: b.top + b.height / 2 });
const box = (b: typeof PREP) => ({ left: pct(b.left), top: pct(b.top), width: pct(b.width), height: pct(b.height) });
const BAR_MS = 1500;
// 0 wide · 1 zoom on "جاري التحضير" · 2 its loader completes · 3 check badge
// · 4 the bar fills toward "في الطريق إليك", camera riding along · 5 on its way
// is now active · 6 zoom out
const AT = [0, 600, 1400, 2000, 2400, 2400 + BAR_MS, 5000];

/** Abu Auf's real order tracker moving from preparing to on its way. */
export function AbuAufTrackerBeat({ active }: { active: boolean }) {
  const step = useBeatSteps(active, AT);
  const camera =
    step >= 1 && step <= 3
      ? { ...centre(PREP), zoom: 2.3 }
      : step === 4 || step === 5
        ? { ...centre(ONWAY), zoom: 2.3 }
        : WIDE;
  return (
    <BeatFrame
      backdrop="#1d1d1b"
      fit={{ w: 88, h: 44.06 }}
      camera={camera}
      cameraTransition={
        step === 4 ? { duration: BAR_MS / 1000, ease: easeInOutSoft } : { duration: 0.9, ease: easeInOutSoft }
      }
    >
      <Image src={`${SRC}/abu-auf-tracker.webp`} alt="" fill unoptimized className="object-contain" />

      {/* "Preparing" loader completes its ring. */}
      <svg className="absolute -rotate-90" style={box(PREP)} viewBox="0 0 100 100" aria-hidden>
        <motion.circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke={ARC}
          strokeWidth="3.4"
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: step >= 2 ? 1 : 0.0001, opacity: step >= 2 ? 1 : 0 }}
          transition={{ duration: 0.6, ease: easeInOutSoft }}
        />
      </svg>
      <motion.div
        className="absolute"
        style={box(BADGE)}
        initial={false}
        animate={step >= 3 ? { scale: [0, 1.35, 1], opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.45, ease: easeOutSoft }}
      >
        <Image src={`${SRC}/abu-auf-tracker-badge.webp`} alt="" fill unoptimized className="object-contain" />
      </motion.div>
      <motion.div
        className="absolute bg-white"
        style={box(LABEL_PREP)}
        initial={false}
        animate={{ opacity: step >= 5 ? 0.5 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* The next bar fills right-to-left with the design's own green bar. */}
      <motion.div
        className="absolute"
        style={box(BAR)}
        initial={false}
        animate={{ clipPath: step >= 4 ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)" }}
        transition={{ duration: step >= 4 ? BAR_MS / 1000 : 0, ease: easeInOutSoft }}
      >
        <Image src={`${SRC}/abu-auf-tracker-bar.webp`} alt="" fill unoptimized className="object-fill" />
      </motion.div>

      {/* "On its way" becomes the active step, in the design's active style. */}
      <motion.div
        className="absolute"
        style={box(ONWAY)}
        initial={false}
        animate={step >= 5 ? { opacity: 1, scale: [0.9, 1.06, 1] } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5, ease: easeOutSoft }}
      >
        <div className="absolute inset-0 rounded-full mix-blend-multiply" style={{ backgroundColor: FILL }} />
        <div className="absolute inset-0 rounded-full border-4" style={{ borderColor: RING }} />
        <motion.svg
          className="absolute inset-0"
          viewBox="0 0 100 100"
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="50" cy="50" r="48" fill="none" stroke={ARC} strokeWidth="3.6" strokeLinecap="round" strokeDasharray="80 222" />
        </motion.svg>
      </motion.div>
      <motion.div
        // Grey label → near-black (contrast keeps the white card white).
        className="absolute mix-blend-multiply"
        style={{ ...box(LABEL_ONWAY), filter: "contrast(3.2)" }}
        initial={false}
        animate={{ opacity: step >= 5 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image src={`${SRC}/abu-auf-tracker-label.webp`} alt="" fill unoptimized className="object-contain" />
      </motion.div>
    </BeatFrame>
  );
}
