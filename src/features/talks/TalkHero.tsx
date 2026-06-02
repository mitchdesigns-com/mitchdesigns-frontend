import Link from "next/link";
import type { Talk, BlogSection } from "@/lib/cms/types";
import { Section } from "@/components/layout/Section";
import { ArrowRight } from "@/components/icons/ArrowRight";

function TagPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded-pill bg-yellow px-4 py-2 text-[14px] font-bold leading-[1.3] text-black">
      {label}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function extractText(node: unknown): string {
  if (!node) return "";
  if (Array.isArray(node)) return node.map(extractText).join(" ");
  if (typeof node === "object" && node !== null) {
    const obj = node as Record<string, unknown>;
    if (typeof obj.text === "string") return obj.text;
    if (obj.children) return extractText(obj.children);
  }
  return "";
}

function calcReadTime(sections: BlogSection[] | undefined): number {
  if (!sections?.length) return 1;
  const allText = sections
    .map((s) => (s.__component === "blocks.rich-text" ? extractText(s.body) : ""))
    .join(" ");
  const wordCount = allText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 200));
}

export function TalkHero({ talk }: { talk: Talk }) {
  const readTime = talk.readTime ?? calcReadTime(talk.sections);

  return (
    <Section theme="dark" className="pt-20 pb-10">
      <div className="flex flex-col gap-10">
        {/* Two-column header row — aligned to bottom */}
        <div className="flex items-end gap-10">
          {/* Left: go-back + title */}
          <div className="flex w-1/2 shrink-0 flex-col justify-between gap-10">
            <Link
              href="/talks"
              className="inline-flex items-center gap-2 text-[16px] text-fg-muted"
            >
              <ArrowRight size={20} className="rotate-180" />
              Go Back
            </Link>
            <h1 className="text-hero-2 font-bold text-white">
              {talk.title}
            </h1>
          </div>

          {/* Right: meta + tags + excerpt — bottom aligned */}
          <div className="flex flex-1 flex-col items-start gap-6">
            {/* Date + read time */}
            <div className="flex items-center gap-3 text-[16px] text-fg-muted">
              {(talk.publishedAt ?? talk.date) && (
                <span>{formatDate((talk.publishedAt ?? talk.date)!)}</span>
              )}
              <>
                <span className="size-1 rounded-full bg-fg-muted" aria-hidden />
                <span>{readTime} min read</span>
              </>
            </div>

            {/* Tags */}
            {(talk.category ?? talk.tags?.length) && (
              <div className="flex flex-wrap gap-2">
                {talk.category
                  ? <TagPill label={talk.category} />
                  : talk.tags?.map((tag) => <TagPill key={tag} label={tag} />)
                }
              </div>
            )}

            {/* Excerpt */}
            <p className="text-balance text-[16px] leading-6 text-fg-muted">
              {talk.excerpt}
            </p>

            {/* Author */}
            {talk.author && (
              <div className="flex items-center gap-3">
                {talk.author.avatar?.url ? (
                  <img
                    src={talk.author.avatar.url}
                    alt={talk.author.avatar.alternativeText ?? talk.author.name}
                    className="size-9 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-yellow text-[13px] font-bold text-black"
                    aria-hidden
                  >
                    {initials(talk.author.name)}
                  </span>
                )}
                <span className="text-[15px] font-medium text-white">
                  {talk.author.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Cover image — full width */}
        {talk.cover?.url && (
          <div className="relative aspect-[1392/450] w-full overflow-hidden rounded-[4px]">
            <img
              src={talk.cover.url}
              alt={talk.cover.alternativeText ?? talk.title}
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        )}
      </div>
    </Section>
  );
}
