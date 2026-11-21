"use client";

import { useState } from "react";
import { Section } from "@/components/layout/Section";
import type { FAQ } from "@/lib/cms/types";
import { cn } from "@/lib/cn";
import { chipBase } from "@/lib/chip";
import { FAQCard } from "./FAQCard";

type FAQPageSectionProps = {
    faqs: Array<FAQ & { id: number }>;
    defaultCategory?: string;
    defaultOpenId?: number;
    title?: string;
};


export function FAQPageSection({
    faqs,
    defaultCategory,
    defaultOpenId,
    title = "FAQs",
}: FAQPageSectionProps) {
    const derivedCategories = Array.from(
        new Set(faqs.map((faq) => faq.category).filter(Boolean) as string[]),
    );
    const categories = ["All FAQs", ...derivedCategories];
    const initialCategory =
        defaultCategory && categories.includes(defaultCategory)
            ? defaultCategory
            : categories[1] ?? categories[0];

    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [openId, setOpenId] = useState<number | null>(defaultOpenId ?? null);

    const visibleFaqs = activeCategory === "All FAQs"
        ? faqs
        : faqs.filter((faq) => faq.category === activeCategory);

    return (
        <Section theme="light" className="py-24 md:py-32">
            <div className="grid gap-10 lg:grid-cols-[minmax(280px,420px)_1fr]">
                {/* Pinned beside the questions only on desktop; below lg the column
                    stacks above the list, so it scrolls away with the page. */}
                <div className="min-w-0 self-start lg:sticky lg:top-24">
                    <h1 className="text-hero-2 font-black text-white">{title}</h1>

                    {/* Below lg: one swipeable row out to the screen edges. */}
                    <div className="-mx-(--container-padding) mt-10 flex gap-3 overflow-x-auto px-(--container-padding) scrollbar-none lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
                        {categories.map((category) => {
                            const isActive = activeCategory === category;
                            return (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => {
                                        setActiveCategory(category);
                                        setOpenId(null);
                                    }}
                                    className={cn(
                                        chipBase,
                                        isActive
                                            ? "border-yellow bg-yellow text-black"
                                            : "border-white/20 bg-space-grey/50 text-white hover:border-white/40 hover:bg-space-grey/70"
                                    )}
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-4">
                    {visibleFaqs.length === 0 ? (
                        <div className="rounded-card-sm border border-border bg-space-grey p-8 text-base text-white/70">
                            No FAQs found for this category yet.
                        </div>
                    ) : (
                        visibleFaqs.map((faq) => {
                            const isOpen = openId === faq.id;
                            return (
                                <FAQCard
                                    key={faq.id}
                                    faq={faq}
                                    isOpen={isOpen}
                                    onToggle={() => setOpenId(isOpen ? null : faq.id)}
                                />
                            );
                        })
                    )}
                </div>
            </div>
        </Section>
    );
}
