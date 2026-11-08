"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import type { CaseStudy } from "@/lib/cms/types";
import { Section } from "@/components/layout/Section";
import { strapiMedia } from "@/lib/cms/media";
import { listCover } from "./listCovers";
import { Media, isVideo } from "@/components/ui/Media";
import { noOrphan } from "@/lib/noOrphan";

// ── helpers ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 3;

/** Project-type tags under the logo (the CMS category for now). */
function TypeTags({ types }: { types: string[] }) {
  if (!types.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {types.map((t) => (
        <li key={t} className="rounded-pill bg-yellow-soft px-3 py-1 text-sm font-medium text-black">
          {t}
        </li>
      ))}
    </ul>
  );
}

// ── sub-components ─────────────────────────────────────────────────────────

function CaseStudyRow({ cs }: { cs: CaseStudy & { id: number } }) {
  const listSrc = strapiMedia(cs.listCover?.url);
  const bundledSrc = listSrc ? undefined : listCover(cs.slug);
  const coverSrc = listSrc ?? bundledSrc ?? strapiMedia(cs.cover?.url);
  // Either CMS field may hold a video; the bundled covers are always images.
  const coverMime = listSrc ? cs.listCover?.mime : bundledSrc ? null : cs.cover?.mime;
  const logoSrc = strapiMedia(cs.logo?.url);

  return (
    <Link
      href={`/case-studies/${cs.slug}`}
      className="flex w-full flex-col overflow-hidden rounded-2xs lg:flex-row"
    >
      {/* Left — info panel: logo + type tags, then title and a short summary */}
      <div className="flex w-full shrink-0 flex-col gap-5 bg-white p-6 lg:w-[30%]">
        <div className="flex flex-col gap-4">
          <div className="h-24 w-full">
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoSrc}
                alt={cs.logo?.alternativeText ?? cs.client}
                className="h-full max-w-3/5 object-contain object-left"
              />
            ) : (
              <span className="text-sm font-medium text-space-grey">{cs.client}</span>
            )}
          </div>
          <TypeTags types={cs.category ? [cs.category] : []} />
        </div>

        {/* Title + divider + summary */}
        <div className="flex flex-col gap-5">
          <h3 className="whitespace-pre-line text-hero-5 text-black text-balance lg:text-card-title">
            {cs.title}
          </h3>
          <div className="h-px w-full bg-space-grey/20" />
          {cs.excerpt && (
            <p className="line-clamp-5 text-base text-grey-700 text-balance">{noOrphan(cs.excerpt, 32)}</p>
          )}
        </div>
      </div>

      {/* Cover image — always 940:580; the info panel stretches to its height */}
      <div className="relative aspect-case-cover w-full overflow-hidden lg:w-auto lg:flex-1">
        {coverSrc && isVideo(coverSrc, coverMime) ? (
          <Media src={coverSrc} mime={coverMime} alt={cs.title} className="object-cover" />
        ) : coverSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverSrc}
            alt={cs.cover?.alternativeText ?? cs.title}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-img-placeholder" />
        )}
      </div>

    </Link>
  );
}

// ── Main export ────────────────────────────────────────────────────────────

export type CaseStudyGridProps = {
  caseStudies: Array<CaseStudy & { id: number }>;
  title?: string;
  description?: string;
};

export function CaseStudyGrid({
  caseStudies,
  title = "Case Studies",
  description = "We don't just promise results — we prove them. These case studies show how we've helped businesses launch, grow, and succeed.",
}: CaseStudyGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Categories are derived from the data — every distinct category present,
  // in first-seen order, with "All" pinned first.
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(caseStudies.map((cs) => cs.category).filter((c): c is string => !!c)))],
    [caseStudies],
  );

  const filtered = activeCategory === "All"
    ? caseStudies
    : caseStudies.filter(
        (cs) => cs.category === activeCategory || cs.services.includes(activeCategory),
      );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Reset visible count on filter change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory]);

  // Infinite scroll via IntersectionObserver
  const loadMore = useCallback(() => {
    setVisibleCount((n) => n + PAGE_SIZE);
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore) loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <Section theme="dark" className="py-25">
      <div className="flex flex-col gap-10 lg:gap-[60px]">
        {/* Header */}
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <h1 className="text-hero-3 text-white md:text-hero-2 lg:text-hero-1">{title}</h1>
          <p className="max-w-full text-lg text-white text-balance lg:max-w-[37%] lg:text-xl">{description}</p>
        </div>

        {/* Category filter — derived from the data */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={
                  cat === activeCategory
                    ? "whitespace-nowrap rounded-pill bg-yellow px-6 py-3 text-base font-medium text-black"
                    : "whitespace-nowrap rounded-pill border border-grey-200 px-6 py-3 text-base font-medium text-grey-200"
                }
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Rows */}
        <div className="flex flex-col gap-[60px]">
          {visible.map((cs) => (
            <CaseStudyRow key={cs.id} cs={cs} />
          ))}
        </div>

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-1" aria-hidden />
      </div>
    </Section>
  );
}
