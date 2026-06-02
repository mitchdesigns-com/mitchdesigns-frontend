/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import { getCollection, getSingle } from "./strapi";
import { strapiMedia } from "./media";
import type {
  CaseStudy,
  Career,
  ClientLogo,
  FAQ,
  SeoData,
  Service,
  ServicePageData,
  StrapiImage,
  Talk,
  TeamMember,
  TechItem,
  Testimonial,
} from "./types";

/* ------------------------------------------------------------------
 * Case Studies
 * ------------------------------------------------------------------ */
export const getCaseStudies = (opts?: { featured?: boolean; limit?: number }) =>
  getCollection<CaseStudy>("/case-studies", {
    revalidate: 60,
    query: {
      "populate[cover]": "*",
      "populate[thumbnail]": "*",
      sort: "publishedAt:desc",
      ...(opts?.featured ? { "filters[featured][$eq]": "true" } : {}),
      ...(opts?.limit ? { "pagination[limit]": opts.limit } : {}),
    },
  });

export const getCaseStudy = async (
  slug: string,
): Promise<(CaseStudy & { id: number }) | null> => {
  const results = await getCollection<CaseStudy>("/case-studies", {
    revalidate: 60,
    query: {
      "filters[slug][$eq]": slug,
      populate: "*",
      "pagination[limit]": 1,
    },
  });
  return results[0] ?? null;
};

/* ------------------------------------------------------------------
 * Talks
 * ------------------------------------------------------------------ */
export const getTalks = () =>
  getCollection<Talk>("/blogs", {
    revalidate: 120,
    query: {
      "populate[cover]": "true",
      "populate[author][populate][avatar]": "true",
      sort: "publishedAt:desc",
    },
  });

export const getTalk = async (
  slug: string,
): Promise<(Talk & { id: number }) | null> => {
  const results = await getCollection<Talk>("/blogs", {
    revalidate: 120,
    query: {
      "filters[slug][$eq]": slug,
      "populate[cover]": "true",
      "populate[author][populate][avatar]": "true",
      "populate[sections][populate]": "*",
      "pagination[limit]": 1,
    },
  });
  return results[0] ?? null;
};

/* ------------------------------------------------------------------
 * Careers
 * ------------------------------------------------------------------ */
export const getCareers = () =>
  getCollection<Career>("/careers", {
    revalidate: 60,
    query: { sort: "publishedAt:desc" },
  });

export const getCareer = async (
  slug: string,
): Promise<(Career & { id: number }) | null> => {
  const results = await getCollection<Career>("/careers", {
    revalidate: 60,
    query: {
      "filters[slug][$eq]": slug,
      populate: "*",
      "pagination[limit]": 1,
    },
  });
  return results[0] ?? null;
};

/* ------------------------------------------------------------------
 * FAQs
 * ------------------------------------------------------------------ */
export const getFAQs = (category?: string) =>
  getCollection<FAQ>("/faqs", {
    revalidate: 300,
    query: {
      sort: "order:asc",
      ...(category ? { "filters[category][$eq]": category } : {}),
    },
  });

/* ------------------------------------------------------------------
 * Services
 * ------------------------------------------------------------------ */
export const getServices = () =>
  getCollection<Service>("/our-services", {
    revalidate: 300,
    query: { populate: "icon" },
  });

export const getService = async (
  slug: Service["slug"],
): Promise<(Service & { id: number }) | null> => {
  const results = await getCollection<Service>("/our-services", {
    revalidate: 300,
    query: {
      "filters[slug][$eq]": slug,
      populate: "icon",
      "pagination[limit]": 1,
    },
  });
  return results[0] ?? null;
};

/* ------------------------------------------------------------------
 * Testimonials
 * ------------------------------------------------------------------ */
export const getTestimonials = () =>
  getCollection<Testimonial>("/testimonials", {
    revalidate: 300,
    query: { "populate[0]": "avatar", "populate[1]": "companyLogo" },
  });

/* ------------------------------------------------------------------
 * Team
 * ------------------------------------------------------------------ */
export const getTeam = () =>
  getCollection<TeamMember>("/team-members", {
    revalidate: 300,
    query: { populate: "photo" },
  });

/* ------------------------------------------------------------------
 * Client logos
 * ------------------------------------------------------------------ */
export async function getClientLogos(): Promise<
  Array<{ name: string; src: string; alt: string }>
