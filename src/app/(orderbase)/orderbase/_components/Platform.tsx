import type { OrderbasePageData } from "@/lib/cms/types";
import { Section, Eyebrow, SectionTitle, Lead, ObCheck } from "./ui";
import { Reveal } from "../_lib/Reveal";
import { OrbIcon } from "../_lib/OrbIcon";

export function Platform({
  data,
}: {
  data: NonNullable<OrderbasePageData["platform"]>;
}) {
  return (
    <Section id="platform" tone="mist">
      <div className="grid items-center gap-14 md:grid-cols-[1fr_.92fr]">
        <Reveal>
          {data.eyebrow && <Eyebrow>{data.eyebrow}</Eyebrow>}
          {(data.titleLead || data.titleAccent) && (
            <SectionTitle className="my-[14px] mb-[18px]">
              {data.titleLead}
              {data.titleAccent && <span className="text-ob-red">{data.titleAccent}</span>}
            </SectionTitle>
          )}
          {data.lead && <Lead className="mb-7">{data.lead}</Lead>}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.categories.map((cat) => (
              <div
                key={cat.label}
                className="flex items-center gap-4 rounded-[18px] border border-transparent bg-white/60 p-[22px] font-ob-display font-bold transition-all duration-300 hover:-translate-y-[5px] hover:border-ob-line hover:bg-white hover:shadow-ob-sm"
              >
                <OrbIcon name={cat.icon} className="size-[68px] flex-none" />
                {cat.label}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay="d2">
          <div className="rounded-ob bg-ob-ink p-[30px] text-white shadow-ob">
            {data.handleTitle && (
              <h4 className="mb-[18px] text-[1.15rem] text-white">{data.handleTitle}</h4>
            )}
            <ul className="flex list-none flex-col gap-[13px]">
              {data.handleItems.map((item) => (
                <li key={item} className="flex items-center gap-[11px] text-[0.96rem] text-[#dcdce0]">
                  <span className="grid size-[22px] flex-none place-items-center rounded-full bg-ob-red">
                    <ObCheck className="size-3 text-white" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
