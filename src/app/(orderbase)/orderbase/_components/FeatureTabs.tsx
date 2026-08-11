"use client";

import { useState } from "react";
import type { OrderbasePageData } from "@/lib/cms/types";
import { Section, Eyebrow, SectionTitle, Lead } from "./ui";
import { Reveal } from "../_lib/Reveal";
import { FeatureItem } from "./FeatureInfo";

export function FeatureTabs({
  data,
}: {
  data: NonNullable<OrderbasePageData["featureTabs"]>;
}) {
  const [active, setActive] = useState(data.tabs[0]?.id);
  const panel = data.tabs.find((t) => t.id === active) ?? data.tabs[0];

  return (
    <Section id="features">
      <Reveal>
        {data.eyebrow && <Eyebrow>{data.eyebrow}</Eyebrow>}
        {data.title && <SectionTitle className="mt-[14px]">{data.title}</SectionTitle>}
        {data.lead && <Lead className="mt-2">{data.lead}</Lead>}
      </Reveal>

      <Reveal delay="d1">
        <div className="my-[38px] flex flex-wrap gap-[10px]">
          {data.tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={`rounded-full px-5 py-[0.7em] font-ob-display text-[0.92rem] font-bold transition-all duration-200 ${
                active === t.id
                  ? "bg-ob-ink text-white"
                  : "bg-ob-mist text-ob-ink hover:bg-ob-mist-2"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal delay="d2">
        <ul
          key={panel?.id}
          className="ob-fade grid grid-cols-1 gap-x-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {panel?.items.map((it) => (
            <FeatureItem key={it.label} label={it.label} infoKey={it.infoKey} />
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
