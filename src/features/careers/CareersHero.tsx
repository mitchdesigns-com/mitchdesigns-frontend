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
      <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
        {eyebrow && (
          <span className="text-lg font-medium text-yellow">{eyebrow}</span>
        )}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
          <h1 className="text-hero-3 font-black text-fg leading-[1.1] max-w-full md:text-hero-1 md:max-w-[44%]">
            {title}
          </h1>
          {description && (
            <p className="text-xl text-fg max-w-full text-balance md:max-w-[39%]">
              {description}
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}
