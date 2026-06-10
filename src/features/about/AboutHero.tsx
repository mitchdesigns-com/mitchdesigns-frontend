import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion";
import type { AboutContent } from "@/lib/cms/types";

export function AboutHero({ hero }: { hero: AboutContent["hero"] }) {
  const titleLines = hero.title.split("\n");

  return (
    <Section className="py-25">
      {/* Top row: heading left + description right */}
      <div className="flex items-end justify-between gap-10 mb-25">
        {/* Left: badge overlapping heading */}
        <div className="flex flex-col" style={{ gap: 0 }}>
          <span className="inline-flex w-fit items-center rounded-full bg-yellow px-3 py-1 text-base font-bold text-black -rotate-3 mb-[-20px] z-10 relative">
            {hero.badge}
          </span>
          <h1 className="text-hero-1 font-black leading-[110%] text-space-grey">
            {titleLines.map((line, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </h1>
        </div>

        {/* Right: description + CTA — above the fold, so reveal on mount
            rather than waiting for the scroll trigger (which never fires
            for content already in view on first paint). */}
        <Reveal immediate className="flex max-w-[517px] flex-col gap-7">
          <p className="text-xl leading-[125%] text-black text-balance">
            {hero.description}
          </p>
          <Button size="lg" asChild>
            <Link href="/quote" className="flex items-center gap-2">
              Get Detailed Proposal
              <ArrowRight size={20} />
            </Link>
          </Button>
        </Reveal>
      </div>

      {/* Bottom row: text panel + 2 image panels */}
      <RevealStagger className="grid grid-cols-3 gap-3 h-[550px]" stagger={0.08}>
        {/* Left panel: grey with text */}
        <RevealItem className="flex flex-col justify-between rounded-sm bg-panel p-10">
          <p className="text-xl font-medium leading-[125%] text-black">
            {hero.panel.title}
          </p>
          <p className="text-base leading-[125%] text-black text-balance">
            {hero.panel.body}
          </p>
        </RevealItem>

        {hero.images.slice(0, 2).map((img, i) => (
          <RevealItem key={i}>
            <Image
              src={img.url}
              alt={img.alt ?? "About MitchDesigns"}
              width={600}
              height={600}
              className="rounded-sm"
            />
          </RevealItem>
        ))}
      </RevealStagger>
    </Section>
  );
}
