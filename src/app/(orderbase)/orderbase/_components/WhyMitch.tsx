import type { OrderbasePageData } from "@/lib/cms/types";
import { makeEd, type Edit } from "../_lib/edit";
import { Section, Eyebrow, SectionTitle } from "./ui";
import { Reveal } from "../_lib/Reveal";
import { Counter } from "../_lib/Counter";
import { MdLockup } from "../_lib/MdLockup";

export function WhyMitch({
  data,
  edit,
}: {
  data: NonNullable<OrderbasePageData["why"]>;
  edit?: Edit;
}) {
  const Ed = makeEd(edit);
  return (
    <Section tone="dark">
      <div className="grid items-start gap-14 md:grid-cols-[.9fr_1.1fr]">
        <Reveal>
          {data.eyebrow && (
            <Eyebrow>
              <Ed f="why.eyebrow">{data.eyebrow}</Ed>
            </Eyebrow>
          )}
          <MdLockup className="mt-[22px] block max-w-[340px]" />
          {data.lockupTag && (
            <div className="mt-3 font-ob-body text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#9a9aa2]">
              <Ed f="why.lockupTag">{data.lockupTag}</Ed>
            </div>
          )}
        </Reveal>

        <Reveal delay="d2">
          {data.title && (
            <SectionTitle className="mb-[26px] max-w-none text-white">
              <Ed f="why.title">{data.title}</Ed>
            </SectionTitle>
          )}
          <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2">
            {data.points.map((p, i) => (
              <div key={p.title} className="flex flex-col gap-2">
                <span className="font-ob-display text-[2.4rem] font-extrabold text-ob-red-soft">
                  <Counter value={p.value} suffix={p.suffix} />
                </span>
                <h4 className="text-[1rem] text-white">
                  <Ed f={`why.points.${i}.title`}>{p.title}</Ed>
                </h4>
                {p.description && (
                  <p className="text-[0.9rem] text-[#b6b6bd]">
                    <Ed f={`why.points.${i}.description`}>{p.description}</Ed>
                  </p>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {data.banner && (
        <Reveal delay="d2">
          <div className="mt-11 rounded-ob bg-gradient-to-br from-ob-red to-ob-red-dark p-[26px_32px] text-center font-ob-display text-[clamp(1.1rem,2.2vw,1.5rem)] font-extrabold text-white">
            <Ed f="why.banner">{data.banner}</Ed>
          </div>
        </Reveal>
      )}
    </Section>
  );
}
