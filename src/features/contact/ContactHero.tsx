import { Reveal } from "@/components/motion";
import { Eyebrow } from "@/features/about/Eyebrow";
import type { ContactPageData } from "@/lib/cms/types";
import { noOrphan } from "@/lib/noOrphan";

/** Hero copy for the left column of the contact page's top section. Above
 *  the fold, so it plays on mount rather than waiting for a scroll. */
export function ContactHero({ eyebrow, title, description }: ContactPageData["hero"]) {
  return (
    <div className="flex flex-col gap-6">
      {eyebrow && <Eyebrow immediate>{eyebrow}</Eyebrow>}
      <Reveal immediate delay={0.1}>
        <h1 className="text-hero-3 font-black leading-tight text-fg text-balance md:text-hero-1">
          {noOrphan(title)}
        </h1>
      </Reveal>
      {description && (
        <Reveal immediate delay={0.25}>
          <p className="text-xl text-fg text-balance">{noOrphan(description)}</p>
        </Reveal>
      )}
    </div>
  );
}
