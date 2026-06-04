type Props = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function ReadyToOwn({
  title = "Ready To Own Your System?",
  subtitle = "Stop renting your customers from aggregators. Launch fast, scale across branches, and take back your margins.",
  ctaLabel = "Contact Sales",
  ctaHref = "#",
}: Props = {}) {
  return (
    <section data-theme="dark" className="relative overflow-hidden bg-black py-20">

      {/* Red glow — 438×438 ellipse at x:537 y:524, blur 100px, 50% opacity */}
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{
          left: 537,
          top: 524,
          width: 438,
          height: 438,
          background: "var(--color-orderbase-red)",
          filter: "blur(100px)",
          opacity: 0.5,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[var(--container-max)] px-[3.75rem] flex flex-col items-center gap-[3.75rem]">

        {/* Header */}
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-hero-2 font-bold text-white text-balance leading-[1.1]">
              {title}
            </h2>
            <p className="text-xl text-white text-balance max-w-[754px]">
              {subtitle}
            </p>
          </div>
          <a
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-pill bg-orderbase-red px-9 py-4 text-xl font-medium text-white"
          >
            {ctaLabel}
          </a>
        </div>

        {/* Decorative UI card cluster */}
        <div className="relative w-full h-[782px]">

          {/* Phone mockup placeholder — centered */}
          <div
            className="absolute rounded-[24px] bg-space-grey flex items-center justify-center"
            style={{ left: 509, top: 0, width: 374, height: 782 }}
          >
            <span className="text-sm text-white/20">App mockup</span>
          </div>

          {/* Dokki Branch card — left */}
          <div
            className="absolute rounded-[24px] bg-space-grey p-4 flex flex-col gap-4"
            style={{ left: 117, top: 392, width: 360 }}
          >
            <p className="text-base font-medium text-fg-muted">DOKKI BRANCH</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-[9px] h-[9px] rounded-full bg-orderbase-red shrink-0" />
                <span className="text-xl font-bold text-white">Stop Sale Active</span>
              </div>
              {/* Toggle */}
              <div className="w-11 h-6 rounded-full bg-orderbase-red flex items-center justify-end px-1">
                <div className="w-4 h-4 rounded-full bg-white" />
              </div>
            </div>
            <p className="text-xl text-grey-200 text-balance">
              Inventory instantly paused for this specific branch.
            </p>
          </div>

          {/* Order card — right */}
          <div
            className="absolute rounded-[24px] bg-space-grey p-4 flex flex-col gap-4"
            style={{ left: 848, top: 583, width: 310 }}
          >
            <div className="flex items-start justify-end gap-3">
              <div className="flex flex-col items-end gap-3">
                <span className="text-xl font-bold text-white" dir="rtl">طلب #١٨٦٥١٣٦</span>
                <span
                  className="inline-flex items-center rounded-full px-3 py-0.5 text-base text-orderbase-red"
                  style={{ background: "rgba(231,43,41,0.15)", border: "1px solid var(--color-orderbase-red)" }}
                  dir="rtl"
                >
                  قيد التوصيل
                </span>
              </div>
              {/* Location icon button */}
              <div
                className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-orderbase-red"
                style={{ background: "rgba(231,43,41,0.15)", border: "1px solid var(--color-orderbase-red)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>

          {/* SAP ERP card — frosted glass */}
          <div
            className="absolute rounded-[24px] p-4 flex flex-col gap-4 backdrop-blur-sm"
            style={{ left: 281, top: 654, width: 360, background: "rgba(70,70,70,0.7)" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-[54px] h-[54px] shrink-0 rounded-full bg-[#1f1f1f] flex items-center justify-center text-white">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <ellipse cx="12" cy="5" rx="8" ry="3" stroke="currentColor" strokeWidth="2"/>
                  <path d="M4 5v6c0 1.657 3.582 3 8 3s8-1.343 8-3V5" stroke="currentColor" strokeWidth="2"/>
                  <path d="M4 11v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-white">SAP ERP</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white" aria-hidden>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-xl text-grey-200">Inventory synced.</span>
              </div>
            </div>
          </div>

          {/* Product card — frosted glass */}
          <div
            className="absolute rounded-[24px] p-4 flex flex-col gap-4 backdrop-blur-[20px]"
            style={{ left: 760, top: 914, width: 360, background: "rgba(70,70,70,0.7)" }}
          >
            <div className="flex items-center gap-4">
              {/* Product image placeholder */}
              <div className="w-14 h-14 shrink-0 rounded-[12px] bg-white/10 flex items-center justify-center">
                <span className="text-xs text-white/30">img</span>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-xl font-bold text-white">Chocolate Hazelnut</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl text-grey-200">EGP 220</span>
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-base"
                    style={{
                      background: "rgba(25,47,23,0.9)",
                      border: "1px solid #39e729",
                      color: "#39e729",
                    }}
                  >
                    In Stock
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
