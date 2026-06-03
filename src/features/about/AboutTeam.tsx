import { Section } from "@/components/layout/Section";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion";

const TEAM_MEMBERS = [
  { name: "Team Member", role: "Role" },
  { name: "Team Member", role: "Role" },
] as const;

export function AboutTeam() {
  return (
    <Section theme="dark" className="py-30">
      <div className="flex items-center gap-10">
        {/* Left: text + team cards */}
        <Reveal className="flex w-[672px] shrink-0 flex-col justify-between gap-10">
          {/* Heading block */}
          <div className="flex flex-col" style={{ gap: 0 }}>
            <span className="inline-flex w-fit items-center rounded-full bg-yellow px-3 py-1 text-base font-bold text-black rotate-3 mb-[-13px] z-10 relative">
              Our Team
            </span>
            <h2 className="text-hero-4 font-bold leading-[130%] text-fg">
              We believe that positive change comes from diverse minds working
              together to make a difference.
            </h2>
          </div>

          {/* Team member cards */}
          <RevealStagger className="flex gap-6" stagger={0.1}>
            {TEAM_MEMBERS.map((member, i) => (
              <RevealItem
                key={i}
                className="flex h-[242px] w-[324px] flex-col justify-end rounded-card-sm bg-space-grey p-5"
              >
                <p className="text-base font-medium text-fg">{member.name}</p>
                <p className="text-sm text-fg-muted">{member.role}</p>
              </RevealItem>
            ))}
          </RevealStagger>
        </Reveal>

        {/* Right: large team photo placeholder */}
        <Reveal className="h-[800px] flex-1 rounded-card-sm bg-space-grey">
          {null}
        </Reveal>
      </div>
    </Section>
  );
}
