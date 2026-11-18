/**
 * Canonical origin for every absolute URL the site emits: canonicals, OpenGraph
 * URLs, JSON-LD `url`/`item` fields, the sitemap and the `Sitemap:` line in
 * robots.txt.
 *
 * `www` — not the apex — because the previous site was indexed on
 * www.mitchdesigns.com: all backlinks, Search Console history and the old
 * sitemap point there. The rebuild already changes ~140 URL paths; moving the
 * host at the same time would stack a second migration on top of that with no
 * ranking upside. Switching to the apex later is a one-line change here plus a
 * Cloudflare redirect rule flip.
 */
export const SITE_URL = "https://www.mitchdesigns.com";

/**
 * Hosts `next/image` is allowed to optimize — must mirror
 * `images.remotePatterns` in next.config.ts.
 *
 * CMS rich text still carries image URLs on the retired Strapi host
 * (strapi-179918-0.cloudclusters.net, whose DNS is gone — the old live site has
 * the same broken images). next/image THROWS on a host that is not
 * allowlisted, which took whole blog posts down to a 500 instead of just
 * losing one image, so callers check the host first and fall back to a
 * placeholder.
 */
const ALLOWED_IMAGE_HOSTS = [
  "cms.mitchdesigns.com",
  "pub-aa7546047e2b40c9810cb247ee90e22d.r2.dev",
  "localhost",
];

export function isOptimizableImage(url: string): boolean {
  if (!url) return false;
  if (url.startsWith("/")) return true; // local asset
  try {
    return ALLOWED_IMAGE_HOSTS.includes(new URL(url).hostname);
  } catch {
    return false;
  }
}
