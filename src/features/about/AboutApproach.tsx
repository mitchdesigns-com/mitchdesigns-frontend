import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { Reveal } from "@/components/motion";
import type { AboutContent } from "@/lib/cms/types";
import { LEADS_URL } from "@/config/nav";

export function AboutApproach({
  approach,
}: {
  approach: AboutContent["approach"];
}) {
  return (
    <Section theme="dark" className="py-30">
      <div className="flex flex-col items-center gap-15 lg:flex-row lg:justify-between">
        {/* Left: text content */}
        <Reveal className="flex w-full max-w-[666px] flex-col gap-15" delay={0.15}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-base font-bold text-yellow">
                {approach.eyebrow}
              </span>
              <h2 className="text-hero-4 font-bold leading-[110%] text-fg">
                {approach.title}
              </h2>
            </div>
            <p className="text-xl leading-[130%] text-fg text-balance">
              {approach.body}
            </p>
          </div>

          <Button size="lg" asChild>
            <Link href={LEADS_URL} className="flex items-center gap-2">
              Get Detailed Proposal
              <ArrowRight size={20} />
            </Link>
          </Button>
        </Reveal>

        {/* Right: decorative graphic */}
        <Reveal className="relative aspect-[666/600] w-full max-w-[666px] overflow-hidden rounded-card-md bg-space-grey">
          {approach.image && (
            <Image
              src={approach.image.url}
              alt={approach.image.alt ?? ""}
              fill
              className="object-cover"
            />
          )}
        </Reveal>
      </div>
    </Section>
  );
}
