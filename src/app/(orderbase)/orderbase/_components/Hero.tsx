import type { OrderbasePageData } from "@/lib/cms/types";
import { makeEd, type Edit } from "../_lib/edit";
import { Container, Btn, Img } from "./ui";
import { Reveal } from "../_lib/Reveal";
import { Counter } from "../_lib/Counter";
import { OrbIcon } from "../_lib/OrbIcon";

export function Hero({
  data,
  edit,
}: {
  data: NonNullable<OrderbasePageData["hero"]>;
  edit?: Edit;
}) {
  const Ed = makeEd(edit);
  return (
    <header
      id="top"
      className="relative overflow-hidden bg-ob-ink pt-[130px] text-white sm:pt-[150px]"
    >
      {/* red glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[120px] -top-[180px] size-[620px] rounded-full opacity-70 blur-[20px]"
        style={{
          background:
            "radial-gradient(circle, rgba(237,46,38,0.5), transparent 65%)",
        }}
      />
      <Container className="relative z-[2]">
        <div className="grid items-center gap-12 md:grid-cols-[1.05fr_.95fr]">
          <Reveal>
            {data.pill && (
              <span className="mb-[14px] inline-flex items-center gap-[9px] rounded-full border border-white/[0.18] bg-white/[0.08] px-[15px] py-[7px] text-[0.82rem] font-semibold">
                <span className="ob-blip size-2 rounded-full bg-ob-red-soft" />
                <Ed f="hero.pill">{data.pill}</Ed>
              </span>
            )}
            <h1 className="text-[clamp(2.5rem,5.6vw,4.35rem)] tracking-[-0.03em]">
              <Ed f="hero.titleLead">{data.titleLead}</Ed>
              {data.titleAccent && (
                <Ed as="span" className="text-ob-red" f="hero.titleAccent">
                  {data.titleAccent}
                </Ed>
              )}
              {data.titleTail && <Ed f="hero.titleTail">{data.titleTail}</Ed>}
            </h1>
            {data.subtitle && (
              <p className="my-[22px] mb-8 max-w-[46ch] text-[1.15rem] text-[#c9c9cf]">
                <Ed f="hero.subtitle">{data.subtitle}</Ed>
              </p>
            )}
            <div className="flex flex-wrap gap-[14px] max-sm:flex-col max-sm:items-stretch">
              {data.primaryCta && (
                <Btn variant="red" href={data.primaryCta.href}>
                  <Ed f="hero.primaryCta.label">{data.primaryCta.label}</Ed>
                </Btn>
              )}
              {data.secondaryCta && (
                <Btn variant="ghost" href={data.secondaryCta.href}>
                  <Ed f="hero.secondaryCta.label">{data.secondaryCta.label}</Ed>
                </Btn>
              )}
            </div>

            <div className="mt-[54px] flex flex-wrap gap-[26px] border-t border-white/[0.12] pb-[56px] pt-[30px] sm:gap-[42px]">
              {data.stats.map((s, i) => (
                <div key={s.label}>
                  <div className="font-ob-display text-[2.3rem] font-extrabold text-white">
                    <Counter
                      value={s.value}
                      suffix={s.suffix}
                      className={s.accent ? "text-ob-red-soft" : undefined}
                    />
                  </div>
                  <div className="max-w-[18ch] text-[0.86rem] text-[#a9a9b2]">
                    <Ed f={`hero.stats.${i}.label`}>{s.label}</Ed>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay="d1" className="relative">
            {data.image && (
              <div className="overflow-hidden rounded-[26px] border-[6px] border-white/[0.06] shadow-ob [transform:rotate(1.4deg)]">
                <Img
                  src={data.image}
                  alt={data.imageAlt ?? ""}
                  className="h-[340px] w-full object-cover md:h-[430px]"
                />
              </div>
            )}
            {data.floatCards[0] && <FloatCard card={data.floatCards[0]} slot="top" />}
            {data.floatCards[1] && <FloatCard card={data.floatCards[1]} slot="bottom" />}
          </Reveal>
        </div>
      </Container>
    </header>
  );
}

function FloatCard({
  card,
  slot,
}: {
  card: { icon: string; title: string; subtitle?: string };
  slot: "top" | "bottom";
}) {
  const pos =
    slot === "top"
      ? "ob-floaty -top-[22px] left-0 md:-left-[26px]"
      : "ob-floaty-2 bottom-[30px] right-0 md:-right-[24px]";
  return (
    <div
      className={`absolute flex items-center gap-[11px] rounded-[16px] bg-white px-4 py-[13px] font-ob-display text-[0.9rem] font-bold text-ob-ink shadow-ob ${pos}`}
    >
      <span className="grid size-[42px] flex-none place-items-center rounded-[11px] bg-ob-red text-white">
        <OrbIcon name={card.icon} className="size-[26px]" />
      </span>
      <span className="block">
        {card.title}
        {card.subtitle && (
          <small className="block font-ob-body text-[0.74rem] font-medium text-ob-muted">
            {card.subtitle}
          </small>
        )}
      </span>
    </div>
  );
}
