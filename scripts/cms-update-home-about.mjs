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
// Short story lines, one beat each (each is its own paragraph). Told as "we",
// with one "I" (the founding). **word** = bold in the rich text.
export const BODY = [
  "In 2005, I founded MitchDesigns, and we built our first corporate website in Egypt.",
  "Brands kept asking for more, so we built online stores, mobile apps, dashboards and ERPs, then the campaigns that brought them customers.",
  "Twenty years and 500 projects later, we learned that pretty was never the goal.",
  "Our mission is to transform successful brands digitally.",
  "We give them systems that automate their work for the AI era, and experiences their customers love to use.",
  "We work as partners, not vendors. We share their targets, sit at the same table and stay long after launch.",
  "And we keep everything transparent. Clear scope, clear pricing, honest numbers and no surprises.",
  "We connect design, data and marketing into one platform, so they **grow**, **scale** and **earn**.",
  "And we never stop innovating, so every brand we work with gets a service that stays hassle free, today and for years to come.",
];
// Phrases the scroll sweep marks by hand.
const MARKS = [{ phrase: "pretty was never the goal", shape: "strike" }];
/** "a **b** c" → text children with bold runs. */
const runs = (line) => line.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((t) => (t.startsWith("**") ? { type: "text", text: t.slice(2, -2), bold: true } : { type: "text", text: t }));
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
  body: BODY.map((line) => ({ type: "paragraph", children: runs(line) })),
  stats: (a.stats ?? []).map((s) => ({ id: s.id, unit: s.unit, label: s.label, value: STATS[s.unit] ?? s.value })),
  marks: MARKS,
};
console.log("home about:", { stats: about.stats.map((s) => `${s.value} ${s.unit}`), marks: MARKS.map((m) => m.phrase) });
if (DRY) process.exit(0);
await api(`/api/home-page?status=published`, { method: "PUT", body: JSON.stringify({ data: { about } }) });
