"use client";

import { useState } from "react";
import type { OrderbasePageData } from "@/lib/cms/types";
import { FEAT_INFO } from "../_lib/featInfo";
import { ObCheck } from "./ui";

type Compare = NonNullable<NonNullable<OrderbasePageData["pricing"]>["compare"]>;

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string")
    return <span className="font-ob-display text-[0.86rem] font-bold">{value}</span>;
  if (value)
    return (
      <span className="grid size-6 place-items-center rounded-full bg-ob-green/[0.14]">
        <ObCheck className="size-[13px] text-ob-green" />
      </span>
    );
  return <span className="h-[2px] w-[22px] rounded bg-[#cfcfd4]" />;
}

export function CompareTable({ data }: { data: Compare }) {
  const cols = data.columns;
  const [sel, setSel] = useState(cols[0]?.id);

  // per-cell visibility: on phones show only the selected data column; ≥sm show all
  const cellVis = (id: string) => (id === sel ? "flex" : "hidden") + " sm:flex";
  const rowGrid =
    "grid grid-cols-[1.4fr_1fr] sm:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]";

  return (
    <div>
      {data.title && (
        <div className="mt-[74px] text-center">
          <h3 className="text-[clamp(1.5rem,3vw,2rem)]">{data.title}</h3>
        </div>
      )}

      {/* mobile column picker */}
      <div className="mt-6 flex flex-wrap justify-center gap-2 sm:hidden">
        {cols.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSel(c.id)}
            className={`rounded-full border-[1.5px] px-[1.1em] py-[0.6em] font-ob-display text-[0.82rem] font-bold ${
              sel === c.id
                ? "border-ob-ink bg-ob-ink text-white"
                : "border-ob-line bg-white text-ob-ink"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-[24px] border border-ob-line shadow-ob-sm sm:mt-16">
        {/* header */}
        <div className={`${rowGrid} bg-ob-ink text-white`}>
          <div className="p-[18px]" />
          {cols.map((c) => (
            <div
              key={c.id}
              className={`${cellVis(c.id)} flex-col items-center gap-[2px] border-l border-white/10 p-[18px] text-center ${
                c.featured ? "bg-ob-red" : ""
              }`}
            >
              <b className="font-ob-display text-[1.05rem]">{c.name}</b>
              {c.tagline && (
                <span
                  className={`text-[0.74rem] ${c.featured ? "text-[#ffd9d6]" : "text-[#a9a9b2]"}`}
                >
                  {c.tagline}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* groups */}
        {data.groups.map((g) => (
          <div key={g.name}>
            <div className="border-t-2 border-ob-red bg-ob-mist-2 px-[18px] py-3 font-ob-display text-[0.66rem] font-extrabold uppercase tracking-[0.13em] text-ob-ink">
              {g.name}
            </div>
            {g.rows.map((r) => {
              const info = r.key ? FEAT_INFO[r.key] : undefined;
              return (
                <div
                  key={r.label}
                  className={`${rowGrid} border-t border-ob-line transition-colors hover:bg-ob-mist`}
                >
                  <div
                    className="flex items-center border-l-0 p-[13px] text-left text-[0.9rem] font-semibold"
                    title={info?.w}
                  >
                    {r.label}
                    {info && <i className="ob-info-dot" aria-hidden="true" />}
                  </div>
                  {cols.map((c, i) => (
                    <div
                      key={c.id}
                      className={`${cellVis(c.id)} items-center justify-center border-l border-ob-line p-[13px] ${
                        c.featured ? "bg-ob-red/[0.04]" : ""
                      }`}
                    >
                      <Cell value={r.values[i]} />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {data.footnote && (
        <p className="mt-[18px] text-center text-[0.84rem] text-ob-muted">
          {data.footnote}
        </p>
      )}
    </div>
  );
}
