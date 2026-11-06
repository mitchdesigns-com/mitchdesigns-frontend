import { SITE_SETTINGS_FALLBACK } from "@/lib/cms/siteDefaults";
import type {
  CaseStudy,
  FAQ,
  ProcessSectionProps,
  Service,
  ServicePageData,
} from "@/lib/cms/types";
import { SERVICES, isLeadFunnelHref, leadsUrl } from "@/config/nav";
import { ServiceHero } from "./sections/ServiceHero";
import { ServiceSwitcher } from "./sections/ServiceSwitcher";
import { CORPORATE_REEL, CUSTOM_REEL, MOBILE_REEL } from "@/config/serviceReels";
import { EcommerceReel } from "./ecommerceReel/EcommerceReel";
import { MediaBuyingScene } from "./mediaBuyingScene/MediaBuyingScene";
import { GoogleAdsScene } from "./googleAdsScene/GoogleAdsScene";
import { SeoScene } from "./seoScene/SeoScene";
import { TabletVideoSection } from "./googleAdsScene/TabletVideoSection";
import { MacbookVideoSection } from "./mediaBuyingScene/MacbookVideoSection";
import { workStepSummary } from "./sections/workSteps";
import { ClientWorkFetcher } from "./sections/ClientWorkFetcher";
import { SupportStack } from "./sections/SupportStack";
import { AppDemoSection } from "./sections/AppDemoSection";
import { AppFlowSection } from "./sections/appFlow/AppFlowSection";
import { appFlowSteps } from "./sections/appFlow/steps";

/** 3D icons for the eCommerce audience tabs (B2C, Food & Beverage, B2B). */
const ECOMMERCE_MODEL_ICONS = [
  { src: "/images/services/ecommerce-models/b2c.webp", alt: "Shopping bag and card, B2C online store" },
  { src: "/images/services/ecommerce-models/food-beverage.webp", alt: "Delivery bag with burger and coffee, food ordering" },
  { src: "/images/services/ecommerce-models/b2b.webp", alt: "Storefront, boxes on a pallet and an invoice, B2B wholesale" },
];

/** "We Got You" card on eCommerce: one order from tap to doorstep
 *  (fallback until `weGotYou.story` is filled in Strapi). */
