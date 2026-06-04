import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion";
import { strapiMedia } from "@/lib/cms/media";
import type { AboutContent, TeamMember } from "@/lib/cms/types";

function MemberCard({ member }: { member: TeamMember }) {
  const photo = member.photo?.url
    ? strapiMedia(member.photo.url) ?? member.photo.url
    : null;

  return (
    <div className="relative flex h-[242px] w-[324px] flex-col justify-end overflow-hidden rounded-card-sm bg-space-grey p-5">
      {photo && (
        <>
          <Image
            src={photo}
            alt={member.name}
            fill
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </>
      )}
      <div className="relative">
        <p className="text-base font-medium text-fg">{member.name}</p>
        <p className="text-sm text-fg-muted">{member.role}</p>
      </div>
    </div>
  );
}

export function AboutTeam({
  team,
  members,
}: {
  team: AboutContent["team"];
  members: TeamMember[];
}) {
  const groupPhoto = team.groupPhoto?.url
    ? strapiMedia(team.groupPhoto.url) ?? team.groupPhoto.url
    : null;

  return (
    <Section theme="dark" className="py-30">
      <div className="flex items-center gap-10">
        {/* Left: text + team cards */}
        <Reveal className="flex w-[672px] shrink-0 flex-col justify-between gap-10">
          {/* Heading block */}
          <div className="flex flex-col" style={{ gap: 0 }}>
            <span className="inline-flex w-fit items-center rounded-full bg-yellow px-3 py-1 text-base font-bold text-black -rotate-3 -mb-2.25 z-10 relative">
              {team.badge}
            </span>
            <h2 className="text-hero-4 font-bold leading-[130%] text-fg">
              {team.heading}
            </h2>
          </div>

          {/* Team member cards */}
          <RevealStagger className="flex gap-6" stagger={0.1}>
            {members.map((member, i) => (
              <RevealItem key={i}>
                <MemberCard member={member} />
              </RevealItem>
            ))}
          </RevealStagger>
        </Reveal>

        {/* Right: large team photo */}
        <Reveal className="relative h-[800px] flex-1 overflow-hidden rounded-card-sm bg-space-grey">
          {groupPhoto && (
            <Image
              src={groupPhoto}
              alt={team.groupPhoto?.alt ?? "The MitchDesigns team"}
              fill
              className="object-cover"
            />
          )}
        </Reveal>
      </div>
    </Section>
  );
}
