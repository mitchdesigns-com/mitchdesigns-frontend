import type { OrderbasePageData } from "@/lib/cms/types";
import { Section, Eyebrow, SectionTitle } from "./ui";
import { Reveal } from "../_lib/Reveal";
import { Counter } from "../_lib/Counter";
import { MdLockup } from "../_lib/MdLockup";

export function WhyMitch({
  data,
}: {
  data: NonNullable<OrderbasePageData["why"]>;
}) {
  return (
    <Section tone="dark">
      <div className="grid items-start gap-14 md:grid-cols-[.9fr_1.1fr]">
        <Reveal>
          {data.eyebrow && <Eyebrow>{data.eyebrow}</Eyebrow>}
          <MdLockup className="mt-[22px] block max-w-[340px]" />
          {data.lockupTag && (
            <div className="mt-3 font-ob-body text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#9a9aa2]">
              {data.lockupTag}
            </div>
          )}
        </Reveal>

        <Reveal delay="d2">
          {data.title && (
            <SectionTitle className="mb-[26px] max-w-none text-white">
              {data.title}
            </SectionTitle>
          )}
          <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2">
            {data.points.map((p) => (
              <div key={p.title} className="flex flex-col gap-2">
                <span className="font-ob-display text-[2.4rem] font-extrabold text-ob-red-soft">
                  <Counter value={p.value} suffix={p.suffix} />
                </span>
                <h4 className="text-[1rem] text-white">{p.title}</h4>
                {p.description && (
                  <p className="text-[0.9rem] text-[#b6b6bd]">{p.description}</p>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {data.banner && (
        <Reveal delay="d2">
          <div className="mt-11 rounded-ob bg-gradient-to-br from-ob-red to-ob-red-dark p-[26px_32px] text-center font-ob-display text-[clamp(1.1rem,2.2vw,1.5rem)] font-extrabold text-white">
            {data.banner}
          </div>
        </Reveal>
      )}
    </Section>
  );
}
