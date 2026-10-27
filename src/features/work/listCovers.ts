import { isVideo } from "@/components/ui/Media";
import { strapiMedia } from "@/lib/cms/media";
import type { CaseStudy } from "@/lib/cms/types";

/**
 * Project covers: the 940×580 mockups in public/images/case-studies
 * (front-end only), used by the case-studies list and the homepage carousel. A CMS `listCover`
 * wins over these; projects with neither keep their CMS cover.
 */
const SLUGS = new Set([
  "abu-auf", "axton-robotics", "cifc", "ecral", "exception", "fam-beef",
  "fort-arabesque", "fregys", "g-developments", "geely", "im-motors", "kemetland",
  "kouider", "la-poire", "laverde", "n-development", "ntg", "people-and-places",
  "rihlati", "sage", "sale-sucre", "sally-helmy", "smart-light", "soueast", "tank",
]);

/** A project's 940×580 mockup cover in public/images/case-studies. */
const mockup = (slug: string) => encodeURI(`/images/case-studies/${slug}-mockup 1.webp`);

export function listCover(slug: string): string | undefined {
  return SLUGS.has(slug) ? mockup(slug) : undefined;
}

/** The same mockup for the Featured Projects carousel (its cards share the
 *  940:580 shape, so it fills them edge to edge). */
export function featuredCover(slug: string): string | undefined {
  return SLUGS.has(slug) ? mockup(slug) : undefined;
}

/** Up to `count` projects for the Featured Projects carousel: the CMS's
 *  featured ones first, then others that have a mockup cover. */
export function pickFeatured<T extends { slug: string; featured?: boolean }>(all: T[], count: number): T[] {
  const featured = all.filter((c) => c.featured);
  const withCover = all.filter((c) => !c.featured && SLUGS.has(c.slug));
  return [...featured, ...withCover].slice(0, count);
}

/** A project's card image — the CMS list/featured image, else a still `cover`,
 *  else the bundled mockup. Never the hero: `cover` may be the hero video. */
export function cardImage(
  study: Pick<CaseStudy, "slug" | "title" | "cover" | "listCover" | "featuredThumbnail">,
): { src: string; mime?: string | null; alt: string } | null {
  const card =
    [study.listCover, study.featuredThumbnail].find((m) => m?.url) ??
    (study.cover && !isVideo(study.cover.url, study.cover.mime) ? study.cover : null);
  const src = strapiMedia(card?.url) ?? listCover(study.slug);
  return src ? { src, mime: card?.mime, alt: card?.alternativeText ?? study.title } : null;
}
