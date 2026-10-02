"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { DragArrows } from "@/components/icons/DragArrows";
import { easeOutSoft } from "@/lib/motion";

const DRAG_SIZE = 92; // px — round drag cursor
const PILL_H = 48; // px — "Explore Project" pill height

// Soft, slightly under-damped springs read as liquid: the blob trails the
// pointer, and its shape overshoots a touch when it morphs.
const FOLLOW = { stiffness: 170, damping: 20, mass: 0.5 };
const MORPH = { type: "spring", stiffness: 260, damping: 15, mass: 0.8 } as const;
const STRETCH = { stiffness: 300, damping: 22 };

/**
 * Carousel cursor: one yellow blob that morphs between the round drag cursor
 * and a compact "Explore Project" pill, trails the pointer on a soft spring and
 * stretches along its direction of travel (axis-aligned, so the pill never
 * tilts). `x`/`y` are the raw pointer position relative to the stage.
 */
export function LiquidCursor({
  x,
  y,
  visible,
  explore = false,
  pressed = false,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  visible: boolean;
  /** Show the "Explore Project" pill instead of the drag cursor. */
  explore?: boolean;
  /** Squish while the pointer is held down (dragging). */
  pressed?: boolean;
}) {
  const left = useSpring(x, FOLLOW);
  const top = useSpring(y, FOLLOW);

  // Squash & stretch from the trailing position's velocity.
  const vx = useVelocity(left);
  const vy = useVelocity(top);
  const stretchX = useSpring(
    useTransform([vx, vy], ([a, b]: number[]) =>
      1 + Math.min(Math.abs(a) / 4000, 0.22) - Math.min(Math.abs(b) / 9000, 0.1),
    ),
    STRETCH,
  );
  const stretchY = useSpring(
    useTransform([vx, vy], ([a, b]: number[]) =>
      1 + Math.min(Math.abs(b) / 4000, 0.22) - Math.min(Math.abs(a) / 9000, 0.1),
    ),
    STRETCH,
  );

  // The pill hugs its label — measure it once it has rendered.
  const labelRef = useRef<HTMLSpanElement>(null);
  const [pillW, setPillW] = useState(176);
  useLayoutEffect(() => {
    if (labelRef.current) setPillW(labelRef.current.offsetWidth + 40);
  }, []);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute z-50 size-0"
      style={{ left, top }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? (pressed ? 0.82 : 1) : 0.4 }}
      transition={{ type: "spring", stiffness: 380, damping: 18 }}
    >
      {/* Liquid blob */}
      <motion.div
        className="absolute left-0 top-0 rounded-full bg-yellow shadow-lg"
        style={{ x: "-50%", y: "-50%", scaleX: stretchX, scaleY: stretchY }}
        initial={false}
        animate={{
          width: explore ? pillW : DRAG_SIZE,
          height: explore ? PILL_H : DRAG_SIZE,
        }}
        transition={MORPH}
      />

      {/* Contents cross-fade inside the blob */}
      <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
        <AnimatePresence initial={false} mode="popLayout">
          {explore ? (
            <motion.span
              key="explore"
              className="flex items-center gap-1.5 whitespace-nowrap text-base font-semibold text-black"
              initial={{ opacity: 0, scale: 0.6, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.6, filter: "blur(6px)" }}
              transition={{ duration: 0.28, ease: easeOutSoft }}
            >
              Explore Project
              <ArrowRight size={16} className="-rotate-45" />
            </motion.span>
          ) : (
            <motion.span
              key="drag"
              className="flex text-black"
              initial={{ opacity: 0, scale: 0.5, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(6px)" }}
              transition={{ duration: 0.28, ease: easeOutSoft }}
            >
              <DragArrows size={38} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Off-screen copy of the label, used only to size the pill. */}
      <span
        ref={labelRef}
        className="invisible absolute flex items-center gap-1.5 whitespace-nowrap text-base font-semibold"
      >
        Explore Project
        <ArrowRight size={16} />
      </span>
    </motion.div>
  );
}
