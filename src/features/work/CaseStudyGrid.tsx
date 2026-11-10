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
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue, type Variants } from "framer-motion";
import { EASE_LUXE } from "@/components/motion";
import { ViewListIcon } from "@/components/icons/ViewListIcon";
import { ViewGridIcon } from "@/components/icons/ViewGridIcon";

// ── helpers ────────────────────────────────────────────────────────────────

/** Projects loaded per step: about one screenful in each view. */
const PAGE_SIZE = { list: 3, grid: 6 } as const;

type View = keyof typeof PAGE_SIZE;
/** Each visitor's last choice of view (a convenience; defaults to list). */
const VIEW_KEY = "md:case-studies-view";

/** The cover shown for a project: the CMS list cover, the bundled mockup, or
 *  the main cover, with its mime so videos play. */
function coverOf(cs: CaseStudy) {
  const listSrc = strapiMedia(cs.listCover?.url);
  const bundledSrc = listSrc ? undefined : listCover(cs.slug);
  const src = listSrc ?? bundledSrc ?? strapiMedia(cs.cover?.url);
  // Either CMS field may hold a video; the bundled covers are always images.
  const mime = listSrc ? cs.listCover?.mime : bundledSrc ? null : cs.cover?.mime;
  return { src, mime };
}

/** The cover inside its zoom layers; fills its (relative) parent. */
function CoverPicture({ cs, drift }: { cs: CaseStudy; drift?: MotionValue<string> }) {
  const { src, mime } = coverOf(cs);
  return (
    // Parallax drift (scroll) → entry zoom → hover zoom, one layer each.
    <motion.div className={drift ? "absolute inset-x-0 -inset-y-1/12" : "absolute inset-0"} style={drift ? { y: drift } : undefined}>
      <motion.div variants={pictureIn} className="absolute inset-0">
        <div className="absolute inset-0 transition-transform duration-700 ease-out-soft group-hover:scale-104">
          {src && isVideo(src, mime) ? (
            <Media src={src} mime={mime} alt={cs.title} className="object-cover" />
          ) : src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={cs.cover?.alternativeText ?? cs.title} className="absolute inset-0 size-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-img-placeholder" />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

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
        <CoverPicture cs={cs} drift={drift} />
      </motion.div>

    </MotionLink>
  );
}

/** Grid view card: cover on top, then logo, title, type and a two-line summary. */
function CaseStudyCard({ cs }: { cs: CaseStudy & { id: number } }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const state = reduced || inView ? "visible" : "hidden";
  const logoSrc = strapiMedia(cs.logo?.url);

  return (
    <MotionLink
      ref={ref}
      href={`/case-studies/${cs.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xs bg-white"
      variants={rowIn}
      initial={reduced ? false : "hidden"}
      animate={state}
    >
      <motion.div variants={coverIn} className="relative aspect-case-cover w-full overflow-hidden">
        <CoverPicture cs={cs} />
      </motion.div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <motion.div variants={lineIn} className="h-10">
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoSrc} alt={cs.logo?.alternativeText ?? cs.client} className="h-full max-w-36 object-contain object-left" />
          ) : (
            <span className="text-sm font-medium text-space-grey">{cs.client}</span>
          )}
        </motion.div>
        <motion.h3 variants={lineIn} className="line-clamp-2 text-xl font-bold text-black text-balance">
          {cs.title}
        </motion.h3>
        <motion.div variants={lineIn}>
          <ProjectTypeTag type={cs.category} subcategory={cs.subcategory} className="text-black" />
        </motion.div>
        {cs.excerpt && (
          // Two lines in every card so the row's cards line up.
          <motion.p variants={lineIn} className="line-clamp-2 text-base text-space-grey text-balance">
            {cs.excerpt}
          </motion.p>
        )}
      </div>
    </MotionLink>
  );
}

/** List / grid switch at the end of the filter row. The yellow circle
 *  shrinks away from the old choice and springs up behind the new one. */
function ViewToggle({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  const reduced = useReducedMotion();
  const options = [
    { value: "list" as const, label: "List view", Icon: ViewListIcon },
    { value: "grid" as const, label: "Grid view", Icon: ViewGridIcon },
  ];
  return (
    <div role="group" aria-label="Project layout" className="ml-auto hidden shrink-0 items-center gap-1 rounded-pill border border-grey-200 p-1 md:flex">
      {options.map(({ value, label, Icon }) => {
        const on = view === value;
        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            aria-pressed={on}
            onClick={() => onChange(value)}
            className={cn(
              "relative flex size-10 items-center justify-center rounded-full transition-colors duration-300",
              on ? "text-black" : "text-grey-200 hover:text-white",
            )}
          >
            <AnimatePresence initial={false}>
              {on && (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-yellow"
                  initial={reduced ? { opacity: 0 } : { scale: 0 }}
                  animate={reduced ? { opacity: 1 } : { scale: 1 }}
                  exit={reduced ? { opacity: 0 } : { scale: 0, transition: { duration: 0.2, ease: "easeIn" } }}
                  transition={{ type: "spring", stiffness: 420, damping: 22 }}
                />
              )}
            </AnimatePresence>
            <motion.span
              className="relative"
              animate={on && !reduced ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <Icon size={18} />
            </motion.span>
          </button>
        );
      })}
    </div>
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
  const [view, setView] = useState<View>("list");
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE.list);
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

  // Open in the view this visitor picked last time.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(VIEW_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved === "grid" || saved === "list") setView(saved);
    } catch {}
  }, []);
  const changeView = (v: View) => {
    setView(v);
    setVisibleCount((n) => Math.max(n, PAGE_SIZE[v]));
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {}
  };

  // Reset visible count on filter change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE[view]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  // Infinite scroll via IntersectionObserver
  const loadMore = useCallback(() => {
    setVisibleCount((n) => n + PAGE_SIZE[view]);
  }, [view]);

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

        </motion.div>

        {/* Category filter (derived from the data) + view toggle.
            Phones: one row that scrolls sideways (like the service switcher). */}
        <motion.div
          variants={headerIn}
          initial={reduced ? false : "hidden"}
          animate="visible"
          className="-mx-(--container-padding) -mt-5 px-(--container-padding) py-3 md:mx-0 md:px-0 lg:-mt-10"
        >
          <div className="flex gap-2 overflow-x-auto scrollbar-none md:flex-wrap md:gap-4 md:overflow-visible">
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
            <ViewToggle view={view} onChange={changeView} />
          </div>
        </motion.div>

        {/* Rows, or a three-up grid of cards */}
        {view === "grid" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {visible.map((cs) => (
              <CaseStudyCard key={cs.id} cs={cs} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-[60px]">
            {visible.map((cs) => (
              <CaseStudyRow key={cs.id} cs={cs} />
            ))}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-1" aria-hidden />
      </div>
    </Section>
  );
}
