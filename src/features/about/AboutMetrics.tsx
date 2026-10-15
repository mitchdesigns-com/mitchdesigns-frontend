import { Section } from "@/components/layout/Section";
import { RevealStagger, RevealItem } from "@/components/motion";
import type { AboutContent } from "@/lib/cms/types";
import { CountUp } from "./CountUp";

/** Key numbers on a dark band: big yellow figures counting up, split by fine dividers. */
export function AboutMetrics({ metrics }: { metrics: AboutContent["metrics"] }) {
  return (
    <Section theme="dark" className="py-20 md:py-28">
      <RevealStagger className="grid grid-cols-1 divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0" stagger={0.12}>
        {metrics.map(({ value, label }) => (
          <RevealItem key={value} className="flex flex-col items-center gap-2 py-8 text-center md:py-2">
            {/* Size on a wrapper: CountUp's class merge would drop a size next to a colour. */}
            <span className="text-hero-1 font-black leading-none">
              <CountUp value={value} className="text-yellow" duration={2.4} />
            </span>
            <span className="text-lg text-fg-muted">{label.replace(/,\s*$/, "")}</span>
          </RevealItem>
        ))}
      </RevealStagger>
    </Section>
  );
}
