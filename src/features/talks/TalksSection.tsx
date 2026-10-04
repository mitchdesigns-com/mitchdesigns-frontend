import Link from "next/link";
import Image from "next/image";
import type { Talk } from "@/lib/cms/types";
import { Section } from "@/components/layout/Section";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { PixelArrowIcon } from "@/components/icons/PixelArrowIcon";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function labelsOf(talk: Talk) {
  return talk.category ? [talk.category] : (talk.tags ?? []);
}

function Cover({ talk, sizes }: { talk: Talk; sizes: string }) {
  if (!talk.cover?.url) return null;
  return (
    <Image
      src={talk.cover.url}
      alt={talk.cover.alternativeText ?? talk.title}
      fill
      sizes={sizes}
      className="object-cover transition-transform duration-1000 ease-out-soft group-hover:scale-105"
    />
  );
}

/** Pixel arrow at rest; swaps to the solid arrow on hover. */
function ReadMoreArrow() {
  return (
    <span className="relative grid size-5 place-items-center">
      <PixelArrowIcon
        size={18}
        className="transition-opacity duration-300 ease-out-soft group-hover:opacity-0"
      />
      <ArrowRight
        size={20}
        className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-out-soft group-hover:opacity-100"
      />
    </span>
  );
}

/** Featured talk — image left, white content box right with the yellow
 *  "Read More" bar. Hover: a yellow panel grows up from the bar to fill the
 *  box, and the bar turns black. */
function FeaturedTalk({ talk }: { talk: Talk }) {
  const date = talk.publishedAt ?? talk.date;

  return (
    <Link href={`/talks/${talk.slug}`} className="group grid md:grid-cols-5">
      <div className="relative aspect-video overflow-hidden bg-space-grey md:col-span-3">
        <Cover talk={talk} sizes="(min-width: 768px) 60vw, 100vw" />
      </div>

      <div className="flex flex-col md:col-span-2">
        <div className="relative flex flex-1 flex-col gap-8 overflow-hidden bg-white p-6 lg:p-10">
          {/* Yellow panel — grows up from the bar on hover, behind the content */}
          <div
            aria-hidden
            className="absolute inset-0 origin-bottom scale-y-0 bg-yellow transition-transform duration-700 ease-out-soft group-hover:scale-y-100"
          />
          <div className="relative flex items-center justify-between gap-4 text-sm tracking-1 text-black uppercase">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {labelsOf(talk).map((label) => (
                <span key={label} className="flex items-center gap-2">
                  <span aria-hidden className="size-2 rounded-full bg-black" />
                  {label}
                </span>
              ))}
            </div>
            {date && <span className="shrink-0 text-grey-600 normal-case">{formatDate(date)}</span>}
          </div>

          <div className="relative mt-auto flex flex-col gap-4">
            <h3 className="text-hero-5 text-balance text-black lg:text-hero-4">{talk.title}</h3>
            <p className="line-clamp-3 text-base text-grey-600 text-balance transition-colors duration-500 ease-out-soft group-hover:text-black">
              {talk.excerpt}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between bg-yellow px-6 py-5 text-sm font-medium tracking-1 text-black uppercase transition-colors duration-500 ease-out-soft group-hover:bg-black group-hover:text-yellow lg:px-10">
          Read More
          <ReadMoreArrow />
        </div>
      </div>
    </Link>
  );
}

/** Row card — full-bleed cover under a 30% veil, white category top-left,
 *  white title + excerpt over the image and a yellow "Read More" bar.
 *  Hover: a white panel grows up from the bar behind the text (text turns
 *  dark) and the bar turns black with yellow "Read More". */
function TalkCard({ talk }: { talk: Talk }) {
  return (
    <Link href={`/talks/${talk.slug}`} className="group flex h-full flex-col">
      <div className="relative aspect-square overflow-hidden bg-space-grey">
        <Cover talk={talk} sizes="(min-width: 768px) 33vw, 100vw" />
        <div aria-hidden className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-x-4 gap-y-1 p-6 text-sm tracking-1 text-white uppercase lg:p-8">
          {labelsOf(talk).map((label) => (
            <span key={label} className="flex items-center gap-2">
              <span aria-hidden className="size-2 rounded-full bg-white" />
              {label}
            </span>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-0 flex min-h-1/3 flex-col justify-end gap-3 p-6 pr-10 lg:p-8 lg:pr-16">
          {/* White panel — grows up from the bar on hover, behind the text */}
          <div
            aria-hidden
            className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-700 ease-out-soft group-hover:scale-y-100"
          />
          {/* Title always takes 2 lines and excerpt exactly 2, so every card
              in the row lines up whatever the copy length. */}
          <h3 className="relative line-clamp-2 min-h-lines-2 text-xl font-bold text-balance text-white transition-colors duration-500 ease-out-soft group-hover:text-black">
            {talk.title}
          </h3>
          <p className="relative line-clamp-2 min-h-lines-2 text-base text-white/80 text-balance transition-colors duration-500 ease-out-soft group-hover:text-grey-600">
            {talk.excerpt}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between bg-yellow px-6 py-5 text-sm font-medium tracking-1 text-black uppercase transition-colors duration-500 ease-out-soft group-hover:bg-black group-hover:text-yellow lg:px-8">
        Read More
        <ReadMoreArrow />
      </div>
    </Link>
  );
}

export function TalksSection({ talks }: { talks: Talk[] }) {
  if (!talks.length) return null;

  const featured = talks.find((t) => t.featured) ?? talks[0]!;
  const rest = talks.filter((t) => t !== featured).slice(0, 3);

  return (
    <Section className="bg-panel py-20">
      <div className="flex flex-col gap-10 lg:gap-15">
        <Reveal>
          <h2 className="text-hero-3 text-black">Talks</h2>
        </Reveal>

        <Reveal>
          <FeaturedTalk talk={featured} />
        </Reveal>

        {rest.length > 0 && (
          <RevealStagger className="grid gap-4 md:grid-cols-3 lg:gap-6" stagger={0.1}>
            {rest.map((t) => (
              <RevealItem key={t.slug}>
                <TalkCard talk={t} />
              </RevealItem>
            ))}
          </RevealStagger>
        )}

        <Link
          href="/talks"
          className="inline-flex items-center gap-2 self-center rounded-pill bg-space-grey px-9 py-6 text-base font-medium whitespace-nowrap text-white max-md:w-full max-md:justify-center"
        >
          Explore All Talks
          <ArrowRight size={20} />
        </Link>
      </div>
    </Section>
  );
}
