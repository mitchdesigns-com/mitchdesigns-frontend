import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { MoreAboutProps } from "@/lib/cms/types";
import { RichText } from "@/components/ui/RichText";
import { RevealStagger, RevealItem } from "@/components/motion";

export function MoreAbout({ title, description, cards }: MoreAboutProps) {
  return (
    <Section className="py-20 md:py-28">
      <div className="space-y-16">
        <SectionHeader title={title} description={description} />
        <RevealStagger as="ol" className="space-y-16" stagger={0.1}>
          {cards.map((card, i) => (
            <RevealItem
              as="li"
              key={card.title}
              className={`flex flex-col gap-10 md:flex-row md:items-center md:gap-16 ${
                i % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="relative min-h-64 flex-1 overflow-hidden rounded-card md:min-h-80">
                <Image
                  src={card.image}
                  alt={card.imageAlt ?? ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4">
                <h3 className="text-hero-5 font-bold text-fg">{card.title}</h3>
                <RichText content={card.description} className="text-lg text-fg-muted" />
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </Section>
  );
}
