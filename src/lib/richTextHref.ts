// Pure, client-safe helper. Normalizes hrefs coming from Strapi rich-text /
// blocks fields so internal links stay relative (and legacy /talks/* URLs are
// canonicalized). Used by RichText and any other rich-text renderer.

export function normalizeRichTextHref(href: string) {
  if (href.startsWith("/")) return href;

  try {
    const url = new URL(href);
    if (url.hostname === "mitchdesigns.com" || url.hostname === "www.mitchdesigns.com") {
      const path = url.pathname.replace(/\/+$/, "");
      const segments = path.split("/").filter(Boolean);
      if (path.startsWith("/talks/")) {
        return `${path}${url.search}${url.hash}`;
      }
      if (segments.length && segments[0].startsWith("talks")) {
        return `/talks/${segments[segments.length - 1]}${url.search}${url.hash}`;
      }
      return `${path}${url.search}${url.hash}`;
    }
  } catch {
    // ignore invalid URLs and return original href
  }

  return href;
}
