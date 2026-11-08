import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

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
      { source: "/services/google-ads", destination: "/services/media-buying", permanent: true },
      // Titan was renamed Orderbase. Specific rules go first so the old slug lands on the renamed post in one hop.
      { source: "/talks-website-design-and-development/titan-vs-other-headless-ecommerce-platforms", destination: "/talks/orderbase-vs-other-headless-ecommerce-platforms", permanent: true },
      { source: "/talks/titan-vs-other-headless-ecommerce-platforms", destination: "/talks/orderbase-vs-other-headless-ecommerce-platforms", permanent: true },
      { source: "/talks-website-design-and-development/mobile-checkout-ux-titan", destination: "/talks/mobile-checkout-ux-orderbase", permanent: true },
      { source: "/talks/mobile-checkout-ux-titan", destination: "/talks/mobile-checkout-ux-orderbase", permanent: true },
      { source: "/talks-website-design-and-development/titan-stop-sale-ecommerce-stock-sync", destination: "/talks/orderbase-stop-sale-ecommerce-stock-sync", permanent: true },
      { source: "/talks/titan-stop-sale-ecommerce-stock-sync", destination: "/talks/orderbase-stop-sale-ecommerce-stock-sync", permanent: true },
      { source: "/talks-website-design-and-development/laravel-react-ecommerce-platform-titan", destination: "/talks/laravel-react-ecommerce-platform-orderbase", permanent: true },
      { source: "/talks/laravel-react-ecommerce-platform-titan", destination: "/talks/laravel-react-ecommerce-platform-orderbase", permanent: true },
      { source: "/talks-website-design-and-development/solve-cart-abandonment-titan-ecommerce-platform", destination: "/talks/solve-cart-abandonment-orderbase-ecommerce-platform", permanent: true },
      { source: "/talks/solve-cart-abandonment-titan-ecommerce-platform", destination: "/talks/solve-cart-abandonment-orderbase-ecommerce-platform", permanent: true },
      { source: "/talks-website-design-and-development/titan-features-for-large-retailer", destination: "/talks/orderbase-features-for-large-retailer", permanent: true },
      { source: "/talks/titan-features-for-large-retailer", destination: "/talks/orderbase-features-for-large-retailer", permanent: true },
      { source: "/talks-website-design-and-development/titan-headless-ecommerce-platform-guide", destination: "/talks/orderbase-headless-ecommerce-platform-guide", permanent: true },
      { source: "/talks/titan-headless-ecommerce-platform-guide", destination: "/talks/orderbase-headless-ecommerce-platform-guide", permanent: true },
      // Old blog path on the previous site now lives under /talks.
      { source: "/talks-website-design-and-development/:slug", destination: "/talks/:slug", permanent: true },
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
