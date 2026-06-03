import { Section } from "@/components/layout/Section";
import { CountUp } from "@/components/ui/CountUp";
import type { NumbersSectionProps } from "@/lib/cms/types";
import { RevealStagger, RevealItem } from "@/components/motion";

export function NumbersSection({ numbers }: NumbersSectionProps) {
  return (
    <Section theme="dark" className="py-20 md:py-28">
      <RevealStagger className="grid grid-cols-2 gap-8 md:grid-cols-4" stagger={0.08}>
        {numbers.map((item) => (
          <RevealItem key={item.title} className="flex flex-col gap-2">
            <span className="text-hero-3 font-bold text-fg md:text-hero-2">
              <CountUp value={item.value} />
            </span>
            <span className="text-lg font-semibold text-fg">{item.title}</span>
            {item.description && (
              <p className="text-sm text-fg-muted text-balance">{item.description}</p>
            )}
          </RevealItem>
        ))}
      </RevealStagger>
    </Section>
  );
}
