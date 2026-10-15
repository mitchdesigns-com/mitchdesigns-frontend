"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { easeInOutSoft } from "@/lib/motion";
import { BeatCursor, BeatFrame, WIDE, pct, useBeatSteps } from "./BeatFrame";

const BASE = "/images/services/ecommerce-beats/exception-tabs-base.webp";
/** Exception's own pill colour and its three real tabs (piece %). */
const PILL_COLOUR = "#1a2122";
const TOP = 44.81;
const HEIGHT = 17.32;
const TABS = [
  { left: 14.42, width: 21.9 },
  { left: 36.88, width: 22.0 },
  { left: 60.07, width: 25.42 },
];
const centre = (i: number) => ({ x: TABS[i].left + TABS[i].width / 2, y: TOP + HEIGHT / 2 });
// 0 wide · 1 zoom on the bar · 2 cursor to New Arrivals · 3 tap: pill slides · 4 cursor to Recommended · 5 tap · 6 zoom out
const AT = [0, 400, 1200, 1800, 2700, 3300, 4400];

/**
 * Exception's real "Perfect Picks for You" tabs. The base is the bar with no
 * active pill; the pill is a clipped layer — the pill colour plus the bar,
 * inverted, so the label under it turns white — sliding across the tabs.
 */
export function ExceptionTabsBeat({ active }: { active: boolean }) {
  const step = useBeatSteps(active, AT);
  const tab = step >= 5 ? 2 : step >= 3 ? 1 : 0;
  const t = TABS[tab];
  const focus = step >= 4 ? centre(step >= 4 && step < 6 ? 2 : tab) : centre(tab);
  return (
    <BeatFrame
      backdrop="#f3f3f5"
      fit={{ w: 88, h: 70.14 }}
      camera={step >= 1 && step <= 5 ? { x: focus.x, y: focus.y, zoom: 1.9 } : WIDE}
      cameraTransition={{ duration: 0.8, ease: easeInOutSoft }}
    >
      <Image src={BASE} alt="" fill unoptimized className="object-contain" />
      <motion.div
        className="absolute inset-0 isolate"
        initial={false}
        animate={{
          clipPath: `inset(${TOP}% ${100 - t.left - t.width}% ${100 - TOP - HEIGHT}% ${t.left}% round 9999px)`,
        }}
        transition={{ type: "spring", stiffness: 210, damping: 24 }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: PILL_COLOUR }} />
        <Image
          src={BASE}
          alt=""
          fill
          unoptimized
          className="object-contain mix-blend-lighten"
          style={{ filter: "invert(1) brightness(1.7)" }}
        />
      </motion.div>
      <BeatCursor
        at={step >= 2 && step <= 5 ? { x: centre(step >= 4 ? 2 : 1).x + 2, y: centre(1).y + 2 } : null}
        click={step === 3 || step === 5}
        size={2.2}
      />
    </BeatFrame>
  );
}
