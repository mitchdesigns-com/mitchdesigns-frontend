"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Talk } from "@/lib/cms/types";
import { Section } from "@/components/layout/Section";

const PAGE = 9; // each page: 1 featured hero + 8 in grid
const INITIAL = PAGE;
const PAGE_SIZE = PAGE;

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

function FeaturedCard({
  talk,
  isLast = false,
  onLastDone,
}: {
  talk: Talk;
  isLast?: boolean;
  onLastDone?: () => void;
}) {
  const calledRef = useRef(false);

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40% 0px" }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      onViewportEnter={
        isLast
          ? () => {
              if (!calledRef.current) {
                calledRef.current = true;
                setTimeout(() => onLastDone?.(), 520);
              }
            }
          : undefined
      }
    >
      <Link href={`/talks/${talk.slug}`} className="flex w-full items-start gap-10">
        {/* Image — 55% width, 4:3 aspect */}
        <div className="relative aspect-676/500 w-[55%] shrink-0 overflow-hidden rounded-[4px]">
          {talk.cover?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={talk.cover.url}
              alt={talk.cover.alternativeText ?? talk.title}
              className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
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
            <h2 className="text-[40px] font-bold leading-[1.1] tracking-[0.01em] text-[#07020d] transition-opacity duration-200 group-hover:opacity-70">
              {talk.title}
            </h2>
            <p className="text-[16px] leading-6 tracking-[0.01em] text-[#515151] text-balance">
              {talk.excerpt}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Regular card (used in 2-col grid) ─────────────────────────────────────

function TalkCard({
  talk,
  delay = 0,
  isLast = false,
  onLastDone,
}: {
  talk: Talk;
  delay?: number;
  isLast?: boolean;
  onLastDone?: () => void;
}) {
  const calledRef = useRef(false);

  return (
    <motion.div
      className="group flex min-w-0 flex-1 flex-col gap-4"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40% 0px" }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
      onViewportEnter={
        isLast
          ? () => {
              if (!calledRef.current) {
                calledRef.current = true;
                setTimeout(() => onLastDone?.(), (0.4 + delay) * 1000 + 50);
              }
            }
          : undefined
      }
    >
      <Link href={`/talks/${talk.slug}`} className="flex flex-col gap-4">
        {/* Image — natural 4:3 aspect, no fixed height */}
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-[2px]">
          {talk.cover?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={talk.cover.url}
              alt={talk.cover.alternativeText ?? talk.title}
              className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
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
            <h3 className="text-[20px] font-medium leading-[1.3] tracking-[0.01em] text-[#07020d] transition-opacity duration-200 group-hover:opacity-70">
              {talk.title}
            </h3>
            <p className="text-[16px] leading-6 tracking-[0.01em] text-[#515151] text-balance">
              {talk.excerpt}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────

export interface TalksListProps {
  talks: Talk[];
}

export function TalksList({ talks }: TalksListProps) {
  const [visible, setVisible] = useState(INITIAL);
  const [showLoadMore, setShowLoadMore] = useState(false);

  // Hide the button whenever new items are loaded; re-show once the last new
  // card fires its onLastDone callback.
  useEffect(() => {
    setShowLoadMore(false);
  }, [visible]);

  const shown = talks.slice(0, visible);
  const hasMore = visible < talks.length;

  // Split into pages; each page leads with a featured hero (a `featured`-flagged
  // talk when the page has one, otherwise the first item) followed by a grid.
  const pages: { hero: Talk; rest: Talk[] }[] = [];
  for (let i = 0; i < shown.length; i += PAGE) {
    const items = shown.slice(i, i + PAGE);
    const hero = items.find((t) => t.featured) ?? items[0]!;
    pages.push({ hero, rest: items.filter((t) => t !== hero) });
  }

  const handleLastDone = () => setShowLoadMore(true);

  return (
    <Section className="py-[120px]">
      <div className="flex flex-col gap-10">
        {pages.map(({ hero, rest }, p) => {
          const isLastPage = p === pages.length - 1;
          const rows: [Talk, Talk | undefined][] = [];
          for (let i = 0; i < rest.length; i += 2) {
            rows.push([rest[i]!, rest[i + 1]]);
          }
          return (
            <div key={p} className="flex flex-col gap-10">
              <FeaturedCard
                talk={hero}
                isLast={isLastPage && rows.length === 0}
                onLastDone={handleLastDone}
              />
              {rows.map(([a, b], rowIdx) => {
                const isLastRow = isLastPage && rowIdx === rows.length - 1;
                return (
                  <div key={rowIdx} className="flex gap-10">
                    <TalkCard
                      talk={a}
                      delay={0.1 + rowIdx * 0.12}
                      isLast={isLastRow && !b}
                      onLastDone={handleLastDone}
                    />
                    {b && (
                      <TalkCard
                        talk={b}
                        delay={0.17 + rowIdx * 0.12}
                        isLast={isLastRow}
                        onLastDone={handleLastDone}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        <AnimatePresence>
          {hasMore && showLoadMore && (
            <motion.div
              className="flex justify-center pt-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="text-[18px] font-medium text-fg underline underline-offset-4 transition-opacity hover:opacity-60"
              >
                Load more
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
