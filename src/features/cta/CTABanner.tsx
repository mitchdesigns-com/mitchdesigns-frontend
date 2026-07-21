import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { RevealStagger, RevealItem } from "@/components/motion";
import { HeaderCtaInView } from "@/components/layout/HeaderCtaInView";
import { LEADS_URL, isLeadsHref } from "@/config/nav";

type CTABannerProps = {
  title?: React.ReactNode;
  description?: string;
  cta?: { label: string; href: string };
  bgImage?: string;
};

export function CTABanner({
  title = "Ready For Your Next Project?",
  description = "Get a fully detailed proposal tailored to your business and users. After a short discovery meeting, our team prepares everything within 48 hours.",
  cta = { label: "Get Detailed Proposal", href: LEADS_URL },
  bgImage = "/images/cta-bg.webp",
}: CTABannerProps) {
  return (
    <Section theme="dark" bleed>
      <div
        className="relative flex min-h-[440px] items-center justify-center overflow-hidden bg-scroll py-16 sm:py-25 md:min-h-[560px] md:bg-fixed"
        style={
          bgImage
            ? {
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Content */}
        <RevealStagger
          className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-8 px-6 md:px-0"
          stagger={0.12}
        >
          <RevealItem>
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" fill="#FFDB00" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M39.9048 40.9604L39.8694 6.40039L24.0839 19.3979L8.90306 6.41873L8.86836 6.40039V6.41114L8.87825 6.40326L8.89707 6.42246L8.80078 40.9604L17.5075 40.937V24.7063L24.0499 31.0666L31.1628 24.3874V40.937L39.9048 40.9604Z"
                fill="#171717"
              />
            </svg>
          </RevealItem>

          <RevealItem className="flex flex-col items-center gap-4 text-center">
            <h2 className="max-w-2xl text-balance text-hero-3 font-bold leading-[1.1] text-white">
              {title}
            </h2>
            <p className="max-w-2xl text-lg text-grey-200 max-md:text-base">{description}</p>
          </RevealItem>

          <RevealItem>
            <HeaderCtaInView className="w-fit max-md:w-full" active={isLeadsHref(cta.href)}>
              <Button asChild size="lg" variant="primary" className="max-md:w-full">
                <Link href={cta.href} className="flex items-center gap-2">
                  {cta.label}
                  <ArrowRight />
                </Link>
              </Button>
            </HeaderCtaInView>
          </RevealItem>
        </RevealStagger>
      </div>
    </Section>
  );
}
