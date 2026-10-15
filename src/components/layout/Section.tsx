import { cn } from "@/lib/cn";

type Theme = "light" | "dark" | "beige" | "space-grey";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  as?: "section" | "header" | "footer" | "div" | "article";
  theme?: Theme;
  bleed?: boolean; // if true, no horizontal padding/container
};

export function Section({
  as: Tag = "section",
  theme = "light",
  bleed = false,
  className,
  children,
  ...props
}: SectionProps) {
  const Component = Tag as "section";
  return (
    <Component
      data-theme={theme === "light" ? undefined : theme}
      className={cn("relative", className)}
      {...props}
    >
      {bleed ? children : <div className="container-page">{children}</div>}
    </Component>
  );
}
