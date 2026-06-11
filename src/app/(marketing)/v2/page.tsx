import type { Metadata } from "next";
import { HeaderConfig } from "@/context/HeaderConfigContext";
import { V2HeroShowcase } from "@/features/v2/V2HeroShowcase";
import { AboutSection } from "@/features/about";
import { ClientLogos } from "@/features/clients";
import { ClientsTrustFetcher } from "@/features/ClientsTrust";
import { FeaturedProjects } from "@/features/work";
import { OurServices } from "@/features/services";
import { TestimonialMarqueeFetcher } from "@/features/testimonials";
import { TechStackFetcher } from "@/features/tech";
import { TalksSection } from "@/features/talks";
import { CTABanner } from "@/features/cta";
import { FAQSection } from "@/features/faqs";
import {
  getCaseStudies,
  getCtaBanner,
  getFAQs,
  getHomePage,
  getServices,
  getTalks,
  getTestimonials,
} from "@/lib/cms";
import {
  fixtureCaseStudies,
  fixtureFAQs,
  fixtureServices,
  fixtureTalks,
  fixtureTestimonials,
} from "@/lib/cms/fixtures";

export const metadata: Metadata = {
  title: "Homepage V2 — Hero Lab",
  description:
    "The MitchDesigns homepage with alternative hero directions to preview.",
  alternates: { canonical: "/v2" },
  robots: { index: false, follow: true },
};

async function safe<T>(p: Promise<T[]>, fallback: T[]): Promise<T[]> {
  try {
    const data = await p;
    return data.length ? data : fallback;
  } catch {
    return fallback;
  }
}

export default async function V2HomePage() {
  const [services, caseStudies, testimonials, faqs, talks, home, ctaBanner] =
    await Promise.all([
      safe(getServices(), fixtureServices),
      safe(getCaseStudies({ featured: true, limit: 4 }), fixtureCaseStudies),
      safe(getTestimonials(), fixtureTestimonials),
      safe(getFAQs(), fixtureFAQs),
      safe(getTalks(), fixtureTalks),
      getHomePage(),
      getCtaBanner(),
    ]);

  // Quiet the unused warnings until a testimonial/FAQ variant is needed here.
  void testimonials;

  return (
    <>
      <HeaderConfig sticky={false} />
      <V2HeroShowcase {...home.hero} />

      <AboutSection {...home.about} />

      <ClientLogos />

      <FeaturedProjects caseStudies={caseStudies} theme="dark" />

      <OurServices services={services} />

      <TestimonialMarqueeFetcher />

      <TechStackFetcher />

      <TalksSection talks={talks} />

      <FAQSection
        faqs={faqs}
        title="Got Questions?"
        description="We've answered the most common ones to help you understand how we work and what to expect."
        defaultCategory="Corporate Websites"
      />

      <ClientsTrustFetcher />
      <CTABanner {...ctaBanner} />
    </>
  );
}
