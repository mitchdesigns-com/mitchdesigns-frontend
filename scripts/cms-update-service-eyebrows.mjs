#!/usr/bin/env node
// Sets the hero eyebrow (`hero.subTitle`) on each Strapi service page: the
// company name first, then the page's main search keyword.
// Sends the whole hero back so its image, CTA and copy stay untouched.
//
//   STRAPI_WRITE_TOKEN=... node scripts/cms-update-service-eyebrows.mjs [--dry] [slug]
const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://cms.mitchdesigns.com";
const TOKEN = process.env.STRAPI_WRITE_TOKEN;
const DRY = process.argv.includes("--dry");
const ONLY = process.argv.slice(2).find((a) => !a.startsWith("--"));
if (!TOKEN) throw new Error("Set STRAPI_WRITE_TOKEN (a full-access Strapi API token).");

const EYEBROWS = {
  corporate: "MitchDesigns - Corporate Website Design Company in Egypt",
  ecommerce: "MitchDesigns - eCommerce Website & App Development in Egypt",
  "mobile-app": "MitchDesigns - Mobile App Development Company in Egypt",
  custom: "MitchDesigns - Custom Software Development Company in Egypt",
  "media-buying": "MitchDesigns - Media Buying & Performance Marketing Agency in Egypt",
  "google-ads": "MitchDesigns - Google Ads Management Agency in Egypt",
  seo: "MitchDesigns - SEO Agency in Egypt for Google & AI Search",
};

const headers = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };
const res = await fetch(`${STRAPI}/api/service-pages?status=draft&populate[hero][populate]=*&pagination[pageSize]=50`, { headers });
const { data } = await res.json();

for (const page of data) {
  const subTitle = EYEBROWS[page.slug];
  if (!subTitle || (ONLY && page.slug !== ONLY)) continue;
  const { id, title, titleHighlights, description, image, cta, reverseLayout } = page.hero;
  const hero = {
    id, title, titleHighlights, subTitle, description, reverseLayout,
    image: image?.id ?? null,
    cta: cta ? { id: cta.id, label: cta.label, href: cta.href } : null,
  };
  console.log(`${DRY ? "[dry] " : ""}${page.slug}: ${subTitle}`);
  if (DRY) continue;
  const put = await fetch(`${STRAPI}/api/service-pages/${page.documentId}?status=published`, {
    method: "PUT", headers, body: JSON.stringify({ data: { hero } }),
  });
  if (!put.ok) throw new Error(`${page.slug} → ${put.status} ${await put.text()}`);
}
