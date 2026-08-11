/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import { getCollection, getCollectionAll, getSingle } from "./strapi";
import { strapiMedia } from "./media";
import { blocksToText } from "./blocks";
import { LEADS_URL } from "@/config/nav";
import type {
  AboutContent,
  AboutImage,
  CaseStudy,
  Career,
  CareersPageData,
  CaseStudiesPageData,
  ClientLogo,
  CtaBannerData,
  FAQ,
  FaqsPageData,
  HomePageData,
  OrderbasePageData,
  SiteSettings,
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
  try {
    const results = await getCollection<CaseStudyRaw>("/case-studies", {
      revalidate: 60,
      query: {
        "populate[cover]": "true",
        "populate[thumbnail]": "true",
        "populate[featuredThumbnail]": "true",
        "populate[logo]": "true",
        "populate[testimonial][populate]": "*",
        "populate[services]": "true",
        sort: "publishedAt:desc",
        ...(opts?.featured ? { "filters[featured][$eq]": "true" } : {}),
        ...(opts?.limit ? { "pagination[limit]": opts.limit } : {}),
      },
    });
    return results.map(normalizeCaseStudy);
  } catch {
    const { fixtureCaseStudies } = await import("./fixtures");
    let items = fixtureCaseStudies.map((s, i) => ({ ...s, id: i + 1 }));
    if (opts?.featured) items = items.filter((s) => (s as CaseStudy).featured);
    if (opts?.limit) items = items.slice(0, opts.limit);
    return items as Array<CaseStudy & { id: number }>;
  }
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
      "populate[featuredThumbnail]": "true",
      "populate[logo]": "true",
      "populate[testimonial][populate]": "*",
      "populate[services]": "true",
      "populate[content][populate]": "*",
      "populate[seo][populate]": "*",
      "pagination[limit]": 1,
    },
  }).catch(() => [] as CaseStudyRaw[]);

  const raw = results[0];
  if (raw) {
    const study = normalizeCaseStudy(raw) as CaseStudy & { id: number };
    study.seo = mapSeo((raw as any).seo);
    return study;
  }
  const { fixtureCaseStudies } = await import("./fixtures");
  const fx = fixtureCaseStudies.find((c) => c.slug === slug);
  return fx ? ({ ...fx, id: 0 } as CaseStudy & { id: number }) : null;
};

/* ------------------------------------------------------------------
 * Talks
 * ------------------------------------------------------------------ */
export const getTalks = async (): Promise<Array<Talk & { id: number }>> => {
  try {
    return await getCollectionAll<Talk>("/blogs", {
      revalidate: 120,
      query: {
        "populate[cover]": "true",
        "populate[author][populate][avatar]": "true",
        sort: "publishedAt:desc",
      },
    });
  } catch {
    const { fixtureTalks } = await import("./fixtures");
    return fixtureTalks.map((t, i) => ({ ...t, id: i + 1 }));
  }
};

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
  }).catch(() => [] as Talk[]);
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
  }).catch(() => [] as Array<Talk & { id: number }>);
  if (results[0]) {
    const talk = results[0];
    talk.seo = mapSeo((talk as any).seo);
    return talk;
  }
  const { fixtureTalks } = await import("./fixtures");
  return (fixtureTalks.find((t) => t.slug === slug) ?? null) as
    | (Talk & { id: number })
    | null;
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
export const getFAQs = async (
  category?: string,
): Promise<Array<FAQ & { id: number }>> => {
  try {
    return await getCollectionAll<FAQ>("/faqs", {
      revalidate: 300,
      query: {
        sort: "order:asc",
        ...(category ? { "filters[category][$eq]": category } : {}),
      },
    });
  } catch {
    const { fixtureFAQs } = await import("./fixtures");
    return category
      ? fixtureFAQs.filter((f) => f.category === category)
      : fixtureFAQs;
  }
};

/* ------------------------------------------------------------------
 * Services
 * ------------------------------------------------------------------ */
