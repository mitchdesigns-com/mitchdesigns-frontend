"use client";

import { trustIconFor } from "./trustIcons";

type ClientsTrustCardProps = {
  /** Still supplied by the CMS; the icon cards don't display it. */
  image?: string | null;
  title: string;
  body: string;
  /** 1-based position, shown as the "(01)" label. */
  index?: number;
};

/** One card of the floating trust grid. The cards aren't links, so the card
 *  itself never moves on hover — a soft yellow light follows the pointer
 *  across the card and lights the border under it. The parent grid supplies
 *  the 3D tilt. */
export function ClientsTrustCard({ title, body, index = 1 }: ClientsTrustCardProps) {
  const { Icon, loop } = trustIconFor(title, index - 1);

  // Pointer position inside the card, as CSS vars the glow layers read —
  // set straight on the element so following the mouse never re-renders.
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

      <div className="relative flex h-full flex-col gap-8 overflow-hidden rounded-card border border-white/10 bg-card/95 bg-clip-padding p-6 shadow-card-deep transition-shadow duration-700 ease-out-soft group-hover:shadow-glow-accent lg:p-8">
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

        <div className="relative flex items-start justify-between">
          <span className="flex size-14 items-center justify-center rounded-card-sm border border-yellow/20 bg-yellow/10 text-yellow transition-colors duration-700 ease-out-soft group-hover:bg-yellow/15">
            <Icon size={28} className={loop} />
          </span>
          <span className="text-sm font-medium text-yellow">
            ({String(index).padStart(2, "0")})
          </span>
        </div>

        <div className="relative mt-auto flex flex-col gap-3">
          <h3 className="text-hero-5 text-fg">{title}</h3>
          <p className="text-base text-fg-muted text-balance">{body}</p>
        </div>
      </div>
    </article>
  );
}
