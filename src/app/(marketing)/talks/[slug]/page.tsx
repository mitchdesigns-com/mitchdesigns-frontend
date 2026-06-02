import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { getTalk, getTalks, getRelatedTalks } from "@/lib/cms";
import { fixtureTalks } from "@/lib/cms/fixtures";
import { TalkHero, TalkContent, RelatedTalks } from "@/features/talks";
import { extractToc } from "@/features/talks/TalkContent";
import type { Talk } from "@/lib/cms/types";

type Params = { slug: string };

// E-E-A-T author entity — update with real Mitch profile URLs
const AUTHOR = {
  "@type": "Person",
  name: "Mitch",
  url: "https://mitchdesigns.com/about",
  jobTitle: "Founder & Creative Director",
  worksFor: {
    "@type": "Organization",
    name: "MitchDesigns",
    url: "https://mitchdesigns.com",
  },
  sameAs: [
    "https://www.linkedin.com/company/mitchdesigns",
    // TODO: add personal LinkedIn, Twitter, Dribbble
  ],
};

const PUBLISHER = {
  "@type": "Organization",
  name: "MitchDesigns",
  url: "https://mitchdesigns.com",
  logo: {
    "@type": "ImageObject",
    url: "https://mitchdesigns.com/logo.png",
  },
};

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const talks = await getTalks();
    if (talks.length) return talks.map((t) => ({ slug: t.slug }));
  } catch { /* fall through */ }
  return fixtureTalks.map((t) => ({ slug: t.slug }));
}

async function resolveTalk(slug: string): Promise<Talk | null> {
  try {
    const cms = await getTalk(slug);
    if (cms) return cms;
  } catch { /* fall through */ }
  return fixtureTalks.find((t) => t.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const talk = await resolveTalk(slug);

  if (!talk) return { title: slug.replace(/-/g, " ") };

  const title = `${talk.title} — MitchDesigns`;
  const description = talk.excerpt;

  return {
    title,
    description,
    authors: [{ name: talk.author?.name ?? "Mitch", url: "https://mitchdesigns.com/about" }],
    alternates: { canonical: `/talks/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://mitchdesigns.com/talks/${slug}`,
      type: "article",
      publishedTime: talk.publishedAt ?? talk.date,
      authors: ["https://mitchdesigns.com/about"],
      ...(talk.cover?.url
        ? {
            images: [
              {
                url: talk.cover.url,
                alt: talk.cover.alternativeText ?? undefined,
              },
            ],
          }
        : {}),
    },
  };
}

export default async function SingleTalkPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const talk = await resolveTalk(slug);
  if (!talk) notFound();

  let allTalks: Talk[] = fixtureTalks;
  try {
    const cms = await getTalks();
    if (cms.length) allTalks = cms;
  } catch { /* fall through */ }

  const sorted = [...allTalks].sort(
    (a, b) => new Date(b.publishedAt ?? b.date ?? 0).getTime() - new Date(a.publishedAt ?? a.date ?? 0).getTime(),
  );
  const idx = sorted.findIndex((t) => t.slug === slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : undefined;
  const next = idx > 0 ? sorted[idx - 1] : undefined;

  let related: Talk[] = fixtureTalks.filter((t) => t.slug !== slug).sort(() => Math.random() - 0.5).slice(0, 2);
  try {
    const cms = await getRelatedTalks(slug, 2);
    if (cms.length) related = cms;
  } catch { /* fall through */ }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://mitchdesigns.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Talks",
        item: "https://mitchdesigns.com/talks",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: talk.title,
        item: `https://mitchdesigns.com/talks/${slug}`,
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: talk.title,
    description: talk.excerpt,
    datePublished: talk.publishedAt ?? talk.date,
    dateModified: talk.publishedAt ?? talk.date,
    author: AUTHOR,
    publisher: PUBLISHER,
    url: `https://mitchdesigns.com/talks/${slug}`,
    inLanguage: "en",
    about: talk.category
      ? [{ "@type": "Thing", name: talk.category }]
      : talk.tags?.map((tag) => ({ "@type": "Thing", name: tag })),
    ...(talk.cover?.url
      ? {
          image: {
            "@type": "ImageObject",
            url: `https://mitchdesigns.com${talk.cover.url}`,
            description: talk.cover.alternativeText ?? talk.title,
          },
        }
      : {}),
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={articleSchema} />
      <TalkHero talk={talk} />
      <TalkContent talk={talk} toc={extractToc(talk.sections)} prev={prev} next={next} />
      <RelatedTalks talks={related} />
    </>
  );
}
