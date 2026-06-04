import { Section } from "@/components/layout/Section";
import { RevealStagger, RevealItem } from "@/components/motion";
import type { AboutContent } from "@/lib/cms/types";

export function AboutMetrics({
  metrics,
}: {
  metrics: AboutContent["metrics"];
}) {
  return (
    <Section className="py-15">
      <RevealStagger className="flex items-center justify-center gap-25" stagger={0.1}>
        {metrics.map(({ value, label }) => (
          <RevealItem key={value} className="flex flex-col items-start">
            <span className="text-hero-2 font-bold leading-[72px] text-black">
              {value}
            </span>
            <span className="text-sm text-fg-muted">{label}</span>
          </RevealItem>
        ))}
      </RevealStagger>
    </Section>
  );
}
