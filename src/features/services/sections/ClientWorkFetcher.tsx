import { getCaseStudies } from "@/lib/cms/queries";
import type { RichText } from "@/lib/cms/types";
import { ClientWork } from "./ClientWork";

/** Loads one category's case studies for the ClientWork section. */
export async function ClientWorkFetcher({
  category,
  title,
  description,
}: {
  category: string;
  title: string;
  description?: RichText;
}) {
  const all = await getCaseStudies().catch(() => []);
  // CMS `order` first (lower first), the rest after it, newest first as loaded.
  const studies = all
    .filter((s) => s.category?.toLowerCase() === category.toLowerCase())
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
  if (!studies.length) return null;
  return <ClientWork title={title} description={description} studies={studies} category={category} />;
}
