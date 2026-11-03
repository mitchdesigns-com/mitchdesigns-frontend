#!/usr/bin/env node
// One-off content update for the homepage "Our Services" list (Strapi `our-service`).
// Sets order, title and tagline per slug. The eCommerce row's `hoverLogo`
// (Orderbase) is uploaded by hand in the Strapi admin.
//
//   STRAPI_WRITE_TOKEN=... node scripts/cms-update-services.mjs [--dry]
const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://cms.mitchdesigns.com";
const TOKEN = process.env.STRAPI_WRITE_TOKEN;
const DRY = process.argv.includes("--dry");
if (!TOKEN) throw new Error("Set STRAPI_WRITE_TOKEN (a full-access Strapi API token).");

const SERVICES = [
  { slug: "corporate", order: 1, title: "Launch a Corporate Website", tagline: "A fast, credible website that turns visitors into enquiries." },
  { slug: "ecommerce", order: 2, title: "Build an eCommerce Platform", tagline: "Web store and mobile app. You own the engine, data, transactions, payments and customers." },
  { slug: "mobile-app", order: 3, title: "Build a Mobile App", tagline: "A mobile app built for your customers." },
  { slug: "custom", order: 4, title: "Build the Software", tagline: "ERPs, booking, car rental, limousine, travel and payment platforms." },
  { slug: "media-buying", order: 5, title: "Scale with Media Buying", tagline: "Meta, TikTok and Google Ads, built as full funnels with performance creative." },
  // google-ads is merged into media-buying (MERGED_SERVICES) and hidden from lists.
  { slug: "seo", order: 6 },
];

const headers = { Authorization: `Bearer ${TOKEN}` };

async function api(path, init = {}) {
  const res = await fetch(`${STRAPI}${path}`, { ...init, headers: { ...headers, ...init.headers } });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} → ${res.status} ${JSON.stringify(body?.error ?? body)}`);
  return body;
}

for (const { slug, ...fields } of SERVICES) {
  const { data } = await api(`/api/our-services?filters[slug][$eq]=${slug}&status=draft`);
  const doc = data?.[0];
  if (!doc) {
    console.warn(`skip ${slug}: not found`);
    continue;
  }
  const update = { ...fields };
  console.log(`${DRY ? "[dry] " : ""}${slug} (${doc.documentId}):`, update);
  if (DRY) continue;
  await api(`/api/our-services/${doc.documentId}?status=published`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: update }),
  });
}
