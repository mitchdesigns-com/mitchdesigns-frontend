import type { OrderbasePageData } from "@/lib/cms/types";
import { makeEd, type Edit } from "../_lib/edit";
import { Section, Eyebrow, SectionTitle, Lead } from "./ui";
import { Reveal } from "../_lib/Reveal";
import { OrbIcon } from "../_lib/OrbIcon";

export function Opportunity({
  data,
  edit,
}: {
  data: NonNullable<OrderbasePageData["opportunity"]>;
  edit?: Edit;
}) {
  const Ed = makeEd(edit);
  return (
    <Section>
      <Reveal>
        {data.eyebrow && (
          <Eyebrow>
            <Ed f="opportunity.eyebrow">{data.eyebrow}</Ed>
          </Eyebrow>
        )}
        {data.title && (
          <SectionTitle className="my-[14px]">
            <Ed f="opportunity.title">{data.title}</Ed>
          </SectionTitle>
        )}
        {data.lead && (
          <Lead>
            <Ed f="opportunity.lead">{data.lead}</Ed>
          </Lead>
        )}
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-5">
        {data.cards.map((c, i) => (
          <Reveal key={c.title} delay={`d${(i % 4) + 1}` as "d1"}>
            <div className="group h-full rounded-[18px] border border-ob-line bg-white p-[26px_22px] transition-all duration-300 hover:-translate-y-[8px] hover:border-transparent hover:shadow-ob">
              <OrbIcon
                name={c.icon}
                className="mb-4 size-[66px] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.04]"
              />
              <h4 className="mb-[7px] text-[1rem]">
                <Ed f={`opportunity.cards.${i}.title`}>{c.title}</Ed>
              </h4>
              {c.description && (
                <p className="text-[0.88rem] text-ob-muted">
                  <Ed f={`opportunity.cards.${i}.description`}>
                    {c.description}
                  </Ed>
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
