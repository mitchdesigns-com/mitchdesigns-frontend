import { Section } from "@/components/layout/Section";
import { CountUp } from "@/components/ui/CountUp";
import type { NumbersSectionProps } from "@/lib/cms/types";
import { RevealStagger, RevealItem } from "@/components/motion";

export function NumbersSection({ numbers }: NumbersSectionProps) {
  return (
    <Section theme="dark" className="py-20 md:py-28">
      <RevealStagger className="grid grid-cols-2 gap-8 md:grid-cols-4" stagger={0.08}>
        {numbers.map((item) => {
          const [num, ...rest] = item.value.split(" ");
          const unit = rest.join(" ");
          return (
            <RevealItem key={item.title} className="flex flex-col gap-2">
              <span className="flex items-start gap-2 whitespace-nowrap text-fg">
                <span className="text-hero-3 font-bold md:text-hero-2">
                  <CountUp value={num} />
                </span>
                {unit && (
                  <span className="text-xl font-semibold md:text-2xl">{unit}</span>
                )}
              </span>
              <span className="text-lg font-semibold text-fg-muted">{item.title}</span>
              {item.description && (
                <p className="text-sm text-fg-muted text-balance">{item.description}</p>
              )}
            </RevealItem>
          );
        })}
      </RevealStagger>
    </Section>
  );
}
