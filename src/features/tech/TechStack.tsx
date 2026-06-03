import type { CSSProperties } from "react";
import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion";
import type { TechItem } from "@/lib/cms/types";

type TechStackProps = {
  items: Array<TechItem & { id: number }>;
  title: string;
  description?: string;
  /** Phrase(s) within `title` to underline in yellow; newline/comma separated. */
  highlight?: string;
};

function formatCategory(category: string): string {
  return category
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Yellow highlighter behind the lower portion of the text; clones across wrapped
// lines so multi-word phrases keep the bar on every line they break onto.
const MARK_STYLE: CSSProperties = {
  background: "none",
  backgroundImage:
    "linear-gradient(to top, var(--color-yellow) 0.35em, transparent 0.35em)",
  boxDecorationBreak: "clone",
  WebkitBoxDecorationBreak: "clone",
};

function HighlightedTitle({
  title,
  highlight,
}: {
  title: string;
  highlight?: string;
}) {
  const phrases = (highlight ?? "")
    .split(/[\n,]+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (!phrases.length) return <>{title}</>;

  const escaped = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  const lookup = new Set(phrases.map((p) => p.toLowerCase()));

  return (
    <>
      {title.split(re).map((part, i) =>
        lookup.has(part.toLowerCase()) ? (
          <mark key={i} className="text-inherit" style={MARK_STYLE}>
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function TechStack({
  items,
  title,
  description,
  highlight,
}: TechStackProps) {
  return (
    <Section className="py-20">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        {/* Left: heading + description */}
        <Reveal className="flex flex-col gap-4 lg:max-w-[415px] lg:shrink-0">
          <h2 className="text-center text-[1.5rem] font-bold leading-[1.3] text-space-grey lg:text-left lg:text-hero-4 lg:leading-[110%]">
            <HighlightedTitle title={title} highlight={highlight} />
          </h2>
          {description && (
            <p className="text-xl leading-[130%] text-fg-muted text-balance">
              {description}
            </p>
          )}
        </Reveal>

        {/* Right: responsive grid of tech cards */}
        <RevealStagger
          className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6"
          stagger={0.07}
        >
          {items.map((t) => {
            // const logo = strapiMedia(t.logo?.url);
            const logo = t.logo?.url;
            return (
              <RevealItem
                key={t.id}
                className="flex h-[88px] w-full items-center gap-3 rounded-card-sm border border-tech-card-border bg-white p-4 shadow-tech-card sm:gap-5 lg:h-[100px] lg:p-5"
              >
                {logo ? (
                  <Image
                    src={logo}
                    alt={t.name}
                    width={60}
                    height={60}
                    className="size-[44px] shrink-0 object-contain lg:size-[60px]"
                  />
                ) : (
                  <span className="size-[44px] shrink-0 rounded-lg bg-bg-alt lg:size-[60px]" />
                )}
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-base font-medium leading-[125%] text-space-grey lg:text-xl">
                    {t.name}
                  </span>
                  <span className="truncate text-sm font-medium leading-[125%] text-fg-muted lg:text-base">
                    {formatCategory(t.category)}
                  </span>
                </div>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </Section>
  );
}
