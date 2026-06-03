import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { Reveal } from "@/components/motion";

export function AboutApproach() {
  return (
    <Section theme="dark" className="py-30">
      <div className="flex items-center justify-between gap-15">
        {/* Left: text content */}
        <Reveal className="flex max-w-[666px] shrink-0 flex-col gap-15" delay={0.15}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-base font-bold text-yellow">
                How We Work
              </span>
              <h2 className="text-hero-4 font-bold leading-[110%] text-fg">
                Every project follows a structured framework designed to align
                business objectives.
              </h2>
            </div>
            <p className="text-xl leading-[130%] text-fg text-balance">
              At Mitch Designs, design is seen as the meeting point of a
              business&rsquo;s goals and the customer&rsquo;s needs. That&rsquo;s
              why we put your customer at the center of our design process. We
              act as your customer advocates to design and develop digital
              products that help you scale your business.
            </p>
          </div>

          <Button size="lg" asChild>
            <Link href="/quote" className="flex items-center gap-2">
              Get Detailed Proposal
              <ArrowRight size={20} />
            </Link>
          </Button>
        </Reveal>

        {/* Right: decorative graphic placeholder */}
        <Reveal className="h-[600px] w-[666px] shrink-0 rounded-card-md bg-space-grey">
          {null}
        </Reveal>
      </div>
    </Section>
  );
}
