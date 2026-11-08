#!/usr/bin/env node
// Section headlines in sentence case on the corporate and eCommerce service
// pages (Strapi `service-page`). Only titles, highlights and closing titles
// change; every other field is sent back as it is in Strapi.
//
//   STRAPI_WRITE_TOKEN=... node scripts/cms-sentence-case-headlines.mjs [--dry]
const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://cms.mitchdesigns.com";
const TOKEN = process.env.STRAPI_WRITE_TOKEN;
const DRY = process.argv.includes("--dry");
if (!TOKEN) throw new Error("Set STRAPI_WRITE_TOKEN (a full-access Strapi API token).");
const headers = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

// component → new fields (highlights match words of the new title, case sensitive).
const PAGES = {
  corporate: {
    hero: { title: "Corporate websites built to convert, scale and inspire trust", titleHighlights: "built to convert" },
    weGotYou: { title: "Tired of unreliable website design agencies?" },
    whyUs: { title: "Why choose MitchDesigns?" },
    process: { title: "From idea to launch", titleHighlights: "launch" },
  },
  ecommerce: {
    hero: { title: "eCommerce agency for B2B & B2C brands" },
    weGotYou: { title: "Tired of eCommerce platforms that hold you back?", titleHighlights: "hold you back?" },
    whyUs: { title: "Why choose MitchDesigns?" },
    process: { title: "Your brand deserves an app", closingTitle: "Scale with every order" },
    support: { title: "Why brands stay with us", titleHighlights: "stay with us" },
    featuresSimplified: { title: "Every feature you need, simplified" },
    moreAbout: { title: "Brands that sell with us" },
  },
};

const Q = [
  "populate[hero][populate]=*",
  "populate[weGotYou][populate][image]=true",
  "populate[weGotYou][populate][cta]=true",
  "populate[weGotYou][populate][story]=true",
  "populate[weGotYou][populate][tabs][populate]=*",
  "populate[whyUs][populate][cards][populate]=*",
  "populate[process][populate][processCards][populate]=*",
  "populate[process][populate][appScreens]=true",
  "populate[support][populate][cards][populate]=*",
  "populate[featuresSimplified][populate]=*",
  "populate[moreAbout][populate][cards][populate]=*",
].join("&");

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

for (const [slug, comps] of Object.entries(PAGES)) {
  const page = (await api(`/api/service-pages?status=draft&filters[slug][$eq]=${slug}&${Q}`)).data[0];
  const data = {};
  for (const [name, fields] of Object.entries(comps)) {
    if (!page[name]) continue;
    data[name] = { ...clean(page[name]), ...fields };
    console.log(`${slug}.${name}: "${page[name].title}" → "${fields.title}"`);
  }
  if (!DRY) await api(`/api/service-pages/${page.documentId}?status=published`, { method: "PUT", body: JSON.stringify({ data }) });
}
