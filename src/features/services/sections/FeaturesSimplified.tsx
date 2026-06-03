import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion";
import type { FeaturesSimplifiedProps } from "@/lib/cms/types";
import { RichText } from "@/components/ui/RichText";

const labelColors: Record<string, string> = {
  New: "bg-accent text-accent-fg",
  Popular: "bg-fg text-bg",
  Trending: "bg-fg-muted/20 text-fg",
};

export function FeaturesSimplified({
  title,
  description,
  image,
  imageAlt,
  featureCards,
}: FeaturesSimplifiedProps) {
  return (
    <Section className="py-20 md:py-28">
      <div className="flex flex-col gap-16 md:flex-row md:gap-20">
        <div className="flex flex-col gap-8 md:w-80 md:shrink-0">
          <SectionHeader title={title} description={description} />
          <Reveal className="relative min-h-64 overflow-hidden rounded-card md:flex-1">
            <Image
              src={image}
              alt={imageAlt ?? ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          </Reveal>
        </div>
        <div className="flex-1">
          <RevealStagger as="ul" className="grid grid-cols-1 gap-4 sm:grid-cols-2" stagger={0.08} delay={0.15}>
            {featureCards.map((card) => (
              <RevealItem
                as="li"
                key={card.title}
                className="flex flex-col gap-2 rounded-card-sm border border-border p-5"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-semibold text-fg">{card.title}</h3>
                  {card.label && (
                    <span
                      className={`rounded-pill px-2.5 py-0.5 text-xs font-medium ${labelColors[card.label]}`}
                    >
                      {card.label}
                    </span>
                  )}
                </div>
                <RichText content={card.description} className="text-sm text-fg-muted" />
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </div>
    </Section>
  );
}
