import type { OrderbasePageData } from "@/lib/cms/types";
import { makeEd, type Edit } from "../_lib/edit";
import { Section, Eyebrow, SectionTitle, Lead } from "./ui";
import { Reveal } from "../_lib/Reveal";

export function Audience({
  data,
  edit,
}: {
  data: NonNullable<OrderbasePageData["audience"]>;
  edit?: Edit;
}) {
  const Ed = makeEd(edit);
  return (
    <Section>
      <Reveal className="mb-[50px] text-center">
        {data.eyebrow && (
          <Eyebrow>
            <Ed f="audience.eyebrow">{data.eyebrow}</Ed>
          </Eyebrow>
        )}
        {data.title && (
          <SectionTitle className="mx-auto mt-[14px]">
            <Ed f="audience.title">{data.title}</Ed>
          </SectionTitle>
        )}
        {data.lead && (
          <Lead className="mx-auto mt-4">
            <Ed f="audience.lead">{data.lead}</Ed>
          </Lead>
        )}
      </Reveal>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {data.cards.map((c, i) => (
          <Reveal key={c.num} delay={`d${i + 1}` as "d1"}>
            <div className="group h-full rounded-ob border border-transparent bg-ob-mist p-[28px_24px] transition-all duration-300 hover:-translate-y-[6px] hover:border-ob-line hover:bg-white hover:shadow-ob-sm">
              <div className="mb-4 grid size-[42px] place-items-center rounded-[12px] bg-white font-ob-display text-[0.9rem] font-extrabold text-ob-red shadow-ob-sm transition-colors group-hover:bg-ob-red group-hover:text-white">
                {c.num}
              </div>
              <h4 className="text-[1.06rem]">
                <Ed f={`audience.cards.${i}.title`}>{c.title}</Ed>
              </h4>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
