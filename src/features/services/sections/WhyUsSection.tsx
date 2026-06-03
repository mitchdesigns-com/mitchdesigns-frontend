import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealStagger, RevealItem } from "@/components/motion";
import type { WhyUsSectionProps } from "@/lib/cms/types";
import { RichText } from "@/components/ui/RichText";

export function WhyUsSection({
  title,
  description,
  cards,
  variant = "grid",
}: WhyUsSectionProps) {
  const cardEls = cards.map((card) => (
    <RevealItem key={card.title} className="flex flex-col gap-4 rounded-card-sm border border-border p-6">
      <div className="relative aspect-video overflow-hidden rounded-card-sm">
        <Image
          src={card.image}
          alt={card.imageAlt ?? ""}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <h3 className="text-lg font-semibold text-fg">{card.title}</h3>
      <RichText content={card.description} className="text-base text-fg-muted" />
    </RevealItem>
  ));

  return (
    <Section theme="dark" className="py-20 md:py-28">
      <div className="space-y-12">
        <SectionHeader eyebrow="Why Us" title={title} description={description} />
        {variant === "slider" ? (
          /* Phase 4: replace with Framer Motion drag carousel */
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
            {cards.map((card) => (
              <div
                key={card.title}
                className="w-72 shrink-0 snap-start flex flex-col gap-4 rounded-card-sm border border-border p-6"
              >
                <div className="relative aspect-video overflow-hidden rounded-card-sm">
                  <Image
                    src={card.image}
                    alt={card.imageAlt ?? ""}
                    fill
                    className="object-cover"
                    sizes="288px"
                  />
                </div>
                <h3 className="text-lg font-semibold text-fg">{card.title}</h3>
                <RichText content={card.description} className="text-base text-fg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <RevealStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
            {cardEls}
          </RevealStagger>
        )}
      </div>
    </Section>
  );
}
