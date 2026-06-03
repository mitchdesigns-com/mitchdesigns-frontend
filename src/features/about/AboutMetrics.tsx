import { Section } from "@/components/layout/Section";
import { RevealStagger, RevealItem } from "@/components/motion";

const METRICS = [
  { value: "20+", label: "Years of experience," },
  { value: "400+", label: "Projects Delivered" },
  { value: "30+", label: "Dedicated Experts" },
] as const;

export function AboutMetrics() {
  return (
    <Section className="py-15">
      <RevealStagger className="flex items-center justify-center gap-25" stagger={0.1}>
        {METRICS.map(({ value, label }) => (
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
