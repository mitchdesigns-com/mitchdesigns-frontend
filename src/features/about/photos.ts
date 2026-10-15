import type { AboutImage } from "@/lib/cms/types";
import { strapiMedia } from "@/lib/cms/media";

/** Our studio photos, used wherever the CMS hasn't set an image yet
 *  (front-end only), so no About section ever shows an empty frame. */
const FALLBACKS = [
  { url: "/images/about/about-1.webp", alt: "The MitchDesigns studio" },
  { url: "/images/about/about-2.webp", alt: "The MitchDesigns team at work" },
];

/** A CMS image (resolved) or a studio photo, picked by `index`. */
export function aboutPhoto(img: AboutImage | null | undefined, index: number): { url: string; alt: string } {
  const url = img?.url ? strapiMedia(img.url) ?? img.url : null;
  const fallback = FALLBACKS[index % FALLBACKS.length];
  return url ? { url, alt: img?.alt ?? fallback.alt } : fallback;
}
