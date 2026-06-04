import { Fragment } from "react";
import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion";
import type { AboutContent, RichText } from "@/lib/cms/types";

type InlineNode = {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

function renderInline(node: InlineNode, key: number) {
  let content: React.ReactNode = node.text;
  if (node.bold) content = <strong className="font-bold">{content}</strong>;
  if (node.italic) content = <em className="font-light">{content}</em>;
  if (node.underline) content = <u>{content}</u>;
  return <Fragment key={key}>{content}</Fragment>;
}

/** Renders a Strapi blocks value inline (no block wrappers) for use in a heading. */
function StoryTitle({ content }: { content: RichText }) {
  if (!content) return null;
  if (typeof content === "string") return <>{content}</>;
  if (!Array.isArray(content)) return null;

  return (
    <>
      {(content as Array<{ children?: InlineNode[] }>).flatMap((block, bi) =>
        (block.children ?? []).map((child, ci) =>
          renderInline(child, bi * 1000 + ci),
        ),
      )}
    </>
  );
}

function StoryCard({
  card,
  className,
}: {
  card: AboutContent["story"]["cards"][number];
  className?: string;
}) {
  return (
    <Reveal className={`flex flex-col gap-5 ${className ?? ""}`}>
      <div className="relative h-[150px] w-[150px] overflow-hidden rounded-sm bg-space-grey">
        {card.image && (
          <Image
            src={card.image.url}
            alt={card.image.alt ?? ""}
            fill
            className="object-cover"
          />
        )}
      </div>
      <p className="max-w-[237px] text-base leading-[125%] text-black text-balance">
        {card.body}
      </p>
    </Reveal>
  );
}

export function AboutStory({ story }: { story: AboutContent["story"] }) {
  const [topCard, bottomCard] = story.cards;

  return (
    <Section className="py-20 bg-yellow overflow-hidden">
      {/* Top-right image card */}
      {topCard && (
        <div className="flex justify-end mb-10">
          <StoryCard card={topCard} />
        </div>
      )}

      {/* Center: Our Story heading */}
      <Reveal className="flex flex-col items-center gap-4 text-center -mt-10 mb-0 relative z-10">
        <p className="text-lg font-medium leading-[130%] text-space-grey">
          {story.eyebrow}
        </p>
        <h2 className="max-w-[890px] text-hero-3 lg:text-story capitalize text-black">
          <StoryTitle content={story.title} />
        </h2>
      </Reveal>

      {/* Bottom: overlapping image + caption */}
      {bottomCard && <StoryCard card={bottomCard} className="-mt-20 items-start" />}
    </Section>
  );
}