const ECOMMERCE_ORDER_STORY = [
  { src: "/images/services/ecommerce/story-1-order.webp", alt: "Customer ordering from an online store on her phone" },
  { src: "/images/services/ecommerce/we-got-you.webp", alt: "Store owner receiving the order on a tablet" },
  { src: "/images/services/ecommerce/story-3-packing.webp", alt: "Staff packing the order for delivery" },
  { src: "/images/services/ecommerce/story-4-delivery.webp", alt: "Courier delivering the order to the customer" },
];
import { WeGotYouTabs } from "./sections/WeGotYouTabs";
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
      pageScroll
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
  // Same services, labels and order as the main menu.
  const switcher = (
    <ServiceSwitcher
      current={slug}
      items={SERVICES.map((s) => ({ slug: s.slug, label: s.shortLabel, href: `/services/${s.slug}` }))}
    />
  );

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
          <ServiceHero {...hero} switcher={switcher} reel={heroReel ?? CORPORATE_REEL} />
          {weGotYou && (
            <WeGotYouOrbit
              {...weGotYou}
              // The CMS image, or our studio shoot until one is set.
              image={weGotYou.image || "/images/studio/corporate-review.webp"}
              imageAlt="MitchDesigns team building a corporate website"
              cta={{ label: weGotYou.cta?.label ?? SITE_SETTINGS_FALLBACK.primaryCta.label, href: leadsUrl(slug) }}
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
          <ServiceHero {...hero} switcher={switcher} scene={<EcommerceReel />} bleedScene />
          {weGotYou &&
            (() => {
              const ecommerceWeGotYou = {
                ...weGotYou,
                // The CMS image is still a placeholder: the card tells an order's
                // story instead — ordered, received, packed, delivered.
                image: "/images/services/ecommerce/we-got-you.webp",
                imageAlt: "Store owner managing orders on a tablet",
                story: weGotYou.story ?? ECOMMERCE_ORDER_STORY,
                cta: { label: weGotYou.cta?.label ?? SITE_SETTINGS_FALLBACK.primaryCta.label, href: leadsUrl(slug) },
              };
              // Audience tabs (B2C · Food & Beverage · B2B) when the CMS has them.
              return weGotYou.tabs?.length ? (
                <WeGotYouTabs {...ecommerceWeGotYou} icons={ECOMMERCE_MODEL_ICONS} />
              ) : (
                <WeGotYouOrbit {...ecommerceWeGotYou} />
              );
            })()}
          {/* The brands we built stores for (CMS heading in `moreAbout`, projects from case studies). */}
          {moreAbout && <ClientWorkFetcher category="eCommerce" title={moreAbout.title} description={moreAbout.description} />}
          {whyUs && <WhyUsSection {...whyUs} />}
          {featuresSimplified && <FeaturesSimplified {...featuresSimplified} />}
          {/* Website + app: the app playing live on a coded phone (CMS `process` copy). */}
          {process?.processCards?.length ? (
            <AppDemoSection
              eyebrow={process.eyebrow}
              title={process.title}
              steps={appFlowSteps(process)}
              logo={{ src: "/images/orderbase/wordmark.svg", alt: "Orderbase" }}
            />
          ) : null}
          {/* Same stack as Corporate, minus the CMS (stores run on their own engine). */}
          <TechStackFetcher {...techStackCopy(techStack, PLATFORM_STACK)} exclude={["Strapi"]} />
          {/* "Why Brands Stay With Us" as a scroll stack of big cards. */}
          {support && <SupportStack {...support} />}
          <TestimonialMarqueeFetcher />
          {serviceFaqs.length > 0 && <FAQSection faqs={serviceFaqs} categories={[]} />}
        </>
      );

    case "custom":
      return (
        <>
          <ServiceHero {...hero} switcher={switcher} reel={heroReel ?? CUSTOM_REEL} />
          {weGotYou && (
            <WeGotYouOrbit
              {...weGotYou}
              // The CMS image, or our studio shoot until one is set.
              image={weGotYou.image || "/images/studio/screens-review.webp"}
              imageAlt="MitchDesigns team reviewing a platform build across screens"
              cta={{ label: weGotYou.cta?.label ?? SITE_SETTINGS_FALLBACK.primaryCta.label, href: leadsUrl(slug) }}
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
          <ServiceHero {...hero} switcher={switcher} scene={<MediaBuyingScene />} />
          {numbers && <NumbersSection {...numbers} />}
          {/* The brief quote gives way to the scroll-written "We Got You"
              scene the other service pages open with. */}
          {weGotYou && (
            <WeGotYouOrbit
              {...weGotYou}
              // The CMS image is missing; our geography widget (front-end only).
              image={encodeURI("/images/media-buying/webp/Widgets [Marketing & Sales] [1.1].webp")}
              imageAlt="Audience geography dashboard widget designed by MitchDesigns"
              cta={{ label: weGotYou.cta?.label ?? SITE_SETTINGS_FALLBACK.primaryCta.label, href: leadsUrl(slug) }}
            />
          )}
          {/* Our Ads Manager recording on a MacBook that opens as you scroll. */}
          <MacbookVideoSection video={deviceVideo} />
          {/* Google Ads is part of media buying now: its tablet recording follows. */}
          <TabletVideoSection />
          {whyUs && <WhyUsSection {...whyUs} />}
          <TestimonialMarqueeFetcher />
          {serviceFaqs.length > 0 && <FAQSection faqs={serviceFaqs} categories={[]} />}
        </>
      );

    case "google-ads":
      return (
        <>
          {/* Our live dashboard widgets, animated (front-end only). */}
          <ServiceHero {...hero} switcher={switcher} scene={<GoogleAdsScene />} />
          {numbers && <NumbersSection {...numbers} />}
          {/* As on the other service pages: the scroll-written "We Got You"
              scene instead of the prototype shot, brief quote and old card. */}
          {weGotYou && (
            <WeGotYouOrbit
              {...weGotYou}
              // The CMS image is missing; our emotions radar widget (front-end only).
              image={encodeURI("/images/google ads/webp/radar.webp")}
              imageAlt="Audience emotions radar dashboard widget designed by MitchDesigns"
              cta={{ label: weGotYou.cta?.label ?? SITE_SETTINGS_FALLBACK.primaryCta.label, href: leadsUrl(slug) }}
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
          <ServiceHero {...hero} switcher={switcher} scene={<SeoScene />} />
          {numbers && <NumbersSection {...numbers} />}
          {/* As on the other service pages: the scroll-written "We Got You"
              scene instead of the prototype shot, brief quote and old card. */}
          {weGotYou && (
            <WeGotYouOrbit
              {...weGotYou}
              // The CMS image is missing; our organic-clicks widget (front-end only).
              image="/images/SEO/seo-clicks.webp"
              imageAlt="Total organic clicks dashboard widget designed by MitchDesigns"
              cta={{ label: weGotYou.cta?.label ?? SITE_SETTINGS_FALLBACK.primaryCta.label, href: leadsUrl(slug) }}
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
          <ServiceHero {...hero} switcher={switcher} reel={heroReel ?? MOBILE_REEL} />
          {weGotYou && (
            <WeGotYouOrbit
              {...weGotYou}
              // The CMS image, or our studio shoot until one is set.
              image={weGotYou.image || "/images/studio/mobile-app.webp"}
              imageAlt="MitchDesigns team testing a mobile app on a phone"
              cta={{ label: weGotYou.cta?.label ?? SITE_SETTINGS_FALLBACK.primaryCta.label, href: leadsUrl(slug) }}
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
                "More than a stack. It's how we build reliable, scalable, and secure digital ecosystems for every client.",
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
