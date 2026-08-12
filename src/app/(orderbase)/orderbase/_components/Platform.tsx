import type { OrderbasePageData } from "@/lib/cms/types";
import { makeEd, type Edit } from "../_lib/edit";
import { Section, Eyebrow, SectionTitle, Lead, ObCheck } from "./ui";
import { Reveal } from "../_lib/Reveal";
import { OrbIcon } from "../_lib/OrbIcon";

export function Platform({
  data,
  edit,
}: {
  data: NonNullable<OrderbasePageData["platform"]>;
  edit?: Edit;
}) {
  const Ed = makeEd(edit);
  return (
    <Section id="platform" tone="mist">
      <div className="grid items-center gap-14 md:grid-cols-[1fr_.92fr]">
        <Reveal>
          {data.eyebrow && <Eyebrow><Ed f="platform.eyebrow">{data.eyebrow}</Ed></Eyebrow>}
          {(data.titleLead || data.titleAccent) && (
            <SectionTitle className="my-[14px] mb-[18px]">
              <Ed f="platform.titleLead">{data.titleLead}</Ed>
              {data.titleAccent && <Ed as="span" className="text-ob-red" f="platform.titleAccent">{data.titleAccent}</Ed>}
            </SectionTitle>
          )}
          {data.lead && <Lead className="mb-7"><Ed f="platform.lead">{data.lead}</Ed></Lead>}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.categories.map((cat, i) => (
              <div
                key={cat.label}
                className="flex items-center gap-4 rounded-[18px] border border-transparent bg-white/60 p-[22px] font-ob-display font-bold transition-all duration-300 hover:-translate-y-[5px] hover:border-ob-line hover:bg-white hover:shadow-ob-sm"
              >
                <OrbIcon name={cat.icon} className="size-[68px] flex-none" />
                <Ed f={`platform.categories.${i}.label`}>{cat.label}</Ed>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay="d2">
          <div className="rounded-ob bg-ob-ink p-[30px] text-white shadow-ob">
            {data.handleTitle && (
              <h4 className="mb-[18px] text-[1.15rem] text-white"><Ed f="platform.handleTitle">{data.handleTitle}</Ed></h4>
            )}
            <ul className="flex list-none flex-col gap-[13px]">
              {data.handleItems.map((item, i) => (
                <li key={item} className="flex items-center gap-[11px] text-[0.96rem] text-[#dcdce0]">
                  <span className="grid size-[22px] flex-none place-items-center rounded-full bg-ob-red">
                    <ObCheck className="size-3 text-white" />
                  </span>
                  <Ed f={`platform.handleItems.${i}.label`}>{item}</Ed>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
