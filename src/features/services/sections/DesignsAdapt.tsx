import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealStagger, RevealItem } from "@/components/motion";
import type { DesignsAdaptProps } from "@/lib/cms/types";
import { RichText } from "@/components/ui/RichText";

export function DesignsAdapt({ title, description, cards }: DesignsAdaptProps) {
  return (
    <Section theme="beige" className="py-20 md:py-28">
      <div className="space-y-12">
        <SectionHeader title={title} description={description} align="center" />
        <RevealStagger className="grid grid-cols-1 gap-6 md:grid-cols-3" stagger={0.08}>
          {cards.map((card) => (
            <RevealItem
              key={card.title}
              className="flex flex-col gap-5 rounded-card border border-border bg-bg p-6"
            >
              <div className="relative aspect-video overflow-hidden rounded-card-sm">
                <Image
                  src={card.image}
                  alt={card.imageAlt ?? ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="text-xl font-semibold text-fg">{card.title}</h3>
              <RichText content={card.description} className="text-base text-fg-muted" />
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </Section>
  );
}
