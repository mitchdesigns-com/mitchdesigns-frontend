import type { CaseStudy, ProjectType } from "@/lib/cms/types";
import { projectTypeLabel } from "@/lib/cms/projectType";

/** Each type gets its own colour dot so the four read apart at a glance. */
const DOT: Record<ProjectType, string> = {
  Corporate: "bg-type-corporate",
  eCommerce: "bg-type-ecommerce",
  "Mobile App": "bg-type-mobile",
  Software: "bg-type-software",
};

type Props = {
  type: CaseStudy["category"];
  subcategory?: CaseStudy["subcategory"];
  /** Text colour for the surface it sits on, e.g. "text-black". */
  className?: string;
};

/** Coloured label naming what kind of project a case study is (Strapi
 *  `category`, plus the optional `subcategory`). Text takes the surrounding
 *  colour, so it works on white, yellow and dark surfaces alike. Renders
 *  nothing when the project has no type. */
export function ProjectTypeTag({ type, subcategory, className = "" }: Props) {
  const label = projectTypeLabel(type);
  if (!type || !label) return null;

  return (
    <span className={`inline-flex flex-wrap items-center gap-x-2 gap-y-1 self-start text-sm font-semibold ${className}`}>
      <span className={`size-2 shrink-0 rounded-full ${DOT[type] ?? "bg-fg-muted"}`} aria-hidden />
      <span>{label}</span>
      {subcategory ? (
        <>
          <span className="size-1 shrink-0 rounded-full bg-current opacity-40" aria-hidden />
          <span className="opacity-60">{subcategory}</span>
        </>
      ) : null}
    </span>
  );
}
