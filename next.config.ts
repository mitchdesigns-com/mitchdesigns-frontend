import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Invalid src prop (http://localhost:1337/images/case-studies/el-gouna.webp) on `next/image`, hostname "localhost" is not configured under images in your `next.config.js`
    // pub-aa7546047e2b40c9810cb247ee90e22d.r2.dev
    formats: ["image/avif", "image/webp"],
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
    viewTransition: true,
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
