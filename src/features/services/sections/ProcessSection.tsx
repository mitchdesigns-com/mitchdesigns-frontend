import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealStagger, RevealItem } from "@/components/motion";
import type { ProcessSectionProps } from "@/lib/cms/types";

export function ProcessSection({
  title,
  description,
  processCards,
}: ProcessSectionProps) {
  return (
    <Section className="py-20 md:py-28">
      <div className="space-y-16">
        <SectionHeader title={title} description={description} />
        <RevealStagger as="ol" className="space-y-16" stagger={0.1}>
          {processCards.map((step, i) => (
            <RevealItem
              as="li"
              key={step.stepNumber}
              className={`flex flex-col gap-10 md:flex-row md:items-start md:gap-16 ${
                i % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="relative min-h-64 flex-1 overflow-hidden rounded-card md:min-h-80">
                <Image
                  src={step.image}
                  alt={step.imageAlt ?? ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4">
                <span className="text-sm font-medium uppercase tracking-[0.18em] text-fg-muted">
                  Step {step.stepNumber < 10 ? `0${step.stepNumber}` : step.stepNumber}
                </span>
                <h3 className="text-hero-5 font-bold">{step.title}</h3>
                <ul className="space-y-3 pt-2">
                  {step.description.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-base text-fg-muted">
                      <span
                        aria-hidden
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span className="text-balance">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </Section>
  );
}
