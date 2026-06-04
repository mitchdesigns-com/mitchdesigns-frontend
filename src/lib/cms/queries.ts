/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import { getCollection, getCollectionAll, getSingle } from "./strapi";
import { strapiMedia } from "./media";
import type {
  AboutContent,
  AboutImage,
  CaseStudy,
  Career,
  CareersPageData,
  ClientLogo,
  CtaBannerData,
  FAQ,
  HomePageData,
  OrderbasePageData,
  SeoData,
  Service,
  ServicePageData,
  StrapiImage,
  Talk,
  TeamMember,
  TechItem,
  TechStackSection,
  Testimonial,
  TrustReason,
} from "./types";

/* ------------------------------------------------------------------
 * Case Studies
 * ------------------------------------------------------------------ */
type CaseStudyRaw = Omit<CaseStudy, "services"> & {
  services?: Array<{ value: string }>;
};

function normalizeCaseStudy<T extends CaseStudyRaw>(raw: T): T & { services: string[] } {
  return { ...raw, services: (raw.services ?? []).map((s) => s.value) };
}

export const getCaseStudies = async (opts?: { featured?: boolean; limit?: number }): Promise<Array<CaseStudy & { id: number }>> => {
  const results = await getCollection<CaseStudyRaw>("/case-studies", {
    revalidate: 60,
    query: {
      "populate[cover]": "true",
      "populate[thumbnail]": "true",
      "populate[logo]": "true",
      "populate[testimonial][populate]": "*",
      "populate[services]": "true",
      sort: "publishedAt:desc",
      ...(opts?.featured ? { "filters[featured][$eq]": "true" } : {}),
      ...(opts?.limit ? { "pagination[limit]": opts.limit } : {}),
    },
  });
  return results.map(normalizeCaseStudy);
};

export const getCaseStudy = async (
  slug: string,
): Promise<(CaseStudy & { id: number }) | null> => {
  const results = await getCollection<CaseStudyRaw>("/case-studies", {
    revalidate: 60,
    query: {
      "filters[slug][$eq]": slug,
      "populate[cover]": "true",
      "populate[thumbnail]": "true",
      "populate[logo]": "true",
      "populate[testimonial][populate]": "*",
      "populate[services]": "true",
      "populate[content][populate]": "*",
      "populate[seo][populate]": "*",
      "pagination[limit]": 1,
    },
  });

  const raw = results[0];
  if (!raw) return null;
  return normalizeCaseStudy(raw) as CaseStudy & { id: number };
};

/* ------------------------------------------------------------------
 * Talks
 * ------------------------------------------------------------------ */
export const getTalks = () =>
  getCollectionAll<Talk>("/blogs", {
    revalidate: 120,
    query: {
      "populate[cover]": "true",
      "populate[author][populate][avatar]": "true",
      sort: "publishedAt:desc",
    },
  });

export const getRelatedTalks = async (
  excludeSlug: string,
  count = 2,
): Promise<Talk[]> => {
  const pool = await getCollection<Talk>("/blogs", {
    revalidate: 120,
    query: {
      "populate[cover]": "true",
      "filters[slug][$ne]": excludeSlug,
      sort: "publishedAt:desc",
      "pagination[limit]": 10,
    },
  });
  // Shuffle and pick `count` random items
  return pool.sort(() => Math.random() - 0.5).slice(0, count);
};

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
      "populate[seo][populate]": "*",
      "pagination[limit]": 1,
    },
  });
  return results[0] ?? null;
};

/* ------------------------------------------------------------------
 * Careers
 * ------------------------------------------------------------------ */
export const getCareers = async (): Promise<Array<Career & { id: number }>> => {
  try {
    return await getCollection<Career>("/careers", {
      revalidate: 60,
      query: { sort: "publishedAt:desc" },
    });
  } catch {
    const { fixtureCareers } = await import("./fixtures");
    return fixtureCareers;
  }
};

export const getCareer = async (
  slug: string,
): Promise<(Career & { id: number }) | null> => {
  try {
    const results = await getCollection<Career>("/careers", {
      revalidate: 60,
      query: {
        "filters[slug][$eq]": slug,
        populate: "*",
        "pagination[limit]": 1,
      },
    });
    if (results[0]) return results[0];
  } catch { /* fall through to fixtures */ }
  const { fixtureCareers } = await import("./fixtures");
  return fixtureCareers.find((c) => c.slug === slug) ?? null;
};

