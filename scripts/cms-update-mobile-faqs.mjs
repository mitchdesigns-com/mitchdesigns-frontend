#!/usr/bin/env node
// Mobile app page FAQs (Strapi `faq`, category "Product Design", which the
// mobile app page reads). What app buyers actually ask, in customer words
// (no sprints, no "product design"). Rewrites the existing entries in order,
// creates any extra ones, deletes nothing.
//
//   STRAPI_WRITE_TOKEN=... node scripts/cms-update-mobile-faqs.mjs [--dry]
const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://cms.mitchdesigns.com";
const TOKEN = process.env.STRAPI_WRITE_TOKEN;
const DRY = process.argv.includes("--dry");
if (!TOKEN) throw new Error("Set STRAPI_WRITE_TOKEN (a full-access Strapi API token).");
const headers = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };
const para = (...texts) => texts.map((text) => ({ type: "paragraph", children: [{ type: "text", text }] }));

const CATEGORY = "Product Design";
// No em dashes, no colons.
const FAQS = [
  {
    question: "How much does a mobile app cost?",
    answer: para("Most mobile apps we build cost between EGP 400,000 and EGP 2,000,000. Where yours falls depends on how complex it is, the features you need and your integrations. Tell us about your idea and we'll send a detailed proposal."),
  },
  {
    question: "How long does it take to build a mobile app?",
    answer: para("From 8 weeks, depending on how complex your app is. We share a schedule with clear milestones at the start, so you always know what comes next."),
  },
  {
    question: "Can you send a quote without a meeting?",
    answer: para("No. Every app is different, so we start with a discovery meeting to understand your customers, your goals and the features you need. That's how we give you an accurate price and timeline instead of a guess."),
  },
  {
    question: "Will my app look premium and international?",
    answer: para("Yes. We design clean, high end apps that stand next to the best in the world, tailored to your brand and tested with real users before launch."),
  },
  {
    question: "Who takes care of the app after launch?",
    answer: para("We do, completely. Updates for every new iOS and Android release, App Store and Google Play requirements, bug fixes, security and performance monitoring. Maintenance has its own agreement, signed separately from the build, so your app is always covered."),
  },
  {
    question: "Should I build a mobile app or a website?",
    answer: para("If you already have customers and want them to come back more often, build a mobile app, because apps are made for retention. If you have a new idea and need to win your first customers, start with a website, because websites are made for acquisition."),
  },
  {
    question: "Should I build my whole idea at once?",
    answer: para("No. It's better to build and launch in phases. We launch the core features first, learn from real users, then add the rest phase by phase, so you reach the market sooner and every phase is shaped by real data."),
  },
];

async function api(path, init = {}) {
  const res = await fetch(`${STRAPI}${path}`, { ...init, headers });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} → ${res.status} ${JSON.stringify(body?.error ?? body)}`);
  return body;
}

const existing = (await api(`/api/faqs?status=draft&filters[category][$eq]=${encodeURIComponent(CATEGORY)}&sort=order:asc&pagination[pageSize]=100`)).data;
// Keep the same order numbers the category already uses.
const base = Math.min(...existing.map((f) => f.order ?? 0), Infinity);
for (const [i, entry] of FAQS.entries()) {
  const f = existing[i];
  const data = { ...entry, order: (Number.isFinite(base) ? base : 1) + i };
  console.log(`${i + 1}${f ? "" : " (new)"}: ${entry.question}${f ? `  (was: ${f.question})` : ""}`);
  if (DRY) continue;
  if (f) await api(`/api/faqs/${f.documentId}?status=published`, { method: "PUT", body: JSON.stringify({ data }) });
  else await api(`/api/faqs?status=published`, { method: "POST", body: JSON.stringify({ data: { ...data, category: CATEGORY } }) });
}
for (const f of existing.slice(FAQS.length)) console.log(`left as is: ${f.question}`);
