import { OrderbaseIcon } from "@/features/orderbase/OrderbaseIcon";
import type { OrderbaseIconName } from "@/lib/cms/types";

export interface MeetFeature {
  icon: OrderbaseIconName;
  title?: string;
  description: string;
}

export interface MeetSectionProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  features?: MeetFeature[];
}

export function MeetSection({
  title = "Meet Orderbase",
  subtitle = "Your digital operating system for food eCommerce",
  ctaLabel = "Contact Sales",
  ctaHref = "#",
  features = [],
}: MeetSectionProps) {
  return (
    <section className="bg-bg py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-[3.75rem] flex flex-col gap-16">

        {/* Header */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-hero-2 font-bold text-fg text-balance leading-[1.1]">
              {title}
            </h2>
            <p className="text-xl text-fg text-balance">
              {subtitle}
            </p>
          </div>

          <a
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-pill bg-orderbase-red px-9 py-4 text-xl font-medium text-white"
          >
            {ctaLabel}
          </a>
        </div>

        {/* Feature cards — 3-up grid */}
        {features.length > 0 ? (
          <div className="grid grid-cols-3 gap-10">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-card-sm bg-panel-mid px-4 py-6 h-[118px] flex items-center justify-center"
              >
                <span className="text-sm text-fg-muted">Feature {i + 1}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }: MeetFeature) {
  return (
    <div className="rounded-card-sm bg-panel-mid px-4 py-6 flex gap-3 items-start">
      {/* Icon container — 32×32, red bg, rounded-[8px] */}
      <div className="shrink-0 w-8 h-8 rounded-[8px] bg-orderbase-red flex items-center justify-center text-white">
        <OrderbaseIcon name={icon} size={20} />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1">
        <p className="text-xl font-medium text-fg">{title}</p>
        <p className="text-base text-fg/70 text-balance">{description}</p>
      </div>
    </div>
  );
}
