"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import type { UseInViewOptions } from "framer-motion";

/** Single source of truth for scroll-reveal trigger behaviour.
 *  Tune the threshold/margin here and every reveal across the app follows. */
export const REVEAL_VIEWPORT: UseInViewOptions = {
  once: true,
  margin: "-40% 0px",
};

/** Returns a ref to attach to the element and whether it has entered the viewport. */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options?: UseInViewOptions,
) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { ...REVEAL_VIEWPORT, ...options });
  return { ref, inView };
}
