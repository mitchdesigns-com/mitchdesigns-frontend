/**
 * Content models — mirror Strapi schema 1:1.
 * Adjust field names here when the Strapi types change.
 */
import type { ServiceSlug } from "@/config/nav";

/**
 * Strapi Blocks rich-text content. The runtime shape is an array of block
 * nodes (paragraphs, headings, lists, etc.). Use <RichText content={...} />
 * to render. Typed as `unknown` so fixtures can still pass plain strings
 * during local dev before Strapi is populated.
 */
export type RichText = unknown;

export type StrapiImage = {
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: { url: string; width: number; height: number };
    small?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
  };
};

export type CaseStudyTestimonial = {
  quote: string;
  author: string;
  role: string;
  avatar?: StrapiImage;
};

export type CaseStudyBlock =
  | { __component: "blocks.rich-text"; body: unknown }
  | { __component: "blocks.image-pair"; left: StrapiImage; right: StrapiImage }
  | { __component: "blocks.media-block"; file: StrapiImage; caption?: string | null }
  | { __component: "blocks.centered-quote"; quote: string }
  | { __component: "blocks.color-palette"; swatches: Array<{ name: string; hex: string }> }
  | { __component: "blocks.case-point"; title: string; body: string }
  | { __component: "blocks.case-testimonial"; quote: string; author: string; role?: string; avatar?: StrapiImage };

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  tagline: string;
  excerpt: string;
  services: string[]; // e.g. ["Digital roadmap & strategy", "Website design & development", "SEO"]
  year: number;
  cover: StrapiImage;
  thumbnail?: StrapiImage;
  /** Image used by the Featured Projects coverflow; falls back to `cover`. */
  featuredThumbnail?: StrapiImage;
  content?: CaseStudyBlock[];
  featured?: boolean;
  publishedAt: string;
  /** Filter category — e.g. "Corporate", "eCommerce", "Mobile App", "Booking Website" */
  category?: string;
  /** Client logo displayed in the info panel */
  logo?: StrapiImage;
  /** Grid card testimonial — populated separately from the detail-page content zone */
  testimonial?: CaseStudyTestimonial;
  websiteUrl?: string;
  /** Hex colour for the box that frames the cover image (e.g. "#0b0f1a"). */
  bgColor?: string;
};

export type BlogSection =
  | { __component: "blocks.rich-text"; body: unknown }
  | { __component: "blocks.media-block"; file: StrapiImage; caption?: string | null };

export type Author = {
  name: string;
  avatar?: StrapiImage;
};

export type Seo = {
  metaTitle: string;
  metaDescription: string;
  canonicalURL?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: StrapiImage;
  noIndex?: boolean;
  structuredData?: unknown;
};

export type Talk = {
  slug: string;
  title: string;
  excerpt: string;
  cover?: StrapiImage;
  sections?: BlogSection[];
  author?: Author;
  seo?: Seo;
  publishedAt?: string;
  category?: "Design" | "Development" | "Marketing" | "SEO" | "Business";
  readTime?: number;
  featured?: boolean;
  // Legacy / fixture-only fields
  event?: string;
  date?: string;
  tags?: string[];
};

export type Career = {
  slug: string;
  title: string;
  team: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  location: string;
  remote: boolean;
  excerpt: string;
  /** Optional hero illustration shown on the detail page. */
  image?: StrapiImage;
  /** Pull-quote rendered as a highlighted box above the content sections. */
  quote?: string;
  /** Ordered content sections (Responsibilities, Qualifications, Benefits, …). */
  sections?: Array<{ heading: string; body: string }>;
  /** Legacy rich-text body — rendered only when `sections` is empty. */
  body?: unknown;
  publishedAt: string;
};

export type FAQ = {
  question: string;
  answer: RichText;
  /** Optional grouping — e.g. "pricing" | "process" | "support" */
  category?: string;
  /** Manual sort order; lower first */
  order?: number;
};

export type Service = {
  /** Display order in the homepage services list — set in Strapi (ascending). */
  order?: number;
  slug: ServiceSlug;
  title: string;
  tagline: string;
  description: RichText;
  icon?: StrapiImage;
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating?: number; // 1–5
  avatar?: StrapiImage;
  companyLogo?: StrapiImage;
  googleReview?: boolean;
};

export type TeamMember = {
  name: string;
  role: string;
  photo: StrapiImage;
  bio?: RichText;
  socials?: { linkedin?: string; twitter?: string; github?: string };
};

/** Plain image reference used by presentational About sections. */
export type AboutImage = {
  url: string;
  alt?: string;
  /** Intrinsic dimensions from Strapi — used to derive card aspect ratio. */
  width?: number;
  height?: number;
};

