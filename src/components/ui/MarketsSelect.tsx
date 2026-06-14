"use client";

import { cn } from "@/lib/cn";
import { ChevronDown } from "@/components/icons/ChevronDown";

/** Countries offered as served-markets. value → { label, flag } */
const MARKETS = [
  { value: "egypt", flag: "🇪🇬", label: "Egypt" },
  { value: "saudi-arabia", flag: "🇸🇦", label: "Saudi Arabia" },
  { value: "uae", flag: "🇦🇪", label: "UAE" },
  { value: "kuwait", flag: "🇰🇼", label: "Kuwait" },
  { value: "qatar", flag: "🇶🇦", label: "Qatar" },
  { value: "bahrain", flag: "🇧🇭", label: "Bahrain" },
  { value: "oman", flag: "🇴🇲", label: "Oman" },
  { value: "jordan", flag: "🇯🇴", label: "Jordan" },
  { value: "lebanon", flag: "🇱🇧", label: "Lebanon" },
  { value: "morocco", flag: "🇲🇦", label: "Morocco" },
  { value: "tunisia", flag: "🇹🇳", label: "Tunisia" },
  { value: "algeria", flag: "🇩🇿", label: "Algeria" },
  { value: "iraq", flag: "🇮🇶", label: "Iraq" },
  { value: "uk", flag: "🇬🇧", label: "United Kingdom" },
  { value: "us", flag: "🇺🇸", label: "United States" },
  { value: "germany", flag: "🇩🇪", label: "Germany" },
  { value: "france", flag: "🇫🇷", label: "France" },
  { value: "canada", flag: "🇨🇦", label: "Canada" },
  { value: "australia", flag: "🇦🇺", label: "Australia" },
  { value: "other", flag: "🌍", label: "Other" },
] as const;

const byValue = (v: string) => MARKETS.find((m) => m.value === v);

type Props = {
  id?: string;
  value: readonly string[];
  onChange: (value: readonly string[]) => void;
  invalid?: boolean;
  className?: string;
};

export function MarketsSelect({ id, value, onChange, invalid, className }: Props) {
  const selected = value ?? [];
  const available = MARKETS.filter((m) => !selected.includes(m.value));

  function add(next: string) {
    if (!next || selected.includes(next)) return;
    onChange([...selected, next]);
  }

  function remove(target: string) {
    onChange(selected.filter((v) => v !== target));
  }

  return (
    <div
      className={cn(
        "flex min-h-11 w-full flex-wrap items-center gap-2 rounded border border-grey-200 bg-bg px-3 py-2",
        invalid && "border-orderbase-red",
        className,
      )}
    >
      {selected.map((v) => {
        const market = byValue(v);
        return (
          <span
            key={v}
            className="inline-flex items-center gap-1.5 rounded bg-panel px-2 py-1 text-sm font-medium text-black"
          >
            <span aria-hidden>{market?.flag ?? "🌍"}</span>
            {market?.label ?? v}
            <button
              type="button"
              aria-label={`Remove ${market?.label ?? v}`}
              onClick={() => remove(v)}
              className="ml-0.5 text-fg-muted transition-colors hover:text-black"
            >
              ✕
            </button>
          </span>
        );
      })}

      {/* Add-a-market control: a visual chevron over a native select */}
      <div className="relative flex-1">
        <div className="pointer-events-none flex items-center justify-between gap-1 text-base text-fg-muted whitespace-nowrap">
          <span>{selected.length ? "Add another…" : "Select markets…"}</span>
          <ChevronDown size={16} />
        </div>
        <select
          id={id}
          value=""
          onChange={(e) => add(e.target.value)}
          className="absolute inset-0 h-full w-full opacity-0"
          aria-label="Add a market"
        >
          <option value="" disabled>
            Select a market
          </option>
          {available.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
