import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CardSlider } from "@/components/ui/CardSlider";
import { RevealStagger, RevealItem } from "@/components/motion";
import type { WhyUsSectionProps } from "@/lib/cms/types";
import { RichText } from "@/components/ui/RichText";
import { Logo } from "@/components/icons/Logo";

export function WhyUsSection({
  title,
  description,
  cards,
  variant = "grid",
}: WhyUsSectionProps) {
  const cardEls = cards.map((card) => (
    <RevealItem key={card.title} className="flex h-full flex-col gap-6 rounded-card bg-space-grey p-5">
      <div className="relative aspect-card-media overflow-hidden rounded-card-sm">
        <Image
          src={card.image}
          alt={card.imageAlt ?? ""}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-normal text-white">{card.title}</h3>
        <RichText content={card.description} className="text-base font-medium text-grey-500" />
      </div>
    </RevealItem>
  ));

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
                <RichText content={card.description} className="text-base text-fg-muted" />
              </div>
            ))}
          </CardSlider>
        ) : (
          <RevealStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
            {cardEls}
          </RevealStagger>
        )}
      </div>
    </Section>
  );
}
