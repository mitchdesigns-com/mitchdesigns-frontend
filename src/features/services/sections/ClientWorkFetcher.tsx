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
  const studies = all.filter((s) => s.category?.toLowerCase() === category.toLowerCase());
  if (!studies.length) return null;
  return <ClientWork title={title} description={description} studies={studies} category={category} />;
}
