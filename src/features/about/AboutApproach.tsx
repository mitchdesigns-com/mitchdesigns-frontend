import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { Parallax, ParallaxImage, Reveal } from "@/components/motion";
import type { AboutContent } from "@/lib/cms/types";
import { LEADS_URL } from "@/config/nav";
import { aboutPhoto } from "./photos";
import { Eyebrow } from "./Eyebrow";

/**
 * "How We Work": the approach copy beside a photo that rides at its own
 * scroll speed and drifts inside its frame, with a yellow block peeking out
 * behind it for depth.
 */
export function AboutApproach({ approach }: { approach: AboutContent["approach"] }) {
  const photo = aboutPhoto(approach.image, 1);
  return (
    <Section theme="dark" className="py-24 md:py-32">
      <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <Reveal className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Eyebrow>{approach.eyebrow}</Eyebrow>
            <h2 className="text-hero-3 font-bold text-fg text-balance">{approach.title}</h2>
          </div>
          <p className="text-xl text-fg-muted text-balance">{approach.body}</p>
          <Button size="lg" asChild>
            <Link href={LEADS_URL} className="flex w-fit items-center gap-2">
              Get Detailed Proposal
              <ArrowRight size={20} />
            </Link>
          </Button>
        </Reveal>

        <div className="relative">
          {/* Yellow block behind, moving the other way */}
          <Parallax speed={40} className="absolute -right-4 -bottom-6 left-12 top-12 md:-right-8 md:-bottom-10">
            <div className="size-full bg-yellow" />
          </Parallax>
          <Parallax speed={-40} className="relative">
            <ParallaxImage src={photo.url} alt={photo.alt} className="aspect-6/5" />
          </Parallax>
        </div>
      </div>
    </Section>
  );
}
