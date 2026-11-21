#!/usr/bin/env node
// Copy fixes from the mobile review: About metrics match the home page
// (500+ projects, sentence-case labels) and the testimonials heading says
// "brands", not "clients". Only these fields change.
//
//   STRAPI_WRITE_TOKEN=... node scripts/cms-update-mobile-fixes.mjs [--dry]
const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://cms.mitchdesigns.com";
const TOKEN = process.env.STRAPI_WRITE_TOKEN;
const DRY = process.argv.includes("--dry");
if (!TOKEN) throw new Error("Set STRAPI_WRITE_TOKEN (a full-access Strapi API token).");
const headers = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", "User-Agent": "curl/8.7.1" };

async function api(path, init = {}) {
  const res = await fetch(`${STRAPI}${path}`, { ...init, headers });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} → ${res.status} ${JSON.stringify(body?.error ?? body)}`);
  return body;
}

const METRICS = [
  { value: "20+", label: "Years of experience" },
  { value: "500+", label: "Projects delivered" },
  { value: "30+", label: "Dedicated experts" },
];
const TESTIMONIALS_HEADING = "Loved by brands";

const about = (await api("/api/about-page?populate[metrics]=true")).data;
console.log("about metrics:", about.metrics.map((m) => `${m.value} ${m.label}`), "→", METRICS.map((m) => `${m.value} ${m.label}`));
const site = (await api("/api/site-setting")).data;
console.log("testimonialsHeading:", site.testimonialsHeading, "→", TESTIMONIALS_HEADING);
if (!DRY) {
  await api("/api/about-page?status=published", { method: "PUT", body: JSON.stringify({ data: { metrics: METRICS } }) });
  await api("/api/site-setting?status=published", { method: "PUT", body: JSON.stringify({ data: { testimonialsHeading: TESTIMONIALS_HEADING } }) });
  console.log("published");
}
