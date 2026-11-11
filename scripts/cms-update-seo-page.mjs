#!/usr/bin/env node
// SEO & AEO service page (Strapi `service-page` slug=seo) and its FAQs
// (category "SEO / AGO"). Covers Google search and AI answers together.
// Hero figures are industry statistics with their source, not our own.
// Headlines in sentence case. No em dashes, no colons, "brands" not "clients".
//
//   STRAPI_WRITE_TOKEN=... node scripts/cms-update-seo-page.mjs [--dry]
const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://cms.mitchdesigns.com";
const TOKEN = process.env.STRAPI_WRITE_TOKEN;
const DRY = process.argv.includes("--dry");
if (!TOKEN) throw new Error("Set STRAPI_WRITE_TOKEN (a full-access Strapi API token).");
const headers = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", "User-Agent": "curl/8.7.1" };

const text = (t) => [{ type: "text", text: t }];
const para = (...texts) => texts.map((t) => ({ type: "paragraph", children: text(t) }));
const bullets = (...items) => ({ type: "list", format: "unordered", children: items.map((t) => ({ type: "list-item", children: text(t) })) });

// ── Page copy ───────────────────────────────────────────────────────────────

/** Required image on cards whose image the page doesn't show (search-visual.webp). */
const PLACEHOLDER_IMAGE = 807;

const PAGE = {
  hero: {
    title: "Get found on Google and in AI answers",
    titleHighlights: "AI answers",
    subTitle: "SEO and AEO agency in Egypt for Google and AI search",
    description: para(
      "Your customers search on Google and ask ChatGPT, Gemini and Perplexity. We optimize your website to rank on Google and to be the brand AI assistants recommend, then turn that visibility into leads and sales.",
    ),
  },
  // Industry figures, each with its source in the description.
  numbers: {
    numbers: [
      { value: "5 Trillion", title: "Searches on Google every year", description: para("Source, Google 2025") },
      { value: "900 Million", title: "People use ChatGPT every week", description: para("Source, OpenAI 2026") },
      { value: "27.6%", title: "Of all clicks go to the first Google result", description: para("Source, Backlinko study of 4 million searches") },
    ],
  },
  weGotYou: {
    title: "Invested in SEO but saw no real results?",
    titleHighlights: "Invested in SEO",
    description: para(
      "Ranking on Google is only half the picture now. We build one search strategy for Google and for AI assistants, based on how your audience searches, what they ask and what makes them take action.",
    ),
  },
  // The Google and AI rows, each shown on a phone (card 1 Google, card 2 AI).
  designsAdapt: {
    title: "Be found wherever your customers search",
    titleHighlights: "wherever your customers search",
    description: para("One strategy for the two places your customers look before they buy."),
    cards: [
      {
        title: "SEO for Google search",
        icon: "search",
        image: PLACEHOLDER_IMAGE,
        description: [
          ...para("We get your pages to the top of Google for the searches that bring customers, not just traffic."),
          bullets("Technical SEO and site speed", "Keyword and content strategy", "Local SEO and Google Business Profile"),
        ],
      },
      {
        title: "AEO for AI answers",
        icon: "sparkle",
        image: PLACEHOLDER_IMAGE,
        description: [
          ...para(
            "AEO means answer engine optimization. We make your brand the answer ChatGPT, Gemini, Perplexity and Google AI Overviews give when customers ask about what you sell.",
          ),
          bullets("Content AI engines can quote", "Structured data for AI crawlers", "Brand mentions on trusted sites"),
        ],
      },
    ],
  },
  // "What do you do exactly?" as the corporate work-steps scroll.
  process: {
    title: "What we do to get you found",
    titleHighlights: "get you found",
    description: para("Every step we take to rank you on Google and get you recommended by AI."),
    steps: [
      ["Search and AI audit", "We audit your site's technical health, your rankings and how AI assistants describe your brand today."],
      ["Keyword and question research", "We find the searches and the questions your customers ask Google and AI, ranked by buying intent."],
      ["Technical SEO", "We fix speed, indexing, structured data and site structure so Google and AI crawlers read every page."],
      ["Content that answers", "We write pages that answer your customers' questions clearly, in a format AI engines can quote."],
      ["Authority and mentions", "We earn links, reviews and mentions on trusted sites, the signals Google and AI rely on."],
      ["Tracking and reports", "Monthly reports on rankings, organic traffic, leads and how often AI cites your brand."],
    ],
  },
  whyUs: {
    title: "Why choose MitchDesigns?",
    description: para("Search is about intent and conversion, on Google and in AI answers."),
    cards: [
      ["Proven search results", "We've helped brands rank across competitive industries and grow organic traffic that turns into sales."],
      ["Intent driven keywords", "We target high intent keywords and questions that bring visitors ready to take action."],
      ["Ready for AI search", "We optimize for Google and for AI assistants together, so your brand shows up in both."],
      ["Continuous support", "We keep updating your strategy as Google and AI engines change, to keep you ahead of competitors."],
    ],
  },
  seo: {
    metaTitle: "SEO and AEO agency in Egypt | MitchDesigns",
    metaDescription:
      "Rank on Google and get recommended by ChatGPT, Gemini and Perplexity. MitchDesigns builds one search strategy for Google and AI answers.",
  },
};

