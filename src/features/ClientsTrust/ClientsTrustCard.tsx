"use client";

import { GlowCard } from "@/components/ui/GlowCard";
import { trustIconFor } from "./trustIcons";

type ClientsTrustCardProps = {
  /** Still supplied by the CMS; the icon cards don't display it. */
  image?: string | null;
  title: string;
  body: string;
  /** 1-based position, shown as the "(01)" label. */
  index?: number;
};

/** One card of the floating trust grid (pointer-following glow comes from
 *  GlowCard; the parent grid supplies the 3D tilt). */
export function ClientsTrustCard({ title, body, index = 1 }: ClientsTrustCardProps) {
  const { Icon, loop } = trustIconFor(title, index - 1);

  return (
    <GlowCard className="gap-8 p-6 lg:p-8">
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
    </GlowCard>
  );
}
