import { getCaseStudies } from "@/lib/cms/queries";
import type { RichText } from "@/lib/cms/types";
import { ClientWork } from "./ClientWork";

/** Loads one category's case studies for the ClientWork section. */
export async function ClientWorkFetcher({
  category,
  title,
  description,
  exclude = [],
}: {
  category: string;
  title: string;
  description?: RichText;
  /** Case-study slugs to leave out (tagged with the category but not a fit). */
  exclude?: string[];
}) {
  const all = await getCaseStudies().catch(() => []);
  const studies = all.filter((s) => s.category?.toLowerCase() === category.toLowerCase() && !exclude.includes(s.slug));
  if (!studies.length) return null;
  return <ClientWork title={title} description={description} studies={studies} category={category} />;
}
