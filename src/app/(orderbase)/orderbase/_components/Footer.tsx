import type { OrderbasePageData } from "@/lib/cms/types";
import { makeEd, type Edit } from "../_lib/edit";
import { Container } from "./ui";
import { OrderbaseWordmark } from "../_lib/OrderbaseWordmark";

export function Footer({
  data,
  edit,
}: {
  data: NonNullable<OrderbasePageData["footer"]>;
  edit?: Edit;
}) {
  const Ed = makeEd(edit);
  const year = new Date().getFullYear();
  return (
    <footer className="bg-black pb-[34px] pt-[60px] text-white">
      <Container>
        <div className="grid grid-cols-1 gap-10 border-b border-white/[0.12] pb-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#top" aria-label="Orderbase" className="text-white">
              <OrderbaseWordmark className="ob-logo inline-flex h-[48px] items-center" />
            </a>
            {data.tagline && (
              <p className="mt-4 max-w-[34ch] text-[0.9rem] text-[#9a9aa2]">
                <Ed f="footer.tagline">{data.tagline}</Ed>
              </p>
            )}
          </div>

          {data.columns.map((col, i) => (
            <div key={col.title}>
              <h5 className="mb-4 font-ob-display text-[0.85rem] font-bold uppercase tracking-[0.1em] text-white">
                <Ed f={`footer.columns.${i}.title`}>{col.title}</Ed>
              </h5>
              <ul className="flex list-none flex-col gap-[10px]">
                {col.links.map((l, j) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener"
                      className="text-[0.9rem] text-[#b6b6bd] transition-colors hover:text-ob-red-soft"
                    >
                      <Ed f={`footer.columns.${i}.links.${j}.label`}>
                        {l.label}
                      </Ed>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-[10px] pt-[26px] text-[0.82rem] text-[#7a7a82]">
          {data.bottomLeft && (
            <span>
              © {year} <Ed f="footer.bottomLeft">{data.bottomLeft}</Ed>
            </span>
          )}
          {data.bottomRight && (
            <span>
              <Ed f="footer.bottomRight">{data.bottomRight}</Ed>
            </span>
          )}
        </div>
      </Container>
    </footer>
  );
}
