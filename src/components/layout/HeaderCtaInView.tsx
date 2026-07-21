"use client";

import { useContext, useEffect, useId, useRef } from "react";
import { HeaderConfigContext } from "@/context/HeaderConfigContext";

/**
 * Attach the returned ref to a page-level CTA element. While that element is
 * within the viewport, the sticky header hides its own (duplicate) CTA so the
 * two never compete for the same action.
 *
 * Only gate the header on CTAs that point at the same destination as the header
 * CTA (the leads app) — an in-page button to `/quote` or elsewhere is a
 * different action and shouldn't suppress the header CTA. Pass `active` to
 * opt a given CTA in.
 */
export function useHeaderCtaInView<T extends Element>(active = true) {
  const ref = useRef<T>(null);
  const id = useId();
  const { reportCtaInView } = useContext(HeaderConfigContext);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    const io = new IntersectionObserver(
      ([entry]) => reportCtaInView(id, entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      reportCtaInView(id, false);
    };
  }, [id, active, reportCtaInView]);

  return ref;
}

/**
 * Wrapper for server components: hides the header CTA while its children are on
 * screen. Renders a plain block wrapper so it slots into existing markup without
 * changing layout. Only reports when `active` (i.e. this is a leads-app CTA).
 */
export function HeaderCtaInView({
  children,
  className,
  active = true,
}: {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}) {
  const ref = useHeaderCtaInView<HTMLDivElement>(active);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