/* ------------------------------------------------------------------
 * FAQs
 * ------------------------------------------------------------------ */
export const getFAQs = (category?: string) =>
  getCollectionAll<FAQ>("/faqs", {
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
export const getTeam = async (): Promise<Array<TeamMember & { id: number }>> => {
  try {
    const data = await getCollection<TeamMember>("/team-members", {
      revalidate: 300,
      query: { populate: "photo" },
    });
    if (data.length) return data;
  } catch { /* fall through to fixtures */ }
  const { fixtureTeam } = await import("./fixtures");
  return fixtureTeam;
};

/* ------------------------------------------------------------------
 * About page (single type)
 * ------------------------------------------------------------------ */
function aboutImage(m: any): AboutImage | null {
  if (!m || !m.url) return null;
  return {
    url: strapiMedia(m.url) ?? m.url,
    alt: m.alternativeText ?? undefined,
    width: typeof m.width === "number" ? m.width : undefined,
    height: typeof m.height === "number" ? m.height : undefined,
  };
}

function mapAboutPage(raw: any): AboutContent {
  return {
    hero: {
      badge: raw.hero?.badge ?? "",
      title: raw.hero?.title ?? "",
      description: raw.hero?.description ?? "",
      panel: {
        title: raw.hero?.panel?.title ?? "",
        body: raw.hero?.panel?.body ?? "",
      },
      images: (raw.hero?.images ?? [])
        .map(aboutImage)
        .filter((i: AboutImage | null): i is AboutImage => i !== null),
    },
    metrics: (raw.metrics ?? []).map((m: any) => ({
      value: m.value,
      label: m.label,
    })),
    approach: {
      eyebrow: raw.approach?.eyebrow ?? "",
      title: raw.approach?.title ?? "",
      body: raw.approach?.body ?? "",
      image: aboutImage(raw.approach?.image),
    },
    innovate: {
      text: raw.innovate?.text ?? "",
      photos: (raw.innovate?.photos ?? [])
        .map(aboutImage)
        .filter((i: AboutImage | null): i is AboutImage => i !== null),
    },
    team: {
      badge: raw.team?.badge ?? "",
      heading: raw.team?.heading ?? "",
      groupPhoto: aboutImage(raw.team?.groupPhoto),
    },
    story: {
      eyebrow: raw.story?.eyebrow ?? "",
      title: raw.story?.title ?? "",
      cards: (raw.story?.cards ?? []).map((c: any) => ({
        body: c.body,
        image: aboutImage(c.image),
      })),
    },
  };
}

export const getAboutPage = async (): Promise<AboutContent> => {
  const raw = await getSingle<Record<string, any>>("/about-page", {
    revalidate: 300,
    query: {
      "populate[hero][populate]": "*",
      "populate[metrics][populate]": "*",
      "populate[approach][populate]": "*",
      "populate[innovate][populate]": "*",
      "populate[team][populate]": "*",
      "populate[story][populate][cards][populate]": "*",
    },
  });
  if (raw?.hero) return mapAboutPage(raw);

  const { fixtureAboutPage } = await import("./fixtures");
  return fixtureAboutPage;
};

/* ------------------------------------------------------------------
 * Home Page (single type)
 * ------------------------------------------------------------------ */
/** Hero rotating words are stored comma/newline-separated in Strapi. */
function parseWords(raw: unknown): string[] | undefined {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string") {
    const words = raw
      .split(/[,\n]/)
      .map((w) => w.trim())
      .filter(Boolean);
    return words.length ? words : undefined;
  }
  return undefined;
}

export const getHomePage = async (): Promise<HomePageData> => {
  try {
    const raw = await getSingle<Record<string, any>>("/home-page", {
      revalidate: 300,
      query: {
        "populate[hero]": "*",
        "populate[about][populate]": "*",
        "populate[orderbaseOverview][populate]": "*",
      },
    });
    if (raw?.hero || raw?.about || raw?.orderbaseOverview) {
      return {
        hero: raw.hero
          ? {
              eyebrow: raw.hero.eyebrow ?? undefined,
              headline: raw.hero.headline,
              rotatingWords: parseWords(raw.hero.rotatingWords),
            }
          : undefined,
        about: raw.about
          ? {
              intro: raw.about.intro ?? undefined,
              body: raw.about.body ?? undefined,
              signature: raw.about.signature ?? undefined,
              stats: (raw.about.stats ?? []).map((s: any) => ({
                value: s.value,
                unit: s.unit ?? undefined,
                label: s.label ?? undefined,
              })),
              cta: raw.about.ctaLabel
                ? { label: raw.about.ctaLabel, href: raw.about.ctaHref ?? "#" }
                : undefined,
            }
          : undefined,
        orderbaseOverview: raw.orderbaseOverview
          ? {
              heading: raw.orderbaseOverview.heading,
              description: raw.orderbaseOverview.description ?? undefined,
              descriptionHighlight:
                raw.orderbaseOverview.descriptionHighlight ?? undefined,
              countValue: raw.orderbaseOverview.countValue ?? undefined,
              countLabel: raw.orderbaseOverview.countLabel ?? undefined,
              cta: raw.orderbaseOverview.ctaLabel
                ? {
                    label: raw.orderbaseOverview.ctaLabel,
                    href: raw.orderbaseOverview.ctaHref ?? "/orderbase",
                  }
                : undefined,
              cards: (raw.orderbaseOverview.cards ?? []).map((c: any) => ({
                icon: c.icon,
                title: c.title,
                description: c.description ?? undefined,
              })),
            }
          : undefined,
      };
    }
  } catch {
    /* fall through to fixture */
  }
  const { fixtureHomePage } = await import("./fixtures");
  return fixtureHomePage;
};

/* ------------------------------------------------------------------
 * Orderbase Page (single type)
 * ------------------------------------------------------------------ */
export const getOrderbasePage = async (): Promise<OrderbasePageData> => {
  const mUrl = (m: any) => (m ? strapiMedia(m.url) ?? m.url : undefined);
  const iconCard = (c: any) => ({
    icon: c.icon,
    title: c.title ?? undefined,
    description: c.description,
  });
  try {
    const raw = await getSingle<Record<string, any>>("/orderbase-page", {
      revalidate: 300,
      query: {
        "populate[hero]": "*",
        "populate[brands][populate]": "*",
        "populate[meet][populate]": "*",
        "populate[challenge][populate][items][populate]": "*",
        "populate[moreAbout][populate]": "*",
        "populate[journey][populate][steps][populate]": "*",
        "populate[delivery][populate]": "*",
        "populate[pricing][populate][plans][populate]": "*",
        "populate[sinceFrom][populate]": "*",
        "populate[readyToOwn]": "*",
      },
    });
    if (raw?.hero) {
      return {
        hero: raw.hero ?? undefined,
        brands: (raw.brands ?? []).map((b: any) => ({
          name: b.name,
          logo: mUrl(b.logo),
        })),
        meet: raw.meet
          ? { ...raw.meet, features: (raw.meet.features ?? []).map(iconCard) }
          : undefined,
        challenge: raw.challenge
          ? {
              label: raw.challenge.label ?? undefined,
              title: raw.challenge.title ?? undefined,
              items: (raw.challenge.items ?? []).map((i: any) => ({
                title: i.title,
                description: i.description ?? undefined,
                image: mUrl(i.image),
              })),
            }
          : undefined,
        moreAbout: raw.moreAbout
          ? {
              ...raw.moreAbout,
              features: (raw.moreAbout.features ?? []).map(iconCard),
            }
          : undefined,
        journey: raw.journey
          ? {
              title: raw.journey.title ?? undefined,
              subtitle: raw.journey.subtitle ?? undefined,
              ctaLabel: raw.journey.ctaLabel ?? undefined,
              ctaHref: raw.journey.ctaHref ?? undefined,
              steps: (raw.journey.steps ?? []).map((s: any) => ({
                number: s.number,
                title: s.title,
                description: s.description ?? undefined,
                image: mUrl(s.image),
              })),
            }
          : undefined,
        delivery: raw.delivery
          ? {
              title: raw.delivery.title ?? undefined,
              subtitle: raw.delivery.subtitle ?? undefined,
              leftCards: (raw.delivery.leftCards ?? []).map(iconCard),
              rightCards: (raw.delivery.rightCards ?? []).map(iconCard),
            }
          : undefined,
        pricing: raw.pricing
          ? {
              title: raw.pricing.title ?? undefined,
              subtitle: raw.pricing.subtitle ?? undefined,
              plans: (raw.pricing.plans ?? []).map((p: any) => ({
                name: p.name,
                tagline: p.tagline ?? undefined,
                price: p.price ?? undefined,
                setupFee: p.setupFee ?? undefined,
                recommended: p.recommended ?? undefined,
                highlighted: p.highlighted ?? undefined,
                ctaLabel: p.ctaLabel ?? undefined,
                ctaHref: p.ctaHref ?? undefined,
                features: (p.features ?? []).map((f: any) => ({
                  label: f.label,
                  disabled: f.disabled ?? undefined,
                })),
              })),
            }
          : undefined,
        sinceFrom: raw.sinceFrom
          ? {
              pill: raw.sinceFrom.pill ?? undefined,
              title: raw.sinceFrom.title ?? undefined,
              description: raw.sinceFrom.description ?? undefined,
              statsTitle: raw.sinceFrom.statsTitle ?? undefined,
              stats: (raw.sinceFrom.stats ?? []).map((s: any) => ({
                value: s.value,
                label: s.label ?? undefined,
              })),
            }
          : undefined,
        readyToOwn: raw.readyToOwn ?? undefined,
      };
    }
  } catch {
    /* fall through to fixture */
  }
  const { fixtureOrderbasePage } = await import("./fixtures");
  return fixtureOrderbasePage;
};

/* ------------------------------------------------------------------
 * Careers Page (single type)
 * ------------------------------------------------------------------ */
export const getCareersPage = async (): Promise<CareersPageData> => {
  try {
    const raw = await getSingle<Record<string, any>>("/careers-page", {
      revalidate: 300,
      query: {
        "populate[hero]": "*",
        "populate[drives]": "*",
      },
    });
    if (raw?.hero || (raw?.drives && raw.drives.length)) {
      return {
        hero: raw.hero
          ? {
              eyebrow: raw.hero.eyebrow ?? undefined,
              title: raw.hero.title,
              description: raw.hero.description ?? undefined,
            }
          : undefined,
        drives: (raw.drives ?? []).map((d: any) => ({ label: d.label })),
      };
    }
  } catch {
    /* fall through to fixture */
  }
  const { fixtureCareersPage } = await import("./fixtures");
  return fixtureCareersPage;
};

/* ------------------------------------------------------------------
 * CTA Banner (single type)
 * ------------------------------------------------------------------ */
export const getCtaBanner = async (): Promise<CtaBannerData> => {
  try {
    const raw = await getSingle<Record<string, any>>("/cta-banner", {
      revalidate: 300,
      query: { populate: "bgImage" },
    });
    if (raw?.title) {
      return {
        title: raw.title,
        description: raw.description ?? undefined,
        cta: raw.ctaLabel
          ? { label: raw.ctaLabel, href: raw.ctaHref ?? "/quote" }
          : undefined,
        bgImage: raw.bgImage
          ? strapiMedia(raw.bgImage.url) ?? raw.bgImage.url
          : undefined,
      };
    }
  } catch {
    /* fall through to fixture */
  }
  const { fixtureCtaBanner } = await import("./fixtures");
  return fixtureCtaBanner;
};

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
 * Trust reasons ("Reasons Clients Trust MitchDesigns")
 * ------------------------------------------------------------------ */
export const getTrustReasons = () =>
  getCollection<TrustReason>("/trust-reasons", {
    revalidate: 600,
    query: { populate: "image", sort: "order:asc" },
  });

/* ------------------------------------------------------------------
 * Tech stack
 * ------------------------------------------------------------------ */
export const getTechStack = () =>
  getCollection<TechItem>("/tech-items", {
    revalidate: 600,
    query: { populate: "logo" },
  });

/** Single type — heading copy for the homepage tech stack section. */
export const getTechStackSection = (): Promise<
  (TechStackSection & { id: number }) | null
> => getSingle<TechStackSection>("/tech-stack-section", { revalidate: 600 });

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
            stepIcon: c.stepIcon ? mediaUrl(c.stepIcon) : undefined,
            stepIconAlt: c.stepIcon ? mediaAlt(c.stepIcon) : undefined,
            image: mediaUrl(c.image),
            imageAlt: mediaAlt(c.image),
            description: c.description ?? undefined,
          })),
        }
      : undefined,
    support: raw.support
      ? {
          title: raw.support.title,
          titleHighlights: raw.support.titleHighlights ?? undefined,
          description: raw.support.description ?? undefined,
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
