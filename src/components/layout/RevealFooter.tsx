"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * "Sticky reveal" footer (à la whatmattersagency.com): the footer is pinned to
 * the bottom of the viewport behind the page. The page content sits on top with
 * a solid background and a bottom margin equal to the footer's height, so as you
 * scroll to the end the content slides up off the footer to uncover it.
 *
 * Only engaged when the footer fits within the viewport (otherwise a taller-
 * than-screen footer would be clipped at the top), and disabled for reduced
 * motion — both fall back to a normal in-flow footer.
 */
export function RevealFooter({
  children,
  footer,
}: {
  children: ReactNode;
  footer: ReactNode;
}) {
  const footerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [height, setHeight] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const measure = () => {
      const h = el.offsetHeight;
      setHeight(h);
      setEnabled(!reduced && h > 0 && h <= window.innerHeight);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduced]);

  return (
    <>
      <div
        className="relative z-10 bg-bg"
        style={enabled ? { marginBottom: height } : undefined}
      >
        {children}
      </div>
      <div
        ref={footerRef}
        className={enabled ? "fixed inset-x-0 bottom-0 z-0" : "relative z-0"}
        aria-hidden={false}
      >
        {footer}
      </div>
    </>
  );
}
