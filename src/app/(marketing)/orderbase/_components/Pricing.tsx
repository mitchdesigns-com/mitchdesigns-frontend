import { CheckmarkSquareIcon } from "@/components/icons/CheckmarkSquareIcon";

interface PricingFeature {
  label: string;
  disabled?: boolean;
}

interface PricingPlan {
  name: string;
  tagline?: string;
  price?: string;
  setupFee?: string;
  features: PricingFeature[];
  recommended?: boolean;
  highlighted?: boolean; // Pro card — red border + tinted bg
  ctaLabel?: string;
  ctaHref?: string;
}

const DEFAULT_PLANS: PricingPlan[] = [
  {
    name: "Standard",
    tagline: "Launch Fast",
    price: "15,000",
    setupFee: "+ 90,000 EGP One-time Setup",
    ctaLabel: "Contact Sales",
    ctaHref: "#",
    features: [
      { label: "Up to 2 Branches" },
      { label: "Standard Interface Design" },
      { label: "Basic Order Management" },
      { label: "Guest Checkout Only", disabled: true },
      { label: "No ERP Integrations", disabled: true },
    ],
  },
  {
    name: "Pro",
    tagline: "Custom & Scalable",
    price: "22,000",
    setupFee: "+ 180,000 EGP One-time Setup",
    recommended: true,
    highlighted: true,
    ctaLabel: "Contact Sales",
    ctaHref: "#",
    features: [
      { label: "Up to 10 Branches" },
      { label: "Custom Interface Design" },
      { label: "Multi-Branch & Stop Sale Logic" },
      { label: "User Accounts & Vouchers" },
      { label: "Standard ERP Integrations" },
    ],
  },
  {
    name: "Elite",
    tagline: "Full Digital Infrastructure",
    price: "40,000",
    setupFee: "+ 280,000 EGP One-time Setup",
    ctaLabel: "Contact Sales",
    ctaHref: "#",
    features: [
      { label: "Up to 30 Branches" },
      { label: "Delivery Driver App & API" },
      { label: "Loyalty & Wallet System" },
      { label: "Build Your Own Product" },
      { label: "Custom Integrations & Reporting" },
    ],
  },
];

type PricingProps = {
  title?: string;
  subtitle?: string;
  plans?: PricingPlan[];
};

export function Pricing({
  title = "Start with OrderBase in 3 ways",
  subtitle = "Transparent pricing for growing food brands.",
  plans = DEFAULT_PLANS,
}: PricingProps = {}) {
  return (
    <section data-theme="dark" className="bg-black py-20">
      <div className="mx-auto max-w-[var(--container-max)] px-[3.75rem] flex flex-col items-center gap-10">

        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-hero-3 font-bold text-white text-balance leading-[1.1]">
            {title}
          </h2>
          <p className="text-xl text-white text-balance">{subtitle}</p>
        </div>

        {/* Cards */}
        <div className="flex items-start gap-6 w-full">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  const isHighlighted = plan.highlighted;

  return (
    <div
      className="relative flex flex-col gap-8 flex-1 rounded-[32px] p-10"
      style={{
        background: isHighlighted ? "var(--color-card-pro)" : "var(--color-space-grey)",
        border: isHighlighted ? "1px solid var(--color-orderbase-red)" : "none",
      }}
    >
      {/* "Most Recommended" pill */}
      {plan.recommended && (
        <div
          className="absolute -top-3 left-[250px] inline-flex items-center justify-center rounded-pill bg-orderbase-red border border-black px-2 py-1 text-base font-medium text-white whitespace-nowrap"
          style={{ transform: "rotate(3deg)", transformOrigin: "left center" }}
        >
          Most Recommended
        </div>
      )}

      {/* Plan name + tagline */}
      <div className="flex flex-col gap-1">
        <p className="text-[2rem] font-bold text-white leading-[1.1]">{plan.name}</p>
        <p
          className="text-xl"
          style={{ color: isHighlighted ? "var(--color-orderbase-red)" : "var(--color-grey-200)" }}
        >
          {plan.tagline}
        </p>
      </div>

      {/* Price */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-hero-4 font-bold text-white leading-[1.1]">{plan.price}</span>
          <span className="text-xl text-white/60">EGP /mo</span>
        </div>
        <p className="text-xl text-white/60">{plan.setupFee}</p>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-white/20" />

      {/* Features */}
      <ul className="flex flex-col gap-3">
        {plan.features.map((f) => (
          <li key={f.label} className="flex items-center gap-3">
            <CheckmarkSquareIcon
              size={24}
              className={f.disabled ? "text-fg-muted" : "text-white"}
            />
            <span
              className="text-base"
              style={{ color: f.disabled ? "var(--color-grey-500)" : "white" }}
            >
              {f.label}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href={plan.ctaHref ?? "#"}
        className="flex w-full items-center justify-center rounded-pill py-4 text-xl font-medium text-white"
        style={
          isHighlighted
            ? { background: "var(--color-orderbase-red)" }
            : { border: "1px solid var(--color-orderbase-red)" }
        }
      >
        {plan.ctaLabel}
      </a>
    </div>
  );
}
