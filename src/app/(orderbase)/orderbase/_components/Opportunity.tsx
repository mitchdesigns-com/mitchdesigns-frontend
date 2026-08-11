import type { OrderbasePageData } from "@/lib/cms/types";
import { Section, Eyebrow, SectionTitle, Lead } from "./ui";
import { Reveal } from "../_lib/Reveal";
import { OrbIcon } from "../_lib/OrbIcon";

export function Opportunity({
  data,
}: {
  data: NonNullable<OrderbasePageData["opportunity"]>;
}) {
  return (
    <Section>
      <Reveal>
        {data.eyebrow && <Eyebrow>{data.eyebrow}</Eyebrow>}
        {data.title && (
          <SectionTitle className="my-[14px]">{data.title}</SectionTitle>
        )}
        {data.lead && <Lead>{data.lead}</Lead>}
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-5">
        {data.cards.map((c, i) => (
          <Reveal key={c.title} delay={`d${(i % 4) + 1}` as "d1"}>
            <div className="group h-full rounded-[18px] border border-ob-line bg-white p-[26px_22px] transition-all duration-300 hover:-translate-y-[8px] hover:border-transparent hover:shadow-ob">
              <OrbIcon
                name={c.icon}
                className="mb-4 size-[66px] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.04]"
              />
              <h4 className="mb-[7px] text-[1rem]">{c.title}</h4>
              {c.description && (
                <p className="text-[0.88rem] text-ob-muted">{c.description}</p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
