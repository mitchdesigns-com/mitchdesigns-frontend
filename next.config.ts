import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/* ------------------------------------------------------------------------
 * SEO migration map: old mitchdesigns.com URLs → rebuild URLs
 *
 * Covers three generations of URLs:
 *   1. the previous Next.js site (its sitemap, 140 URLs),
 *   2. the 99 rules that site's own next.config.mjs carried forward, and
 *   3. the WordPress-era paths behind those (/portfolio, /case_study, /job).
 *
 * Rules: every destination is a 200 (never another redirect — one hop only),
 * every rule is a 301, and sources are written WITHOUT a trailing slash
 * because Next 308s `/path/` to `/path` before matching.
 * ------------------------------------------------------------------------ */

// ── Legacy post slugs: the old site served these posts at the site root
// (WordPress era) before moving them under /talks-website-design-and-development.
const LEGACY_TALK_SLUGS = [
  "10-elements-for-a-high-converting-website",
  "10-questions-for-performance-marketing-agency",
  "2024-e-commerce-in-dubai",
  "advertising-and-media-buying-agency-in-egypt",
  "answering-7-faqs-about-seo-services-in-dubai",
  "black-friday-media-buying-for-ecommerce",
  "building-an-ecommerce-online-store-in-egypt",
  "cheers-to-a-new-year",
  "conversion-rate-optimization-in-egypt",
  "custom-website-design-vs-template-design",
  "e-commerce-website-design-in-egypt",
  "ecommerce-shipping-company-in-egypt",
  "egypts-ecommerce-growth-in-2020",
  "fintech-in-saudi-arabia",
  "guide-to-the-power-of-web-design-in-dubai",
  "how-professional-web-design-company-boost-seo",
  "how-to-build-an-ecommerce-website-in-egypt",
  "how-to-choose-media-buying-agency-in-egypt",
  "how-to-enter-saudi-e-commerce-market",
  "how-to-find-the-best-seo-agency-in-egypt",
  "improve-your-business-website-in-2023",
  "in-house-team-vs-hiring-media-buying-agency",
  "intuitive-website-navigation",
  "is-wordpress-secure-to-protect-your-website",
  "media-buying-and-ecommerce-website-design",
  "mistakes-with-media-buying-agency-in-egypt",
  "optimize-ecommerce-website-for-high-seasons",
  "our-website-design-and-development-process",
  "paypal-now-egypt",
  "saudi-e-commerce-market-what-you-need-to-know",
  "seo-in-egypt-sales-for-ecommerce-website",
  "seo-mistakes-ecommerce-websites-in-egypt-make",
  "showcasing-recognitions-appreciations",
  "the-fintech-industry-in-egypt-in-2023",
  "the-power-of-storytelling-in-website-design",
  "the-power-of-videos-in-web-design",
  "the-secret-to-high-converting-website",
  "top-10-seo-mistakes-in-website-design",
  "user-interfaces",
  "web-design-inspiration-for-ecommerce-fashion",
  "website-design-effect-on-ecommerce-in-egypt",
  "website-design-for-global-audiences",
  "why-you-business-needs-seo-agency-in-egypt",
  "why-you-dont-need-a-mobile-app",
  "woocommerce-shopify-magento-custom",
  "woocommerce-vs-laravel-for-ecommerce",
  "wordpress-for-web-design-company-in-egypt",
  "wordpress-growing-ecommerce-business-in-egypt",
  "your-guide-to-a-successful-online-presence",
];

// Old URLs whose slug changed on the way to /talks, plus the WordPress
// /feed/ variants that still get crawled.
const LEGACY_TALK_ALIASES: Record<string, string> = {
  "/5-reasons-why-website-maintenance-is-vita": "5-reasons-why-website-maintenance-is-vital",
  "/building-an-ecommerce-online-store-in-egypt/feed": "building-an-ecommerce-online-store-in-egypt",
  "/custom-website-design-vs-template-design/feed": "custom-website-design-vs-template-design",
  "/five-digital-marketing-channels-to-increase-sales": "digital-marketing-channels-to-increase-sales",
  "/improve-your-online-presence-in-2023-the-importance-of-updating-your-business-website": "improve-your-business-website-in-2023",
  "/italks-website-design-and-development/ntuitive-website-navigation": "intuitive-website-navigation",
  "/our-process-of-designing-and-delivering-a-fabulous-website-2018": "our-website-design-and-development-process",
  "/review-why-did-we-choose-wordpress-for-our-web-design-company-in-egypt": "wordpress-for-web-design-company-in-egypt",
  "/user-interfaces/feed": "user-interfaces",
  "/website-design-for-global-audiences/feed": "website-design-for-global-audiences",
};

