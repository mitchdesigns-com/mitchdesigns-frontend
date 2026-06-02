"use client";

import { useEffect, useState } from "react";

export type SectionTheme = "light" | "dark" | "beige";

/**
 * Watches sections marked with `data-theme` and reports the theme currently
 * intersecting the top of the viewport. Used by Header to flip its variant
 * as the user scrolls between sections of different backgrounds.
 *
 * Sections must render with `data-theme="dark"` (or "beige") for this to pick
 * them up. The Section component already does this.
 */
export function useSectionTheme(headerOffsetPx = 72): SectionTheme {
  const [theme, setTheme] = useState<SectionTheme>("light");

  useEffect(() => {
    // Keep a mutable reference to the current themed sections so the
    // update() closure can re-evaluate when the DOM changes (client nav).
    let sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-theme]"),
    );

    const update = () => {
      const probeY = headerOffsetPx + 1;
      let next: SectionTheme = "light";
      for (const el of sections) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom > probeY) {
          const t = el.dataset.theme as SectionTheme | undefined;
          if (t === "dark" || t === "beige") next = t;
          else next = "light";
          break;
        }
      }
      setTheme((prev) => (prev === next ? prev : next));
    };

    // MutationObserver will catch client-side route swaps and content
    // changes so we can re-scan the DOM for [data-theme] sections.
    const observer = new MutationObserver(() => {
      sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-theme]"),
      );
      update();
    });

    // Watch the whole document for added/removed nodes.
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run and conventional listeners for scroll/resize.
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [headerOffsetPx]);

  return theme;
}
