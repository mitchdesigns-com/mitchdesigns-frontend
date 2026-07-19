import type { Metadata } from "next";
import type { SeoData } from "@/lib/cms/types";

type Fallback = {
  title: string;
  description: string;
  canonical: string;
  /** OG image used when the CMS SEO has no ogImage (e.g. the entry's cover). */
  image?: string;
};

export function buildPageMetadata(fallback: Fallback, cms?: SeoData): Metadata {
  const title = cms?.metaTitle ?? fallback.title;
  const description = cms?.metaDescription ?? fallback.description;
  const canonical = cms?.canonicalURL ?? fallback.canonical;
  const ogTitle = cms?.ogTitle ?? title;
  const ogDescription = cms?.ogDescription ?? description;
  const ogImage = cms?.ogImage?.url ?? fallback.image;

  return {
    title,
    description,
    ...(cms?.noIndex ? { robots: { index: false, follow: false } } : {}),
    alternates: { canonical },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: `https://mitchdesigns.com${canonical}`,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}
