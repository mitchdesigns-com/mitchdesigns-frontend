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
  body?: unknown; // Strapi blocks / markdown
  featured?: boolean;
  publishedAt: string;
  /** Filter category — e.g. "Corporate", "eCommerce", "Mobile App", "Booking Website" */
  category?: string;
  /** Client logo displayed in the info panel */
  logo?: StrapiImage;
  /** Paired testimonial shown in the right panel of the grid card */
  testimonial?: CaseStudyTestimonial;
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

export type TechItem = {
  name: string;
  category: string;
  logo: StrapiImage;
};

export type ClientLogo = {
  name: string;
  logo: StrapiImage;
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
  theme?: "light" | "beige";
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
  image: string;
  imageAlt?: string;
  description: string[];
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
