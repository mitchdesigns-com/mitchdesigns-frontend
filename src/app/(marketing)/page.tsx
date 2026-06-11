import type { Metadata } from "next";
import { HeaderConfig } from "@/context/HeaderConfigContext";
import { CreativeHero } from "@/features/hero";
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
import { JsonLd } from "@/components/seo/JsonLd";
import { V2FloatButton } from "@/features/v2/V2FloatButton";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};
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

async function safe<T>(p: Promise<T[]>, fallback: T[]): Promise<T[]> {
  try {
    const data = await p;
    return data.length ? data : fallback;
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
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

  // Single @graph merges AggregateRating + FAQPage + HowTo into one <script> tag
  const homeGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "MitchDesigns",
        url: "https://mitchdesigns.com",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5",
          bestRating: "5",
          worstRating: "1",
          ratingCount: testimonials.length,
        },
        review: testimonials
          .filter((t) => t.googleReview)
          .map((t) => ({
            "@type": "Review",
            author: { "@type": "Person", name: t.author },
            reviewBody: t.quote,
            reviewRating: { "@type": "Rating", ratingValue: "5" },
          })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "HowTo",
        name: "How to Start a Project with MitchDesigns",
        description:
          "The step-by-step process for working with MitchDesigns — from first contact to product launch.",
        totalTime: "PT8W",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Request a Proposal",
            text: "Fill out our quote form with your project goals, budget range, and timeline. We respond within 24 hours with initial thoughts.",
            url: "https://mitchdesigns.com/quote",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Discovery Call",
            text: "We schedule a call to deeply understand your business, users, and success metrics. This shapes the entire project scope.",
            url: "https://mitchdesigns.com/quote/schedule-call",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Design & Prototype",
            text: "Our designers build wireframes and high-fidelity prototypes in Figma. You review, give feedback, and we iterate until it's right.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Development",
            text: "Engineers build the product using Next.js, React Native, or the right stack for your project — with regular demos throughout.",
          },
          {
            "@type": "HowToStep",
            position: 5,
            name: "QA & Launch",
            text: "We run thorough QA across devices and browsers, then manage the launch. You get full source code ownership and handoff documentation.",
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={homeGraph} />
      <HeaderConfig sticky={false} />
      <CreativeHero {...home.hero} />

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
      <V2FloatButton />
    </>
  );
}
