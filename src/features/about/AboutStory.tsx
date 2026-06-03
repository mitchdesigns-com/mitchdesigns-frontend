import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion";

export function AboutStory() {
  return (
    <Section className="py-20 bg-yellow overflow-hidden">
      {/* Top-right image card */}
      <div className="flex justify-end mb-10">
        <Reveal className="flex flex-col gap-5">
          <div className="h-[150px] w-[150px] rounded-sm bg-space-grey" />
          <p className="max-w-[237px] text-base leading-[125%] text-black text-balance">
            We believe that positive change comes from diverse minds working
            together to make a difference.
          </p>
        </Reveal>
      </div>

      {/* Center: Our Story heading */}
      <Reveal className="flex flex-col items-center gap-4 text-center -mt-10 mb-0 relative z-10">
        <p className="text-xl font-medium leading-[130%] text-space-grey">
          Our Story
        </p>
        <h2 className="max-w-[858px] text-hero-3 font-bold leading-[120%] text-black text-balance">
          Since 2005, we&rsquo;ve partnered with over 200 clients across 15
          industries to innovate and transform the digital landscape in Egypt
          and the MENA region.
        </h2>
      </Reveal>

      {/* Bottom: overlapping image + caption */}
      <Reveal className="-mt-20 flex flex-col items-start gap-5">
        <div className="h-[150px] w-[150px] rounded-sm bg-space-grey" />
        <p className="max-w-[237px] text-base leading-[125%] text-black text-balance">
          We act as your customer advocates to develop products that help you
          scale efficiently.
        </p>
      </Reveal>
    </Section>
  );
}
