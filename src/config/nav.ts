/** External lead/quote funnel — moved to its own project (md-leads). */
export const LEADS_URL = "https://leads.mitchdesigns.com/";

/**
 * True when a CTA points at the leads app — the same destination as the header
 * CTA. Only these should suppress the header CTA when scrolled into view.
 */
export function isLeadsHref(href?: string | null): boolean {
  return !!href && href.startsWith("https://leads.mitchdesigns.com");
}

/**
 * A CTA that should route into the lead funnel: either an in-app `/quote` link
 * (legacy / CMS-authored) or the bare leads app. These get rewritten to the
 * service-specific funnel URL on service pages.
 */
export function isLeadFunnelHref(href?: string | null): boolean {
  return !!href && (href.startsWith("/quote") || isLeadsHref(href));
}

/**
 * Marketing service slug → lead-funnel service slug (md-leads routes). Only the
 * four productised services have a dedicated funnel; the rest fall back to the
 * leads home, which redirects gracefully.
 */
const LEADS_FUNNEL_SERVICE: Partial<Record<ServiceSlug, string>> = {
  corporate: "corporate-website",
  ecommerce: "ecommerce",
  "mobile-app": "mobile-app",
  custom: "custom-web",
};

/**
 * Deep link into the leads app with a service preselected, e.g.
 * `https://leads.mitchdesigns.com/quote/mobile-app/1`. Falls back to the leads
 * home for services without a dedicated funnel.
 */
export function leadsUrl(service?: string): string {
  const funnelService = service
    ? LEADS_FUNNEL_SERVICE[service as ServiceSlug]
    : undefined;
  return funnelService ? `${LEADS_URL}quote/${funnelService}/1` : LEADS_URL;
}

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Our Services", href: null, hasChevron: true },
  { label: "Work", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Talks", href: "/talks" },
  { label: "FAQ", href: "/faqs" },
  { label: "Jobs", href: "/careers" },
  { label: "Get Detailed Proposal", href: LEADS_URL },
] as const;

export const COMPANY_LINKS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/case-studies" },
  { label: "Agency", href: "/about" },
  { label: "Talks", href: "/talks" },
  { label: "FAQ", href: "/faqs" },
  { label: "Jobs", href: "/careers" },
] as const;

export type ServiceSlug =
  | "corporate"
  | "ecommerce"
  | "mobile-app"
  | "custom"
  | "media-buying"
  | "google-ads"
  | "seo";

export const SERVICES: {
  slug: ServiceSlug;
  title: string;
  subtitle: string | null;
  footerLabel: string;
}[] = [
  {
    slug: "corporate",
    title: "Corporate Website",
    subtitle: "Design & Development",
    footerLabel: "Corporate Website Design",
  },
  {
    slug: "ecommerce",
    title: "eCommerce Platform",
    subtitle: "Custom Design & Development",
    footerLabel: "eCommerce Development",
  },
  {
    slug: "mobile-app",
    title: "Mobile App",
    subtitle: "Design & Development",
    footerLabel: "Mobile App Design",
  },
  {
    slug: "custom",
    title: "Custom Platform",
    subtitle: "Design & Development",
    footerLabel: "Custom Web Apps Development",
  },
  {
    slug: "media-buying",
    title: "Media Buying",
    subtitle: "Meta / TikTok",
    footerLabel: "Media Buying",
  },
  {
    slug: "google-ads",
    title: "Google Ads",
    subtitle: null,
    footerLabel: "Google Ads",
  },
  {
    slug: "seo",
    title: "Rank With SEO",
    subtitle: null,
    footerLabel: "Rank With SEO",
  },
];

/**
 * Maps each service to the FAQ `category` whose entries feed that service's
 * accordion / FAQ filtering. Edit the right-hand values to match the category
 * names used in Strapi (Settings → FAQ entries).
 */
export const SERVICE_FAQ_CATEGORY: Record<ServiceSlug, string> = {
  corporate: "Corporate Website",
  ecommerce: "eCommerce website",
  "mobile-app": "Product Design",
  custom: "Custom Software",
  "media-buying": "Media Buying",
  "google-ads": "Google Ads",
  seo: "SEO / AGO",
};

export function serviceHref(slug: ServiceSlug) {
  return `/services/${slug}` as const;
}
