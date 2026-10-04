"use client";

import { useReducedMotion, useSpring } from "framer-motion";

const TILT_SPRING = { stiffness: 50, damping: 18, mass: 0.8 };

/**
 * Springy 3D tilt that leans a plane toward the mouse. Spread `handlers` on
 * the element that should track the pointer, and put `rotateX` / `rotateY`
 * on a `transform-3d` motion element inside a `perspective-*` parent.
 * Mouse only (touch stays flat); off for reduced motion.
 */
export function useTilt(maxTilt = 8) {
  const reduced = useReducedMotion();
  const rotateX = useSpring(0, TILT_SPRING);
  const rotateY = useSpring(0, TILT_SPRING);

  const handlers = {
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      if (reduced || e.pointerType !== "mouse") return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      rotateY.set(x * 2 * maxTilt);
      rotateX.set(-y * 2 * maxTilt);
    },
    onPointerLeave: () => {
      rotateX.set(0);
      rotateY.set(0);
    },
  };

  return { rotateX, rotateY, handlers };
}
