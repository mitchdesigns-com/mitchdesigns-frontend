import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCaseStudies, getCaseStudiesPage } from "@/lib/cms";
import { fixtureCaseStudies } from "@/lib/cms/fixtures";
import type { CaseStudy } from "@/lib/cms/types";
import { CaseStudyGrid } from "@/features/work";

export const metadata: Metadata = {
  title: "Case Studies — Websites & Apps We've Built",
  description:
    "Browse MitchDesigns' portfolio — websites, mobile apps, and custom platforms built for top Egyptian and regional brands including El Gouna, Lychee, and G Developments.",
  openGraph: {
    title: "Case Studies — Websites & Apps We've Built",
    description:
      "Browse MitchDesigns' portfolio — websites, mobile apps, and custom platforms built for top Egyptian and regional brands.",
    url: "https://mitchdesigns.com/case-studies",
  },
  alternates: { canonical: "/case-studies" },
};

async function resolveCaseStudies(): Promise<Array<CaseStudy & { id: number }>> {
  try {
    const cms = await getCaseStudies();
    if (cms.length) return cms;
  } catch {
    /* fall through to fixtures */
  }
  return fixtureCaseStudies.map((s, i) => ({ ...s, id: i + 1 }));
}

export default async function CaseStudiesIndexPage() {
  const [caseStudies, page] = await Promise.all([
    resolveCaseStudies(),
    getCaseStudiesPage(),
  ]);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MitchDesigns Case Studies",
    itemListElement: caseStudies.map((study, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://mitchdesigns.com/case-studies/${study.slug}`,
      name: study.title,
    })),
  };

  return (
    <>
      <JsonLd data={itemListSchema} />
      <CaseStudyGrid caseStudies={caseStudies} title={page.hero?.title} />
    </>
  );
}
