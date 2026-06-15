import type { MetadataRoute } from "next";
import { getCaseStudies, getServices, getTalks } from "@/lib/cms/queries";

const BASE = "https://mitchdesigns.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Live CMS, with the query layer's fixture fallback if Strapi is unreachable.
  const [services, caseStudies, talks] = await Promise.all([
    getServices(),
    getCaseStudies(),
    getTalks(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/about`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/case-studies`, lastModified: now, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/faqs`, lastModified: now, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/careers`, lastModified: now, priority: 0.6, changeFrequency: "weekly" },
    { url: `${BASE}/talks`, lastModified: now, priority: 0.7, changeFrequency: "weekly" },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${BASE}/services/${s.slug}`,
    lastModified: now,
    priority: 0.85,
    changeFrequency: "monthly",
  }));

  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies.map((c) => ({
    url: `${BASE}/case-studies/${c.slug}`,
    lastModified: new Date(c.publishedAt),
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  const talkRoutes: MetadataRoute.Sitemap = talks.map((t) => ({
    url: `${BASE}/talks/${t.slug}`,
    lastModified: new Date(t.publishedAt ?? t.date ?? Date.now()),
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  return [...staticRoutes, ...serviceRoutes, ...caseStudyRoutes, ...talkRoutes];
}
