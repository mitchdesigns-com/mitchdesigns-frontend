"use client";

import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
import { MailIcon } from "@/components/icons/MailIcon";
import { MapPinIcon } from "@/components/icons/MapPinIcon";
import { PhoneIcon } from "@/components/icons/PhoneIcon";
import { Section } from "@/components/layout/Section";
import { RevealItem, RevealStagger } from "@/components/motion";

type Row = { label: string; value: string; href: string; icon: React.ReactNode; external?: boolean };

type Props = {
  phone?: string;
  email?: string;
  address?: string;
  mapUrl?: string;
  labels: { phone: string; email: string; address: string; map: string };
};

/** "+20 101 443 0669" from however the number is stored ("201014430669",
 *  "+201014430669"). Numbers in another shape are shown as entered. */
export function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  const eg = digits.match(/^20(\d{3})(\d{3})(\d{4})$/);
  if (eg) return `+20 ${eg[1]} ${eg[2]} ${eg[3]}`;
  return raw.trim().startsWith("+") || !/^\d+$/.test(raw.trim()) ? raw.trim() : `+${raw.trim()}`;
}

/** Google Maps search link for an address (used when Strapi has no map URL). */
export function mapsSearchUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/** Keyless Google Maps embed centred on the address (shown, not interactive). */
function mapsEmbedUrl(address: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`;
}

/**
 * Phone, email and office address, with a map card that opens the office in
 * Google Maps. Rows without a value in Site Settings are left out.
 */
export function ContactInfo({ phone, email, address, mapUrl, labels }: Props) {
  const mapHref = mapUrl || (address ? mapsSearchUrl(address) : undefined);
  const rows: Row[] = [
    phone && {
      label: labels.phone,
      value: formatPhone(phone),
      href: `tel:+${phone.replace(/\D/g, "")}`,
      icon: <PhoneIcon size={24} />,
    },
    email && { label: labels.email, value: email, href: `mailto:${email}`, icon: <MailIcon size={24} /> },
    address &&
      mapHref && {
        label: labels.address,
        value: address,
        href: mapHref,
        icon: <MapPinIcon size={24} />,
        external: true,
      },
  ].filter(Boolean) as Row[];

  return (
    <Section className="py-20 md:py-28">
      <RevealStagger className="grid gap-10 lg:grid-cols-5 lg:items-stretch lg:gap-16">
        <ul className="flex min-w-0 flex-col lg:col-span-3">
          {rows.map((row) => (
            <RevealItem as="li" key={row.label} className="border-b border-border first:border-t">
              <a
                href={row.href}
                {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-center gap-5 py-7 md:gap-8 md:py-9"
              >
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-yellow text-black transition-transform duration-300 ease-out-soft group-hover:-rotate-6 group-hover:scale-105 md:size-16">
                  {row.icon}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-base text-fg-muted">{row.label}</span>
                  <span className="text-lg font-bold text-fg wrap-anywhere sm:text-xl md:text-hero-5">{row.value}</span>
                </span>
                <ArrowUpRight
                  size={28}
                  className="shrink-0 text-fg transition-transform duration-300 ease-out-soft group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </a>
            </RevealItem>
          ))}
        </ul>

        {mapHref && (
          <RevealItem className="relative min-h-80 overflow-clip rounded-card bg-black lg:col-span-2">
            {address && (
              <iframe
                src={mapsEmbedUrl(address)}
                title={labels.map}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                tabIndex={-1}
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -top-1/3 h-5/3 w-full border-0 opacity-80 grayscale invert"
              />
            )}
            <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent" aria-hidden />
            <a
              href={mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex h-full min-h-80 flex-col justify-between p-7 text-white md:p-9"
            >
              {/* Sits on the office: the embed centres the address, and the
                  crop above keeps that centre in the middle of the card. */}
              <span className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-full items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-yellow/30 motion-reduce:animate-none" aria-hidden />
                <span className="relative flex size-16 items-center justify-center rounded-full bg-yellow text-black shadow-lg transition-transform duration-300 ease-out-soft group-hover:scale-110">
                  <MapPinIcon size={30} />
                </span>
              </span>
              <span aria-hidden />
              <span className="relative flex flex-col gap-4">
                {address && <span className="text-lg text-white text-balance">{address}</span>}
                <span className="flex items-center justify-between gap-4 border-t border-space-grey pt-4">
                  <span className="text-base font-bold text-yellow">{labels.map}</span>
                  <ArrowUpRight
                    size={24}
                    className="text-yellow transition-transform duration-300 ease-out-soft group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </span>
              </span>
            </a>
          </RevealItem>
        )}
      </RevealStagger>
    </Section>
  );
}
