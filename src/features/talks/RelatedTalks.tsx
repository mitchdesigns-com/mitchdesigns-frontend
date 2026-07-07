import type { Talk } from "@/lib/cms/types";
import { Section } from "@/components/layout/Section";
import { TalkCard } from "./TalkCard";

export function RelatedTalks({
  talks,
  heading = "More Talks",
}: {
  talks: Talk[];
  heading?: string;
}) {
  if (!talks.length) return null;

  return (
    <Section className="pt-10 pb-15">
      <div className="flex flex-col gap-[60px]">
        <h2 className="text-[60px] font-bold leading-[1.1] text-black">{heading}</h2>
        <div className="flex gap-10">
          {talks.map((t) => (
            <TalkCard key={t.slug} talk={t} />
          ))}
        </div>
      </div>
    </Section>
  );
}
