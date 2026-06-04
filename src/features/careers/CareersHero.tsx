import { Section } from "@/components/layout/Section";
import type { CareersPageData } from "@/lib/cms/types";

type Props = NonNullable<CareersPageData["hero"]>;

export function CareersHero({
  eyebrow = "Join Our Team",
  title = "Be Part Of Our Team",
  description = "Join our team of passionate individuals dedicated to innovative web design. We embrace open communication, flat hierarchies, and empower you with full ownership of your work.",
}: Partial<Props> = {}) {
  return (
    <Section theme="dark" className="pt-25 pb-25">
      <div className="flex flex-col gap-6">
        {eyebrow && (
          <span className="text-lg font-medium text-yellow">{eyebrow}</span>
        )}
        <div className="flex items-end justify-between gap-10">
          <h1 className="text-hero-1 font-black text-fg leading-[1.1] max-w-[44%]">
            {title}
          </h1>
          {description && (
            <p className="text-xl text-fg max-w-[39%] text-balance">
              {description}
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}
