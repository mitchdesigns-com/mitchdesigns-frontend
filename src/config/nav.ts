/** External lead/quote funnel — moved to its own project (md-leads). */
export const LEADS_URL = "https://leads.mitchdesigns.com/";

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
