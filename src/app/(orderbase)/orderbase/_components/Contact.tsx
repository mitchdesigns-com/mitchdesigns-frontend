"use client";

import { useState } from "react";
import type { OrderbasePageData } from "@/lib/cms/types";
import { Section, Eyebrow, SectionTitle, Btn } from "./ui";
import { Reveal } from "../_lib/Reveal";
import { OrbIcon } from "../_lib/OrbIcon";

export function Contact({
  data,
}: {
  data: NonNullable<OrderbasePageData["contact"]>;
}) {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    phone: "",
    plan: data.planOptions[0] ?? "",
    message: "",
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const number = (data.whatsappNumber ?? "").replace(/[^0-9]/g, "");
    const lines = [
      "Hi Orderbase! I'd like a demo.",
      "",
      `Name: ${form.name}`,
      `Brand: ${form.brand}`,
      `Phone: ${form.phone}`,
      `Plan: ${form.plan}`,
      `Message: ${form.message}`,
    ];
    const url = `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener");
  };

  const field =
    "w-full rounded-xl border-[1.5px] border-ob-line bg-white px-4 py-[0.85em] text-[0.95rem] text-ob-ink outline-none transition focus:border-ob-red focus:shadow-[0_0_0_4px_rgba(237,46,38,0.12)]";

  return (
    <Section id="contact" tone="dark">
      <div className="grid items-center gap-[54px] md:grid-cols-2">
        <Reveal>
          {data.eyebrow && <Eyebrow>{data.eyebrow}</Eyebrow>}
          {data.title && (
            <SectionTitle className="mt-[14px] text-white">{data.title}</SectionTitle>
          )}
          {data.lead && (
            <p className="mt-4 max-w-[60ch] text-[clamp(1.02rem,1.6vw,1.18rem)] text-[#c2c2c9]">
              {data.lead}
            </p>
          )}

          <div className="mt-[30px] flex flex-col gap-[13px]">
            {data.methods.map((m) => (
              <a
                key={m.label}
                href={m.href}
                target={m.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener"
                className="flex items-center gap-[15px] rounded-[15px] border border-white/10 bg-white/[0.05] p-[16px_18px] transition-all duration-300 hover:translate-x-[6px] hover:border-ob-red/[0.45] hover:bg-ob-red/[0.12]"
              >
                <span className="grid size-[50px] flex-none place-items-center rounded-[13px] bg-ob-red">
                  <OrbIcon name={m.icon} className="size-[30px]" />
                </span>
                <span className="block">
                  <small className="block text-[0.76rem] text-[#9a9aa2]">{m.label}</small>
                  <b className="font-ob-display text-[1rem]">{m.value}</b>
                </span>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay="d2">
          <form
            onSubmit={onSubmit}
            className="rounded-[24px] bg-white p-[34px] text-ob-ink shadow-ob"
          >
            {data.formTitle && <h3 className="mb-[6px] text-[1.35rem]">{data.formTitle}</h3>}
            {data.formNote && (
              <p className="mb-[22px] text-[0.9rem] text-ob-muted">{data.formNote}</p>
            )}

            <Label text="Your name">
              <input
                required
                className={field}
                placeholder="e.g. Ahmed Hassan"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Label>
            <Label text="Brand / company">
              <input
                required
                className={field}
                placeholder="Your food brand"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              />
            </Label>
            <Label text="Phone">
              <input
                required
                type="tel"
                className={field}
                placeholder="+20 ..."
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Label>
            <Label text="Plan you're interested in">
              <select
                className={field}
                value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
              >
                {data.planOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Label>
            <Label text="Message">
              <textarea
                rows={3}
                className={field}
                placeholder="Tell us about your branches & goals"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </Label>

            <Btn variant="red" type="submit" className="mt-[6px] w-full">
              {data.submitLabel ?? "Send via WhatsApp"}
            </Btn>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="mb-[15px] block">
      <span className="mb-[6px] block text-[0.82rem] font-semibold">{text}</span>
      {children}
    </label>
  );
}