/** Posts renamed when Titan became Orderbase — old slug on either old or new blog path. */
const TITAN_TO_ORDERBASE: Record<string, string> = {
  "titan-vs-other-headless-ecommerce-platforms": "orderbase-vs-other-headless-ecommerce-platforms",
  "mobile-checkout-ux-titan": "mobile-checkout-ux-orderbase",
  "titan-stop-sale-ecommerce-stock-sync": "orderbase-stop-sale-ecommerce-stock-sync",
  "laravel-react-ecommerce-platform-titan": "laravel-react-ecommerce-platform-orderbase",
  "solve-cart-abandonment-titan-ecommerce-platform": "solve-cart-abandonment-orderbase-ecommerce-platform",
  "titan-features-for-large-retailer": "orderbase-features-for-large-retailer",
  "titan-headless-ecommerce-platform-guide": "orderbase-headless-ecommerce-platform-guide",
};

/** Case studies whose slug changed in the rebuild. */
const RENAMED_CASE_STUDIES: Record<string, string> = {
  "abdelrahim-koueider": "kouider",
  lapoire: "la-poire",
  "people-places": "people-and-places",
};

/** Case studies the rebuild does not publish — the index is the nearest page. */
const REMOVED_CASE_STUDIES = [
  "almaza-bay",
  "atayeb",
  "dresscode",
  "go-bus",
  "gobus-app",
  "golimo",
  "lychee",
  "mg",
  "naseej",
  "sidekick",
];

/** Flat pages on the old site, and the page that replaced each. */
const PAGE_MOVES: Record<string, string> = {
  // Core pages
  "/about-mitchdesigns-website-design-company": "/about",
  "/privacy-policy": "/privacy",
  "/get-in-touch": "/contact",
  "/get-in-touch/drop-a-message": "/contact",
  "/drop-a-message": "/contact",
  "/get-in-touch/ask-for-a-quick-quote": "/quote",
  "/ask-for-a-quick-quote": "/quote",
  "/media-buying-calendly": "/quote/schedule-call",
  // Blog index, old and WordPress-era
  "/talks-website-design-and-development": "/talks",
  "/blog": "/talks",
  "/category/talks": "/talks",
  // Jobs → careers
  "/jobs": "/careers",
  "/job/php-web-developer": "/careers",
  "/job/seo-specialist": "/careers",
  "/job/frontend-development-internship": "/careers",
  // Service landers → /services/<slug>
  "/corporate-web-design": "/services/corporate",
  "/top-web-design-company-in-dubai": "/services/corporate",
  "/top-web-design-company-in-saudi-arabia": "/services/corporate",
  "/ecommerce-solutions": "/services/ecommerce",
  "/services": "/services/ecommerce",
  "/ecommerce": "/services/ecommerce",
  "/website-design": "/services/ecommerce",
  "/website-design-and-development": "/services/ecommerce",
  "/woocommerce-pwa": "/services/ecommerce",
  "/product-design": "/services/custom",
  "/product-design-service": "/services/custom",
  "/brand-strategy": "/services/custom",
  "/tech-and-digital-consultation": "/services/custom",
  "/tech-and-digital-consulation": "/services/custom", // typo preserved from the old config
  "/google-ads-management": "/services/media-buying",
  "/social-media-buying": "/services/media-buying",
  "/social-media-ads": "/services/media-buying",
  "/services/google-ads": "/services/media-buying", // MERGED_SERVICES in src/config/nav.ts
  // Old keyword landers with no equivalent page
  "/web-design-companies-in-egypt": "/",
  "/web-design-company-in-egypt": "/",
  "/top-website-design-company-in-saudi-arabia": "/",
  // Arabic landers — percent-encoded exactly as the old config had them
  "/%D8%A3%D9%81%D8%B6%D9%84-%D8%B4%D8%B1%D9%83%D8%A9-%D8%AA%D8%B5%D9%85%D9%8A%D9%85-%D9%85%D9%88%D8%A7%D9%82%D8%B9-%D9%88%D9%8A%D8%A8-%D9%81%D9%8A-%D8%AF%D8%A8%D9%8A": "/",
  "/%D8%A3%D9%81%D8%B6%D9%84-%D8%B4%D8%B1%D9%83%D8%A9-%D8%AA%D8%B5%D9%85%D9%8A%D9%85-%D9%85%D9%88%D8%A7%D9%82%D8%B9-%D9%88%D9%8A%D8%A8-%D9%81%D9%8A-%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9": "/",
  // WordPress portfolio entries that map to surviving case studies
  "/portfolio/sally-helmy": "/case-studies/sally-helmy",
  "/portfolio/abu-auf": "/case-studies/abu-auf",
  "/portfolio/abdelrahim-koueider": "/case-studies/kouider",
  "/egypt-foods": "/case-studies",
};

