import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion";
import { Eyebrow } from "@/features/about/Eyebrow";
import type { ContactPageData } from "@/lib/cms/types";
import { noOrphan } from "@/lib/noOrphan";

/** Dark page hero, the same shape as the Careers hero. Above the fold, so it
 *  plays on mount rather than waiting for a scroll. */
export function ContactHero({ eyebrow, title, description }: ContactPageData["hero"]) {
  return (
    <Section theme="dark" className="pb-20 pt-36 md:pb-25 md:pt-44">
      <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
        {eyebrow && <Eyebrow immediate>{eyebrow}</Eyebrow>}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
          <Reveal immediate delay={0.1} className="md:max-w-1/2">
            <h1 className="text-hero-3 font-black leading-tight text-fg text-balance md:text-hero-1">
              {noOrphan(title)}
            </h1>
          </Reveal>
          {description && (
            <Reveal immediate delay={0.25} className="md:max-w-2/5">
              <p className="text-xl text-fg text-balance">{noOrphan(description)}</p>
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  );
}
