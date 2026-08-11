import type { OrderbasePageData, OrbPricingPlan } from "@/lib/cms/types";
import { Section, Eyebrow, SectionTitle, Lead, Btn, ObCheck } from "./ui";
import { Reveal } from "../_lib/Reveal";
import { OrbIcon } from "../_lib/OrbIcon";
import { CompareTable } from "./CompareTable";

export function Pricing({
  data,
}: {
  data: NonNullable<OrderbasePageData["pricing"]>;
}) {
  return (
    <Section id="pricing">
      <Reveal className="mx-auto max-w-[52ch] text-center">
        {data.eyebrow && <Eyebrow>{data.eyebrow}</Eyebrow>}
        {data.title && (
          <SectionTitle className="mx-auto mt-[14px]">{data.title}</SectionTitle>
        )}
        {data.lead && <Lead className="mx-auto mt-4">{data.lead}</Lead>}
      </Reveal>

      {/* plan cards */}
      <div className="mt-[50px] grid grid-cols-1 gap-[18px] md:grid-cols-2 xl:grid-cols-4">
        {data.plans.map((plan, i) => (
          <Reveal key={plan.name} delay={(`d${i + 1}` as "d1")}>
            <PlanCard plan={plan} />
          </Reveal>
        ))}
      </div>

      {/* GMV examples table */}
      {data.gmv && (
        <Reveal className="mx-auto mt-[60px] max-w-[780px] text-center">
          {data.gmv.title && (
            <h3 className="text-[clamp(1.3rem,2.6vw,1.8rem)]">{data.gmv.title}</h3>
          )}
          {data.gmv.lead && <Lead className="mx-auto mt-[10px]">{data.gmv.lead}</Lead>}
          <div className="mt-5 overflow-hidden rounded-[18px] border border-ob-line shadow-ob-sm">
            <table className="w-full border-collapse bg-white text-[0.82rem] sm:text-[0.92rem]">
              <thead>
                <tr>
                  {data.gmv.columns.map((c) => (
                    <th
                      key={c}
                      className="border-b border-ob-line bg-ob-ink px-2 py-[13px] text-center font-ob-display font-bold text-white first:text-left"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.gmv.rows.map((row) => (
                  <tr key={row.cells[0]} className="even:bg-ob-mist">
                    {row.cells.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`border-b border-ob-line px-2 py-[13px] text-center last:border-b-0 first:text-left first:font-bold ${
                          ci === 2 ? "font-extrabold text-ob-red" : ""
                        } ${ci === 3 ? "font-extrabold" : ""}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.gmv.footnote && (
            <p className="mt-3 text-[0.8rem] text-ob-muted">{data.gmv.footnote}</p>
          )}
        </Reveal>
      )}

      {/* comparison matrix */}
      {data.compare && <CompareTable data={data.compare} />}
    </Section>
  );
}

function PlanCard({ plan }: { plan: OrbPricingPlan }) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-[24px] border-[1.5px] p-[30px_24px] transition-all duration-300 hover:-translate-y-[6px] hover:shadow-ob ${
        plan.featured
          ? "border-ob-red shadow-[0_30px_70px_-28px_rgba(237,46,38,0.5)]"
          : "border-ob-line"
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ob-ink px-[15px] py-[6px] font-ob-display text-[0.72rem] font-bold tracking-[0.04em] text-white">
          {plan.badge}
        </div>
      )}

      <div className="mb-[10px] grid h-[120px] place-items-center">
        <OrbIcon name={plan.icon} className="size-[104px]" />
      </div>

      <h3 className="text-[1.4rem]">{plan.name}</h3>
      {plan.tagline && (
        <div className="mb-1 font-ob-display text-[0.95rem] font-bold text-ob-red">
          {plan.tagline}
        </div>
      )}
      {plan.audience && (
        <div className="min-h-[38px] text-[0.85rem] text-ob-muted">{plan.audience}</div>
      )}

      <div className="my-[18px] border-y border-ob-line py-[18px]">
        {plan.priceRows.map((row) => (
          <div
            key={row.label}
            className="mb-[6px] flex items-baseline justify-between last:mb-0"
          >
            <span className="text-[0.82rem] text-ob-muted">{row.label}</span>
            <span
              className={`font-ob-display font-extrabold ${row.small ? "text-[1rem]" : "text-[1.18rem]"}`}
            >
              {row.value}
              {row.unit && (
                <small className="ml-1 text-[0.72rem] font-semibold text-ob-muted">
                  {row.unit}
                </small>
              )}
            </span>
          </div>
        ))}
        {plan.gmvNote && (
          <div className="mt-3 border-t border-dashed border-ob-line pt-[10px] text-[0.73rem] font-semibold leading-[1.45] text-ob-muted">
            {plan.gmvNote}
          </div>
        )}
      </div>

      <ul className="my-[6px] mb-6 flex flex-1 list-none flex-col gap-[11px]">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-[10px] text-[0.9rem]">
            <span className="mt-[2px] grid size-[19px] flex-none place-items-center rounded-full bg-ob-green/[0.14]">
              <ObCheck className="size-[11px] text-ob-green" />
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {plan.ctaLabel && (
        <Btn
          variant={plan.ctaVariant ?? "outline"}
          href={plan.ctaHref ?? "#contact"}
          className="w-full"
        >
          {plan.ctaLabel}
        </Btn>
      )}
    </div>
  );
}
