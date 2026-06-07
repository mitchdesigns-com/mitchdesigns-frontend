"use client";

import { useEffect, useRef } from "react";

/** Same key StepRenderer persists the in-progress lead under. */
const STORAGE_KEY = "mitchdesigns.quote.lead";

function readStoredFirstName(): string | undefined {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const value = raw ? (JSON.parse(raw) as { firstName?: unknown }).firstName : undefined;
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
  } catch {
    return undefined;
  }
}

/**
 * While a quote page is backgrounded (the tab loses focus), swap the document
 * title to a nudge that pulls the visitor back — personalized with their first
 * name once they've entered it (the `firstName` arg, or the persisted lead as a
 * fallback for pages that don't hold live form state). The real title is
 * restored the moment the tab is focused again, and on unmount.
 */
export function useAwayTitle(firstName?: string) {
  const nameRef = useRef(firstName);
  nameRef.current = firstName;
  const savedTitle = useRef<string | null>(null);

  useEffect(() => {
    const restore = () => {
      if (savedTitle.current !== null) {
        document.title = savedTitle.current;
        savedTitle.current = null;
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (savedTitle.current === null) savedTitle.current = document.title;
        const name = nameRef.current?.trim() || readStoredFirstName();
        document.title = name
          ? `${name}, your quote is waiting 👋`
          : "Your quote is waiting 👋";
      } else {
        restore();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      restore();
    };
  }, []);
}

/**
 * Zero-render wrapper around {@link useAwayTitle} so server-component quote
 * pages can opt in by dropping `<AwayTitle />` into their tree.
 */
export function AwayTitle({ firstName }: { firstName?: string }) {
  useAwayTitle(firstName);
  return null;
}
