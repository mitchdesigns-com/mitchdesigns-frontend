"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HeartSolid } from "@/components/icons/HeartSolid";
import { easeOutSoft } from "@/lib/motion";
import { BeatCursor, BeatFrame, WIDE, pct, useBeatSteps } from "./BeatFrame";

const SRC = "/images/services/ecommerce-beats";
/** Sally Helmy's two real product cards, as cut from the case study. */
const CARDS = [
  { src: `${SRC}/sally-card-1.webp`, left: 0, width: 48.51, stack: { x: "53%", rotate: -4 } },
  { src: `${SRC}/sally-card-2.webp`, left: 51.22, width: 48.78, stack: { x: "-52.5%", rotate: 4 } },
];
// The outline heart on the second card: centre and outer width (frame %).
const HEART = { x: 95.6, y: 6.1, w: 2.96 };
// 0 stacked · 1 side by side · 2 camera + cursor to the heart · 3 tap: heart fills · 4 zoom out
const AT = [0, 500, 1700, 2700, 3900];

/** Cards fan out side by side, then the bouquet gets favourited. */
export function SallyHelmyCardsBeat({ active }: { active: boolean }) {
  const step = useBeatSteps(active, AT);
  const zoomed = step === 2 || step === 3;
  return (
    <BeatFrame
      backdrop="#1d1d1b"
      fit={{ w: 75.45, h: 90 }}
      camera={zoomed ? { x: HEART.x - 12, y: HEART.y + 14, zoom: 1.8 } : WIDE}
    >
      {CARDS.map((c, i) => (
        <motion.div
          key={c.src}
          className="absolute top-0 h-full"
          style={{ left: pct(c.left), width: pct(c.width), zIndex: i }}
          initial={false}
          animate={step >= 1 ? { x: "0%", rotate: 0, scale: 1 } : { ...c.stack, scale: 0.94 }}
          transition={{ type: "spring", stiffness: 140, damping: 18, delay: step >= 1 ? i * 0.08 : 0 }}
        >
          <Image src={c.src} alt="" fill unoptimized className="object-contain" />
        </motion.div>
      ))}
      <motion.div
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-black"
        // Exactly the outline heart's box (its outer edge), so it fills it.
        style={{ left: pct(HEART.x), top: pct(HEART.y), width: pct(HEART.w) }}
        initial={false}
        animate={step === 3 ? { scale: [0, 1.4, 1], opacity: 1 } : step === 4 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.45, ease: easeOutSoft }}
      >
        <HeartSolid className="h-auto w-full" />
      </motion.div>
      <BeatCursor at={step === 2 || step === 3 ? { x: HEART.x + 0.3, y: HEART.y + 1.2 } : null} click={step === 3} size={2.2} />
    </BeatFrame>
  );
}
