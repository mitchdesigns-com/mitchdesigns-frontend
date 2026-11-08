import { getCaseStudies } from "@/lib/cms/queries";
import type { RichText } from "@/lib/cms/types";
import { inProjectType } from "@/lib/cms/projectType";
import { ClientWork } from "./ClientWork";

/** Loads one category's case studies for the ClientWork section. */
export async function ClientWorkFetcher({
  category,
  title,
  description,
  logosOnly,
}: {
  category: string;
  title: string;
  description?: RichText;
  /** Logo wall only (the page shows its projects elsewhere). */
  logosOnly?: boolean;
}) {
  const all = await getCaseStudies().catch(() => []);
  // CMS `order` first (lower first), the rest after it, newest first as loaded.
  const studies = all
    .filter((s) => inProjectType(s, category))
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
  if (!studies.length) return null;
  return <ClientWork title={title} description={description} studies={studies} category={category} logosOnly={logosOnly} />;
}
