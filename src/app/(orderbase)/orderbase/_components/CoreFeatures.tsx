import type { OrderbasePageData } from "@/lib/cms/types";
import { makeEd, type Edit } from "../_lib/edit";
import { Section, Eyebrow, SectionTitle } from "./ui";
import { Reveal } from "../_lib/Reveal";

export function CoreFeatures({
  data,
  edit,
}: {
  data: NonNullable<OrderbasePageData["core"]>;
  edit?: Edit;
}) {
  const Ed = makeEd(edit);
  return (
    <Section tone="dark">
      <Reveal className="mb-2 text-center">
        {data.eyebrow && (
          <Eyebrow>
            <Ed f="core.eyebrow">{data.eyebrow}</Ed>
          </Eyebrow>
        )}
        {data.title && (
          <SectionTitle className="mx-auto mt-[14px] text-white">
            <Ed f="core.title">{data.title}</Ed>
          </SectionTitle>
        )}
      </Reveal>

      <div className="mt-[46px] grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
        {data.cards.map((c, i) => (
          <Reveal key={c.num} delay={`d${(i % 3) + 1}` as "d1"}>
            <div className="h-full rounded-[18px] border border-white/[0.09] bg-white/[0.04] p-[26px] transition-all duration-300 hover:-translate-y-[6px] hover:border-ob-red/[0.45] hover:bg-ob-red/10">
              <span className="mb-[14px] block font-ob-display text-[0.85rem] font-extrabold text-ob-red-soft">
                {c.num}
              </span>
              <h4 className="mb-[7px] text-[1.06rem] text-white">
                <Ed f={`core.cards.${i}.title`}>{c.title}</Ed>
              </h4>
              {c.description && (
                <p className="text-[0.9rem] text-[#b6b6bd]">
                  <Ed f={`core.cards.${i}.description`}>{c.description}</Ed>
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
