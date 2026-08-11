import type { ObCtaVariant } from "@/lib/cms/types";

/** The `.wrap` container — width: min(1180px, 92vw), centered. */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-[min(1180px,92vw)] ${className ?? ""}`}>
      {children}
    </div>
  );
}

type Tone = "light" | "dark" | "mist" | "showcase";

const TONE: Record<Tone, string> = {
  light: "bg-ob-paper text-ob-ink",
  dark: "bg-ob-ink text-white",
  mist: "bg-ob-mist text-ob-ink",
  showcase: "bg-gradient-to-b from-ob-mist to-white text-ob-ink overflow-hidden",
};

/** A page section — `.sec` padding, optional tone background + id anchor. */
export function Section({
  id,
  tone = "light",
  className,
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-theme={tone === "dark" ? "dark" : undefined}
      className={`relative py-[66px] sm:py-24 ${TONE[tone]} ${className ?? ""}`}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1 inline-block font-ob-display text-[0.92rem] font-extrabold uppercase tracking-[0.1em] text-ob-red">
      {children}
    </span>
  );
}

export function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`max-w-[28ch] text-[clamp(1.95rem,3.7vw,2.65rem)] leading-[1.2] ${className ?? ""}`}
    >
      {children}
    </h2>
  );
}

export function Lead({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`max-w-[60ch] text-[clamp(1.02rem,1.6vw,1.18rem)] text-ob-muted ${className ?? ""}`}
    >
      {children}
    </p>
  );
}

const BTN: Record<ObCtaVariant, string> = {
  red: "bg-ob-red text-white shadow-[0_14px_30px_-12px_rgba(237,46,38,0.7)] hover:bg-ob-red-dark hover:shadow-[0_20px_40px_-12px_rgba(237,46,38,0.85)]",
  dark: "bg-ob-ink text-white hover:bg-black",
  ghost:
    "bg-white/[0.08] text-white border border-white/[0.28] hover:bg-white/[0.16]",
  outline:
    "bg-white text-ob-ink border-[1.5px] border-ob-line hover:border-ob-ink",
};

/** Pill button. Renders an anchor by default, a <button> when `type` is set. */
export function Btn({
  variant = "red",
  href,
  type,
  className,
  children,
  ...rest
}: {
  variant?: ObCtaVariant;
  href?: string;
  type?: "submit" | "button";
  className?: string;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const cls = `inline-flex items-center justify-center gap-[0.55em] whitespace-nowrap rounded-full px-6 py-[0.9em] font-ob-display text-[0.95rem] font-bold transition-all duration-300 hover:-translate-y-[3px] ${BTN[variant]} ${className ?? ""}`;
  if (type) {
    return (
      <button type={type} className={cls}>
        {children}
      </button>
    );
  }
  return (
    <a href={href} className={cls} {...rest}>
      {children}
    </a>
  );
}

/**
 * Plain <img>. The landing uses several absolutely-positioned, oversized
 * device mockups where next/image's layout model fights the design, so we opt
 * out of it here deliberately (assets are local, sized in CSS).
 */
export function Img(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...props} />;
}

/** The little check-stroke used throughout the design. Color via `text-*`. */
export function ObCheck({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
