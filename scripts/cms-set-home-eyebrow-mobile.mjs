#!/usr/bin/env node
// Phone-only tagline for the home hero (home-page.hero.eyebrowMobile).
// Desktop keeps hero.eyebrow. Only this field changes.
//
//   STRAPI_WRITE_TOKEN=... node scripts/cms-set-home-eyebrow-mobile.mjs [--dry]
const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://cms.mitchdesigns.com";
const TOKEN = process.env.STRAPI_WRITE_TOKEN;
const DRY = process.argv.includes("--dry");
if (!TOKEN) throw new Error("Set STRAPI_WRITE_TOKEN (a full-access Strapi API token).");
const headers = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", "User-Agent": "curl/8.7.1" };
const EYEBROW_MOBILE = "Website design and mobile app development company based in Egypt";

async function api(path, init = {}) {
  const res = await fetch(`${STRAPI}${path}`, { ...init, headers });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} → ${res.status} ${JSON.stringify(body?.error ?? body)}`);
  return body;
}
/** Strapi read shape → write shape: media become ids, timestamps go. */
function clean(v) {
  if (Array.isArray(v)) return v.map(clean);
  if (v && typeof v === "object") {
    if ("mime" in v && "url" in v) return v.id;
    const out = {};
    for (const [k, x] of Object.entries(v)) {
      if (["documentId", "createdAt", "updatedAt", "publishedAt", "locale"].includes(k)) continue;
      out[k] = clean(x);
    }
    return out;
  }
  return v;
}

const page = (await api("/api/home-page?status=draft&populate[hero][populate]=*")).data;
const hero = { ...clean(page.hero), eyebrowMobile: EYEBROW_MOBILE };
console.log("eyebrow (desktop):", page.hero.eyebrow, "| eyebrowMobile:", page.hero.eyebrowMobile, "→", EYEBROW_MOBILE);
if (!DRY) {
  await api("/api/home-page?status=published", { method: "PUT", body: JSON.stringify({ data: { hero } }) });
  const after = (await api("/api/home-page?populate[hero]=true")).data.hero;
  if (after.eyebrowMobile !== EYEBROW_MOBILE) throw new Error("eyebrowMobile not stored yet (schema not deployed?)");
  console.log("published");
}
