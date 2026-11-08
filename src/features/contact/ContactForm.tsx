"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { ChevronDown } from "@/components/icons/ChevronDown";
import { Tick } from "@/components/icons/Tick";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { EASE_LUXE } from "@/components/motion";
import { leadsApiOrigin, SERVICES } from "@/config/nav";
import { chipBase } from "@/lib/chip";
import { cn } from "@/lib/cn";
import type { ContactPageData } from "@/lib/cms/types";
import { noOrphan } from "@/lib/noOrphan";

export type ContactDetails = { name: string; email: string };

type Status = "idle" | "sending" | "sent" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  copy: ContactPageData;
  details: ContactDetails;
  onDetailsChange: (details: ContactDetails) => void;
};

function Field({
  label,
  htmlFor,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className={`text-sm font-medium ${error ? "text-orderbase-red" : "text-fg"}`}>
        {label}
      </label>
      {children}
    </div>
  );
}

/**
 * The general inquiry form. Its header toggles the body open and closed.
 * Posts to md-leads `/api/contact`, which saves the message in Strapi and
 * tells the team on Slack. Name and email are lifted to the page so the
 * booking calendar below can reuse them.
 */
export function ContactForm({ copy, details, onDetailsChange }: Props) {
  const id = useId();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(true);
  const [topic, setTopic] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [tried, setTried] = useState(false);

  const topics = [
    ...SERVICES.map((s) => ({ value: s.slug as string, label: s.shortLabel })),
    { value: "consultation", label: copy.consultationLabel },
    { value: "general", label: copy.generalLabel },
  ];

  const missing = {
    topic: !topic,
    name: !details.name.trim(),
    email: !EMAIL_RE.test(details.email.trim()),
    phone: phone.replace(/\D/g, "").length < 7,
    message: !message.trim(),
  };
  const invalid = Object.values(missing).some(Boolean);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    if (invalid || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch(`${leadsApiOrigin(window.location.hostname)}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: details.name,
          email: details.email,
          phone,
          company,
          topic,
          message,
          pageUrl: window.location.href,
          website: honeypot,
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-card bg-bg-alt p-6 md:p-12">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-body`}
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-start justify-between gap-6 text-left"
      >
        <span className="flex flex-col gap-3">
          <span className="text-hero-4 font-bold text-fg">{noOrphan(copy.formHeading)}</span>
          {!open && <span className="text-base font-medium text-fg-muted">{copy.formToggleLabel}</span>}
        </span>
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-fg text-bg transition-transform duration-300 ease-out-soft group-hover:scale-105">
          <ChevronDown size={22} className={cn("transition-transform duration-300 ease-out-soft", open && "rotate-180")} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-body`}
            key="body"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_LUXE }}
            className="overflow-hidden"
          >
            {status === "sent" ? (
              <div className="mt-10 flex flex-col items-start gap-4" role="status">
                <span className="flex size-14 items-center justify-center rounded-full bg-yellow text-black">
                  <Tick size={26} />
                </span>
                <p className="text-hero-5 font-bold text-fg text-balance">{copy.successTitle}</p>
                <p className="text-lg text-fg-muted text-balance">{copy.successBody}</p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="mt-8 flex flex-col gap-8">
                {copy.formIntro && (
                  <p className="max-w-2xl text-lg text-fg-muted text-balance">{noOrphan(copy.formIntro)}</p>
                )}

                <fieldset className="flex flex-col gap-4">
                  <legend
                    className={`mb-4 text-sm font-medium ${tried && missing.topic ? "text-orderbase-red" : "text-fg"}`}
                  >
                    {copy.topicLabel}
                  </legend>
                  <div role="radiogroup" className="flex flex-wrap gap-2">
                    {topics.map((t) => {
                      const active = topic === t.value;
                      return (
                        <button
                          key={t.value}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setTopic(t.value)}
                          className={cn(
                            chipBase,
                            active
                              ? "border-fg bg-fg text-bg"
                              : "border-border bg-bg text-fg hover:border-fg",
                          )}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="grid gap-6 md:grid-cols-2">
                  <Field label={copy.nameLabel} htmlFor={`${id}-name`} error={tried && missing.name}>
                    <Input
                      id={`${id}-name`}
                      autoComplete="name"
                      value={details.name}
                      invalid={tried && missing.name}
                      onChange={(e) => onDetailsChange({ ...details, name: e.target.value })}
                    />
                  </Field>
                  <Field label={copy.emailFieldLabel} htmlFor={`${id}-email`} error={tried && missing.email}>
                    <Input
                      id={`${id}-email`}
                      type="email"
                      autoComplete="email"
                      value={details.email}
                      invalid={tried && missing.email}
                      onChange={(e) => onDetailsChange({ ...details, email: e.target.value })}
                    />
                  </Field>
                  <Field label={copy.phoneFieldLabel} htmlFor={`${id}-phone`} error={tried && missing.phone}>
                    <Input
                      id={`${id}-phone`}
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      invalid={tried && missing.phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </Field>
                  <Field label={copy.companyLabel} htmlFor={`${id}-company`}>
                    <Input
                      id={`${id}-company`}
                      autoComplete="organization"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </Field>
                  <Field
                    label={copy.messageLabel}
                    htmlFor={`${id}-message`}
                    error={tried && missing.message}
                    className="md:col-span-2"
                  >
                    <Textarea
                      id={`${id}-message`}
                      rows={6}
                      value={message}
                      invalid={tried && missing.message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </Field>
                  {/* Honeypot: hidden from people, filled by bots. */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                  />
                </div>

                <div className="flex flex-col items-start gap-4">
                  <Button type="submit" variant="secondary" size="lg" disabled={status === "sending"}>
                    {copy.submitLabel}
                  </Button>
                  {status === "error" && (
                    <p role="alert" className="text-sm text-orderbase-red text-balance">
                      {copy.errorText}
                    </p>
                  )}
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
