import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { RichText } from "@/components/ui/RichText";
import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
import { MapPin } from "@/components/icons/MapPin";
import { Briefcase } from "@/components/icons/Briefcase";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion";
import type { Career } from "@/lib/cms/types";

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="inline-flex items-center gap-2 text-xl text-fg-muted">
        {icon}
        {label}
      </span>
      <span className="text-xl font-medium text-fg">{value}</span>
    </div>
  );
}

function JobSummaryCard({
  role,
  applyHref,
}: {
  role: Career;
  applyHref: string;
}) {
  return (
    <div className="flex flex-col gap-10 rounded-card bg-space-grey p-8 lg:sticky lg:top-28">
      <div className="flex flex-col gap-2">
        <span className="text-lg font-medium text-fg-muted">Job Details</span>
        <h2 className="text-hero-4 font-bold text-fg">{role.title}</h2>
      </div>

      <div className="flex flex-col gap-6">
        <MetaRow
          icon={<MapPin size={22} />}
          label="Location"
          value={role.remote ? "Remote" : role.location}
        />
        <MetaRow
          icon={<Briefcase size={24} />}
          label="Type"
          value={role.type}
        />
      </div>

      <Button asChild size="lg" className="w-full">
        <a href={applyHref}>
          Apply Now
          <ArrowUpRight size={20} />
        </a>
      </Button>
    </div>
  );
}

export function JobDetailBody({
  role,
  applyHref,
}: {
  role: Career;
  applyHref: string;
}) {
  return (
    <Section theme="dark" className="py-20">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,557fr)_minmax(0,795fr)]">
        {/* Sticky summary */}
        <Reveal className="lg:self-start">
          <JobSummaryCard role={role} applyHref={applyHref} />
        </Reveal>

        {/* Content */}
        <div className="flex flex-col gap-15">
          {role.quote && (
            <Reveal>
              <blockquote className="rounded-card-sm border border-yellow bg-yellow/10 px-6 py-3 text-hero-5 font-bold text-fg text-balance">
                &ldquo;{role.quote}&rdquo;
              </blockquote>
            </Reveal>
          )}

          {role.sections && role.sections.length > 0 ? (
            <RevealStagger
              as="div"
              className="flex flex-col gap-15"
              stagger={0.08}
            >
              {role.sections.map((section) => (
                <RevealItem
                  key={section.heading}
                  className="flex flex-col gap-5"
                >
                  <h2 className="text-hero-3 font-bold text-fg">
                    {section.heading}
                  </h2>
                  <p className="whitespace-pre-line text-xl text-fg text-balance">
                    {section.body}
                  </p>
                </RevealItem>
              ))}
            </RevealStagger>
          ) : role.body ? (
            <Reveal>
              <RichText content={role.body} className="text-xl text-fg" />
            </Reveal>
          ) : (
            <p className="text-xl text-fg-muted text-balance">
              We&rsquo;d love to hear from you. Send us your portfolio and a note
              about why you&rsquo;re a great fit.
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}
