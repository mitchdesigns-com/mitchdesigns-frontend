import type { Metadata } from "next";
import { TalksList, TalksHero } from "@/features/talks";
import { getTalks, getTalksPage } from "@/lib/cms";
import { fixtureTalks } from "@/lib/cms/fixtures";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Talks & Articles — MitchDesigns",
  description:
    "Insights on UX, product design, and digital growth from the MitchDesigns team — conference talks, workshops, and community sessions across Egypt and the region.",
  openGraph: {
    title: "Talks & Articles — MitchDesigns",
    description:
      "Insights on UX, product design, and digital growth from the MitchDesigns team.",
    url: "https://mitchdesigns.com/talks",
  },
  alternates: { canonical: "/talks" },
};

async function safe<T>(p: Promise<T[]>, fallback: T[], label: string): Promise<T[]> {
  try {
    const data = await p;
    if (!data.length) {
      console.warn(`[safe] ${label}: returned empty array — using fallback`);
      return fallback;
    }
    return data;
  } catch (err) {
    console.error(`[safe] ${label}: threw error — using fallback\n`, err);
    return fallback;
  }
}

export default async function TalksIndexPage() {
  const [talks, talksPage] = await Promise.all([
    safe(getTalks(), fixtureTalks, "getTalks"),
    getTalksPage(),
  ]);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MitchDesigns Talks & Articles",
    itemListElement: talks.map((talk, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://mitchdesigns.com/talks/${talk.slug}`,
      name: talk.title,
    })),
  };

  return (
    <>
      <JsonLd data={itemListSchema} />
      <TalksHero
        heading={talksPage?.heading ?? undefined}
        subheading={talksPage?.subheading ?? undefined}
      />
      <TalksList talks={talks} />
    </>
  );
}