/**
 * Single type — copy + media for the /about page (excluding the team grid,
 * which is driven by the `team-member` collection via `getTeam`).
 */
export type AboutContent = {
  hero: {
    badge: string;
    /** Newlines render as line breaks. */
    title: string;
    description: string;
    panel: { title: string; body: string };
    images: AboutImage[];
  };
  metrics: Array<{ value: string; label: string }>;
  approach: {
    eyebrow: string;
    title: string;
    body: string;
    image?: AboutImage | null;
  };
  innovate: {
    /** Scrolling headline (e.g. "Innovate Or Die"). */
    text: string;
    photos: AboutImage[];
  };
  team: {
    badge: string;
    heading: string;
    groupPhoto?: AboutImage | null;
  };
  story: {
    eyebrow: string;
    /** Rich text (Strapi blocks) so editors can bold/italic words. */
    title: RichText;
    cards: Array<{ image?: AboutImage | null; body: string }>;
  };
};

export type TechItem = {
  name: string;
  category: string;
  logo: StrapiImage;
};

/** Single type — heading copy for the homepage tech stack section. */
export type TechStackSection = {
  title: string;
  description?: string | null;
  /** Phrase(s) within `title` to underline in yellow; newline/comma separated. */
  highlight?: string | null;
};

export type ClientLogo = {
  name: string;
  logo: StrapiImage;
  order?: number;
};

/** Reason cards in the "Reasons Clients Trust MitchDesigns" section. */
export type TrustReason = {
  title: string;
  body: string;
  image?: StrapiImage | null;
  order?: number;
};

/* ------------------------------------------------------------------
 * Service page section prop types
 * Each section component re-exports its own type; these live here
 * so fixtures and queries can reference them without importing
 * from feature components (which may be client-only).
 * ------------------------------------------------------------------ */

export type ServiceHeroProps = {
  title: string;
  titleHighlights?: string[];
  subTitle?: string;
  description: RichText;
  image?: string;
  imageAlt?: string;
  cta?: { label: string; href: string };
  reverseLayout?: boolean;
};

export type PrototypesProps = {
  image: string;
  imageAlt?: string;
  /** Tailwind bg class applied to the section, e.g. "bg-panel" */
  backgroundColor?: string;
};

export type WeGotYouProps = {
  title: string;
  titleHighlights?: string[];
  titleTag?: "h2" | "h3";
  label?: string;
  description: RichText;
  image: string;
  imageAlt?: string;
  cta?: { label: string; href: string };
  theme?: "light" | "dark" | "beige";
  imagePosition?: "left" | "right";
};

export type WhyUsCard = {
  title: string;
  image: string;
  imageAlt?: string;
  description: RichText;
};

export type WhyUsSectionProps = {
  title: string;
  titleHighlights?: string[];
  description?: RichText;
  cards: WhyUsCard[];
  /** "slider" is a Phase 4 drag carousel; falls back to grid until then */
  variant?: "grid" | "slider";
};

export type ProcessCard = {
  stepNumber: number;
  title: string;
  stepIcon?: string;
  stepIconAlt?: string;
  image: string;
  imageAlt?: string;
  description: RichText;
};

export type ProcessSectionProps = {
  title: string;
  titleHighlights?: string[];
  description?: RichText;
  processCards: ProcessCard[];
};

export type SupportCard = {
  title: string;
  image: string;
  imageAlt?: string;
  description: RichText;
};

export type SupportSectionProps = {
  title: string;
  titleHighlights?: string[];
  description?: RichText;
  cards: SupportCard[];
};

export type FeatureCard = {
  title: string;
  label?: "New" | "Popular" | "Trending";
  description: RichText;
};

export type FeaturesSimplifiedProps = {
  title: string;
  titleHighlights?: string[];
  description?: RichText;
  image: string;
  imageAlt?: string;
  featureCards: FeatureCard[];
};

export type AccordionSectionProps = {
  title: string;
  titleHighlights?: string[];
  description?: RichText;
  image: string;
  imageAlt?: string;
  accordion: Array<{ id: string; title: string; content: RichText }>;
};

export type NumberItem = {
  value: string;
  title: string;
  description?: string;
};

export type NumbersSectionProps = {
  numbers: NumberItem[];
};

export type BriefSectionProps = {
  description: RichText;
  signature?: string;
};

export type DesignsAdaptCard = {
  title: string;
  description: RichText;
  image: string;
  imageAlt?: string;
};

export type DesignsAdaptProps = {
  title: string;
  titleHighlights?: string[];
  description?: RichText;
  cards: DesignsAdaptCard[];
};

export type MoreAboutCard = {
  title: string;
  description: RichText;
  image: string;
  imageAlt?: string;
};

