"use client";

import { useState } from "react";
import Link from "next/link";
import type { Talk } from "@/lib/cms/types";
import { Section } from "@/components/layout/Section";

const PAGE_SIZE = 8;
const INITIAL = 9; // 1 featured + first 8 in grid

// ── helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── sub-components ─────────────────────────────────────────────────────────

function TagPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-yellow px-4 py-2 text-[14px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-black">
      {label}
    </span>
  );
}

function Meta({ date, readTime }: { date: string; readTime?: number }) {
  return (
    <div className="flex items-center gap-3 text-[16px] leading-tight tracking-[0.01em] text-[#515151]">
      <span className="whitespace-nowrap">{formatDate(date)}</span>
      {readTime != null && (
        <>
          <span className="size-1 rounded-full bg-[#515151]" aria-hidden />
          <span className="whitespace-nowrap">{readTime} min read</span>
        </>
      )}
    </div>
  );
}

// ── Featured card (full-width hero row) ────────────────────────────────────

function FeaturedCard({ talk }: { talk: Talk }) {
  return (
    <Link
      href={`/talks/${talk.slug}`}
      className="flex w-full items-start gap-10"
    >
      {/* Image — 55% width, 4:3 aspect */}
      <div className="relative aspect-676/500 w-[55%] shrink-0 overflow-hidden rounded-[4px]">
        {talk.cover?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={talk.cover.url}
            alt={talk.cover.alternativeText ?? talk.title}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#e5e5e5]" />
        )}
      </div>

      {/* Content — fills remaining space, matches image height via self-stretch */}
      <div className="flex flex-1 self-stretch flex-col items-start justify-between py-10">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            {talk.category
              ? <TagPill label={talk.category} />
              : talk.tags?.map((tag) => <TagPill key={tag} label={tag} />)
            }
          </div>
          <Meta date={(talk.publishedAt ?? talk.date) ?? ""} readTime={talk.readTime} />
        </div>

        <div className="flex flex-col gap-2.5">
          <h2 className="text-[40px] font-bold leading-[1.1] tracking-[0.01em] text-[#07020d]">
            {talk.title}
          </h2>
          <p className="text-[16px] leading-6 tracking-[0.01em] text-[#515151]">
            {talk.excerpt}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ── Regular card (used in 2-col grid) ─────────────────────────────────────

function TalkCard({ talk }: { talk: Talk }) {
  return (
    <Link
      href={`/talks/${talk.slug}`}
      className="flex min-w-0 flex-1 flex-col gap-4"
    >
      {/* Image — natural 4:3 aspect, no fixed height */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-[2px]">
        {talk.cover?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={talk.cover.url}
            alt={talk.cover.alternativeText ?? talk.title}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#e5e5e5]" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {talk.category
              ? <TagPill label={talk.category} />
              : talk.tags?.map((tag) => <TagPill key={tag} label={tag} />)
            }
          </div>
          <Meta date={(talk.publishedAt ?? talk.date) ?? ""} readTime={talk.readTime} />
        </div>

        <div className="flex flex-col gap-2.5">
          <h3 className="text-[20px] font-medium leading-[1.3] tracking-[0.01em] text-[#07020d]">
            {talk.title}
          </h3>
          <p className="text-[16px] leading-6 tracking-[0.01em] text-[#515151]">
            {talk.excerpt}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ── Main export ────────────────────────────────────────────────────────────

export interface TalksListProps {
  talks: Talk[];
}

export function TalksList({ talks }: TalksListProps) {
  const [visible, setVisible] = useState(INITIAL);

  const shown = talks.slice(0, visible);
  const featured = shown.find((t) => t.featured) ?? shown[0];
  const rest = shown.filter((t) => t !== featured);

  const rows: [Talk, Talk | undefined][] = [];
  for (let i = 0; i < rest.length; i += 2) {
    rows.push([rest[i]!, rest[i + 1]]);
  }

  const hasMore = visible < talks.length;

  return (
    <Section className="py-[120px]">
      <div className="flex flex-col gap-10">
        {featured && <FeaturedCard talk={featured} />}

        {rows.map(([a, b], i) => (
          <div key={i} className="flex gap-10">
            <TalkCard talk={a} />
            {b && <TalkCard talk={b} />}
          </div>
        ))}

        {hasMore && (
          <div className="flex justify-center pt-6">
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="text-[18px] font-medium text-fg underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}
