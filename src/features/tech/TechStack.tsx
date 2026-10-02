import type { CSSProperties } from "react";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion";
import type { TechItem } from "@/lib/cms/types";
import { TechPile } from "./TechPile";

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
    "linear-gradient(to top, var(--color-yellow) 0.45em, transparent 0.45em)",
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
    // Desktop: a fixed-height stage — copy top-left, the tech cards drop in from
    // the top edge and pile up bottom-right (see TechPile).
    <Section bleed className="overflow-hidden bg-panel py-20 lg:h-190">
      <div className="container-page h-full">
        <div className="relative flex h-full flex-col gap-10">
          <Reveal
            className="relative flex flex-col gap-4 lg:max-w-160"
            viewport={{ margin: "0px 0px -20% 0px" }}
          >
            <h2 className="text-center text-[1.5rem] font-bold leading-[1.3] text-space-grey lg:text-left lg:text-hero-4 lg:leading-[110%]">
              <HighlightedTitle title={title} highlight={highlight} />
            </h2>
            {description && (
              <p className="text-xl leading-[130%] text-grey-600 text-balance">
                {description}
              </p>
            )}
          </Reveal>

          <TechPile
            items={items.map((t) => ({
              id: t.id,
              name: t.name,
              category: formatCategory(t.category),
              logo: t.logo?.url,
            }))}
          />
        </div>
      </div>
    </Section>
  );
}
