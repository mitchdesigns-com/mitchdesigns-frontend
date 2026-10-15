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

/** A CMS link component (`sections.link`). */
export type CmsLink = { label: string; href: string };

/** Keys of the shared animated line-icon set (`src/components/icons/lineIcons.ts`).
 *  Mirrors the `icon` enumeration on Strapi cards. */
export const LINE_ICON_KEYS = [
  "compass", "layers", "link", "pen", "buoy", "gauge", "grid", "board", "sparkle",
  "sync", "team", "phone", "target", "click", "funnel", "code", "globe", "search",
  "receipt", "card", "tag", "box", "lock", "pulse", "ab", "atom", "trend", "bell",
  "headset", "chat", "server", "monitor", "tablet",
] as const;
export type LineIconKey = (typeof LINE_ICON_KEYS)[number];

export type StrapiImage = {
  url: string;
  alternativeText?: string | null;
  /** e.g. "image/webp", "video/webm" — set by Strapi on every upload. */
  mime?: string | null;
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
  | { __component: "blocks.media-block"; file: StrapiImage; caption?: string | null; poster?: StrapiImage | null }
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
  /** 940:580 card image for the /case-studies grid; falls back to the bundled cover, then `cover`. */
  listCover?: StrapiImage;
  /** Image used by the Featured Projects coverflow; falls back to `cover`. */
  featuredThumbnail?: StrapiImage;
  content?: CaseStudyBlock[];
  featured?: boolean;
  publishedAt: string;
  /** Filter category — e.g. "Corporate", "eCommerce", "Mobile App", "Booking Website" */
  category?: string;
  /** Client logo displayed in the info panel */
  logo?: StrapiImage;
  /** Full-colour logo for the /case-studies info panel; falls back to `logo`. */
  logoColored?: StrapiImage;
  /** White/greyscale logo for the homepage logos grid. */
  logoGreyscale?: StrapiImage;
  /** Grid card testimonial — populated separately from the detail-page content zone */
  testimonial?: CaseStudyTestimonial;
  websiteUrl?: string;
  /** Hex colour for the box that frames the cover image (e.g. "#0b0f1a"). */
  bgColor?: string;
  /** CMS SEO override; falls back to title/tagline when unset. */
  seo?: SeoData;
};

export type BlogSection =
  | { __component: "blocks.rich-text"; body: unknown }
  | { __component: "blocks.media-block"; file: StrapiImage; caption?: string | null; poster?: StrapiImage | null };

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
    cta?: CmsLink;
  };
  metrics: Array<{ value: string; label: string }>;
  approach: {
    eyebrow: string;
    title: string;
    body: string;
    image?: AboutImage | null;
    cta?: CmsLink;
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
    /** Company film; falls back to the bundled showreel. */
    video?: string;
    videoPoster?: string;
    videoTitle?: string;
    caption?: string;
  };
  story: {
    eyebrow: string;
    /** Rich text (Strapi blocks) so editors can bold/italic words. */
    title: RichText;
    cards: Array<{ image?: AboutImage | null; body: string }>;
  };
  /** CMS SEO override; falls back to the hardcoded page metadata when unset. */
  seo?: SeoData;
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
  /** Picks the card's line icon; unset → guessed from the title. */
  icon?: LineIconKey | null;
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
  /** Image sequence played in place of `image` (e.g. the eCommerce order story). */
  story?: Array<{ src: string; alt: string }>;
};

export type WhyUsCard = {
  title: string;
  image: string;
  imageAlt?: string;
  description: RichText;
  /** Picks the card's line icon; unset → guessed from the title. */
  icon?: LineIconKey;
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
  /** One-line summary shown on the work-steps cards. */
  summary?: string;
};

export type ProcessSectionProps = {
  title: string;
  titleHighlights?: string[];
  description?: RichText;
  processCards: ProcessCard[];
  /** Mobile app flow: eyebrow, closing pose copy and phone screens. */
  eyebrow?: string;
  closingTitle?: string;
  closingText?: string;
  appScreens?: string[];
};

