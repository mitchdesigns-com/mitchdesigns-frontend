import { Section } from "@/components/layout/Section";

const DEFAULT_DRIVES = [
  { label: "Open Communication" },
  { label: "Flat Hierarchies" },
  { label: "Full Ownership" },
  { label: "Innovative Culture" },
];

type Props = { drives?: Array<{ label: string }> };

export function OurDrive({ drives = DEFAULT_DRIVES }: Props = {}) {
  return (
    <Section theme="dark" className="py-25">
      <div className="flex gap-5 snap-x snap-mandatory overflow-x-auto pb-2 sm:snap-none sm:overflow-x-visible sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {drives.map(({ label }) => (
          <div
            key={label}
            className="min-w-[78%] shrink-0 snap-start min-h-87 rounded-card border border-border shadow-soft-lg flex items-center justify-center sm:min-w-0 sm:flex-1 sm:shrink"
          >
            <span className="text-lg text-fg-muted font-medium text-center text-balance px-6">
              {label}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}