const FAQ_CATEGORY = "SEO / AGO";
// `match` finds an existing question to rewrite; without a match it's created.
const FAQS = [
  {
    match: /what is aeo/i,
    order: 3,
    question: "What is AEO?",
    answer: para(
      "AEO, or answer engine optimization, gets your brand into the answers AI assistants give, like ChatGPT, Gemini, Perplexity and Google AI Overviews. It works alongside SEO and builds on many of the same signals.",
    ),
  },
  {
    match: /seo and aeo together/i,
    order: 4,
    question: "Do I need SEO and AEO together?",
    answer: para(
      "Yes. Your customers use both Google and AI assistants before they buy. AI engines often draw on pages that already rank well, so one strategy for both gets you found in more places.",
    ),
  },
  {
    match: /measure.*ai/i,
    order: 5,
    question: "How do you measure visibility in AI answers?",
    answer: para(
      "We track how often AI assistants mention and cite your brand for the questions your customers ask, and report it every month with your rankings, organic traffic and leads.",
    ),
  },
  {
    match: /how long.*results/i,
    order: 6,
    question: "How long does SEO take to show results?",
    answer: para(
      "Most brands see clear movement within 3 to 6 months, depending on competition and where the site starts. We share progress every month so you see what is improving.",
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
  "populate[process][populate][processCards][populate]=*",
  "populate[designsAdapt][populate][cards][populate]=*",
  "populate[seo][populate]=*",
].join("&");
const page = (await api(`/api/service-pages?status=draft&filters[slug][$eq]=seo&${q}`)).data[0];

const hero = { ...clean(page.hero), ...PAGE.hero };
const numbers = { ...clean(page.numbers), numbers: PAGE.numbers.numbers };
const weGotYou = { ...clean(page.weGotYou), ...PAGE.weGotYou };
const designsAdapt = PAGE.designsAdapt;
const processSection = {
  title: PAGE.process.title,
  titleHighlights: PAGE.process.titleHighlights,
  description: PAGE.process.description,
  processCards: PAGE.process.steps.map(([title, summary], i) => ({
    stepNumber: i + 1,
    title,
    summary,
    description: para(summary),
    image: PLACEHOLDER_IMAGE,
  })),
};
const whyUsNow = clean(page.whyUs);
const whyUs = {
  ...whyUsNow,
  title: PAGE.whyUs.title,
  description: PAGE.whyUs.description,
  cards: whyUsNow.cards.map((c, i) => {
    const [title, text] = PAGE.whyUs.cards[i] ?? [c.title];
    return { ...c, title, ...(text ? { description: para(text) } : {}) };
  }),
};
const seo = { ...clean(page.seo), ...PAGE.seo };

console.log("seo:", { hero: hero.title, numbers: numbers.numbers.map((n) => n.value), steps: processSection.processCards.length, whyUs: whyUs.cards.map((c) => c.title) });
if (!DRY) {
  await api(`/api/service-pages/${page.documentId}?status=published`, {
    method: "PUT",
    body: JSON.stringify({ data: { hero, numbers, weGotYou, designsAdapt, process: processSection, whyUs, seo } }),
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
