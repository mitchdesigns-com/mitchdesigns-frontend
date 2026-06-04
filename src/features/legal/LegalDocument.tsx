import { Section } from "@/components/layout/Section";

type Props = {
  title: string;
  /** Human-readable last-updated date, e.g. "June 4, 2026". */
  updated: string;
  children: React.ReactNode;
};

/**
 * Long-form legal document layout (Privacy, Terms). Styles its children via a
 * scoped prose treatment so pages only supply semantic content.
 */
export function LegalDocument({ title, updated, children }: Props) {
  return (
    <Section theme="dark" className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-hero-3 font-bold md:text-hero-2">{title}</h1>
        <p className="mt-4 text-sm text-fg-muted">Last updated: {updated}</p>
        <div
          className="mt-10 space-y-5 text-lg text-fg-muted [&_a]:text-accent [&_a]:underline [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-fg [&_li]:text-balance [&_p]:text-balance [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
        >
          {children}
        </div>
      </div>
    </Section>
  );
}
