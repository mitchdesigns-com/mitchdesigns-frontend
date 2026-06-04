import { cn } from "@/lib/cn";
import type { RichText } from "@/lib/cms/types";
import { RichText as RichTextRenderer } from "./RichText";

type SectionHeaderProps = {
  eyebrow?: string;
  /** Rendered above the title instead of the eyebrow. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: RichText;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  icon,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {icon ? (
        <span
          className={cn("mb-8 flex text-fg", align === "center" && "justify-center")}
        >
          {icon}
        </span>
      ) : eyebrow ? (
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-fg-muted">
          {eyebrow}
        </p>
      ) : null}
      <h2 className={cn("text-hero-4 font-bold md:text-hero-3", !icon && "mt-4")}>
        {title}
      </h2>
      {description ? (
        <RichTextRenderer content={description} className="mt-4 text-lg text-fg-muted" />
      ) : null}
    </div>
  );
}
