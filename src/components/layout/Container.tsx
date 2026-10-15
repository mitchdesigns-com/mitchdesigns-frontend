import { cn } from "@/lib/cn";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: keyof React.JSX.IntrinsicElements;
};

export function Container({
  as: Tag = "div",
  className,
  ...props
}: ContainerProps) {
  const Component = Tag as "div";
  return <Component className={cn("container-page", className)} {...props} />;
}
