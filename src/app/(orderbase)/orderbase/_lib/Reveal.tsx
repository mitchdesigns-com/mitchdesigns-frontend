"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fade/slide a block in the first time it scrolls into view. Falls back to
 * fully visible if IntersectionObserver never fires (SSR paint shows content,
 * the observer only adds the `is-in` class once mounted).
 */
export function Reveal({
  children,
  className,
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  /** stagger token: "d1" | "d2" | "d3" | "d4" */
  delay?: "d1" | "d2" | "d3" | "d4";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`ob-reveal ${delay ?? ""} ${shown ? "is-in" : ""} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
