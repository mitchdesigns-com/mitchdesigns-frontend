import type { ProjectType } from "./types";

/** Display names for the Strapi `category` enum. Pure, safe for client components. */
const LABELS: Record<ProjectType, string> = {
  Corporate: "Corporate website",
  eCommerce: "eCommerce",
  "Mobile App": "Mobile app",
  Software: "Software",
};

export function projectTypeLabel(type: string | undefined | null): string | undefined {
  return type ? (LABELS[type as ProjectType] ?? type) : undefined;
}

/** True when a project is of this type, as its main or its second type. */
export function inProjectType(
  cs: { category?: string | null; secondaryCategory?: string | null },
  type: string,
): boolean {
  const t = type.toLowerCase();
  return cs.category?.toLowerCase() === t || cs.secondaryCategory?.toLowerCase() === t;
}
