import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
import { SlideLabel } from "@/components/ui/SlideLabel";
import { Eyebrow } from "@/features/about/Eyebrow";
import { MapPin } from "@/components/icons/MapPin";
import { Briefcase } from "@/components/icons/Briefcase";
import type { Career } from "@/lib/cms/types";

function JobTag({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-yellow px-4 py-2 text-base text-yellow transition-colors delay-75 duration-300 group-hover:border-black group-hover:text-black">
      {icon}
      {label}
    </span>
  );
}

/** A whole job row is the link. On hover (the nav menu's style) a white
 *  panel grows out from the centre across the full page width, the title
 *  rolls up, the text (and tags) turn dark, and "Apply Today"
 *  becomes a yellow button whose arrow turns from ↗ to →. The row's padding
 *  sits inside a matching negative margin, so text stays on the grid. */
function JobRow({ job, applyLabel }: { job: Career; applyLabel: string }) {
  return (
    <Link
      href={`/careers/${job.slug}`}
      className="group relative -mx-6 flex flex-col items-start gap-6 border-t border-border px-6 py-6 transition-colors duration-300 hover:border-transparent md:flex-row md:items-center md:justify-between md:gap-10 md:py-10"
    >
      {/* White panel growing out from the centre across the full page width
          (the nav menu's hover; centred on the row, centred on the page). */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 origin-center scale-x-0 bg-white transition-transform duration-500 ease-out-soft group-hover:scale-x-100"
      />
      <div className="relative flex w-full flex-col gap-4 md:w-auto">
        <h3 className="text-hero-4 font-bold text-fg transition-colors delay-75 duration-300 group-hover:text-black">
          {/* The title rolls up like the nav menu items */}
          <span className="sr-only">{job.title}</span>
          <span aria-hidden>
            <SlideLabel label={job.title} line={1.4} />
          </span>
        </h3>
        <p className="text-lg text-fg text-balance transition-colors delay-75 duration-300 group-hover:text-black">{job.excerpt}</p>
        <div className="flex items-center gap-6">
          <JobTag
            icon={<MapPin size={20} />}
            label={job.remote ? "Remote" : job.location}
          />
          <JobTag icon={<Briefcase size={20} />} label={job.type} />
        </div>
      </div>
      <span className="relative flex shrink-0 items-center gap-2 rounded-pill px-5 py-3 text-lg font-medium text-fg transition-colors delay-100 duration-300 group-hover:bg-yellow group-hover:text-black">
        {applyLabel}
        <ArrowUpRight size={26} className="transition-transform duration-500 ease-out-soft group-hover:rotate-45" />
      </span>
    </Link>
  );
}

export function OpenPositions({
  jobs,
  heading = "Open Positions",
  applyLabel = "Apply Today",
}: {
  jobs: Career[];
  heading?: string;
  applyLabel?: string;
}) {
  if (jobs.length === 0) return null;

  return (
    <Section theme="dark" className="overflow-x-clip pb-25">
      <div className="flex flex-col">
        <Eyebrow className="mb-8">{heading}</Eyebrow>
        {jobs.map((job) => (
          <JobRow key={job.slug} job={job} applyLabel={applyLabel} />
        ))}
        <div className="border-t border-border" />
      </div>
    </Section>
  );
}
