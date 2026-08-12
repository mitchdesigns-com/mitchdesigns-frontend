import type { OrderbasePageData } from "@/lib/cms/types";
import { makeEd, type Edit } from "../_lib/edit";
import { Section, Eyebrow, SectionTitle } from "./ui";
import { Reveal } from "../_lib/Reveal";
import { OrbIcon } from "../_lib/OrbIcon";

export function Integrations({
  data,
  edit,
}: {
  data: NonNullable<OrderbasePageData["integrations"]>;
  edit?: Edit;
}) {
  const Ed = makeEd(edit);
  return (
    <Section id="integrations" tone="mist">
      <Reveal>
        {data.eyebrow && (
          <Eyebrow>
            <Ed f="integrations.eyebrow">{data.eyebrow}</Ed>
          </Eyebrow>
        )}
        {data.title && (
          <SectionTitle className="my-[14px] mb-[10px]">
            <Ed f="integrations.title">{data.title}</Ed>
          </SectionTitle>
        )}
      </Reveal>

      <div className="mt-11 grid grid-cols-1 gap-5 md:grid-cols-3">
        {data.cards.map((c, i) => (
          <Reveal key={c.title} delay={`d${i + 1}` as "d1"}>
            <div className="relative h-full overflow-hidden rounded-ob border border-ob-line bg-white p-[32px_28px] transition-all duration-300 hover:-translate-y-[6px] hover:border-transparent hover:shadow-ob">
              <span className="absolute right-[22px] top-[14px] font-ob-display text-[2.6rem] font-extrabold leading-none text-ob-mist-2">
                {c.num}
              </span>
              <OrbIcon name={c.icon} className="mb-[18px] size-[72px]" />
              <h4 className="mb-[9px] text-[1.12rem]">
                <Ed f={`integrations.cards.${i}.title`}>{c.title}</Ed>
              </h4>
              {c.description && (
                <p className="text-[0.92rem] text-ob-muted">
                  <Ed f={`integrations.cards.${i}.description`}>
                    {c.description}
                  </Ed>
                </p>
              )}
              {c.chips.length > 0 && (
                <div className="mt-[14px] flex flex-wrap gap-[7px]">
                  {c.chips.map((chip, j) => (
                    <span
                      key={chip}
                      className="rounded-[7px] bg-ob-mist px-[10px] py-[5px] text-[0.72rem] font-semibold text-[#555]"
                    >
                      <Ed f={`integrations.cards.${i}.chips.${j}.label`}>
                        {chip}
                      </Ed>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