export const getServices = async (): Promise<Array<Service & { id: number }>> => {
  try {
    return await getCollection<Service>("/our-services", {
      revalidate: 300,
      query: { populate: "icon", sort: "order:asc" },
    });
  } catch {
    const { fixtureServices } = await import("./fixtures");
    return fixtureServices as Array<Service & { id: number }>;
  }
};

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
  }).catch(() => [] as Array<Service & { id: number }>);
  if (results[0]) return results[0];
  const { fixtureServices } = await import("./fixtures");
  return (fixtureServices.find((s) => s.slug === slug) ?? null) as
    | (Service & { id: number })
    | null;
};

/* ------------------------------------------------------------------
 * Testimonials
 * ------------------------------------------------------------------ */
export const getTestimonials = async (): Promise<
  Array<Testimonial & { id: number }>
> => {
  try {
    return await getCollection<Testimonial>("/testimonials", {
      revalidate: 300,
      query: { "populate[0]": "avatar", "populate[1]": "companyLogo" },
    });
  } catch {
    const { fixtureTestimonials } = await import("./fixtures");
    return fixtureTestimonials as Array<Testimonial & { id: number }>;
  }
};

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
    seo: mapSeo(raw.seo),
    hero: {
      badge: raw.hero?.badge ?? "",
      title: raw.hero?.title ?? "",
      description: blocksToText(raw.hero?.description) ?? "",
      panel: {
        title: raw.hero?.panel?.title ?? "",
        body: blocksToText(raw.hero?.panel?.body) ?? "",
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
      body: blocksToText(raw.approach?.body) ?? "",
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
        body: blocksToText(c.body) ?? "",
        image: aboutImage(c.image),
      })),
    },
  };
}

