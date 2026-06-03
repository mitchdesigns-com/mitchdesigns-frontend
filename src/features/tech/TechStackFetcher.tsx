import { getTechStack, getTechStackSection } from "@/lib/cms";
import { fixtureTechStack, fixtureTechStackSection } from "@/lib/cms/fixtures";
import { TechStack } from "./TechStack";

type Props = {
  /** Explicit overrides (e.g. service pages). When omitted, copy is pulled
   *  from the Tech Stack single type in Strapi. */
  title?: string;
  description?: string;
  highlight?: string;
};

export async function TechStackFetcher({ title, description, highlight }: Props) {
  let items;
  try {
    const data = await getTechStack();
    items = data && data.length ? data : fixtureTechStack;
  } catch {
    items = fixtureTechStack;
  }

  if (!items.length) return null;

  // Explicit props win; otherwise fetch the single type, falling back to fixture.
  let section: { title: string; description?: string; highlight?: string };
  if (title !== undefined) {
    section = { title, description, highlight };
  } else {
    let cms = fixtureTechStackSection;
    try {
      const data = await getTechStackSection();
      if (data) cms = data;
    } catch {
      /* keep fixture */
    }
    section = {
      title: cms.title,
      description: cms.description ?? undefined,
      highlight: cms.highlight ?? undefined,
    };
  }

  return (
    <TechStack
      items={items}
      title={section.title}
      description={section.description}
      highlight={section.highlight}
    />
  );
}
