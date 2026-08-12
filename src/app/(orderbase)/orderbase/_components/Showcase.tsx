import type { OrderbasePageData } from "@/lib/cms/types";
import { makeEd, type Edit } from "../_lib/edit";
import { Section, Eyebrow, SectionTitle, Img } from "./ui";
import { Reveal } from "../_lib/Reveal";
import { OrbIcon } from "../_lib/OrbIcon";

export function Showcase({
  data,
  edit,
}: {
  data: NonNullable<OrderbasePageData["showcase"]>;
  edit?: Edit;
}) {
  const Ed = makeEd(edit);
  return (
    <Section tone="showcase">
      <div className="grid items-center gap-14 md:grid-cols-[1.55fr_1fr]">
        <Reveal className="relative min-h-[360px] md:min-h-[560px]">
          {data.image && (
            <Img
              src={data.image}
              alt={data.imageAlt ?? ""}
              className="absolute left-1/2 top-1/2 h-auto w-full max-w-none -translate-x-1/2 -translate-y-1/2 md:w-[138%]"
              style={{
                filter:
                  "drop-shadow(0 8px 18px rgba(0,0,0,.17)) drop-shadow(0 32px 32px rgba(0,0,0,.14)) drop-shadow(0 72px 43px rgba(0,0,0,.08))",
              }}
            />
          )}
        </Reveal>

        <Reveal delay="d2">
          {data.eyebrow && <Eyebrow><Ed f="showcase.eyebrow">{data.eyebrow}</Ed></Eyebrow>}
          {(data.titleLead || data.titleAccent) && (
            <SectionTitle className="my-[14px] mb-[26px]">
              <Ed f="showcase.titleLead">{data.titleLead}</Ed>
              {data.titleAccent && <Ed as="span" className="text-ob-red" f="showcase.titleAccent">{data.titleAccent}</Ed>}
            </SectionTitle>
          )}
          <div className="flex flex-col gap-[18px]">
            {data.features.map((f, i) => (
              <div key={f.title} className="group flex items-start gap-[15px]">
                <span className="grid size-[56px] flex-none place-items-center rounded-[13px] border border-ob-line bg-white text-ob-red transition-transform duration-300 group-hover:-rotate-6">
                  <OrbIcon name={f.icon} className="size-[38px]" />
                </span>
                <div>
                  <h4 className="mb-[3px] text-[1.02rem]"><Ed f={`showcase.features.${i}.title`}>{f.title}</Ed></h4>
                  {f.description && (
                    <p className="text-[0.9rem] text-ob-muted"><Ed f={`showcase.features.${i}.description`}>{f.description}</Ed></p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
