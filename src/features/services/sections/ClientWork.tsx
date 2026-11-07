import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { RichText } from "@/components/ui/RichText";
import { CardSlider } from "@/components/ui/CardSlider";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { Media, isVideo } from "@/components/ui/Media";
import { strapiMedia } from "@/lib/cms/media";
import { cn } from "@/lib/cn";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion";
import type { CaseStudy, RichText as RichTextValue } from "@/lib/cms/types";

type Study = CaseStudy & { id: number };

/** Columns that keep the logo rows even: 7 logos with up to 5 a row become 4 + 3. */
const balancedCols = (n: number, max: number) => Math.max(1, Math.ceil(n / Math.ceil(n / max)));
const SM_BASIS: Record<number, string> = { 1: "sm:basis-full", 2: "sm:basis-1/2", 3: "sm:basis-1/3", 4: "sm:basis-1/4" };
const LG_BASIS: Record<number, string> = {
  1: "lg:basis-full", 2: "lg:basis-1/2", 3: "lg:basis-1/3", 4: "lg:basis-1/4", 5: "lg:basis-1/5", 6: "lg:basis-1/6", 7: "lg:basis-1/7",
};

/**
 * "Brands that sell with us": the clients of one category (e.g. eCommerce) as
 * a logo wall, then their projects as cards, all linking into the Work section.
 * Heading copy from the CMS; projects from the case studies.
 */
export function ClientWork({
  title,
  description,
  studies,
  category,
}: {
  title: string;
  description?: RichTextValue;
  studies: Study[];
  /** Case-study category, used for the "all work" link filter. */
  category: string;
}) {
  const withLogo = studies.filter((s) => s.logo?.url);
  // Cards: projects with a proper card cover first.
  const cards = [...studies]
    .filter((s) => s.listCover?.url || s.cover?.url)
    .sort((a, b) => Number(!!b.listCover?.url) - Number(!!a.listCover?.url))
    .slice(0, 6);
  const allHref = `/case-studies?category=${encodeURIComponent(category)}`;

  return (
    <Section className="py-20 md:py-28">
      <div className="flex flex-col gap-12 md:gap-16">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-4">
            <h2 className="text-hero-3 text-left font-bold text-balance">{title}</h2>
            {description ? <RichText content={description} className="text-lg text-fg-muted text-balance" /> : null}
          </div>
          <Link
            href={allHref}
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-pill bg-black px-6 py-3 text-base font-medium text-white transition-opacity hover:opacity-80"
          >
            View all {category} work
            <ArrowRight size={18} />
          </Link>
        </Reveal>

        {/* Logo wall: rows kept even, a shorter last row sits centred */}
        <RevealStagger as="ul" stagger={0.07} className="-m-1.5 flex flex-wrap justify-center">
          {withLogo.map((s) => (
            <RevealItem
              as="li"
              key={s.slug}
              className={cn("basis-1/2 p-1.5", SM_BASIS[balancedCols(withLogo.length, 4)], LG_BASIS[balancedCols(withLogo.length, 7)])}
            >
              <Link
                href={`/case-studies/${s.slug}`}
                aria-label={`${s.client} case study`}
                className="group flex aspect-3/2 items-center justify-center rounded-card-sm border border-border bg-white p-3 transition-colors duration-300 hover:border-black"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={strapiMedia(s.logo!.url) ?? undefined}
                  alt={s.logo?.alternativeText || s.client}
                  className="size-full object-contain grayscale transition duration-300 group-hover:grayscale-0"
                />
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>

        {/* Project cards */}
        {cards.length > 0 && (
          <CardSlider scrollStep={384 + 16}>
            {cards.map((s) => {
              const src = strapiMedia(s.listCover?.url ?? s.cover?.url);
              const mime = s.listCover?.url ? s.listCover?.mime : s.cover?.mime;
              return (
                <Link
                  key={s.slug}
                  href={`/case-studies/${s.slug}`}
                  className="group flex w-80 flex-col overflow-hidden rounded-card bg-panel md:w-96"
                >
                  <div className="relative aspect-case-cover overflow-hidden">
                    {src && isVideo(src, mime) ? (
                      <Media src={src} mime={mime} alt={s.title} className="object-cover" />
                    ) : src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={src} alt={s.title} className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <h3 className="text-xl font-bold text-balance">{s.title}</h3>
                    {s.excerpt && <p className="text-base text-fg-muted text-balance">{s.excerpt}</p>}
                    <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold">
                      View case study
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </CardSlider>
        )}
      </div>
    </Section>
  );
}
