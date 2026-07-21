import type {
  CaseStudy,
  FAQ,
  Service,
  ServicePageData,
} from "@/lib/cms/types";
import { isLeadFunnelHref, leadsUrl } from "@/config/nav";
import { ServiceHero } from "./sections/ServiceHero";
import { PrototypesSection } from "./sections/PrototypesSection";
import { WeGotYou } from "./sections/WeGotYou";
import { WhyUsSection } from "./sections/WhyUsSection";
import { ProcessSection } from "./sections/ProcessSection";
import { SupportSection } from "./sections/SupportSection";
import { FeaturesSimplified } from "./sections/FeaturesSimplified";
import { AccordionSection } from "./sections/AccordionSection";
import { NumbersSection } from "./sections/NumbersSection";
import { BriefSection } from "./sections/BriefSection";
import { DesignsAdapt } from "./sections/DesignsAdapt";
import { MoreAbout } from "./sections/MoreAbout";
import { TestimonialMarqueeFetcher } from "@/features/testimonials/TestimonialMarqueeFetcher";
import { FAQSection } from "@/features/faqs/FAQSection";
import { FeaturedProjects } from "@/features/work/FeaturedProjects";
import { TechStackFetcher } from "@/features/tech/TechStackFetcher";

type Props = {
  slug: Service["slug"];
  data: ServicePageData;
  faqs: Array<FAQ & { id: number }>;
  /** FAQs for this service's category — feed the accordion section. */
  accordionFaqs?: FAQ[];
  caseStudies?: CaseStudy[];
};

/**
 * Point a section's CTA at the lead funnel with this service preselected.
 * Rewrites legacy `/quote` links (and bare leads links) to
 * `…/quote/<service>/1`; leaves unrelated CTAs (e.g. `/about`) untouched.
 */
function withServiceLeadCta<
  T extends { cta?: { label: string; href: string } } | undefined,
>(section: T, slug: string): T {
  if (section?.cta && isLeadFunnelHref(section.cta.href)) {
    return { ...section, cta: { ...section.cta, href: leadsUrl(slug) } };
  }
  return section;
}

export function ServicePageRenderer({
  slug,
  data,
  faqs,
  accordionFaqs = [],
  caseStudies = [],
}: Props) {
  const {
    hero: rawHero,
    prototypes,
    weGotYou: rawWeGotYou,
    whyUs,
    process,
    support,
    featuresSimplified,
    accordion,
    numbers,
    brief,
    designsAdapt,
    moreAbout,
  } = data;

  const hero = withServiceLeadCta(rawHero, slug);
  const weGotYou = withServiceLeadCta(rawWeGotYou, slug);

  // Accordion items come from the FAQ collection (filtered by service category);
  // fall back to the section's own seeded items when no FAQs match.
  const accordionItems = accordionFaqs.length
    ? accordionFaqs.map((f, i) => ({
        id: String(i),
        title: f.question,
        content: f.answer,
      }))
    : accordion?.accordion ?? [];

  switch (slug) {
    case "corporate":
      return (
        <>
          <ServiceHero {...hero} />
          <PrototypesSection {...prototypes} />
          {weGotYou && <WeGotYou {...weGotYou} />}
          {whyUs && <WhyUsSection {...whyUs} />}
          {process && <ProcessSection {...process} />}
          <TechStackFetcher
            title="Our Technology Stack"
            description="The tools and frameworks we use to build custom platforms that scale."
            highlight="Technology Stack"
          />
          {support && <SupportSection {...support} />}
          <TestimonialMarqueeFetcher />
          <FAQSection faqs={faqs} />
        </>
      );

    case "ecommerce":
      return (
        <>
          <ServiceHero {...hero} />
          <PrototypesSection {...prototypes} />
          {weGotYou && <WeGotYou {...weGotYou} />}
          {whyUs && <WhyUsSection {...whyUs} />}
          {featuresSimplified && <FeaturesSimplified {...featuresSimplified} />}
          {support && <SupportSection {...support} />}
          <TestimonialMarqueeFetcher />
          <FAQSection faqs={faqs} />
        </>
      );

    case "custom":
      return (
        <>
          <ServiceHero {...hero} />
          <PrototypesSection {...prototypes} />
          {designsAdapt && <DesignsAdapt {...designsAdapt} />}
          {moreAbout && <MoreAbout {...moreAbout} />}
          {accordion && (
            <AccordionSection {...accordion} accordion={accordionItems} />
          )}
          {process && <ProcessSection {...process} />}
          {caseStudies.length > 0 && (
            <FeaturedProjects caseStudies={caseStudies} />
          )}
          <TechStackFetcher
            title="Our Technology Stack"
            description="The tools and frameworks we use to build custom platforms that scale."
            highlight="Technology Stack"
          />
          <TestimonialMarqueeFetcher />
          {weGotYou && <WeGotYou {...weGotYou} />}
          <FAQSection faqs={faqs} />
        </>
      );

    case "media-buying":
    case "google-ads":
    case "seo":
      return (
        <>
          <ServiceHero {...hero} />
          <PrototypesSection {...prototypes} />
          {numbers && <NumbersSection {...numbers} />}
          {brief && <BriefSection {...brief} />}
          {weGotYou && (
            <WeGotYou
              {...weGotYou}
              theme={slug === "google-ads" ? "dark" : weGotYou.theme}
            />
          )}
          {whyUs && <WhyUsSection {...whyUs} />}
          <TestimonialMarqueeFetcher />
          <FAQSection faqs={faqs} />
        </>
      );

    case "mobile-app":
      return (
        <>
          <ServiceHero {...hero} />
          <PrototypesSection {...prototypes} />
          {weGotYou && <WeGotYou {...weGotYou} theme="beige" />}
          {whyUs && <WhyUsSection {...whyUs} />}
          {process && <ProcessSection {...process} />}
          <TechStackFetcher
            title="Craft seamless digital platforms with our modern tech stack"
            description="More than a stack — it's how we build reliable, scalable, and secure digital ecosystems for every client."
            highlight="modern tech stack"
          />
          {support && <SupportSection {...support} />}
          <TestimonialMarqueeFetcher />
          <FAQSection faqs={faqs} />
        </>
      );

    default:
      return null;
  }
}
