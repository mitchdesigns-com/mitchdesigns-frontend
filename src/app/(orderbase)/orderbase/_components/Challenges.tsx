import type { OrderbasePageData } from "@/lib/cms/types";
import { makeEd, type Edit } from "../_lib/edit";
import { Section, Eyebrow, SectionTitle, Img } from "./ui";
import { Reveal } from "../_lib/Reveal";

export function Challenges({
  data,
  edit,
}: {
  data: NonNullable<OrderbasePageData["challenges"]>;
  edit?: Edit;
}) {
  const Ed = makeEd(edit);
  return (
    <Section id="challenges" tone="dark">
      <div className="grid items-center gap-14 md:grid-cols-[1.1fr_1fr]">
        <Reveal>
          {data.eyebrow && (
            <Eyebrow>
              <Ed f="challenges.eyebrow">{data.eyebrow}</Ed>
            </Eyebrow>
          )}
          {data.title && (
            <SectionTitle className="my-[14px] mb-5 text-white">
              <Ed f="challenges.title">{data.title}</Ed>
            </SectionTitle>
          )}
          <div className="flex flex-col gap-[10px]">
            {data.items.map((it, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-[16px] border border-white/[0.08] bg-white/[0.045] p-[18px_20px] transition-all duration-300 hover:translate-x-[6px] hover:border-ob-red/40 hover:bg-ob-red/[0.12]"
              >
                <span className="grid size-[30px] flex-none place-items-center rounded-[9px] bg-ob-red/[0.18] font-ob-display font-extrabold text-ob-red-soft">
                  {i + 1}
                </span>
                <p className="text-[0.98rem] text-[#d4d4d9]">
                  <Ed f={`challenges.items.${i}.text`}>{it.text}</Ed>
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {data.image && (
          <Reveal delay="d2">
            <Img
              src={data.image}
              alt={data.imageAlt ?? ""}
              className="max-h-[520px] w-full object-contain"
            />
          </Reveal>
        )}
      </div>
    </Section>
  );
}
