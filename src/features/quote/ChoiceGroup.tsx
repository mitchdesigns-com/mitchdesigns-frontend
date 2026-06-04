"use client";

import { cn } from "@/lib/cn";
import type { QuoteFieldKey, QuoteFormValue, QuoteStepOption } from "@/lib/quote/schema";

type Props = {
  name: QuoteFieldKey;
  options: readonly QuoteStepOption[];
  value: QuoteFormValue | undefined;
  error?: string;
  variant: "radio" | "completion-choice";
  compact?: boolean;
  onChange: (value: string) => void;
};

export function ChoiceGroup({
  name,
  options,
  value,
  error,
  variant,
  compact = false,
  onChange,
}: Props) {
  const currentValue = typeof value === "string" ? value : "";
  const isCompletion = variant === "completion-choice";

  return (
    <div>
      <div className={cn(isCompletion ? "grid gap-3 md:grid-cols-2" : "space-y-2")}>
        {options.map((option) => {
          const checked = currentValue === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "relative flex items-center gap-2 rounded px-4 py-3 text-base font-medium transition-colors cursor-pointer",
                isCompletion && "min-h-[120px] flex-col justify-center gap-3 text-center rounded-card-sm",
                compact && "py-2",
                checked ? "bg-black text-white" : "bg-panel text-black",
              )}
            >
              {option.recommended ? (
                <span className="absolute -top-5 left-3 rotate-[-8deg] rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-fg">
                  Recommended
                </span>
              ) : null}

              {/* Custom radio indicator */}
              <span
                className={cn(
                  "shrink-0 rounded-full border-2 flex items-center justify-center",
                  isCompletion ? "hidden" : "size-5",
                  checked ? "border-yellow bg-yellow" : "border-grey-500 bg-transparent",
                )}
              >
                {checked && (
                  <span className="size-2 rounded-full bg-black" />
                )}
              </span>

              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />

              <span>{option.label}</span>
              {isCompletion && option.description ? (
                <span
                  className={cn(
                    "text-sm font-normal text-balance",
                    checked ? "text-white/80" : "text-fg-muted",
                  )}
                >
                  {option.description}
                </span>
              ) : null}
            </label>
          );
        })}
      </div>
      {error ? <p className="mt-2 text-sm text-orderbase-red">{error}</p> : null}
    </div>
  );
}
