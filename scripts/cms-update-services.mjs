#!/usr/bin/env node
// One-off content update for the homepage "Our Services" list (Strapi `our-service`).
// Sets order, title and tagline per slug, and uploads the Orderbase logo as the
// eCommerce row's `hoverLogo`. Needs the backend's `hoverLogo` field deployed first.
//
//   STRAPI_WRITE_TOKEN=... node scripts/cms-update-services.mjs [--dry]
import { readFile } from "node:fs/promises";

const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://cms.mitchdesigns.com";
const TOKEN = process.env.STRAPI_WRITE_TOKEN;
const DRY = process.argv.includes("--dry");
if (!TOKEN) throw new Error("Set STRAPI_WRITE_TOKEN (a full-access Strapi API token).");

const SERVICES = [
  { slug: "corporate", order: 1, title: "Launch a Corporate Website", tagline: "A fast, credible website that turns visitors into enquiries." },
  { slug: "ecommerce", order: 2, title: "Build an eCommerce Platform", tagline: "Custom stores on Orderbase, our own commerce engine, built to sell from day one.", logo: "public/images/orderbase/logo.webp" },
  { slug: "mobile-app", order: 3, title: "Build a Mobile App", tagline: "iOS and Android apps your customers keep opening." },
  { slug: "custom", order: 4, title: "Build the Software", tagline: "ERPs, booking, car rental, limousine, travel and payment platforms." },
  { slug: "media-buying", order: 5, title: "Scale with Media Buying", tagline: "Meta and TikTok campaigns, full-funnel strategy and performance creative." },
  { slug: "google-ads", order: 6 },
  { slug: "seo", order: 7 },
];

const headers = { Authorization: `Bearer ${TOKEN}` };

async function api(path, init = {}) {
  const res = await fetch(`${STRAPI}${path}`, { ...init, headers: { ...headers, ...init.headers } });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} → ${res.status} ${JSON.stringify(body?.error ?? body)}`);
  return body;
}

async function uploadLogo(file) {
  const form = new FormData();
  form.append("files", new Blob([await readFile(file)], { type: "image/webp" }), "orderbase-logo.webp");
  form.append("fileInfo", JSON.stringify({ alternativeText: "Orderbase" }));
  const [uploaded] = await api("/api/upload", { method: "POST", body: form });
  return uploaded.id;
}

for (const { slug, logo, ...fields } of SERVICES) {
  const { data } = await api(`/api/our-services?filters[slug][$eq]=${slug}&status=draft`);
  const doc = data?.[0];
  if (!doc) {
    console.warn(`skip ${slug}: not found`);
    continue;
  }
  const update = { ...fields };
  if (logo && !DRY) update.hoverLogo = await uploadLogo(logo);
  console.log(`${DRY ? "[dry] " : ""}${slug} (${doc.documentId}):`, update);
  if (DRY) continue;
  await api(`/api/our-services/${doc.documentId}?status=published`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: update }),
  });
}
