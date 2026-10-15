import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CardSlider } from "@/components/ui/CardSlider";
import { RevealItem } from "@/components/motion";
import { TiltGrid } from "@/components/ui/TiltGrid";
import { GlowCard } from "@/components/ui/GlowCard";
import type { WhyUsSectionProps } from "@/lib/cms/types";
import { RichText } from "@/components/ui/RichText";
import { Logo } from "@/components/icons/Logo";
import { whyLineIconFor } from "./whyLineIcons";

export function WhyUsSection({
  title,
  description,
  cards,
  variant = "grid",
}: WhyUsSectionProps) {
  const cardEls = cards.map((card, i) => {
    // Flat outline icon picked from the title, with its own looping motion
    // (the CMS image isn't shown).
    const { Icon, loop } = whyLineIconFor(card.title, i);
    return (
      <RevealItem key={card.title} className="h-full transform-3d">
        <GlowCard className="gap-6 p-5">
          <span className="flex size-20 items-center justify-center rounded-card-sm bg-yellow/10 text-yellow ring-1 ring-yellow/25">
            <Icon size={44} className={loop} />
          </span>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-normal text-balance text-white">
              {card.title}
            </h3>
            <RichText
              content={card.description}
              className="text-base font-medium text-grey-500"
            />
          </div>
        </GlowCard>
      </RevealItem>
    );
  });

  return (
    <Section theme="dark" className="py-20 md:py-28">
      <div className="space-y-12">
        <SectionHeader
          icon={<Logo />}
          title={title}
          description={description}
          align="center"
        />
        {variant === "slider" ? (
          <CardSlider scrollStep={288 + 16}>
            {cards.map((card) => (
              <div
                key={card.title}
                className="flex h-full w-72 flex-col gap-4 rounded-card bg-space-grey p-6"
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
                <RichText
                  content={card.description}
                  className="text-base text-fg-muted"
                />
              </div>
            ))}
          </CardSlider>
        ) : (
          <TiltGrid
            className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${cards.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}
          >
            {cardEls}
          </TiltGrid>
        )}
      </div>
    </Section>
  );
}
