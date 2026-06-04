type Stat = { value: string; label?: string };

type Props = {
  pill?: string;
  title?: string;
  description?: string;
  statsTitle?: string;
  stats?: Stat[];
};

const DEFAULT_STATS: Stat[] = [
  { value: "+400", label: "Projects Delivered" },
  { value: "+20", label: "Years of Experience" },
  { value: "+30", label: "Dedicated Experts" },
];

export function SinceFrom({
  pill = "Since 2005",
  title = "Built By\nMitchDesigns",
  description = "Founded in 2005, MitchDesigns empowers businesses across industries with custom digital solutions tailored for long-term impact.",
  statsTitle = "Our Experience",
  stats = DEFAULT_STATS,
}: Props = {}) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[var(--container-max)] px-[3.75rem] flex flex-col gap-[3.75rem]">

        {/* Top row — pill+title left, description right, baseline aligned */}
        <div className="flex justify-between items-end">

          {/* Left — "Since 2005" pill overlapping title */}
          <div className="flex flex-col items-start" style={{ gap: 0 }}>
            <div
              className="relative z-10 -mb-[14px] inline-flex items-center justify-center rounded-pill bg-yellow border border-white px-2 py-1 text-base font-bold text-black"
              style={{ transform: "rotate(4deg)", transformOrigin: "left center" }}
            >
              {pill}
            </div>
            <h2 className="text-hero-2 font-bold text-space-grey leading-[1.1] whitespace-pre-line">
              {title}
            </h2>
          </div>

          {/* Right — description */}
          <p className="text-xl text-fg text-balance max-w-[517px]">
            {description}
          </p>
        </div>

        {/* Bottom row — stats card + 2 illustration slots */}
        <div className="flex items-start gap-3">

          {/* Stats card */}
          <div className="w-[456px] shrink-0 h-[550px] rounded-[16px] bg-panel p-10 flex flex-col justify-between">
            <p className="text-base font-medium text-fg">{statsTitle}</p>

            <div className="flex flex-col gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="contents">
                  <StatRow value={stat.value} label={stat.label ?? ""} />
                  {i < stats.length - 1 && <div className="w-full h-px bg-border" />}
                </div>
              ))}
            </div>
          </div>

          {/* Illustration slots */}
          {[1, 2].map((i) => (
            <div key={i} className="flex-1 h-[550px] rounded-[16px] bg-panel flex items-center justify-center">
              <span className="text-sm text-fg-muted">Illustration {i}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatRow({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-hero-4 font-bold text-fg leading-[1.1]">{value}</span>
      <span className="text-base text-space-grey">{label}</span>
    </div>
  );
}
