#!/usr/bin/env node
// Site-wide primary button: "Schedule Consultation Meeting", pointing at the
// lead funnel's start page (consultation preselected there).
// Sets Site Settings → primaryCta, and the hero / We Got You buttons on every
// service page, the CTA banner and the About "How We Work" button (whole components are sent
// back so images, tabs and logos stay intact).
//
//   STRAPI_WRITE_TOKEN=... node scripts/cms-update-cta-labels.mjs [--dry]
const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://cms.mitchdesigns.com";
const TOKEN = process.env.STRAPI_WRITE_TOKEN;
const DRY = process.argv.includes("--dry");
if (!TOKEN) throw new Error("Set STRAPI_WRITE_TOKEN (a full-access Strapi API token).");
const headers = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

const LABEL = "Schedule Consultation Meeting";
const HREF = "https://leads.mitchdesigns.com/";
const OLD = /^get (detailed )?proposal$/i;

async function api(path, init = {}) {
  const res = await fetch(`${STRAPI}${path}`, { ...init, headers });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} → ${res.status} ${JSON.stringify(body?.error ?? body)}`);
  return body;
}
const put = (path, data) => (DRY ? console.log("[dry] PUT", path, Object.keys(data).join(",")) : api(path, { method: "PUT", body: JSON.stringify({ data }) }));
const id = (m) => m?.id ?? null;
const link = (cta) => cta && { id: cta.id, label: OLD.test(cta.label?.trim() ?? "") ? LABEL : cta.label, href: cta.href };

// Site Settings
console.log("site-setting: primaryCta");
await put(`/api/site-setting?status=published`, { primaryCtaLabel: LABEL, primaryCtaHref: HREF });

// Service pages: hero + We Got You buttons
const q = [
  "populate[hero][populate]=*",
  "populate[weGotYou][populate][image]=true",
  "populate[weGotYou][populate][cta]=true",
  "populate[weGotYou][populate][story]=true",
  "populate[weGotYou][populate][tabs][populate][logo]=true",
].join("&");
const pages = (await api(`/api/service-pages?status=draft&pagination[pageSize]=50&${q}`)).data;
for (const page of pages) {
  const data = {};
  const h = page.hero;
  if (h?.cta && OLD.test(h.cta.label.trim())) {
    data.hero = {
      id: h.id, title: h.title, titleHighlights: h.titleHighlights, subTitle: h.subTitle, description: h.description,
      reverseLayout: h.reverseLayout, image: id(h.image), cta: link(h.cta),
    };
  }
  const w = page.weGotYou;
  if (w?.cta && OLD.test(w.cta.label.trim())) {
    data.weGotYou = {
      id: w.id, title: w.title, titleHighlights: w.titleHighlights, titleTag: w.titleTag, label: w.label, description: w.description,
      theme: w.theme, imagePosition: w.imagePosition, image: id(w.image), cta: link(w.cta), story: (w.story ?? []).map((m) => m.id),
      tabs: (w.tabs ?? []).map((t) => ({ id: t.id, label: t.label, title: t.title, titleHighlights: t.titleHighlights, description: t.description, logo: id(t.logo) })),
    };
  }
  if (!Object.keys(data).length) continue;
  console.log(`service-page ${page.slug}: ${Object.keys(data).join(", ")}`);
  await put(`/api/service-pages/${page.documentId}?status=published`, data);
}

// CTA banner ("Ready For Your Next Project?"): button + a line that matches it
const BANNER_TEXT = "Book a free 30-minute call with our team. Talk through your project and get clear direction on scope, timeline and budget.";
const banner = (await api(`/api/cta-banner?status=draft`)).data;
if (banner && OLD.test(banner.ctaLabel?.trim() ?? "")) {
  console.log("cta-banner: label, href, description");
  await put(`/api/cta-banner?status=published`, {
    ctaLabel: LABEL,
    ctaHref: HREF,
    description: [{ type: "paragraph", children: [{ type: "text", text: BANNER_TEXT }] }],
  });
}

// About "How We Work" button
const about = (await api(`/api/about-page?status=draft&populate[approach][populate]=*`)).data;
const ap = about?.approach;
if (ap?.cta && OLD.test(ap.cta.label?.trim() ?? "")) {
  const { id: apId, image, cta, ...rest } = ap;
  const approach = { id: apId, ...Object.fromEntries(Object.entries(rest).filter(([, v]) => typeof v !== "object" || v === null || Array.isArray(v))), cta: link(cta) };
  if (image !== undefined) approach.image = id(image);
  console.log("about-page: approach.cta");
  await put(`/api/about-page?status=published`, { approach });
}
