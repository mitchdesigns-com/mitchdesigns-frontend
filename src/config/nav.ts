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

/** Marketing service slug → the lead funnel's project type (md-leads). */
const LEADS_FUNNEL_SERVICE: Partial<Record<ServiceSlug, string>> = {
  corporate: "corporate-website",
  ecommerce: "ecommerce",
  "mobile-app": "mobile-app",
  custom: "custom-web",
  "media-buying": "media-buying",
  "google-ads": "media-buying",
  seo: "seo",
};

/**
 * Where a service page's CTA goes: the funnel's start page with that service
 * and the consultation path preselected (`?service=ecommerce&action=schedule-call`),
 * so the visitor doesn't land on whatever they picked on an earlier visit.
 * (Per-service step links like `quote/<service>/1` skip the consultation
 * choice, so they aren't used.) No service → the plain start page.
 */
export function leadsUrl(service?: string): string {
  const funnelService = service ? LEADS_FUNNEL_SERVICE[service as ServiceSlug] : undefined;
  return funnelService ? `${LEADS_URL}?service=${funnelService}&action=schedule-call` : LEADS_URL;
}

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Our Services", href: null, hasChevron: true },
  { label: "Work", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Talks", href: "/talks" },
  { label: "FAQ", href: "/faqs" },
  { label: "Jobs", href: "/careers" },
  { label: "Schedule Consultation Meeting", href: LEADS_URL },
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
  /** Short pill label for the service switcher at the top of each service page. */
  shortLabel: string;
}[] = [
  {
    slug: "corporate",
    title: "Corporate Website",
    subtitle: "Design & Development",
    footerLabel: "Corporate Website Design",
    shortLabel: "Corporate",
  },
  {
    slug: "ecommerce",
    title: "eCommerce Platform",
    subtitle: "Custom Design & Development",
    footerLabel: "eCommerce Development",
    shortLabel: "eCommerce",
  },
  {
    slug: "mobile-app",
    title: "Mobile App",
    subtitle: "Design & Development",
    footerLabel: "Mobile App Design",
    shortLabel: "Mobile App",
  },
  {
    slug: "custom",
    title: "Custom Platform",
    subtitle: "Design & Development",
    footerLabel: "Custom Web Apps Development",
    shortLabel: "Software",
  },
  {
    slug: "media-buying",
    title: "Media Buying",
    subtitle: "Meta / TikTok / Google",
    footerLabel: "Media Buying",
    shortLabel: "Media Buying",
  },
  {
    slug: "seo",
    title: "Get Found on Google & AI",
    subtitle: "SEO / AEO",
    footerLabel: "SEO & AEO",
    shortLabel: "SEO & AEO",
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

/**
 * Services folded into another one: no row, menu item or page of their own.
 * Their URL redirects to the target (see `redirects()` in next.config.ts).
 */
export const MERGED_SERVICES: Partial<Record<ServiceSlug, ServiceSlug>> = {
  "google-ads": "media-buying",
};

export function serviceHref(slug: ServiceSlug) {
  return `/services/${slug}` as const;
}