export const getAboutPage = async (): Promise<AboutContent> => {
  try {
    const raw = await getSingle<Record<string, any>>("/about-page", {
      revalidate: 300,
      query: {
        "populate[hero][populate]": "*",
        "populate[metrics][populate]": "*",
        "populate[approach][populate]": "*",
        "populate[innovate][populate]": "*",
        "populate[team][populate]": "*",
        "populate[story][populate][cards][populate]": "*",
        "populate[seo][populate]": "*",
      },
    });
    if (raw?.hero) return mapAboutPage(raw);
  } catch {
    /* fall through to fixture */
  }
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
        "populate[clientLogos][populate]": "logo",
        "populate[heroCards][populate]": "*",
      },
    });
    if (raw?.hero || raw?.about || raw?.orderbaseOverview) {
      return {
        faqHeading: raw.faqHeading ?? undefined,
        faqDescription: raw.faqDescription ?? undefined,
        hero: raw.hero
          ? {
              eyebrow: raw.hero.eyebrow ?? undefined,
              headline: raw.hero.headline,
              rotatingWords: parseWords(raw.hero.rotatingWords),
            }
          : undefined,
        about: raw.about
          ? {
              body: blocksToText(raw.about.body),
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
              description: blocksToText(raw.orderbaseOverview.description),
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
                description: blocksToText(c.description),
              })),
            }
          : undefined,
        clientLogos: Array.isArray(raw.clientLogos)
          ? raw.clientLogos
              .filter((c: any) => c?.logo?.url)
              .map((c: any) => ({
                src: strapiMedia(c.logo.url) ?? c.logo.url,
                alt: c.logo.alternativeText ?? c.name,
              }))
          : undefined,
        heroCards:
          Array.isArray(raw.heroCards) && raw.heroCards.length
            ? raw.heroCards.map((c: any) => ({
                label: c.label,
                sub: c.sub ?? undefined,
                accentColor: c.accentColor ?? undefined,
                video: c.video?.url
                  ? strapiMedia(c.video.url) ?? c.video.url
                  : undefined,
                fullVideo: c.fullVideo?.url
                  ? strapiMedia(c.fullVideo.url) ?? c.fullVideo.url
                  : undefined,
              }))
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
  const { fixtureOrderbasePage: fx } = await import("./fixtures");
  const mUrl = (m: any) => (m ? (strapiMedia(m?.url) ?? m?.url) : undefined);
  // json/repeatable string arrays -> string[]
  const strs = (v: any): string[] | undefined =>
    Array.isArray(v)
      ? v.map((x) => (typeof x === "string" ? x : (x?.value ?? x?.label ?? x?.word ?? "")))
      : undefined;

  try {
    const raw = await getSingle<Record<string, any>>("/orderbase-page", {
      revalidate: 300,
      query: {
        "populate[nav][populate]": "*",
        "populate[hero][populate]": "*",
        "populate[audience][populate]": "*",
        "populate[challenges][populate]": "*",
        "populate[opportunity][populate]": "*",
        "populate[platform][populate]": "*",
        "populate[showcase][populate]": "*",
        "populate[core][populate]": "*",
        "populate[featureTabs][populate][tabs][populate]": "*",
        "populate[payments][populate]": "*",
        "populate[integrations][populate]": "*",
        "populate[why][populate]": "*",
        "populate[pricing][populate][plans][populate]": "*",
        "populate[contact][populate]": "*",
        "populate[footer][populate][columns][populate]": "*",
      },
    });
    if (!raw || !(raw.hero || raw.pricing)) return fx;

    // Every section falls back to its fixture when the CMS field is empty, so a
    // partially-filled Orderbase entry still renders a complete page.
    const hero = raw.hero
      ? {
          ...fx.hero,
          ...raw.hero,
          image: mUrl(raw.hero.image) ?? fx.hero?.image,
          stats: raw.hero.stats?.length ? raw.hero.stats : (fx.hero?.stats ?? []),
          floatCards: raw.hero.floatCards?.length
            ? raw.hero.floatCards
            : (fx.hero?.floatCards ?? []),
        }
      : fx.hero;

    const challenges = raw.challenges
      ? {
          ...fx.challenges,
          ...raw.challenges,
          image: mUrl(raw.challenges.image) ?? fx.challenges?.image,
          items: raw.challenges.items?.length
            ? raw.challenges.items
            : (fx.challenges?.items ?? []),
        }
      : fx.challenges;

    const showcase = raw.showcase
      ? {
          ...fx.showcase,
          ...raw.showcase,
          image: mUrl(raw.showcase.image) ?? fx.showcase?.image,
          features: raw.showcase.features?.length
            ? raw.showcase.features
            : (fx.showcase?.features ?? []),
        }
      : fx.showcase;

    const payments = raw.payments
      ? {
          ...fx.payments,
          ...raw.payments,
          features: raw.payments.features?.length
            ? raw.payments.features
            : (fx.payments?.features ?? []),
          images: raw.payments.images?.length
            ? raw.payments.images.map((im: any) => ({
                src: mUrl(im.image) ?? im.src,
                alt: im.alt,
                slot: im.slot,
              }))
            : (fx.payments?.images ?? []),
        }
      : fx.payments;

    const pricing = raw.pricing
      ? {
          ...fx.pricing,
          ...raw.pricing,
          plans: raw.pricing.plans?.length
            ? raw.pricing.plans.map((p: any) => ({
                ...p,
                features: strs(p.features) ?? [],
                priceRows: p.priceRows ?? [],
              }))
            : (fx.pricing?.plans ?? []),
          // gmv + compare are json fields (complex tables) — used as-is
          gmv: raw.pricing.gmv ?? fx.pricing?.gmv,
          compare: raw.pricing.compare ?? fx.pricing?.compare,
        }
      : fx.pricing;

    return {
      meta: raw.meta ?? fx.meta,
      nav: raw.nav ?? fx.nav,
      hero,
      ribbon: strs(raw.ribbon) ?? fx.ribbon,
      audience: raw.audience ?? fx.audience,
      challenges,
      opportunity: raw.opportunity ?? fx.opportunity,
      platform: raw.platform
        ? {
            ...fx.platform,
            ...raw.platform,
            handleItems: strs(raw.platform.handleItems) ?? (fx.platform?.handleItems ?? []),
          }
        : fx.platform,
      showcase,
      core: raw.core ?? fx.core,
      // Strapi reserves `id`, so the tab component stores it as `slug`.
      featureTabs: raw.featureTabs?.tabs?.length
        ? {
            ...raw.featureTabs,
            tabs: raw.featureTabs.tabs.map((t: any) => ({
              id: t.slug ?? t.id ?? t.label,
              label: t.label,
              items: (t.items ?? []).map((it: any) => ({
                label: it.label,
                infoKey: it.infoKey ?? undefined,
              })),
            })),
          }
        : fx.featureTabs,
      payments,
      integrations: raw.integrations
        ? {
            ...raw.integrations,
            cards: (raw.integrations.cards ?? []).map((c: any) => ({
              ...c,
              chips: strs(c.chips) ?? [],
            })),
          }
        : fx.integrations,
      why: raw.why ?? fx.why,
      pricing,
      contact: raw.contact
        ? {
            ...fx.contact,
            ...raw.contact,
            planOptions: strs(raw.contact.planOptions) ?? (fx.contact?.planOptions ?? []),
          }
        : fx.contact,
      footer: raw.footer ?? fx.footer,
    };
  } catch {
    return fx;
  }
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
        "populate[experienceCards][populate]": "image",
      },
    });
    if (raw?.hero || (raw?.drives && raw.drives.length)) {
      return {
        hero: raw.hero
          ? {
              eyebrow: raw.hero.eyebrow ?? undefined,
              title: raw.hero.title,
              description: blocksToText(raw.hero.description),
            }
          : undefined,
        drives: (raw.drives ?? []).map((d: any) => ({ label: d.label })),
        experienceHeading: raw.experienceHeading ?? undefined,
        experienceCards:
          Array.isArray(raw.experienceCards) && raw.experienceCards.length
            ? raw.experienceCards.map((c: any) => ({
                image: c.image?.url
                  ? strapiMedia(c.image.url) ?? c.image.url
                  : null,
                title: c.title,
                body: blocksToText(c.body) ?? "",
              }))
            : undefined,
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
        description: blocksToText(raw.description),
        cta: raw.ctaLabel
          ? { label: raw.ctaLabel, href: raw.ctaHref ?? LEADS_URL }
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
 * Site Settings (single type) — global footer/contact/social
 * ------------------------------------------------------------------ */
/** Defaults match the values previously hardcoded in the Footer. */
const SITE_SETTINGS_FALLBACK: SiteSettings = {
  contactEmail: undefined,
  contactPhone: undefined,
  whatsappNumber: "+201014430669",
  whatsappLabel: "We’re on Whatsapp",
  newsletterTitle: "Join Our Newsletter",
  signatureText: "webdesign agency",
  tagline: "Design. Technology. Performance.",
  copyright: "© 2005-2026 Mitch Designs. All rights reserved.",
  socialLinks: [
    { platform: "facebook", url: "https://facebook.com/mitchdesigns" },
    { platform: "instagram", url: "https://instagram.com/mitchdesigns" },
    { platform: "linkedin", url: "https://linkedin.com/company/mitchdesigns" },
    { platform: "youtube", url: "https://youtube.com/@mitchdesigns" },
  ],
};

export const getSiteSettings = async (): Promise<SiteSettings> => {
  try {
    const raw = await getSingle<Record<string, any>>("/site-setting", {
      revalidate: 300,
      query: { "populate[socialLinks]": "*" },
    });
    if (raw && (raw.tagline || raw.whatsappNumber || raw.socialLinks?.length)) {
      return {
        contactEmail: raw.contactEmail ?? SITE_SETTINGS_FALLBACK.contactEmail,
        contactPhone: raw.contactPhone ?? SITE_SETTINGS_FALLBACK.contactPhone,
        whatsappNumber: raw.whatsappNumber ?? SITE_SETTINGS_FALLBACK.whatsappNumber,
        whatsappLabel: raw.whatsappLabel ?? SITE_SETTINGS_FALLBACK.whatsappLabel,
        newsletterTitle:
          raw.newsletterTitle ?? SITE_SETTINGS_FALLBACK.newsletterTitle,
        signatureText: raw.signatureText ?? SITE_SETTINGS_FALLBACK.signatureText,
        tagline: raw.tagline ?? SITE_SETTINGS_FALLBACK.tagline,
        copyright: raw.copyright ?? SITE_SETTINGS_FALLBACK.copyright,
        socialLinks: Array.isArray(raw.socialLinks) && raw.socialLinks.length
          ? raw.socialLinks
              .filter((s: any) => s?.platform && s?.url)
              .map((s: any) => ({ platform: s.platform, url: s.url }))
          : SITE_SETTINGS_FALLBACK.socialLinks,
      };
    }
  } catch {
    /* fall through to fallback */
  }
  return SITE_SETTINGS_FALLBACK;
};

/* ------------------------------------------------------------------
 * Simple page heroes (single types)
 * ------------------------------------------------------------------ */
const mapPageHero = (raw: Record<string, any> | null) =>
  raw?.hero?.title
    ? {
        eyebrow: raw.hero.eyebrow ?? undefined,
        title: raw.hero.title as string,
        description: blocksToText(raw.hero.description),
      }
    : undefined;

export const getCaseStudiesPage = async (): Promise<CaseStudiesPageData> => {
  try {
    const raw = await getSingle<Record<string, any>>("/case-studies-page", {
      revalidate: 300,
      query: { "populate[hero]": "*" },
    });
    return { hero: mapPageHero(raw) };
  } catch {
    return {};
  }
};

export const getFaqsPage = async (): Promise<FaqsPageData> => {
  try {
    const raw = await getSingle<Record<string, any>>("/faqs-page", {
      revalidate: 300,
      query: { "populate[hero]": "*" },
    });
    return { hero: mapPageHero(raw) };
  } catch {
    return {};
  }
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
export const getTrustReasons = async () => {
  try {
    const items = await getCollection<TrustReason>("/trust-reasons", {
      revalidate: 600,
      query: { populate: "image", sort: "order:asc" },
    });
    return items.map((r) => ({ ...r, body: blocksToText(r.body) ?? "" }));
  } catch {
    const { fixtureTrustReasons } = await import("./fixtures");
    return fixtureTrustReasons.map((r) => ({
      ...r,
      body: blocksToText(r.body) ?? "",
    }));
  }
};

/* ------------------------------------------------------------------
 * Tech stack
 * ------------------------------------------------------------------ */
export const getTechStack = async (): Promise<
  Array<TechItem & { id: number }>
> => {
  try {
    return await getCollection<TechItem>("/tech-items", {
      revalidate: 600,
      query: { populate: "logo" },
    });
  } catch {
    const { fixtureTechStack } = await import("./fixtures");
    return fixtureTechStack;
  }
};

/** Single type — heading copy for the homepage tech stack section. */
export const getTechStackSection = async (): Promise<
  (TechStackSection & { id: number }) | null
> => {
  try {
    const raw = await getSingle<TechStackSection>("/tech-stack-section", {
      revalidate: 600,
    });
    return raw ? { ...raw, description: blocksToText(raw.description) } : null;
  } catch {
    const { fixtureTechStackSection } = await import("./fixtures");
    return {
      ...fixtureTechStackSection,
      id: 0,
      description: blocksToText(fixtureTechStackSection.description),
    };
  }
};

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
            description: blocksToText(n.description),
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
  try {
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
    if (raw) return mapServicePage(raw);
  } catch {
    /* CMS unreachable (e.g. 502 during build) — fall through to fixture */
  }

  const { fixtureServicePages } = await import("./fixtures/servicePages");
  return fixtureServicePages[slug];
}

/* ------------------------------------------------------------------
 * Talks Page (single type)
 * ------------------------------------------------------------------ */

export type TalksPageData = {
  heading: string | null;
  subheading: unknown;
};

export const getTalksPage = (): Promise<TalksPageData | null> =>
  getSingle<TalksPageData>("/talks-page", { revalidate: 300 }).catch(() => null);
