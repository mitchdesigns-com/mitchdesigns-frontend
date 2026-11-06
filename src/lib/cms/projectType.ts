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