> {
  try {
    const items = await getCollection<ClientLogo>("/client-logos", {
      revalidate: 300,
      query: { populate: "logo", sort: "order:asc" },
    });
    return items.map((item) => ({
      name: item.name,
      src: strapiMedia(item.logo.url) ?? item.logo.url,
      alt: item.logo.alternativeText ?? item.name,
    }));
  } catch {
    const { fixtureClientLogos } = await import("./fixtures");
    return fixtureClientLogos.map((item) => ({
      name: item.name,
      src: item.logo.url,
      alt: item.logo.alternativeText ?? item.name,
    }));
  }
}

/* ------------------------------------------------------------------
 * Tech stack
 * ------------------------------------------------------------------ */
export const getTechStack = () =>
  getCollection<TechItem>("/tech-items", {
    revalidate: 600,
    query: { populate: "logo" },
  });

/* ------------------------------------------------------------------
 * Service page data
 * ------------------------------------------------------------------ */

// Strapi returns media as { url, alternativeText, ... }. Section types use plain strings.
function mediaUrl(
  m:
    | { url: string; alternativeText?: string | null }
    | string
    | null
    | undefined,
): string {
  if (!m) return "";
  if (typeof m === "string") return m;
  return m.url;
}

function mediaAlt(
  m:
    | { url: string; alternativeText?: string | null }
    | string
    | null
    | undefined,
): string | undefined {
  if (!m || typeof m === "string") return undefined;
  return m.alternativeText ?? undefined;
}

function mapSeo(raw: any): SeoData | undefined {
  if (!raw) return undefined;
  return {
    metaTitle: raw.metaTitle as string,
    metaDescription: raw.metaDescription as string,
    canonicalURL: (raw.canonicalURL as string) ?? undefined,
    ogTitle: (raw.ogTitle as string) ?? undefined,
    ogDescription: (raw.ogDescription as string) ?? undefined,
    ogImage: (raw.ogImage as StrapiImage) ?? undefined,
    noIndex: (raw.noIndex as boolean) ?? false,
    structuredData: (raw.structuredData as string) ?? undefined,
  };
}

