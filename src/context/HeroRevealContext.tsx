"use client";

import { createContext, useContext } from "react";

/**
 * Whether the homepage hero reveal has fully opened onto the content below.
 * `null` outside a HeroReveal (or with reduced motion) — consumers then fall
 * back to their own in-view triggers.
 */
export const HeroRevealContext = createContext<boolean | null>(null);

export function useHeroRevealOpened() {
  return useContext(HeroRevealContext);
}
