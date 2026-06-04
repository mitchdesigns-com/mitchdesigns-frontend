import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
import { MapPin } from "@/components/icons/MapPin";
import { Briefcase } from "@/components/icons/Briefcase";
import type { Career } from "@/lib/cms/types";

function JobTag({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-yellow px-4 py-2 text-base text-yellow">
      {icon}
      {label}
    </span>
  );
}

function JobRow({ job }: { job: Career }) {
  return (
    <div className="flex items-center justify-between border-t border-border py-10">
      <div className="flex flex-col gap-4">
        <h3 className="text-hero-4 font-bold text-fg">{job.title}</h3>
        <p className="text-lg text-fg text-balance">{job.excerpt}</p>
        <div className="flex items-center gap-6">
          <JobTag
            icon={<MapPin size={20} />}
            label={job.remote ? "Remote" : job.location}
          />
          <JobTag icon={<Briefcase size={20} />} label={job.type} />
        </div>
      </div>
      <Link
        href={`/careers/${job.slug}`}
        className="flex items-center gap-2 text-lg font-medium text-fg shrink-0"
      >
        Apply Today
        <ArrowUpRight size={26} />
      </Link>
    </div>
  );
}

export function OpenPositions({ jobs }: { jobs: Career[] }) {
  if (jobs.length === 0) return null;

  return (
    <Section theme="dark" className="pb-25">
      <div className="flex flex-col">
        <span className="text-lg font-medium text-yellow mb-6">
          Open Positions
        </span>
        {jobs.map((job) => (
          <JobRow key={job.slug} job={job} />
        ))}
        <div className="border-t border-border" />
      </div>
    </Section>
  );
}