function mapServicePage(raw: any): ServicePageData {
  const hero = raw.hero;
  const prototypes = raw.prototypes;

  return {
    seo: mapSeo(raw.seo),
    hero: {
      title: hero.title,
      titleHighlights: hero.titleHighlights ?? undefined,
      subTitle: hero.subTitle ?? undefined,
      description: hero.description,
      image: hero.image ? mediaUrl(hero.image) : undefined,
      imageAlt: hero.image ? mediaAlt(hero.image) : undefined,
      cta: hero.cta ?? undefined,
      reverseLayout: hero.reverseLayout ?? undefined,
    },
    prototypes: {
      image: mediaUrl(prototypes.image),
      imageAlt: mediaAlt(prototypes.image),
      backgroundColor: prototypes.backgroundColor ?? undefined,
    },
    weGotYou: raw.weGotYou
      ? {
          title: raw.weGotYou.title,
          titleHighlights: raw.weGotYou.titleHighlights ?? undefined,
          titleTag: raw.weGotYou.titleTag ?? undefined,
          label: raw.weGotYou.label ?? undefined,
          description: raw.weGotYou.description,
          image: mediaUrl(raw.weGotYou.image),
          imageAlt: mediaAlt(raw.weGotYou.image),
          cta: raw.weGotYou.cta ?? undefined,
          theme: raw.weGotYou.theme ?? undefined,
          imagePosition: raw.weGotYou.imagePosition ?? undefined,
        }
      : undefined,
    whyUs: raw.whyUs
      ? {
          title: raw.whyUs.title,
          titleHighlights: raw.whyUs.titleHighlights ?? undefined,
          description: raw.whyUs.description ?? undefined,
          variant: raw.whyUs.variant ?? undefined,
          cards: (raw.whyUs.cards ?? []).map((c: any) => ({
            title: c.title,
            image: mediaUrl(c.image),
            imageAlt: mediaAlt(c.image),
            description: c.description,
          })),
        }
      : undefined,
    process: raw.process
      ? {
          title: raw.process.title,
          titleHighlights: raw.process.titleHighlights ?? undefined,
          description: raw.process.description ?? undefined,
          processCards: (raw.process.processCards ?? []).map((c: any) => ({
            stepNumber: c.stepNumber,
            title: c.title,
            image: mediaUrl(c.image),
            imageAlt: mediaAlt(c.image),
            description: c.description ?? [],
          })),
        }
      : undefined,
    support: raw.support
      ? {
          title: raw.support.title,
          titleHighlights: raw.support.titleHighlights ?? undefined,
          cards: (raw.support.cards ?? []).map((c: any) => ({
            title: c.title,
            image: mediaUrl(c.image),
            imageAlt: mediaAlt(c.image),
            description: c.description,
          })),
        }
      : undefined,
    featuresSimplified: raw.featuresSimplified
      ? {
          title: raw.featuresSimplified.title,
          titleHighlights: raw.featuresSimplified.titleHighlights ?? undefined,
          description: raw.featuresSimplified.description ?? undefined,
          image: mediaUrl(raw.featuresSimplified.image),
          imageAlt: mediaAlt(raw.featuresSimplified.image),
          featureCards: (raw.featuresSimplified.featureCards ?? []).map(
            (c: any) => ({
              title: c.title,
              label: c.label ?? undefined,
              description: c.description,
            }),
          ),
        }
      : undefined,
    accordion: raw.accordion
      ? {
          title: raw.accordion.title,
          titleHighlights: raw.accordion.titleHighlights ?? undefined,
          description: raw.accordion.description ?? undefined,
          image: mediaUrl(raw.accordion.image),
          imageAlt: mediaAlt(raw.accordion.image),
          accordion: (raw.accordion.accordion ?? ([] as any[])).map(
            (a: any, i: number) => ({
              id: a.id ?? String(i),
              title: a.title,
              content: a.content,
            }),
          ),
        }
      : undefined,
    numbers: raw.numbers
      ? {
          numbers: (raw.numbers.numbers ?? ([] as any[])).map((n: any) => ({
            value: n.value,
            title: n.title,
            description: n.description ?? undefined,
          })),
        }
      : undefined,
    brief: raw.brief
      ? {
          description: raw.brief.description,
          signature: raw.brief.signature ?? undefined,
        }
      : undefined,
    designsAdapt: raw.designsAdapt
      ? {
          title: raw.designsAdapt.title,
          titleHighlights: raw.designsAdapt.titleHighlights ?? undefined,
          description: raw.designsAdapt.description ?? undefined,
          cards: (raw.designsAdapt.cards ?? ([] as any[])).map((c: any) => ({
            title: c.title,
            description: c.description,
            image: mediaUrl(c.image),
            imageAlt: mediaAlt(c.image),
          })),
        }
      : undefined,
    moreAbout: raw.moreAbout
      ? {
          title: raw.moreAbout.title,
          titleHighlights: raw.moreAbout.titleHighlights ?? undefined,
          description: raw.moreAbout.description ?? undefined,
          cards: (raw.moreAbout.cards ?? ([] as any[])).map((c: any) => ({
            title: c.title,
            description: c.description,
            image: mediaUrl(c.image),
            imageAlt: mediaAlt(c.image),
          })),
        }
      : undefined,
  };
}

export async function getServicePageData(
  slug: Service["slug"],
): Promise<ServicePageData> {
  const results = await getCollection<Record<string, unknown>>(
    "/service-pages",
    {
      revalidate: 300,
      query: {
        "filters[slug][$eq]": slug,
        // Flat sections — one level of populate gets all their fields + media
        "populate[hero][populate]": "*",
        "populate[prototypes][populate]": "*",
        "populate[weGotYou][populate]": "*",
        "populate[brief][populate]": "*",
        "populate[featuresSimplified][populate]": "*",
        "populate[accordion][populate]": "*",
        "populate[numbers][populate]": "*",
        // Sections with repeatable sub-components that have their own images
        "populate[whyUs][populate][cards][populate]": "*",
        "populate[process][populate][processCards][populate]": "*",
        "populate[support][populate][cards][populate]": "*",
        "populate[designsAdapt][populate][cards][populate]": "*",
        "populate[moreAbout][populate][cards][populate]": "*",
        "populate[seo][populate]": "*",
      },
    },
  );

  const raw = results[0];
  if (!raw) {
    const { fixtureServicePages } = await import("./fixtures/servicePages");
    return fixtureServicePages[slug];
  }

  return mapServicePage(raw);
}

/* ------------------------------------------------------------------
 * Talks Page (single type)
 * ------------------------------------------------------------------ */

export type TalksPageData = {
  heading: string | null;
  subheading: unknown;
};

export const getTalksPage = (): Promise<TalksPageData | null> =>
  getSingle<TalksPageData>("/talks-page", { revalidate: 300 });
