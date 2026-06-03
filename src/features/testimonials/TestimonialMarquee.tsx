"use client";

import Image from "next/image";
import { Marquee } from "@/components/ui/Marquee";
import { Section } from "@/components/layout/Section";
import { strapiMedia } from "@/lib/cms/media";
import type { Testimonial } from "@/lib/cms/types";
import { Heart } from "@/components/icons/Heart";
import { GoogleBadge } from "@/components/icons/GoogleBadge";
import { Reveal } from "@/components/motion";

type TestimonialMarqueeProps = {
  testimonials: Array<Testimonial & { id: number }>;
};

function ReviewCard({ t }: { t: Testimonial & { id: number } }) {
  const avatar = strapiMedia(t.avatar?.url);
  const logo = strapiMedia(t.companyLogo?.url);

  return (
    <article className="flex w-card-review shrink-0 flex-col justify-between rounded-card-md border border-card-border bg-card p-5">
      <div className="flex flex-col gap-8">
        {/* Header: avatar + name/role + Google badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            {avatar ? (
              <Image
                src={avatar}
                alt={t.author}
                width={58}
                height={58}
                className="size-[58px] rounded-xl object-cover"
              />
            ) : (
              <span className="grid size-[58px] shrink-0 place-items-center rounded-xl bg-space-grey text-base font-medium text-grey-200">
                {t.author.charAt(0)}
              </span>
            )}
            <div className="flex flex-col gap-1">
              <p className="text-base font-medium leading-snug text-grey-200">
                {t.author}
              </p>
              <p className="text-xs leading-snug text-grey-500">
                {t.role} of {t.company}
              </p>
            </div>
          </div>
          {t.googleReview && <GoogleBadge />}
        </div>

        {/* Quote */}
        <div className="flex flex-col gap-1 py-2.5">
          <span className="font-sans text-5xl leading-none text-grey-200" aria-hidden>
            &ldquo;
          </span>
          <p className="text-lg leading-[1.3] text-grey-200 text-balance">
            {t.quote}&rdquo;
          </p>
        </div>
      </div>

      {/* Company logo */}
      {logo && (
        <Image
          src={logo}
          alt={t.company}
          width={120}
          height={28}
          className="mt-4 h-7 w-auto object-contain object-left"
        />
      )}
    </article>
  );
}

export function TestimonialMarquee({ testimonials }: TestimonialMarqueeProps) {

  return (
    <Section theme="dark" bleed className="overflow-hidden py-20">
      {/* Header */}
      <Reveal className="container-page mb-10 flex flex-col items-center gap-3.5 text-center">
        <h2 className="relative inline-flex items-center text-hero-3 font-bold text-white">
          Loved By Clients
          <span className="absolute -right-8 -top-1 rotate-15">
            <Heart />
          </span>
        </h2>
        <p className="max-w-lg text-base text-white text-balance">
          Hear it from the brands and people who trusted us — genuine feedback that tells our story better than we can.
        </p>
      </Reveal>

      {/* Marquee rows — both use all testimonials so neither row ever runs short */}
      <div className="relative flex flex-col gap-10">
        <Marquee speed={40} gap={40}>
          {testimonials.map((t) => (
            <ReviewCard key={`a-${t.id}`} t={t} />
          ))}
        </Marquee>
        <Marquee speed={40} gap={40} direction="right">
          {testimonials.map((t) => (
            <ReviewCard key={`b-${t.id}`} t={t} />
          ))}
        </Marquee>

        {/* Edge fade gradients — desktop only */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-72 sm:block"
          style={{ background: "linear-gradient(to right, #07020d 30%, transparent)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-72 sm:block"
          style={{ background: "linear-gradient(to left, #07020d 30%, transparent)" }}
          aria-hidden
        />
      </div>
    </Section>
  );
}
