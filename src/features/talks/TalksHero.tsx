import { Section } from "@/components/layout/Section";
import { RichText } from "@/components/ui/RichText";

interface TalksHeroProps {
  heading?: string;
  subheading?: unknown;
}

export function TalksHero({
  heading = "Talks",
  subheading,
}: TalksHeroProps) {
  return (
    <Section className="py-[120px] pb-0">
      <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:justify-between md:gap-10 md:text-left">
        <h1 className="font-black text-[44px] leading-[1.1] text-space-grey md:text-[92px]">
          {heading}
        </h1>
        <div className="max-w-[517px] text-[22px] font-bold leading-[1.1] text-space-grey md:text-[32px]">
          {subheading ? (
            <RichText content={subheading} />
          ) : (
            <p className="text-balance">
              Explore Insights, Stories, and Ideas Shaping Creativity and Modern Design.
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}
