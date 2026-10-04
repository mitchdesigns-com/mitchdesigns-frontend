"use client";

import { cn } from "@/lib/cn";

/**
 * Dark card for the floating 3D grids (homepage trust reasons, service
 * "why us"). The card itself never moves on hover — a soft yellow light
 * follows the pointer across it and lights the border under it.
 * `className` lays out the content (padding, gap) on the card surface.
 */
export function GlowCard({ className, children }: { className?: string; children: React.ReactNode }) {
  // Pointer position as CSS vars the glow layers read — set straight on the
  // element so following the mouse never re-renders.
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  const glowAt = { transform: "translate(var(--mx, 50%), var(--my, 0px))" };

  return (
    <article className="group relative h-full transform-3d" onPointerMove={onPointerMove}>
      {/* Border light — a blob behind the card shows through its edge */}
      <div
        aria-hidden
        className="absolute -inset-px overflow-hidden rounded-card opacity-0 transition-opacity duration-700 ease-out-soft group-hover:opacity-100"
      >
        <div
          style={glowAt}
          className="absolute top-0 left-0 -mt-24 -ml-24 size-48 rounded-full bg-yellow/70 blur-2xl transition-transform duration-500 ease-out-soft"
        />
      </div>

      <div className="relative h-full overflow-hidden rounded-card border border-white/10 bg-card/95 bg-clip-padding shadow-card-deep transition-shadow duration-700 ease-out-soft group-hover:shadow-glow-accent">
        {/* Inner light following the pointer */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-out-soft group-hover:opacity-100"
        >
          <div
            style={glowAt}
            className="absolute top-0 left-0 -mt-32 -ml-32 size-64 rounded-full bg-yellow/15 blur-3xl transition-transform duration-700 ease-out-soft"
          />
        </div>

        <div className={cn("relative flex h-full flex-col", className)}>{children}</div>
      </div>
    </article>
  );
}