export type MoreAboutProps = {
  title: string;
  titleHighlights?: string[];
  description?: RichText;
  cards: MoreAboutCard[];
};

export type SeoData = {
  metaTitle: string;
  metaDescription: string;
  canonicalURL?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: StrapiImage;
  noIndex?: boolean;
  structuredData?: unknown;
};

export type ServicePageData = {
  seo?: SeoData;
  hero: ServiceHeroProps;
  prototypes: PrototypesProps;
  weGotYou?: WeGotYouProps;
  whyUs?: WhyUsSectionProps;
  process?: ProcessSectionProps;
  support?: SupportSectionProps;
  featuresSimplified?: FeaturesSimplifiedProps;
  accordion?: AccordionSectionProps;
  numbers?: NumbersSectionProps;
  brief?: BriefSectionProps;
  designsAdapt?: DesignsAdaptProps;
  moreAbout?: MoreAboutProps;
};

/* ------------------------------------------------------------------
 * Home Page (single type)
 * ------------------------------------------------------------------ */
export type HomeHero = {
  eyebrow?: string;
  headline: string;
  rotatingWords?: string[];
};

export type HomeStat = {
  value: string;
  unit?: string;
  label?: string;
};

export type HomeAboutSection = {
  /**
   * Full body copy that animates from grey → white on scroll. Authored as a
   * Strapi `blocks` field, flattened to a `\n\n`-joined string in the query
   * (inline marks are dropped — the char-by-char animation can't render them).
   */
  body?: string;
  signature?: string;
  stats: HomeStat[];
  cta?: { label: string; href: string };
};

export type OrderbaseFeature = {
  icon: "bell" | "dashboard" | "scooter" | "layout-grid";
  title: string;
  description?: string;
};

export type HomeOrderbaseOverview = {
  heading: string;
  description?: string;
  /** Word(s) within the description rendered in the Orderbase red accent. */
  descriptionHighlight?: string;
  countValue?: string;
  countLabel?: string;
  cta?: { label: string; href: string };
  cards: OrderbaseFeature[];
};

export type HomePageData = {
  hero?: HomeHero;
  about?: HomeAboutSection;
  orderbaseOverview?: HomeOrderbaseOverview;
};

/* ------------------------------------------------------------------
 * CTA Banner (single type)
 * ------------------------------------------------------------------ */
export type CtaBannerData = {
  title: string;
  description?: string;
  cta?: { label: string; href: string };
  bgImage?: string;
};

/* ------------------------------------------------------------------
 * Careers Page (single type)
 * ------------------------------------------------------------------ */
export type CareersPageData = {
  hero?: {
    eyebrow?: string;
    title: string;
    description?: string;
  };
  drives: Array<{ label: string }>;
};

/* ------------------------------------------------------------------
 * Orderbase Page (single type) — /orderbase microsite
 * ------------------------------------------------------------------ */
export type OrderbaseIconName =
  | "user"
  | "shopping-bag"
  | "scooter"
  | "building"
  | "bar-chart"
  | "map-pin"
  | "database"
  | "trending-up"
  | "route"
  | "app-window";

export type OrderbaseIconCard = {
  icon: OrderbaseIconName;
  title?: string;
  description: string;
};

export type OrderbasePricingPlan = {
  name: string;
  tagline?: string;
  price?: string;
  setupFee?: string;
  recommended?: boolean;
  highlighted?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  features: Array<{ label: string; disabled?: boolean }>;
};

export type OrderbasePageData = {
  hero?: {
    title: string;
    titleHighlight?: string;
    description?: string;
    primaryCtaLabel?: string;
    primaryCtaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
  };
  brands: Array<{ name: string; logo?: string }>;
  meet?: {
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
    features: OrderbaseIconCard[];
  };
  challenge?: {
    label?: string;
    title?: string;
    items: Array<{ title: string; description?: string; image?: string }>;
  };
  moreAbout?: {
    title?: string;
    description?: string;
    ctaLabel?: string;
    ctaHref?: string;
    features: OrderbaseIconCard[];
  };
  journey?: {
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
    steps: Array<{ number: string; title: string; description?: string; image?: string }>;
  };
  delivery?: {
    title?: string;
    subtitle?: string;
    leftCards: OrderbaseIconCard[];
    rightCards: OrderbaseIconCard[];
  };
  pricing?: {
    title?: string;
    subtitle?: string;
    plans: OrderbasePricingPlan[];
  };
  sinceFrom?: {
    pill?: string;
    title?: string;
    description?: string;
    statsTitle?: string;
    stats: Array<{ value: string; label?: string }>;
  };
  readyToOwn?: {
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };
};
