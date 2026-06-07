import Link from "next/link";
import Image from "next/image";
import type { Talk } from "@/lib/cms/types";
import { Section } from "@/components/layout/Section";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion";
import { ArrowRight } from "@/components/icons/ArrowRight";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function TagPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded-pill bg-yellow px-4 py-2 text-[14px] font-bold leading-[1.3] text-black">
      {label}
    </span>
  );
}

function FeaturedTalk({ talk }: { talk: Talk }) {
  return (
    <Link href={`/talks/${talk.slug}`} className="flex w-full items-start gap-8">
      <Reveal className="relative aspect-[533/390] w-[38%] shrink-0 overflow-hidden rounded-card-md">
        {talk.cover?.url ? (
          <Image
            src={talk.cover.url}
            alt={talk.cover.alternativeText ?? talk.title}
            fill
            sizes="(min-width: 768px) 40vw, 80vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#e5e5e5]" />
        )}
      </Reveal>

      <Reveal delay={0.15} className="flex flex-1 flex-col justify-between self-stretch py-10">
        <div className="flex items-center gap-5">
          <div className="flex flex-wrap gap-2">
            {talk.category
              ? <TagPill label={talk.category} />
              : talk.tags?.map((tag) => <TagPill key={tag} label={tag} />)
            }
          </div>
          {(talk.publishedAt ?? talk.date) && (
            <span className="text-[16px] leading-tight text-[#515151]">
              {formatDate((talk.publishedAt ?? talk.date)!)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          <h3 className="text-[46px] font-bold leading-[1.1] text-black">
            {talk.title}
          </h3>
          <p className="text-balance text-[16px] leading-6 text-[#515151]">
            {talk.excerpt}
          </p>
        </div>
      </Reveal>
    </Link>
  );
}

function SmallTalkCard({ talk }: { talk: Talk }) {
  return (
    <Link href={`/talks/${talk.slug}`} className="flex flex-1 flex-col gap-4">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-card-md">
        {talk.cover?.url ? (
          <Image
            src={talk.cover.url}
            alt={talk.cover.alternativeText ?? talk.title}
            fill
            sizes="(min-width: 768px) 25vw, 80vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#e5e5e5]" />
        )}
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {talk.category
              ? <TagPill label={talk.category} />
              : talk.tags?.map((tag) => <TagPill key={tag} label={tag} />)
            }
          </div>
          {(talk.publishedAt ?? talk.date) && (
            <span className="shrink-0 text-[16px] leading-tight text-[#515151]">
              {formatDate((talk.publishedAt ?? talk.date)!)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          <h3 className="text-[20px] font-medium leading-[1.3] text-black">
            {talk.title}
          </h3>
          <p className="text-balance text-[16px] leading-6 text-[#515151]">
            {talk.excerpt}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function TalksSection({ talks }: { talks: Talk[] }) {
  if (!talks.length) return null;

  const featured = talks.find((t) => t.featured) ?? talks[0]!;
  const grid = talks.filter((t) => t !== featured).slice(0, 4);
  const mobileTalks = [featured, ...grid];

  return (
    <Section className="py-20">
      <div className="flex flex-col gap-10 md:gap-[60px]">
        <Reveal>
          <h2 className="text-[36px] font-bold leading-[1.1] text-black md:text-[46px]">
            Talks
          </h2>
        </Reveal>

        {/* Mobile — horizontal scroll; left aligns with content, right bleeds to the edge */}
        <RevealStagger
          className="-mr-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
          stagger={0.1}
        >
          {mobileTalks.map((t) => (
            <RevealItem key={t.slug} className="w-[80vw] shrink-0 snap-start">
              <SmallTalkCard talk={t} />
            </RevealItem>
          ))}
        </RevealStagger>

        {/* Desktop — featured + grid */}
        <div className="hidden flex-col gap-8 md:flex">
          <FeaturedTalk talk={featured} />
          {grid.length > 0 && (
            <RevealStagger className="flex gap-4" stagger={0.1}>
              {grid.map((t) => (
                <RevealItem key={t.slug} className="flex flex-1">
                  <SmallTalkCard talk={t} />
                </RevealItem>
              ))}
            </RevealStagger>
          )}
        </div>

        <Link
          href="/talks"
          className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-pill bg-space-grey px-9 py-6 text-[16px] font-medium text-white max-md:w-full max-md:justify-center"
        >
          Explore All Talks
          <ArrowRight size={20} />
        </Link>
      </div>
    </Section>
  );
}
