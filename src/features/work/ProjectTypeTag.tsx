import type { CaseStudy } from "@/lib/cms/types";
import { projectTypeLabel } from "@/lib/cms/projectType";

type Props = {
  type: CaseStudy["category"];
  subcategory?: CaseStudy["subcategory"];
  /** "dark" sits on dark surfaces, "light" on white / yellow ones. */
  theme?: "dark" | "light";
};

/** Pill naming what kind of project a case study is (Strapi `category`).
 *  Renders nothing when the project has no type. */
export function ProjectTypeTag({ type, subcategory, theme = "light" }: Props) {
  const label = projectTypeLabel(type);
  if (!label) return null;

  const pill = `inline-flex shrink-0 items-center rounded-full px-2 py-1.5 text-sm ${
    theme === "dark" ? "bg-card-border text-white" : "bg-border text-black"
  }`;

  return (
    <span className="flex flex-wrap items-center gap-2 self-start">
      <span className={pill}>{label}</span>
      {subcategory ? <span className={pill}>{subcategory}</span> : null}
    </span>
  );
}
