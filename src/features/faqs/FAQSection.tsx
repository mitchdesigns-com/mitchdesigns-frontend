"use client";

import Link from "next/link";
import { useState } from "react";
import { Section } from "@/components/layout/Section";
import { cn } from "@/lib/cn";
import type { FAQ } from "@/lib/cms/types";
import { fixtureFAQs } from "@/lib/cms/fixtures";
import { FAQCard } from "./FAQCard";

type FAQSectionProps = {
  faqs?: Array<FAQ & { id: number }>;
  title?: React.ReactNode;
  description?: string;
  categories?: string[];
  defaultCategory?: string;
  defaultOpenId?: number;
  ctaHref?: string;
};

export function FAQSection({
  faqs = fixtureFAQs,
  title = "Got Questions?",
  description = "We've answered the most common ones to help you understand how we work and what to expect.",
  categories,
  defaultCategory,
  defaultOpenId,
  ctaHref = "/faqs",
}: FAQSectionProps) {
  const derivedCategories =
    categories ??
    Array.from(new Set(faqs.map((f) => f.category).filter(Boolean) as string[]));
  const categoryOptions = ["All FAQs", ...derivedCategories];
  const initialCategory =
    defaultCategory && categoryOptions.includes(defaultCategory)
      ? defaultCategory
      : categoryOptions[1] ?? categoryOptions[0];

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [openId, setOpenId] = useState<number | null>(defaultOpenId ?? null);

  const visibleFaqs =
    activeCategory === "All FAQs"
      ? faqs
      : faqs.filter((f) => f.category === activeCategory);
  const displayedFaqs = visibleFaqs.slice(0, 6);
  const hasCategories = derivedCategories.length > 0;

  return (
    <Section theme="dark" className="pt-12 pb-24 md:py-32">
      <div className="flex flex-col items-center gap-8 md:gap-12">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-hero-2 font-bold text-white">{title}</h2>
          {description && (
            <p className="max-w-md text-base text-fg-muted">{description}</p>
          )}
        </div>

        {/* Category tabs — single scrolling row on mobile, centered wrap on desktop */}
        {hasCategories && (
          <div className="-mr-4 flex w-full gap-3 overflow-x-auto [scrollbar-width:none] md:mr-0 md:w-auto md:flex-wrap md:justify-center md:overflow-visible [&::-webkit-scrollbar]:hidden">
            {categoryOptions.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenId(null);
                }}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-pill border px-5 py-2.5 text-sm font-medium transition-colors",
                  activeCategory === cat
                    ? "border-white bg-space-grey text-white"
                    : "border-border bg-space-grey text-fg-muted hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* FAQ cards */}
        <div className="flex w-full max-w-2xl flex-col gap-3">
          {displayedFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <FAQCard
                key={faq.id}
                faq={faq}
                isOpen={isOpen}
                onToggle={() => setOpenId(isOpen ? null : faq.id)}
              />
            );
          })}
        </div>

        {/* CTA */}
        <Link
          href={ctaHref}
          className="whitespace-nowrap rounded-pill bg-space-grey px-8 py-4 text-center text-sm font-medium text-white transition-colors hover:bg-bg-alt max-md:w-full"
        >
          Explore All FAQs
        </Link>
      </div>
    </Section>
  );
}
