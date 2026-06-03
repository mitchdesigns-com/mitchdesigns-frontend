import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/icons/ArrowRight";
import Image from "next/image";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion";

export function AboutHero() {
  return (
    <Section className="py-25">
      {/* Top row: heading left + description right */}
      <div className="flex items-end justify-between gap-10 mb-25">
        {/* Left: badge overlapping heading */}
        <div className="flex flex-col" style={{ gap: 0 }}>
          <span className="inline-flex w-fit items-center rounded-full bg-yellow px-3 py-1 text-base font-bold text-black -rotate-3 mb-[-20px] z-10 relative">
            Since 2005
          </span>
          <h1 className="text-hero-1 font-black leading-[110%] text-space-grey">
            About
            <br />
            MitchDesigns
          </h1>
        </div>

        {/* Right: description + CTA */}
        <Reveal className="flex max-w-[517px] flex-col gap-7">
          <p className="text-xl leading-[125%] text-black text-balance">
            We design and build high-performance digital platforms that turn
            user engagement into measurable business results.
          </p>
          <Button size="lg" asChild>
            <Link href="/quote" className="flex items-center gap-2">
              Get Detailed Proposal
              <ArrowRight size={20} />
            </Link>
          </Button>
        </Reveal>
      </div>

      {/* Bottom row: 3 image panels */}
      <RevealStagger className="grid grid-cols-3 gap-3 h-[550px]" stagger={0.08}>
        {/* Left panel: grey with text */}
        <RevealItem className="flex flex-col justify-between rounded-sm bg-panel p-10">
          <p className="text-xl font-medium leading-[125%] text-black">
            Clarity Before Creativity
          </p>
          <p className="text-base leading-[125%] text-black text-balance">
            Founded in 2005, MitchDesigns empowers businesses across industries
            with custom digital solutions tailored for long-term impact.
          </p>
        </RevealItem>

        {/* Middle image placeholder */}
        <RevealItem>
          <Image
            src="/images/about/about-1.webp"
            alt="About MitchDesigns"
            width={600}
            height={600}
            className="rounded-sm"
          />
        </RevealItem>

        {/* Right image placeholder */}
        <RevealItem>
          <Image
            src="/images/about/about-2.webp"
            alt="About MitchDesigns"
            width={600}
            height={600}
            className="rounded-sm"
          />
        </RevealItem>
      </RevealStagger>
    </Section>
  );
}
