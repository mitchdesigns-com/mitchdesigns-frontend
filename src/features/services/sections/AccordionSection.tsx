import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Accordion } from "@/components/ui/Accordion";
import type { AccordionSectionProps } from "@/lib/cms/types";
import { RichText } from "@/components/ui/RichText";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion";

export function AccordionSection({
  title,
  description,
  image,
  imageAlt,
  accordion,
}: AccordionSectionProps) {
  return (
    <Section className="py-20 md:py-28">
      <div className="flex flex-col gap-12 md:flex-row md:items-start md:gap-20">
        <Reveal className="relative min-h-72 overflow-hidden rounded-card md:sticky md:top-24 md:min-h-[32rem] md:w-96 md:shrink-0">
          <Image
            src={image}
            alt={imageAlt ?? ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 384px"
          />
        </Reveal>
        <RevealStagger className="flex flex-1 flex-col gap-8" stagger={0.08} delay={0.15}>
          <RevealItem>
            <SectionHeader title={title} description={description} />
          </RevealItem>
          <RevealItem>
            <Accordion
              items={accordion.map((item) => ({
                id: item.id,
                title: item.title,
                content: <RichText content={item.content} />,
              }))}
            />
          </RevealItem>
        </RevealStagger>
      </div>
    </Section>
  );
}
