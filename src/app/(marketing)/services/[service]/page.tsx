import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServicePageRenderer } from "@/features/services/ServicePageRenderer";
import {
  getCaseStudies,
  getFAQs,
  getServicePageData,
} from "@/lib/cms";
import {
  fixtureCaseStudies,
  fixtureFAQs,
} from "@/lib/cms/fixtures";
import { buildPageMetadata } from "@/lib/seo";
import {
  SERVICES as NAV_SERVICES,
  SERVICE_FAQ_CATEGORY,
  type ServiceSlug,
} from "@/config/nav";

const SERVICE_SLUGS = NAV_SERVICES.map((s) => s.slug);

type Params = { service: ServiceSlug };

const SERVICE_META: Record<ServiceSlug, { title: string; description: string }> = {
  corporate: {
    title: "Corporate Website Design & Development",
    description:
      "Custom corporate websites built on Next.js with headless CMS. No templates — designed for lead generation, brand clarity, and high performance. Based in Egypt, serving the MENA region.",
  },
  "mobile-app": {
    title: "Mobile App Design & Development",
    description:
      "Native-feel iOS and Android apps built with React Native. Designed for conversion, built for performance, and ready for App Store submission. MitchDesigns — Egypt.",
  },
  ecommerce: {
    title: "eCommerce Platform Design & Development",
    description:
      "Custom eCommerce storefronts with seamless checkout, local payment gateway integration (Paymob, Fawry), and conversion-optimised UX. MitchDesigns — Egypt.",
  },
  custom: {
    title: "Custom Platform & Software Development",
    description:
      "Booking systems, SaaS dashboards, internal tools, and client portals — custom-architected for reliability and designed for the people who use them daily.",
  },
  "media-buying": {
    title: "Media Buying & Paid Social Advertising",
    description:
      "Data-driven paid campaigns across Meta, TikTok, and Snapchat. Creative testing, audience targeting, and funnel optimisation built around your CPA — not just impressions.",
  },
  seo: {
    title: "SEO & AI-Generative Optimisation (AGO)",
    description:
      "Technical SEO, content strategy, and AI-Generative Optimisation (AGO) to rank on Google and surface in AI-powered search results like ChatGPT and Perplexity. Arabic SEO included.",
  },
  "google-ads": {
    title: "Google Ads Management",
    description:
      "Search and Performance Max campaigns built around profitable keywords and tight negative lists. Continuously tested and optimised for every dirham in ad spend.",
  },
};

async function safe<T>(p: Promise<T[] | null>, fallback: T[]): Promise<T[]> {
  try {
    const data = await p;
    return data && data.length ? data : fallback;
  } catch {
    return fallback;
  }
}


export function generateStaticParams() {
  return SERVICE_SLUGS.map((service) => ({ service }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { service } = await params;
  if (!SERVICE_SLUGS.includes(service)) return {};
  const data = await getServicePageData(service);
  const fallback = SERVICE_META[service];
  return buildPageMetadata(
    { title: fallback.title, description: fallback.description, canonical: `/services/${service}` },
    data.seo,
  );
}

export default async function ServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { service } = await params;
  if (!SERVICE_SLUGS.includes(service)) notFound();

  const [data, faqs, accordionFaqs, caseStudies] = await Promise.all([
    getServicePageData(service),
    safe(getFAQs(), fixtureFAQs),
    safe(getFAQs(SERVICE_FAQ_CATEGORY[service]), []),
    safe(getCaseStudies({ featured: true, limit: 4 }), fixtureCaseStudies),
  ]);

  const meta = SERVICE_META[service];
  const title = data.seo?.metaTitle ?? meta.title;
  const description = data.seo?.metaDescription ?? meta.description;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mitchdesigns.com" },
      { "@type": "ListItem", position: 2, name: "Services", item: "https://mitchdesigns.com/services" },
      { "@type": "ListItem", position: 3, name: title, item: `https://mitchdesigns.com/services/${service}` },
    ],
  };

  const serviceSchema = data.seo?.structuredData ?? {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description,
    provider: {
      "@type": "Organization",
      name: "MitchDesigns",
      url: "https://mitchdesigns.com",
    },
    areaServed: { "@type": "Country", name: "Egypt" },
    url: `https://mitchdesigns.com/services/${service}`,
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={serviceSchema} />
      <ServicePageRenderer
        slug={service}
        data={data}
        faqs={faqs}
        accordionFaqs={accordionFaqs}
        caseStudies={caseStudies}
      />
    </>
  );
}
