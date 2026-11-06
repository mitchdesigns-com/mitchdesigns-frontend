#!/usr/bin/env node
// Homepage "About" letter from Mitch (Strapi `home-page` → about): the mission
// story, its hand-drawn marks and the stats. Sends the whole component back.
//
//   STRAPI_WRITE_TOKEN=... node scripts/cms-update-home-about.mjs [--dry]
const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://cms.mitchdesigns.com";
const TOKEN = process.env.STRAPI_WRITE_TOKEN;
const DRY = process.argv.includes("--dry");
if (!TOKEN) throw new Error("Set STRAPI_WRITE_TOKEN (a full-access Strapi API token).");
const headers = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

// No em dashes, no colons.
export const BODY = [
  "It started in 2005 with one corporate website. Twenty years later, we build the whole digital business, from eCommerce and mobile apps to custom systems, dashboards and ERPs, all connected and powered by performance marketing for premium brands.",
  "Pretty was never the goal. Our mission is to transform brands that already win offline, with systems that automate their work for the AI era and experiences their customers love, so they grow, scale and earn more.",
];
// Phrases the scroll sweep marks by hand.
const MARKS = [
  { phrase: "Pretty was never the goal", shape: "strike" },
  { phrase: "grow, scale and earn more", shape: "wave" },
];
// Stat value overrides, by unit.
const STATS = { Projects: "500+" };

async function api(path, init = {}) {
  const res = await fetch(`${STRAPI}${path}`, { ...init, headers });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} → ${res.status} ${JSON.stringify(body?.error ?? body)}`);
  return body;
}

const home = (await api(`/api/home-page?status=draft&populate[about][populate]=*`)).data;
const a = home.about;
const about = {
  id: a.id,
  signature: a.signature,
  ctaLabel: a.ctaLabel,
  ctaHref: a.ctaHref,
  body: BODY.map((text) => ({ type: "paragraph", children: [{ type: "text", text }] })),
  stats: (a.stats ?? []).map((s) => ({ id: s.id, unit: s.unit, label: s.label, value: STATS[s.unit] ?? s.value })),
  marks: MARKS,
};
console.log("home about:", { stats: about.stats.map((s) => `${s.value} ${s.unit}`), marks: MARKS.map((m) => m.phrase) });
if (DRY) process.exit(0);
await api(`/api/home-page?status=published`, { method: "PUT", body: JSON.stringify({ data: { about } }) });
