import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { Parallax, ParallaxImage, Reveal } from "@/components/motion";
import type { AboutContent } from "@/lib/cms/types";
import { LEADS_URL } from "@/config/nav";
import { Eyebrow } from "./Eyebrow";
import { noOrphan } from "@/lib/noOrphan";

/**
 * Culture and environment: the statement and copy side by side, then a
 * wide-angle team photo across the full width that drifts inside its frame,
 * with a yellow block peeking out behind it for depth.
 */
const CULTURE_PHOTO = { url: "/images/studio/about/culture.webp", alt: "The MitchDesigns team working together in the open studio" };

export function AboutApproach({ approach }: { approach: AboutContent["approach"] }) {
  // The CMS image, or our studio shoot until one is set.
  const photo = approach.image?.url
    ? { url: approach.image.url, alt: approach.image.alt ?? CULTURE_PHOTO.alt }
    : CULTURE_PHOTO;
  return (
    <Section theme="dark" className="py-24 md:py-32">
      <Reveal className="grid items-end gap-8 lg:grid-cols-2 lg:gap-24">
        <div className="flex flex-col gap-4">
          <Eyebrow>{approach.eyebrow}</Eyebrow>
          <h2 className="text-hero-3 text-left font-bold text-fg text-balance">{noOrphan(approach.title)}</h2>
        </div>
        <div className="flex flex-col items-start gap-6">
          {approach.body.split(/\n\n+/).map((para, i) => (
            <p key={i} className="text-xl text-fg-muted text-balance">{noOrphan(para)}</p>
          ))}
          {approach.cta?.label && (
            <Button size="lg" asChild>
              <Link href={approach.cta.href ?? LEADS_URL} className="flex w-fit items-center gap-2">
                {approach.cta.label}
                <ArrowRight size={20} />
              </Link>
            </Button>
          )}
        </div>
      </Reveal>

      <div className="relative mt-16 md:mt-24">
        {/* Yellow block behind, moving the other way */}
        <Parallax speed={30} className="absolute -right-4 -bottom-6 left-12 top-12 md:-right-8 md:-bottom-10">
          <div className="size-full bg-yellow" />
        </Parallax>
        <Parallax speed={-30} className="relative">
          <ParallaxImage src={photo.url} alt={photo.alt} className="aspect-3/2 lg:aspect-21/9" />
        </Parallax>
      </div>
    </Section>
  );
}
