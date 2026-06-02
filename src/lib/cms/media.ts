const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

/** Resolve a media URL — handles absolute, local, and Strapi URLs. */
export function strapiMedia(path: string | undefined | null): string | null {
  if (!path) return null;

  // Absolute URL
  if (path.startsWith("http")) return path;

  // Local public image
  if (path.startsWith("/images/")) return path;

  // Strapi media
  return `${STRAPI_URL}${path}`;
}