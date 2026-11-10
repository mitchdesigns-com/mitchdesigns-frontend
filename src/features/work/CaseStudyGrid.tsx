"use client";

import { Fragment, useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { CaseStudy } from "@/lib/cms/types";
import { cn } from "@/lib/cn";
import { chipBase } from "@/lib/chip";
import { Section } from "@/components/layout/Section";
import { strapiMedia } from "@/lib/cms/media";
import { listCover } from "./listCovers";
import { Media, isVideo } from "@/components/ui/Media";
import { ProjectTypeTag } from "./ProjectTypeTag";
import { inProjectType } from "@/lib/cms/projectType";
import { motion, useInView, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { EASE_LUXE } from "@/components/motion";

// ── helpers ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 3;

/** Filter chips, in order — Strapi `category` value and the label shown. */
const FILTERS = [
  { value: "All", label: "All" },
  { value: "Corporate", label: "Corporate" },
  { value: "eCommerce", label: "eCommerce" },
  { value: "Mobile App", label: "Mobile Apps" },
  { value: "Software", label: "Software" },
] as const;

// ── motion ─────────────────────────────────────────────────────────────────

const MotionLink = motion.create(Link);

/** Row rises in; its children (info lines, cover) run off the same trigger. */
const rowIn: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE_LUXE, staggerChildren: 0.08, delayChildren: 0.2 } },
};
const lineIn: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_LUXE } },
};
/** Cover opens like a curtain from the bottom… */
const coverIn: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  visible: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.1, ease: EASE_LUXE, delay: 0.1 } },
};
/** …while the picture inside settles from a zoom. */
const pictureIn: Variants = {
  hidden: { scale: 1.3 },
  visible: { scale: 1, transition: { duration: 1.5, ease: EASE_LUXE, delay: 0.1 } },
};

/** Header: title words rise out of a mask, then the copy and chips follow. */
const headerIn: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const wordIn: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.9, ease: EASE_LUXE } },
};

// ── sub-components ─────────────────────────────────────────────────────────

function CaseStudyRow({ cs }: { cs: CaseStudy & { id: number } }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  // Gentle parallax on the cover while the row crosses the screen.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-6%", "6%"]);
  const state = reduced || inView ? "visible" : "hidden";
  const listSrc = strapiMedia(cs.listCover?.url);
  const bundledSrc = listSrc ? undefined : listCover(cs.slug);
  const coverSrc = listSrc ?? bundledSrc ?? strapiMedia(cs.cover?.url);
  // Either CMS field may hold a video; the bundled covers are always images.
  const coverMime = listSrc ? cs.listCover?.mime : bundledSrc ? null : cs.cover?.mime;
  const logoSrc = strapiMedia(cs.logo?.url);

  return (
    <MotionLink
      ref={ref}
      href={`/case-studies/${cs.slug}`}
      className="group flex w-full flex-col overflow-hidden rounded-2xs lg:flex-row"
      variants={rowIn}
      initial={reduced ? false : "hidden"}
      animate={state}
    >
      {/* Left — info panel: logo + title grouped at the top */}
      <div className="flex w-full shrink-0 flex-col gap-5 bg-white p-6 lg:w-[30%]">
        {/* Logo */}
        <motion.div variants={lineIn} className="h-26 w-full">
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc}
              alt={cs.logo?.alternativeText ?? cs.client}
              className="h-full max-w-45 object-contain object-left"
            />
          ) : (
            <span className="text-sm font-medium text-space-grey">{cs.client}</span>
          )}
        </motion.div>

        {/* Title, type label + short summary of scope, challenge and what we did (CMS `excerpt`) */}
        <div className="flex flex-col gap-3">
          <motion.h3 variants={lineIn} className="whitespace-pre-line text-hero-5 text-black text-balance">
            {cs.title}
          </motion.h3>
          <motion.div variants={lineIn}>
            <ProjectTypeTag type={cs.category} subcategory={cs.subcategory} className="text-black" />
          </motion.div>
          {cs.excerpt && (
            <motion.p variants={lineIn} className="text-base text-space-grey text-balance lg:text-lg">{cs.excerpt}</motion.p>
          )}
        </div>
      </div>

      {/* Cover image — always 940:580; the info panel stretches to its height */}
      <motion.div variants={coverIn} className="relative aspect-case-cover w-full overflow-hidden lg:w-auto lg:flex-1">
        {/* Parallax drift (scroll) → entry zoom → hover zoom, one layer each. */}
        <motion.div className="absolute inset-x-0 -inset-y-1/12" style={{ y: drift }}>
        <motion.div variants={pictureIn} className="absolute inset-0">
        <div className="absolute inset-0 transition-transform duration-700 ease-out-soft group-hover:scale-104">
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
        </motion.div>
        </motion.div>
      </motion.div>

    </MotionLink>
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
  description = "We don't just promise results. We prove them. These case studies show how we've helped businesses launch, grow, and succeed.",
}: CaseStudyGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // A chip only shows while at least one project sits under it.
  const filters = FILTERS.filter(
    ({ value }) => value === "All" || caseStudies.some((cs) => inProjectType(cs, value)),
  );

  // `?category=eCommerce` (e.g. from a service page) opens on that filter.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("category");
    const match = wanted && filters.map((f) => f.value as string).find((c) => c.toLowerCase() === wanted.toLowerCase());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (match) setActiveCategory(match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = activeCategory === "All"
    ? caseStudies
    : caseStudies.filter(
        (cs) => inProjectType(cs, activeCategory) || cs.services.includes(activeCategory),
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
    <Section theme="dark" className="pt-32 pb-25 lg:py-25">
      <div className="flex flex-col gap-10 lg:gap-[60px]">
        {/* Header + category chips, kept close together */}
        <motion.div
          className="flex flex-col gap-5"
          variants={headerIn}
          initial={reduced ? false : "hidden"}
          animate="visible"
        >
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <h1 className="text-hero-3 text-white md:text-hero-2 lg:text-hero-1">
            {title.split(" ").map((word, i, all) => (
              <Fragment key={i}>
                <span className="inline-block overflow-hidden pb-1 align-bottom">
                  <motion.span variants={wordIn} className="inline-block">
                    {word}
                  </motion.span>
                </span>
                {i < all.length - 1 && " "}
              </Fragment>
            ))}
          </h1>
          <motion.p variants={lineIn} className="max-w-full text-lg text-white text-balance lg:max-w-[37%] lg:text-xl">{description}</motion.p>
        </div>

        {/* Category filter — derived from the data */}
        {(
          // Phones: one row that scrolls sideways (like the service switcher).
          // Sticky: pins to the top while the list scrolls, released at its end.
          <div className="sticky top-0 z-40 -mx-(--container-padding) flex gap-2 overflow-x-auto bg-bg px-(--container-padding) py-4 scrollbar-none md:mx-0 md:flex-wrap md:gap-4 md:overflow-visible md:px-0">
            {filters.map(({ value: cat, label }) => (
              <motion.button
                variants={lineIn}
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  chipBase,
                  cat === activeCategory
                    ? "border-yellow bg-yellow text-black"
                    : "border-grey-200 text-grey-200",
                )}
              >
                {label}
              </motion.button>
            ))}
          </div>
        )}
        </motion.div>

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
