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
      <div className="flex flex-col gap-5 sm:flex-row">
        {drives.map(({ label }) => (
          <div
            key={label}
            className="flex-1 min-h-87 rounded-card border border-border shadow-soft-lg flex items-center justify-center"
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
