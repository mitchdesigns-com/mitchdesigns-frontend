"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import type { CaseStudy } from "@/lib/cms/types";
import { Section } from "@/components/layout/Section";
import { strapiMedia } from "@/lib/cms/media";

// ── helpers ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 3;

function ServiceBullet({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-1">
      <span className="size-1 shrink-0 rounded-full bg-space-grey" aria-hidden />
      <span className="text-xs text-space-grey">{label}</span>
    </li>
  );
}

// ── sub-components ─────────────────────────────────────────────────────────

function CaseStudyRow({ cs }: { cs: CaseStudy & { id: number } }) {
  const coverSrc = strapiMedia(cs.cover?.url);
  const avatarSrc = strapiMedia(cs.testimonial?.avatar?.url);

  return (
    <Link
      href={`/case-studies/${cs.slug}`}
      className="flex w-full flex-col overflow-hidden rounded-2xs lg:flex-row"
    >
      {/* Left — info panel: logo + title grouped at the top */}
      <div className="flex w-full shrink-0 flex-col gap-5 bg-white p-6 lg:w-[30%]">
        {/* Logo */}
        <div className="h-[70px] w-full">
          {cs.logo?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cs.logo.url}
              alt={cs.logo.alternativeText ?? cs.client}
              className="h-full max-w-[120px] object-contain object-left"
            />
          ) : (
            <span className="text-sm font-medium text-space-grey">{cs.client}</span>
          )}
        </div>

        {/* Title + divider + services */}
        <div className="flex flex-col gap-5">
          <h3 className="whitespace-pre-line text-hero-5 text-black text-balance lg:text-card-title">
            {cs.title}
          </h3>
          <div className="h-px w-full bg-space-grey/20" />
          <ul className="flex flex-col gap-1">
            {cs.services.map((s) => (
              <ServiceBullet key={s} label={s} />
            ))}
          </ul>
        </div>
      </div>

      {/* Center — cover image (needs an explicit ratio when the card is stacked) */}
      <div className="relative aspect-video w-full overflow-hidden lg:aspect-auto lg:w-auto lg:flex-1">
        {coverSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverSrc}
            alt={cs.cover.alternativeText ?? cs.title}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-img-placeholder" />
        )}
      </div>

      {/* Right — testimonial panel */}
      <div className="flex w-full shrink-0 flex-col justify-between gap-6 bg-space-grey p-10 lg:w-[30%] lg:gap-0">
        {/* Opening quote mark */}
        <span className="text-hero-1 leading-none text-yellow" aria-hidden>
          &ldquo;
        </span>

        {/* Quote */}
        {cs.testimonial ? (
          <p className="text-hero-5 text-white text-balance">
            {cs.testimonial.quote}
          </p>
        ) : null}

        {/* Author */}
        {cs.testimonial ? (
          <div className="flex flex-col gap-10">
            <div className="h-px w-full bg-grey-500" />
            <div className="flex items-center gap-5">
              {avatarSrc ? (
                <div className="relative size-16 shrink-0 overflow-hidden rounded-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarSrc}
                    alt={cs.testimonial.author}
                    className="absolute inset-0 size-full object-cover"
                  />
                </div>
              ) : (
                <div className="size-16 shrink-0 rounded-full bg-grey-600" />
              )}
              <div className="flex flex-col gap-1">
                <span className="text-xl font-medium leading-tight text-white">
                  {cs.testimonial.author}
                </span>
                <span className="text-base leading-tight text-yellow">
                  {cs.testimonial.role}
                </span>
              </div>
            </div>
          </div>
        ) : null}
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
    <Section theme="dark" className="py-20">
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
                    ? "rounded-pill bg-yellow px-6 py-3 text-base font-medium text-black"
                    : "rounded-pill border border-grey-200 px-6 py-3 text-base font-medium text-grey-200"
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
