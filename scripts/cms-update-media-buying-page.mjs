#!/usr/bin/env node
// Media buying service page (Strapi `service-page` slug=media-buying) and its
// FAQs (category "Media Buying"). Facts, not ad slogans. Headlines in
// sentence case. No em dashes, no colons, "brands" not "clients".
// Only the fields below change; everything else is sent back as it is.
//
//   STRAPI_WRITE_TOKEN=... node scripts/cms-update-media-buying-page.mjs [--dry]
const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://cms.mitchdesigns.com";
const TOKEN = process.env.STRAPI_WRITE_TOKEN;
const DRY = process.argv.includes("--dry");
if (!TOKEN) throw new Error("Set STRAPI_WRITE_TOKEN (a full-access Strapi API token).");
const headers = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", "User-Agent": "curl/8.7.1" };

const text = (t) => [{ type: "text", text: t }];
const para = (...texts) => texts.map((t) => ({ type: "paragraph", children: text(t) }));
const bullets = (...items) => ({ type: "list", format: "unordered", children: items.map((t) => ({ type: "list-item", children: text(t) })) });

// ── Page copy ───────────────────────────────────────────────────────────────

const PAGE = {
  hero: {
    title: "Scale fast with optimized funnels",
    titleHighlights: "funnels",
    description: [
      ...para(
        "Every campaign we run starts with analysis of your data, your audience and your creative. We manage ads for premium brands, with a long term strategy for growth and short term plans for this month's targets.",
      ),
      bullets(
        "A full funnel plan, from the first view to the repeat purchase",
        "Content and video made for each product and each audience",
        "Clear monthly reports on spend, revenue and ROAS",
      ),
    ],
  },
  // Value = "<number> <unit>"; the unit shows small beside the number.
  numbers: {
    numbers: [
      { value: "40+", title: "Brands we manage ads for", description: null },
      // ~40 brands × EGP 1 to 5 million a month (about 3 on average) × 5 years.
      { value: "7 Billion", title: "EGP in revenue for our brands", description: null },
      { value: "5", title: "Countries, including Egypt, Saudi Arabia and the UAE", description: null },
    ],
  },
  weGotYou: {
    title: "Ads that sell start with the right funnel",
    titleHighlights: "right funnel",
    description: para(
      "We plan the full funnel for your brand, from the first time a customer sees your ad to the day they buy again. We use AI and deep data analysis to read what works, analyze every creative, then make the right content for the right product and show it to the right audience. Every budget decision is backed by data.",
    ),
  },
  whyUs: {
    title: "Why choose MitchDesigns?",
    cardTitles: ["Well proven track record", "Tailored funnel strategy", "Comprehensive analytics", "Dedicated support"],
  },
};

const FAQ_CATEGORY = "Media Buying";
// `match` finds an existing question to rewrite; without a match it's created.
const FAQS = [
  {
    match: /cost/i,
    order: 9,
    question: "How do you charge for media buying?",
    answer: para(
      "We charge a flat monthly retainer based on tiers of your ad spend. We don't take a percentage of your sales or your growth. Each tier has one fixed fee, and we recommend which tier to start with based on your goals and budget.",
    ),
  },
  {
    match: /free audit/i,
    order: 11,
    question: "Can you give me a free audit of my ad account?",
    answer: para(
      "Yes. We can audit your ad account for free and show you what's working, what's wasting budget and where we would start.",
    ),
  },
  {
    match: /create content/i,
    order: 12,
    question: "Do you create content for our ads?",
    answer: para(
      "Yes. We create the content for your ads, mostly video, made for each product and each audience we target.",
    ),
  },
];

// ── Run ─────────────────────────────────────────────────────────────────────

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

const q = [
  "populate[hero][populate]=*",
  "populate[numbers][populate]=*",
  "populate[weGotYou][populate][image]=true",
  "populate[weGotYou][populate][cta]=true",
  "populate[weGotYou][populate][story]=true",
  "populate[weGotYou][populate][tabs][populate]=*",
  "populate[whyUs][populate][cards][populate]=*",
].join("&");
const page = (await api(`/api/service-pages?status=draft&filters[slug][$eq]=media-buying&${q}`)).data[0];

const hero = { ...clean(page.hero), ...PAGE.hero };
const numbers = { ...clean(page.numbers), numbers: PAGE.numbers.numbers };
const weGotYou = { ...clean(page.weGotYou), ...PAGE.weGotYou };
const whyUsNow = clean(page.whyUs);
const whyUs = {
  ...whyUsNow,
  title: PAGE.whyUs.title,
  cards: whyUsNow.cards.map((c, i) => ({ ...c, title: PAGE.whyUs.cardTitles[i] ?? c.title })),
};

console.log("media-buying:", { hero: hero.title, numbers: numbers.numbers.map((n) => n.value), weGotYou: weGotYou.title, whyUs: whyUs.cards.map((c) => c.title) });
if (!DRY) {
  await api(`/api/service-pages/${page.documentId}?status=published`, {
    method: "PUT",
    body: JSON.stringify({ data: { hero, numbers, weGotYou, whyUs } }),
  });
  console.log("page published");
}

const existing = (await api(`/api/faqs?status=draft&filters[category][$eq]=${encodeURIComponent(FAQ_CATEGORY)}&pagination[pageSize]=100`)).data;
for (const { match, ...entry } of FAQS) {
  const f = existing.find((x) => match.test(x.question));
  console.log(`${f ? "update" : "create"}: ${entry.question}${f ? `  (was: ${f.question})` : ""}`);
  if (DRY) continue;
  if (f) await api(`/api/faqs/${f.documentId}?status=published`, { method: "PUT", body: JSON.stringify({ data: entry }) });
  else await api(`/api/faqs?status=published`, { method: "POST", body: JSON.stringify({ data: { ...entry, category: FAQ_CATEGORY } }) });
}
