import type { OrderbasePageData } from "@/lib/cms/types";
import { makeEd, type Edit } from "../_lib/edit";
import { Section, Eyebrow, SectionTitle, Lead, Img } from "./ui";
import { Reveal } from "../_lib/Reveal";
import { OrbIcon } from "../_lib/OrbIcon";

const SLOT: Record<string, string> = {
  phone:
    "z-[1] w-[60%] max-w-[230px] left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 md:w-[74%] md:max-w-[340px] md:left-[42%] md:top-1/2",
  credit:
    "z-[3] w-[66%] max-w-[240px] top-0 right-0 md:w-[72%] md:max-w-[330px] md:-top-[40px] md:-right-[70px]",
  wallet:
    "z-[4] w-[62%] max-w-[215px] top-[63%] left-0 md:w-[64%] md:max-w-[290px] md:top-[47%] md:-left-[40px]",
};

export function Payments({
  data,
  edit,
}: {
  data: NonNullable<OrderbasePageData["payments"]>;
  edit?: Edit;
}) {
  const Ed = makeEd(edit);
  return (
    <Section id="payments">
      <div className="grid items-center gap-14 md:grid-cols-[1.1fr_.9fr]">
        <Reveal className="order-2 md:order-1">
          {data.eyebrow && <Eyebrow><Ed f="payments.eyebrow">{data.eyebrow}</Ed></Eyebrow>}
          {data.title && (
            <SectionTitle className="my-[14px] mb-4"><Ed f="payments.title">{data.title}</Ed></SectionTitle>
          )}
          {data.lead && <Lead className="mb-[6px]"><Ed f="payments.lead">{data.lead}</Ed></Lead>}

          <div className="mt-[30px] flex flex-col gap-[22px]">
            {data.features.map((f, i) => (
              <div key={f.title} className="group flex items-start gap-4">
                <OrbIcon
                  name={f.icon}
                  className="size-[56px] flex-none transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.05]"
                />
                <div>
                  <h4 className="mb-[3px] text-[1.05rem]"><Ed f={`payments.features.${i}.title`}>{f.title}</Ed></h4>
                  {f.description && (
                    <p className="text-[0.9rem] text-ob-muted"><Ed f={`payments.features.${i}.description`}>{f.description}</Ed></p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal
          delay="d2"
          className="relative order-1 mx-auto min-h-[470px] w-[min(420px,100%)] justify-self-center md:order-2 md:min-h-[640px] md:w-auto"
        >
          {data.images.map((img) => (
            <Img
              key={img.slot}
              src={img.src}
              alt={img.alt ?? ""}
              loading="lazy"
              className={`pointer-events-none absolute h-auto select-none ${SLOT[img.slot] ?? SLOT.phone}`}
            />
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
