"use client";

import { FEAT_INFO } from "../_lib/featInfo";
import { ObCheck } from "./ui";

const ROWS: Array<[keyof (typeof FEAT_INFO)[string], string]> = [
  ["w", "What it is"],
  ["b", "Benefit"],
  ["v", "Value to your brand"],
  ["s", "Specs"],
];

/**
 * A feature list item that reveals an explainer card on hover / focus / tap.
 * When `infoKey` has no matching entry it degrades to a plain labelled item.
 */
export function FeatureItem({
  label,
  infoKey,
}: {
  label: string;
  infoKey?: string;
}) {
  const info = infoKey ? FEAT_INFO[infoKey] : undefined;

  return (
    <li className="ob-finfo relative flex list-none items-start gap-[11px] break-inside-avoid border-b border-ob-line py-[11px]">
      <span className="mt-[2px] grid size-5 flex-none place-items-center rounded-full bg-ob-red/[0.12]">
        <ObCheck className="size-[11px] text-ob-red" />
      </span>
      <span
        className={`ob-finfo-label text-[0.92rem] transition-colors ${info ? "cursor-help" : ""}`}
      >
        {label}
        {info && <i className="ob-info-dot" aria-hidden="true" />}
      </span>

      {info && (
        <span
          role="tooltip"
          className="ob-pop absolute left-0 top-full z-50 mt-2 w-[min(340px,80vw)] overflow-hidden rounded-2xl border border-ob-line bg-white text-left text-ob-ink shadow-ob"
        >
          <span className="block bg-ob-ink px-4 py-3 font-ob-display text-[0.92rem] font-bold leading-tight text-white">
            {label}
          </span>
          <span className="flex flex-col gap-[10px] px-4 py-[13px]">
            {ROWS.map(([k, heading]) => (
              <span key={k} className="block">
                <span className="mb-[3px] block font-ob-display text-[0.6rem] font-bold uppercase tracking-[0.09em] text-ob-red">
                  {heading}
                </span>
                <span className="block text-[0.82rem] leading-[1.45] text-[#4a4a52]">
                  {info[k]}
                </span>
              </span>
            ))}
          </span>
        </span>
      )}
    </li>
  );
}
