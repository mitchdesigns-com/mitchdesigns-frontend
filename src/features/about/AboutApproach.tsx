import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { Reveal } from "@/components/motion";
import type { AboutContent } from "@/lib/cms/types";

export function AboutApproach({
  approach,
}: {
  approach: AboutContent["approach"];
}) {
  return (
    <Section theme="dark" className="py-30">
      <div className="flex items-center justify-between gap-15">
        {/* Left: text content */}
        <Reveal className="flex max-w-[666px] shrink-0 flex-col gap-15" delay={0.15}>
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
            <Link href="/quote" className="flex items-center gap-2">
              Get Detailed Proposal
              <ArrowRight size={20} />
            </Link>
          </Button>
        </Reveal>

        {/* Right: decorative graphic */}
        <Reveal className="relative h-[600px] w-[666px] shrink-0 overflow-hidden rounded-card-md bg-space-grey">
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
