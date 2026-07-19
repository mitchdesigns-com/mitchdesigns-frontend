import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  CaseStudyHero,
  TextInRow,
  TwoImagesInRow,
  SingleImageInRow,
  ColorPalette,
  CenteredQuote,
  RelatedProjects,
} from "@/features/work";
import { RichText } from "@/components/ui/RichText";
import { getCaseStudies, getCaseStudy } from "@/lib/cms";
import { buildPageMetadata } from "@/lib/seo";
import { blocksToText } from "@/lib/cms/blocks";
import { fixtureCaseStudies } from "@/lib/cms/fixtures";
import type { CaseStudy } from "@/lib/cms/types";

type Params = { slug: string };

async function resolveStudy(slug: string): Promise<CaseStudy | null> {
  try {
    const cms = await getCaseStudy(slug);
    if (cms) return cms;
  } catch { /* fall through */ }
  return fixtureCaseStudies.find((s) => s.slug === slug) ?? null;
}

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const studies = await getCaseStudies();
    if (studies.length) return studies.map((s) => ({ slug: s.slug }));
  } catch { /* fall through */ }
  return fixtureCaseStudies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await resolveStudy(slug);

  if (!study) return { title: slug.replace(/-/g, " ") };

  return buildPageMetadata(
    {
      title: `${study.title} — Case Study`,
      description:
        study.tagline ||
        `How MitchDesigns designed and built ${study.title} for ${study.client}.`,
      canonical: `/case-studies/${slug}`,
      image: study.cover?.url,
    },
    study.seo,
  );
}

export default async function SingleCaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [study, allStudies] = await Promise.all([
    resolveStudy(slug),
    getCaseStudies().catch(() => fixtureCaseStudies.map((s, i) => ({ ...s, id: i + 1 }))),
  ]);
  if (!study) notFound();

  const relatedStudies = allStudies
    .filter((s) => s.slug !== slug)
    .slice(0, 2);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mitchdesigns.com" },
      { "@type": "ListItem", position: 2, name: "Case Studies", item: "https://mitchdesigns.com/case-studies" },
      { "@type": "ListItem", position: 3, name: study.title, item: `https://mitchdesigns.com/case-studies/${slug}` },
    ],
  };

  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: study.title,
    description: study.tagline,
    creator: { "@type": "Organization", name: "MitchDesigns", url: "https://mitchdesigns.com" },
    datePublished: study.publishedAt,
    url: `https://mitchdesigns.com/case-studies/${slug}`,
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={creativeWorkSchema} />

      <Section data-theme="dark" className="pt-32 pb-24">
        <CaseStudyHero study={study} />
      </Section>

      {study.content?.map((block, i) => {
        switch (block.__component) {
          case "blocks.rich-text":
            return (
              <Section key={i} data-theme="dark" className="py-24">
                <RichText content={block.body} />
              </Section>
            );
          case "blocks.case-point":
            return (
              <Section key={i} data-theme="dark" className="py-24">
                <TextInRow
                  heading={block.title}
                  items={[{ title: block.title, body: blocksToText(block.body) ?? "" }]}
                />
              </Section>
            );
          case "blocks.image-pair":
            return (
              <Section key={i} data-theme="dark" className="py-10">
                <TwoImagesInRow left={block.left} right={block.right} />
              </Section>
            );
          case "blocks.media-block":
            return (
              <Section key={i} data-theme="dark" className="py-10">
                <SingleImageInRow image={block.file} />
              </Section>
            );
          case "blocks.centered-quote":
            return (
              <Section key={i} data-theme="dark" className="py-24">
                <CenteredQuote quote={block.quote} />
              </Section>
            );
          case "blocks.case-testimonial":
            return (
              <Section key={i} data-theme="dark" className="py-24">
                <CenteredQuote quote={block.quote} author={block.author} role={block.role} avatar={block.avatar} />
              </Section>
            );
          case "blocks.color-palette":
            return (
              <Section key={i} data-theme="dark" className="py-24">
                <ColorPalette palettes={block.swatches} />
              </Section>
            );
          default:
            return null;
        }
      })}

      <RelatedProjects studies={relatedStudies} />
    </>
  );
}
