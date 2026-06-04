import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion";

type Props = {
  title: string;
  excerpt: string;
  image?: { url: string; alt?: string } | null;
};

export function JobDetailHero({ title, excerpt, image }: Props) {
  return (
    <Section theme="light" className="pt-32 pb-20 lg:py-20">
      <div className="flex flex-col items-stretch gap-10 lg:flex-row lg:items-stretch">
        {/* Illustration */}
        <Reveal className="relative aspect-[557/611] w-full overflow-hidden rounded-card bg-bg-alt lg:w-[42%] lg:shrink-0">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt ?? title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="dots-pattern absolute inset-0 opacity-40" aria-hidden />
          )}
        </Reveal>

        {/* Heading + intro */}
        <div className="flex flex-1 flex-col justify-between gap-10 py-2">
          <Reveal className="flex flex-col gap-4">
            <span className="text-lg font-medium text-fg-muted">Job Details</span>
            <h1 className="text-hero-3 font-bold text-fg">{title}</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-xl text-fg text-balance">{excerpt}</p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
