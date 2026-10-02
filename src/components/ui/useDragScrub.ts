"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { animate, useMotionValue, type AnimationPlaybackControls } from "framer-motion";

/**
 * Horizontal drag / swipe / trackpad "scrub" over an element, as a raw px
 * offset motion value (pair it with a spring for smooth following). Release
 * throws with inertia. Touch keeps vertical page scrolling (pan-y) — give the
 * element `touch-pan-y select-none`.
 */
export function useDragScrub(ref: RefObject<HTMLElement | null>) {
  const offset = useMotionValue(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{
    id: number;
    startX: number;
    startOffset: number;
    lastX: number;
    lastT: number;
    velocity: number;
  } | null>(null);
  const glide = useRef<AnimationPlaybackControls | null>(null);

  function onPointerDown(e: React.PointerEvent<HTMLElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    glide.current?.stop();
    drag.current = {
      id: e.pointerId,
      startX: e.clientX,
      startOffset: offset.get(),
      lastX: e.clientX,
      lastT: performance.now(),
      velocity: 0,
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Pointer already gone (e.g. a cancelled touch) — works without capture.
    }
    setDragging(true);
  }

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const now = performance.now();
    const dt = Math.max(1, now - d.lastT);
    // Light smoothing so one jittery sample doesn't dominate the throw.
    d.velocity = 0.8 * ((e.clientX - d.lastX) / dt) * 1000 + 0.2 * d.velocity;
    d.lastX = e.clientX;
    d.lastT = now;
    offset.set(d.startOffset + (e.clientX - d.startX));
  }

  function onPointerEnd(e: React.PointerEvent<HTMLElement>) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    setDragging(false);
    glide.current = animate(offset, offset.get(), {
      type: "inertia",
      velocity: d.velocity,
      power: 0.4,
      timeConstant: 380,
    });
  }

  // Horizontal trackpad swipes scrub too (vertical ones still scroll).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      glide.current?.stop();
      offset.set(offset.get() - e.deltaX);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [ref, offset]);

  useEffect(() => () => glide.current?.stop(), []);

  return {
    offset,
    dragging,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
      // Stop the browser's native image/link drag from hijacking the scrub.
      onDragStart: (e: React.DragEvent) => e.preventDefault(),
    },
  };
}