// 301, not Next's default 308 for `permanent: true` — the previous site emitted
// 301 for every one of these URLs, and old crawlers and link-checkers handle it
// more predictably. Google treats the two the same.
const moved = (source: string, destination: string) => ({ source, destination, statusCode: 301 as const });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Invalid src prop (http://localhost:1337/images/case-studies/el-gouna.webp) on `next/image`, hostname "localhost" is not configured under images in your `next.config.js`
    // pub-aa7546047e2b40c9810cb247ee90e22d.r2.dev
    formats: ["image/avif", "image/webp"],
    // 90 for case-study media (screens with fine UI text), 100 for the studio
    // photography; 75 everywhere else.
    qualities: [75, 90, 100],
    // Cache optimized images for 31 days (report flagged /_next/image as "None").
    minimumCacheTTL: 2678400,
    remotePatterns: [
      // Add CMS image domains here, e.g.:
      // { protocol: "https", hostname: "cdn.sanity.io" },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "pub-aa7546047e2b40c9810cb247ee90e22d.r2.dev",
      },
      {
        protocol: "https",
        hostname: "cms.mitchdesigns.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  // RFC 8288 Link headers — advertise real, agent-useful resources from the
  // homepage. All three use IANA-registered relation types and point to
  // resources that actually exist. Relative URIs resolve against the request
  // host, so this works on staging and prod without env coupling.
  // Merged services (MERGED_SERVICES in src/config/nav.ts) keep their old URL alive.
  async redirects() {
    return [
      // ── Blog posts ─────────────────────────────────────────────────────
      // Titan → Orderbase renames first: a renamed post must not fall through
      // to the generic /talks-website-design-and-development/:slug rule, which
      // would send it to a slug that no longer exists.
      ...Object.entries(TITAN_TO_ORDERBASE).flatMap(([from, to]) => [
        moved(`/talks-website-design-and-development/${from}`, `/talks/${to}`),
        moved(`/talks/${from}`, `/talks/${to}`),
      ]),
      // Root-level post slugs from the WordPress era.
      ...LEGACY_TALK_SLUGS.map((slug) => moved(`/${slug}`, `/talks/${slug}`)),
      ...Object.entries(LEGACY_TALK_ALIASES).map(([from, slug]) => moved(from, `/talks/${slug}`)),
      // Everything else under the old blog path keeps its slug.
      moved("/talks-website-design-and-development/:slug", "/talks/:slug"),

      // ── Case studies ───────────────────────────────────────────────────
      ...Object.entries(RENAMED_CASE_STUDIES).flatMap(([from, to]) => [
        moved(`/case-studies/${from}`, `/case-studies/${to}`),
        moved(`/portfolio/${from}`, `/case-studies/${to}`),
      ]),
      ...REMOVED_CASE_STUDIES.map((slug) => moved(`/case-studies/${slug}`, "/case-studies")),

      // ── Pages ──────────────────────────────────────────────────────────
      ...Object.entries(PAGE_MOVES).map(([from, to]) => moved(from, to)),

      // ── Wildcards last ─────────────────────────────────────────────────
      // Spell the renamed and removed slugs out first so /case_study/<slug>
      // reaches its destination in one hop instead of chaining through
      // /case-studies/<old slug>.
      ...Object.entries(RENAMED_CASE_STUDIES).map(([from, to]) => moved(`/case_study/${from}`, `/case-studies/${to}`)),
      ...REMOVED_CASE_STUDIES.map((slug) => moved(`/case_study/${slug}`, "/case-studies")),
      moved("/case_study/:slug*", "/case-studies/:slug*"),
      moved("/jobs/:slug*", "/careers"),
      moved("/job/:slug*", "/careers"),
      moved("/portfolio", "/case-studies"),
      moved("/portfolio/:slug*", "/case-studies"),
      // The old booking funnel lives on its own domain.
      moved("/calendly", "https://leads.mitchdesigns.com/"),
      moved("/calendly/:path*", "https://leads.mitchdesigns.com/"),
    ];
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value: [
              '</sitemap.xml>; rel="sitemap"',
              '</privacy>; rel="privacy-policy"',
              '</terms>; rel="terms-of-service"',
            ].join(", "),
          },
        ],
      },
    ];
  },
};

export default function config(phase: string): NextConfig {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    initOpenNextCloudflareForDev({
      configPath: "wrangler.dev.jsonc",
    });
  }

  return nextConfig;
}
