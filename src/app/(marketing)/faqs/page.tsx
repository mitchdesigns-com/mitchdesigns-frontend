import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQPageSection } from "@/features/faqs/FAQPageSection";
import { Section } from "@/components/layout/Section";
import { getFAQs } from "@/lib/cms/queries";
import { fixtureFAQs } from "@/lib/cms/fixtures";

export const metadata: Metadata = {
  title: "FAQs — MitchDesigns Design & Development",
  description:
    "Get answers to common questions about website design, mobile app development, eCommerce, media buying, and SEO at MitchDesigns. Transparent pricing, timelines, and process.",
  openGraph: {
    title: "FAQs — MitchDesigns Design & Development",
    description:
      "Common questions about working with MitchDesigns — pricing, timelines, tech stack, and process.",
    url: "https://mitchdesigns.com/faqs",
  },
  alternates: { canonical: "/faqs" },
};

export default async function FAQsPage() {
  const faqs = (await getFAQs()) ?? fixtureFAQs;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <Section theme="dark" className="py-24 md:py-32">
        <FAQPageSection faqs={faqs} defaultOpenId={6} />
      </Section>
    </>
  );
}
