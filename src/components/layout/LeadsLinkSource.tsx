"use client";

import { useEffect } from "react";
import { isLeadsHref } from "@/config/nav";

/**
 * Tags every link into the leads funnel with the page it was clicked on
 * (`?from=<page URL>`), so the funnel's "Back to site" link returns the visitor
 * there. Browsers only pass the domain across sites, not the page, so the funnel
 * can't see it otherwise.
 *
 * One delegated listener instead of a prop on each CTA: it also covers links
 * authored in Strapi. Runs in the capture phase, before the browser reads the
 * href for the navigation.
 */
export function LeadsLinkSource() {
  useEffect(() => {
    const tag = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || !isLeadsHref(link.href)) return;
      const url = new URL(link.href);
      url.searchParams.set("from", window.location.href);
      link.href = url.toString();
    };
    document.addEventListener("click", tag, true);
    document.addEventListener("auxclick", tag, true);
    return () => {
      document.removeEventListener("click", tag, true);
      document.removeEventListener("auxclick", tag, true);
    };
  }, []);

  return null;
}
