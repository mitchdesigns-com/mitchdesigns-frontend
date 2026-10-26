import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { SupportSectionProps } from "@/lib/cms/types";
import { RichText } from "@/components/ui/RichText";
import { RevealStagger, RevealItem } from "@/components/motion";
import { cn } from "@/lib/cn";
import { supportIconFor } from "./supportIcons";

export function SupportSection({ title, description, cards }: SupportSectionProps) {
  return (
    <Section theme="beige" className="py-20 md:py-28">
      <div className="space-y-12">
        <SectionHeader title={title} description={description} align="center" />
        <RevealStagger
          className={cn(
            "grid grid-cols-1 gap-6 sm:grid-cols-2",
            cards.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4",
          )}
          stagger={0.08}
        >
          {cards.map((card, i) => {
            // Animated line icon picked from the title (the CMS image isn't shown).
            const { Icon, loop } = supportIconFor(card.title, i, card.icon);
            return (
              <RevealItem
                key={card.title}
                className="flex flex-col gap-5 rounded-card-sm bg-bg p-6"
              >
                {/* Same tile and icon size as the Why Us cards; solid yellow
                    with a black icon on the light background. */}
                <span className="flex size-20 items-center justify-center rounded-card-sm bg-yellow text-black">
                  <Icon size={44} className={loop} />
                </span>
                <h3 className="text-lg font-semibold text-balance text-fg">{card.title}</h3>
                <RichText content={card.description} className="max-w-support-copy text-base text-fg-muted" />
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </Section>
  );
}
