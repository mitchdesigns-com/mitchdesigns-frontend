import type {
  CaseStudy,
  FAQ,
  Service,
  ServicePageData,
} from "@/lib/cms/types";
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
  caseStudies?: CaseStudy[];
};

export function ServicePageRenderer({
  slug,
  data,
  faqs,
  caseStudies = [],
}: Props) {
  const {
    hero,
    prototypes,
    weGotYou,
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
          {accordion && <AccordionSection {...accordion} />}
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
          {weGotYou && <WeGotYou {...weGotYou} />}
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
          {numbers && <NumbersSection {...numbers} />}
          {brief && <BriefSection {...brief} />}
          {weGotYou && <WeGotYou {...weGotYou} theme="beige" />}
          {whyUs && <WhyUsSection {...whyUs} />}
          <TestimonialMarqueeFetcher />
          <FAQSection faqs={faqs} />
        </>
      );

    default:
      return null;
  }
}
