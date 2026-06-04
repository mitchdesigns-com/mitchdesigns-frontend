import Image from "next/image";
import { OrderbaseIcon } from "@/features/orderbase/OrderbaseIcon";
import type { OrderbaseIconName } from "@/lib/cms/types";

export interface MoreAboutFeature {
  icon: OrderbaseIconName;
  title?: string;
  description: string;
}

export interface MoreAboutProps {
  media?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  features?: MoreAboutFeature[];
}

export function MoreAbout({
  media,
  title = "Your Kitchen And Your Courier Finally In The Same System",
  description = "Take control of your margins, operations, and customer relationships by building your own direct digital channel.",
  ctaLabel = "Contact Sales",
  ctaHref = "#",
  features = [],
}: MoreAboutProps) {
  return (
    <section className="bg-bg py-20">
      <div className="mx-auto max-w-[var(--container-max)] px-[3.75rem] flex items-center gap-10">

        {/* Left — illustration / image */}
        <div className="shrink-0 w-[680px] self-stretch">
          {media ? (
            <Image src={media} alt="" className="w-full h-full object-cover rounded-card" />
          ) : (
            <div className="w-full h-full min-h-[480px] rounded-card bg-panel flex items-center justify-center">
              <span className="text-sm text-fg-muted">Illustration</span>
            </div>
          )}
        </div>

        {/* Right — content */}
        <div className="flex flex-col gap-10 flex-1">

          {/* Title + description */}
          <div className="flex flex-col gap-4">
            <h2 className="text-hero-4 font-bold text-fg text-balance leading-[1.1]">
              {title}
            </h2>
            <p className="text-xl text-fg text-balance">
              {description}
            </p>
          </div>

          {/* 2×2 feature grid */}
          <div className="grid grid-cols-2 gap-5">
            {features.map((feature, i) => (
              <FeatureItem key={i} {...feature} />
            ))}
          </div>

          {/* CTA */}
          <a
            href={ctaHref}
            className="inline-flex w-fit items-center justify-center rounded-pill bg-orderbase-red px-9 py-4 text-xl font-medium text-white"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ icon, description }: MoreAboutFeature) {
  return (
    <div className="flex items-center gap-3 rounded-[12px] border border-border p-4">
      {/* 40×40 red icon container */}
      <div className="shrink-0 w-10 h-10 rounded-[8px] bg-orderbase-red flex items-center justify-center text-white">
        <OrderbaseIcon name={icon} size={24} />
      </div>
      <p className="text-base text-fg text-balance">{description}</p>
    </div>
  );
}
