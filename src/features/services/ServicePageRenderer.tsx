import type {
  CaseStudy,
  FAQ,
  ProcessSectionProps,
  Service,
  ServicePageData,
} from "@/lib/cms/types";
import { isLeadFunnelHref, leadsUrl } from "@/config/nav";
import { ServiceHero } from "./sections/ServiceHero";
import { CORPORATE_REEL, CUSTOM_REEL, MOBILE_REEL } from "@/config/serviceReels";
import { EcommerceReel } from "./ecommerceReel/EcommerceReel";
import { MediaBuyingScene } from "./mediaBuyingScene/MediaBuyingScene";
import { GoogleAdsScene } from "./googleAdsScene/GoogleAdsScene";
import { SeoScene } from "./seoScene/SeoScene";
import { TabletVideoSection } from "./googleAdsScene/TabletVideoSection";
import { MacbookVideoSection } from "./mediaBuyingScene/MacbookVideoSection";
import { workStepSummary } from "./sections/workSteps";
import { AppFlowSection } from "./sections/appFlow/AppFlowSection";
import { appFlowSteps } from "./sections/appFlow/steps";

/** "We Got You" card on eCommerce: one order from tap to doorstep
 *  (fallback until `weGotYou.story` is filled in Strapi). */
const ECOMMERCE_ORDER_STORY = [
  { src: "/images/services/ecommerce/story-1-order.webp", alt: "Customer ordering from an online store on her phone" },
  { src: "/images/services/ecommerce/we-got-you.webp", alt: "Store owner receiving the order on a tablet" },
  { src: "/images/services/ecommerce/story-3-packing.webp", alt: "Staff packing the order for delivery" },
  { src: "/images/services/ecommerce/story-4-delivery.webp", alt: "Courier delivering the order to the customer" },
];
import { WeGotYouOrbit } from "./sections/WeGotYouOrbit";
import { WhyUsSection } from "./sections/WhyUsSection";
import { SupportSection } from "./sections/SupportSection";
import { FeaturesSimplified } from "./sections/FeaturesSimplified";
import { NumbersSection } from "./sections/NumbersSection";
import { TestimonialMarqueeFetcher } from "@/features/testimonials/TestimonialMarqueeFetcher";
import { FAQSection } from "@/features/faqs/FAQSection";
import { FeaturedProjects } from "@/features/work/FeaturedProjects";
import { TechStackFetcher } from "@/features/tech/TechStackFetcher";

/** The service's work steps (CMS process) in the pinned steps-list style. */
/** Tech stack heading copy: CMS `techStack` first, then the page's default. */
function techStackCopy(
  cms: ServicePageData["techStack"],
  fallback: { title: string; description: string; highlight: string },
) {
  return {
    title: cms?.title ?? fallback.title,
    description: cms?.description ?? fallback.description,
    highlight: cms?.highlight ?? fallback.highlight,
  };
}

const PLATFORM_STACK = {
  title: "Our Technology Stack",
  description: "The tools and frameworks we use to build custom platforms that scale.",
  highlight: "Technology Stack",
};

function WorkSteps({ process }: { process: ProcessSectionProps }) {
  return (
    <FeaturesSimplified
      title={process.title}
      titleHighlights={process.titleHighlights}
      description={process.description}
      image=""
      featureCards={[...process.processCards]
        .sort((a, b) => a.stepNumber - b.stepNumber)
        .map((c) => ({ title: c.title, description: workStepSummary(c) }))}
    />
  );
}

/** Loose match of FAQ categories to each service (fallback only). */
const SERVICE_FAQ_MATCH: Partial<Record<Service["slug"], RegExp>> = {
  corporate: /corporate/i,
  ecommerce: /e-?commerce/i,
  "mobile-app": /mobile|product design/i,
  custom: /custom/i,
  "media-buying": /media buying/i,
  "google-ads": /google ads/i,
  seo: /seo|ago/i,
};

