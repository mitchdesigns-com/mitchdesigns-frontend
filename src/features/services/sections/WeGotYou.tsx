import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { HeaderCtaInView } from "@/components/layout/HeaderCtaInView";
import { isLeadsHref } from "@/config/nav";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { Reveal } from "@/components/motion";
import type { WeGotYouProps } from "@/lib/cms/types";
import { RichText } from "@/components/ui/RichText";

function renderTitle(
  title: string,
  titleHighlights: string[] = [],
  Tag: "h2" | "h3",
) {
  if (!titleHighlights.length) {
    return <Tag className="text-hero-5">{title}</Tag>;
  }
  const words = title.split(/\s+/);
  return (
    <Tag className="text-hero-5">
      {words.map((word, i) => {
        const bare = word.replace(/[.,!?;:]+$/, "");
        const trail = word.slice(bare.length);
        const highlighted = titleHighlights.includes(bare);
        return (
          <Fragment key={i}>
            {highlighted ? (
              <span className="text-accent">{bare}</span>
            ) : (
              bare
            )}
            {trail}
            {i < words.length - 1 ? " " : ""}
          </Fragment>
        );
      })}
    </Tag>
  );
}

export function WeGotYou({
  title,
  titleTag = "h2",
  titleHighlights,
  label,
  description,
  image,
  imageAlt,
  cta,
  theme = "light",
  imagePosition = "right",
}: WeGotYouProps) {
  return (
    <Section theme={theme} className="py-20 md:py-28">
      <div
        className={`flex flex-col gap-10 md:flex-row md:items-center ${
          imagePosition === "left" ? "md:flex-row-reverse" : ""
        }`}
      >
        <Reveal className="flex flex-1 flex-col gap-10" delay={0.15}>
          {label && (
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-fg-muted">
              {label}
            </p>
          )}
          {renderTitle(title, titleHighlights, titleTag)}
          <RichText
            content={description}
            className="max-w-2xl text-lg leading-[125%] text-fg-muted md:text-2xl"
          />
          {cta && (
            <HeaderCtaInView active={isLeadsHref(cta.href)}>
              <Button size="lg" asChild>
                <Link href={cta.href} className="flex items-center gap-2">
                  {cta.label}
                  <ArrowRight size={20} />
                </Link>
              </Button>
            </HeaderCtaInView>
          )}
        </Reveal>
        <Reveal className="relative min-h-72 flex-1 overflow-hidden rounded-card md:min-h-96">
          <Image
            src={image}
            alt={imageAlt ?? ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </Reveal>
      </div>
    </Section>
  );
}