export type SupportCard = {
  title: string;
  image: string;
  imageAlt?: string;
  description: RichText;
  /** Picks the card's line icon; unset → guessed from the title. */
  icon?: LineIconKey;
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
  /** Picks the card's line icon; unset → guessed from the title. */
  icon?: LineIconKey;
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
  /** Picks the card's line icon; unset → guessed from the title. */
  icon?: LineIconKey;
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

/** One shot in a service-page hero reel. */
export type ServiceReelShot = {
  src: string;
  alt: string;
  label: string;
  /** Flat backdrop colour around the uncropped shot. */
  backdrop: string;
  /** Photographic shots fill the box edge to edge. */
  cover?: boolean;
};

/** Screen recording played inside the laptop / tablet scene. */
export type DeviceVideo = {
  webm?: string;
  mp4?: string;
  label?: string;
};

export type ServicePageData = {
  seo?: SeoData;
  heroReel?: ServiceReelShot[];
  deviceVideo?: DeviceVideo;
  techStack?: { title?: string; description?: string; highlight?: string };
  /** FAQ category shown on this page; unset → derived from the slug. */
  faqCategory?: string;
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
  /** Showreel; falls back to the bundled webm. */
  video?: string;
  videoPoster?: string;
  playLabel?: string;
  stopLabel?: string;
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
  /** Hand-drawn marks over phrases in `body`. */
  marks?: Array<{ phrase: string; shape: "strike" | "wave" | "swash" }>;
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

/** Content for a homepage hero floating card. Layout/position is fixed in code per slot. */
export type HomeHeroCard = {
  label: string;
  sub?: string;
  accentColor?: string;
  video?: string;
  fullVideo?: string;
};

export type HomePageData = {
  hero?: HomeHero;
  about?: HomeAboutSection;
  orderbaseOverview?: HomeOrderbaseOverview;
  /** Logos picked on the Home Page relation; empty/undefined → component shows all logos. */
  clientLogos?: Array<{ src: string; alt: string }>;
  /** Hero project cards; empty/undefined → component shows its built-in defaults. */
  heroCards?: HomeHeroCard[];
  /** FAQ section heading; empty/undefined → page uses its default copy. */
  faqHeading?: string;
  /** FAQ section intro; empty/undefined → page uses its default copy. */
  faqDescription?: string;
  faqDefaultCategory?: string;
  talksHeading?: string;
  talksReadMoreLabel?: string;
  talksCta?: CmsLink;
  /** "{count}" is replaced with the number of trust reasons. */
  trustHeading?: string;
  trustIntro?: string;
  trustCta?: CmsLink;
};

/* ------------------------------------------------------------------
 * Site Settings (single type) — global footer/contact/social
 * ------------------------------------------------------------------ */
export type SocialPlatform = "facebook" | "instagram" | "linkedin" | "youtube";

export type SiteSettings = {
  contactEmail?: string;
  contactPhone?: string;
  whatsappNumber?: string;
  whatsappLabel?: string;
  newsletterTitle?: string;
  signatureText?: string;
  tagline?: string;
  copyright?: string;
  socialLinks: Array<{ platform: SocialPlatform; url: string }>;
  /** Site-wide "Get Detailed Proposal" button. */
  primaryCta: CmsLink;
  legalLinks: CmsLink[];
  testimonialsHeading: string;
  testimonialsIntro: string;
};

/* ------------------------------------------------------------------
 * Simple page heroes (single types) — eyebrow / title / description
 * ------------------------------------------------------------------ */
export type PageHero = { eyebrow?: string; title: string; description?: string };
export type CaseStudiesPageData = { hero?: PageHero };
export type FaqsPageData = { hero?: PageHero };

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
  drives: Array<{ label: string; image?: string | null }>;
  experienceHeading?: string;
  experienceCards?: Array<{ image: string | null; title: string; body: string }>;
  positionsHeading?: string;
  applyLabel?: string;
  jobDetailsLabel?: string;
  applyNowLabel?: string;
  applyEmail?: string;
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

/* ------------------------------------------------------------------
 * Orderbase landing (V2) — the /orderbase microsite. Every section's copy
 * and numbers are editable in Strapi; the shape below is the contract shared
 * by the query mapper, fixtures, and the section components.
 *
 * `OrbIcon` is a 3D-icon key (see app/(orderbase)/orderbase/_lib/icons3d.ts).
 * Kept as a plain string so the CMS can reference any key without type churn.
 * ------------------------------------------------------------------ */
export type OrbIcon = string;
export type ObLink = { label: string; href: string };
export type ObCtaVariant = "red" | "dark" | "outline" | "ghost";

export type OrbPricingPlan = {
  icon: OrbIcon;
  name: string;
  tagline?: string;
  /** the "Best for …" line */
  audience?: string;
  /** Pro-style highlighted card */
  featured?: boolean;
  badge?: string;
  priceRows: Array<{ label: string; value: string; unit?: string; small?: boolean }>;
  gmvNote?: string;
  features: string[];
  ctaLabel?: string;
  ctaHref?: string;
  ctaVariant?: ObCtaVariant;
};

/** A row in the "Compare all features" matrix. `values` aligns to `compare.columns`.
 *  A cell of `true` = yes tick, `false` = no dash, string = text (e.g. "Up to 10"). */
export type OrbCompareRow = {
  label: string;
  /** feature id, links to the explainer popover (FEAT_INFO) */
  key?: string;
  values: Array<boolean | string>;
};

export type OrderbasePageData = {
  /** Strapi documentId — needed by the front-edit overlay to target this entry. */
  documentId?: string;
  meta?: { title?: string; description?: string };
  nav?: {
    links: ObLink[];
    ctaLabel?: string;
    ctaHref?: string;
  };
  hero?: {
    pill?: string;
    titleLead: string;
    titleAccent?: string;
    titleTail?: string;
    subtitle?: string;
    primaryCta?: ObLink;
    secondaryCta?: ObLink;
    stats: Array<{ value: string; suffix?: string; accent?: boolean; label: string }>;
    image?: string;
    imageAlt?: string;
    floatCards: Array<{ icon: OrbIcon; title: string; subtitle?: string }>;
  };
  ribbon: string[];
  audience?: {
    eyebrow?: string;
    title?: string;
    lead?: string;
    cards: Array<{ num: string; title: string }>;
  };
  challenges?: {
    eyebrow?: string;
    title?: string;
    items: Array<{ text: string }>;
    image?: string;
    imageAlt?: string;
  };
  opportunity?: {
    eyebrow?: string;
    title?: string;
    lead?: string;
    cards: Array<{ icon: OrbIcon; title: string; description?: string }>;
  };
  platform?: {
    eyebrow?: string;
    titleLead?: string;
    titleAccent?: string;
    lead?: string;
    categories: Array<{ icon: OrbIcon; label: string }>;
    handleTitle?: string;
    handleItems: string[];
  };
  showcase?: {
    eyebrow?: string;
    titleLead?: string;
    titleAccent?: string;
    image?: string;
    imageAlt?: string;
    features: Array<{ icon: OrbIcon; title: string; description?: string }>;
  };
  core?: {
    eyebrow?: string;
    title?: string;
    cards: Array<{ num: string; title: string; description?: string }>;
  };
  featureTabs?: {
    eyebrow?: string;
    title?: string;
    lead?: string;
    tabs: Array<{
      id: string;
      label: string;
      items: Array<{ label: string; infoKey?: string }>;
    }>;
  };
  payments?: {
    eyebrow?: string;
    title?: string;
    lead?: string;
    features: Array<{ icon: OrbIcon; title: string; description?: string }>;
    images: Array<{ src: string; alt?: string; slot: "phone" | "credit" | "wallet" }>;
  };
  integrations?: {
    eyebrow?: string;
    title?: string;
    cards: Array<{
      num: string;
      icon: OrbIcon;
      title: string;
      description?: string;
      chips: string[];
    }>;
  };
  why?: {
    eyebrow?: string;
    title?: string;
    lockupTag?: string;
    points: Array<{ value: string; suffix?: string; title: string; description?: string }>;
    banner?: string;
  };
  pricing?: {
    eyebrow?: string;
    title?: string;
    lead?: string;
    plans: OrbPricingPlan[];
    gmv?: {
      title?: string;
      lead?: string;
      columns: string[];
      rows: Array<{ cells: string[] }>;
      footnote?: string;
    };
    compare?: {
      title?: string;
      columns: Array<{ id: string; name: string; tagline?: string; featured?: boolean }>;
      groups: Array<{ name: string; rows: OrbCompareRow[] }>;
      footnote?: string;
    };
  };
  contact?: {
    eyebrow?: string;
    title?: string;
    lead?: string;
    methods: Array<{ icon: OrbIcon; label: string; value: string; href: string }>;
    formTitle?: string;
    formNote?: string;
    planOptions: string[];
    whatsappNumber?: string;
    submitLabel?: string;
  };
  footer?: {
    tagline?: string;
    columns: Array<{ title: string; links: ObLink[] }>;
    bottomLeft?: string;
    bottomRight?: string;
  };
};