type Props = {
  slug: Service["slug"];
  data: ServicePageData;
  faqs: Array<FAQ & { id: number }>;
  /** FAQs for this service's category — feed the accordion and FAQ sections. */
  accordionFaqs?: Array<FAQ & { id: number }>;
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
    weGotYou: rawWeGotYou,
    whyUs,
    process,
    support,
    featuresSimplified,
    numbers,
    designsAdapt,
    moreAbout,
    heroReel,
    deviceVideo,
    techStack,
  } = data;

  const hero = withServiceLeadCta(rawHero, slug);

  // The FAQ section shows this service's questions only (no category filter):
  // the CMS category for the service, or — if that comes back empty — any FAQ
  // whose category clearly names the service. Never unrelated ones.
  const serviceFaqs = accordionFaqs.length
    ? accordionFaqs
    : faqs.filter((f) => SERVICE_FAQ_MATCH[slug]?.test(f.category ?? ""));
  const weGotYou = withServiceLeadCta(rawWeGotYou, slug);

  switch (slug) {
    case "corporate":
      return (
        <>
          <ServiceHero {...hero} reel={heroReel ?? CORPORATE_REEL} />
          {weGotYou && (
            <WeGotYouOrbit
              {...weGotYou}
              cta={{ label: "Get Proposal", href: leadsUrl(slug) }}
            />
          )}
          {whyUs && <WhyUsSection {...whyUs} />}
          {process && <WorkSteps process={process} />}
          <TechStackFetcher {...techStackCopy(techStack, PLATFORM_STACK)} />
          {support && <SupportSection {...support} />}
          <TestimonialMarqueeFetcher />
          {serviceFaqs.length > 0 && <FAQSection faqs={serviceFaqs} categories={[]} />}
        </>
      );

    case "ecommerce":
      return (
        <>
          <ServiceHero {...hero} scene={<EcommerceReel />} />
          {weGotYou && (
            <WeGotYouOrbit
              {...weGotYou}
              // The CMS image is still a placeholder: the card tells an order's
              // story instead — ordered, received, packed, delivered.
              image="/images/services/ecommerce/we-got-you.webp"
              imageAlt="Store owner managing orders on a tablet"
              story={weGotYou.story ?? ECOMMERCE_ORDER_STORY}
              cta={{ label: "Get Proposal", href: leadsUrl(slug) }}
            />
          )}
          {whyUs && <WhyUsSection {...whyUs} />}
          {featuresSimplified && <FeaturesSimplified {...featuresSimplified} />}
          {support && <SupportSection {...support} />}
          <TestimonialMarqueeFetcher />
          {serviceFaqs.length > 0 && <FAQSection faqs={serviceFaqs} categories={[]} />}
        </>
      );

    case "custom":
      return (
        <>
          <ServiceHero {...hero} reel={heroReel ?? CUSTOM_REEL} />
          {weGotYou && (
            <WeGotYouOrbit
              {...weGotYou}
              // The CMS image is missing; our team at work (front-end only).
              image="/images/about/about-2.webp"
              imageAlt="MitchDesigns team reviewing a platform build together"
              cta={{ label: "Get Proposal", href: leadsUrl(slug) }}
            />
          )}
          {/* "Built on Solid Foundations" as the 3D tilt-card grid the other
              service pages use for Why Us, with looping 3D icons. */}
          {moreAbout && <WhyUsSection {...moreAbout} />}
          {/* Device cards in the "We support you beyond launch" style
              (animated line icons instead of shots). */}
          {designsAdapt && <SupportSection {...designsAdapt} />}
          {process && <WorkSteps process={process} />}
          {caseStudies.length > 0 && (
            <FeaturedProjects caseStudies={caseStudies} />
          )}
          <TechStackFetcher {...techStackCopy(techStack, PLATFORM_STACK)} />
          <TestimonialMarqueeFetcher />
          {serviceFaqs.length > 0 && <FAQSection faqs={serviceFaqs} categories={[]} />}
        </>
      );

    case "media-buying":
      return (
        <>
          {/* Our live dashboard widgets, animated (front-end only). */}
          <ServiceHero {...hero} scene={<MediaBuyingScene />} />
          {numbers && <NumbersSection {...numbers} />}
          {/* The brief quote gives way to the scroll-written "We Got You"
              scene the other service pages open with. */}
          {weGotYou && (
            <WeGotYouOrbit
              {...weGotYou}
              // The CMS image is missing; our geography widget (front-end only).
              image={encodeURI("/images/media-buying/webp/Widgets [Marketing & Sales] [1.1].webp")}
              imageAlt="Audience geography dashboard widget designed by MitchDesigns"
              cta={{ label: "Get Proposal", href: leadsUrl(slug) }}
            />
          )}
          {/* Our Ads Manager recording on a MacBook that opens as you scroll. */}
          <MacbookVideoSection video={deviceVideo} />
          {whyUs && <WhyUsSection {...whyUs} />}
          <TestimonialMarqueeFetcher />
          {serviceFaqs.length > 0 && <FAQSection faqs={serviceFaqs} categories={[]} />}
        </>
      );

    case "google-ads":
      return (
        <>
          {/* Our live dashboard widgets, animated (front-end only). */}
          <ServiceHero {...hero} scene={<GoogleAdsScene />} />
          {numbers && <NumbersSection {...numbers} />}
          {/* As on the other service pages: the scroll-written "We Got You"
              scene instead of the prototype shot, brief quote and old card. */}
          {weGotYou && (
            <WeGotYouOrbit
              {...weGotYou}
              // The CMS image is missing; our emotions radar widget (front-end only).
              image={encodeURI("/images/google ads/webp/radar.webp")}
              imageAlt="Audience emotions radar dashboard widget designed by MitchDesigns"
              cta={{ label: "Get Proposal", href: leadsUrl(slug) }}
            />
          )}
          {/* Our Google Ads recording on a tablet that rises as you scroll. */}
          <TabletVideoSection video={deviceVideo} />
          {whyUs && <WhyUsSection {...whyUs} />}
          <TestimonialMarqueeFetcher />
          {serviceFaqs.length > 0 && <FAQSection faqs={serviceFaqs} categories={[]} />}
        </>
      );

    case "seo":
      return (
        <>
          {/* Our organic-clicks widget, animated (front-end only). */}
          <ServiceHero {...hero} scene={<SeoScene />} />
          {numbers && <NumbersSection {...numbers} />}
          {/* As on the other service pages: the scroll-written "We Got You"
              scene instead of the prototype shot, brief quote and old card. */}
          {weGotYou && (
            <WeGotYouOrbit
              {...weGotYou}
              // The CMS image is missing; our organic-clicks widget (front-end only).
              image="/images/SEO/seo-clicks.webp"
              imageAlt="Total organic clicks dashboard widget designed by MitchDesigns"
              cta={{ label: "Get Proposal", href: leadsUrl(slug) }}
            />
          )}
          {whyUs && <WhyUsSection {...whyUs} />}
          <TestimonialMarqueeFetcher />
          {serviceFaqs.length > 0 && <FAQSection faqs={serviceFaqs} categories={[]} />}
        </>
      );

    case "mobile-app":
      return (
        <>
          <ServiceHero {...hero} reel={heroReel ?? MOBILE_REEL} />
          {weGotYou && (
            <WeGotYouOrbit
              {...weGotYou}
              // The CMS image is missing; one of our app shots (front-end only).
              image={encodeURI("/images/mobile-app/Frame 2147227611.webp")}
              imageAlt="Hand holding a phone with a finance app designed by MitchDesigns"
              cta={{ label: "Get Proposal", href: leadsUrl(slug) }}
            />
          )}
          {whyUs && <WhyUsSection {...whyUs} />}
          <AppFlowSection
            steps={appFlowSteps(process)}
            eyebrow={process?.eyebrow}
            closingTitle={process?.closingTitle}
            closingText={process?.closingText}
            screens={process?.appScreens}
          />
          <TechStackFetcher
            {...techStackCopy(techStack, {
              title: "Craft seamless digital platforms with our modern tech stack",
              description:
                "More than a stack — it's how we build reliable, scalable, and secure digital ecosystems for every client.",
              highlight: "modern tech stack",
            })}
          />
          {support && <SupportSection {...support} />}
          <TestimonialMarqueeFetcher />
          {serviceFaqs.length > 0 && <FAQSection faqs={serviceFaqs} categories={[]} />}
        </>
      );

    default:
      return null;
  }
}
