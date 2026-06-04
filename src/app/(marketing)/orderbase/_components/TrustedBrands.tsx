/* eslint-disable @next/next/no-img-element */
export interface Brand {
  name: string;
  logo?: string;
}

export interface TrustedBrandsProps {
  heading?: string;
  brands?: Brand[];
}

export function TrustedBrands({
  heading = "Trusted by F&B brands across Egypt",
  brands = [],
}: TrustedBrandsProps) {
  return (
    <section className="bg-bg py-10">
      <div className="mx-auto max-w-[var(--container-max)] px-[3.75rem] flex flex-col gap-[3.375rem]">
        <p className="text-xl font-medium text-fg text-center text-balance">
          {heading}
        </p>

        {/* 5-up logo row — each slot ~290px, gap-4 */}
        <div className="flex items-center justify-between gap-4">
          {brands.length > 0
            ? brands.map((brand) => (
                <div
                  key={brand.name}
                  className="flex flex-1 items-center justify-center h-[78px]"
                >
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-h-12 w-auto object-contain mix-blend-exclusion"
                    />
                  ) : (
                    <span className="text-sm text-fg-muted">{brand.name}</span>
                  )}
                </div>
              ))
            : Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-1 items-center justify-center h-[78px] rounded-card-sm bg-panel"
                >
                  <span className="text-sm text-fg-muted">Brand {i + 1}</span>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
