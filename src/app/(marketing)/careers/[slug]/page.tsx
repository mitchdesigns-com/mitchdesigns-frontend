import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobDetailHero } from "@/features/careers/JobDetailHero";
import { JobDetailBody } from "@/features/careers/JobDetailBody";
import { CareerExperience } from "@/features/careers/CareerExperience";
import { strapiMedia } from "@/lib/cms/media";
import { getCareers, getCareer, getCareersPage } from "@/lib/cms";

const APPLY_EMAIL = "careers@mitchdesigns.com";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const careers = await getCareers();
    return careers.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const role = await getCareer(slug);
    if (role)
      return {
        title: role.title,
        description: role.excerpt,
        alternates: { canonical: `/careers/${slug}` },
      };
  } catch { /* fall through */ }
  return {
    title: slug.replace(/-/g, " "),
    alternates: { canonical: `/careers/${slug}` },
  };
}

export default async function SingleCareerPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [role, careersPage] = await Promise.all([
    getCareer(slug).catch(() => null),
    getCareersPage().catch(() => null),
  ]);
  if (!role) notFound();

  const applyHref = `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(
    `Application — ${role.title}`,
  )}`;

  const heroImage = role.image?.url
    ? { url: strapiMedia(role.image.url) ?? role.image.url, alt: role.image.alternativeText ?? role.title }
    : null;

  return (
    <main>
      <JobDetailHero title={role.title} excerpt={role.excerpt} image={heroImage} />
      <JobDetailBody role={role} applyHref={applyHref} />
      <CareerExperience
        heading={careersPage?.experienceHeading}
        cards={careersPage?.experienceCards}
      />
    </main>
  );
}
