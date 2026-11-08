#!/usr/bin/env node
// Software service page copy (Strapi `service-page` slug=custom): booking
// platforms and ERPs. Sends whole components back so images and CTAs stay.
// Headlines in sentence case. No em dashes, no colons, "brands" not "clients".
//
//   STRAPI_WRITE_TOKEN=... node scripts/cms-update-software-page.mjs [--dry]
const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://cms.mitchdesigns.com";
const TOKEN = process.env.STRAPI_WRITE_TOKEN;
const DRY = process.argv.includes("--dry");
if (!TOKEN) throw new Error("Set STRAPI_WRITE_TOKEN (a full-access Strapi API token).");
const headers = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

const para = (...texts) => texts.map((text) => ({ type: "paragraph", children: [{ type: "text", text }] }));
const id = (m) => m?.id ?? null;

// ── Page copy ───────────────────────────────────────────────────────────────

const HERO = {
  title: "Booking platforms and ERPs built around your business",
  titleHighlights: "built around your business",
  description: para(
    "We build custom software on a well structured backend, a solid database and robust APIs. Booking engines, payments and every integration you need, behind an interface so easy that every customer and every team member gets it right away. And when you're ready, the same platform powers your mobile app.",
  ),
};

const WE_GOT_YOU = {
  title: "Complex operations, made simple",
  titleHighlights: "simple",
  label: "We Got You",
  description: para(
    "Behind every booking and every order sits a lot of logic. We engineer it properly, then hide it behind an interface your customers and your team find effortless.",
  ),
};

// "Why work with MitchDesigns?" as a carousel of eight.
const WHY_US = {
  title: "Why work with MitchDesigns?",
  titleHighlights: "MitchDesigns",
  description: para("Software that works as well for your customers as it does for your operations."),
  cards: [
    ["Product design", "We start from your users and your operations, so every screen and feature earns its place.", "target"],
    ["Seamless user experience", "Interfaces that adapt to every role, from customers booking online to staff running the day.", "ab"],
    ["Scalable development", "A well structured backend, a solid database and robust APIs, ready to grow with your business.", "server"],
    ["Ongoing support", "We keep improving your platform from real usage data, with updates, monitoring and new features.", "headset"],
    ["For tech leaders", "Clean architecture and documented APIs your own developers can build on.", "code"],
    ["For marketing directors", "Platforms that convert, with the tracking and data your campaigns need.", "funnel"],
    ["For startup founders", "We turn your idea into a working product and launch it in phases, so you reach the market sooner.", "trend"],
    ["For product managers", "Clear scope, milestones and releases, so you always know what ships next.", "compass"],
  ],
};

// Big stacked cards, as on eCommerce.
const DESIGNS_ADAPT = {
  title: "Designs that adapt",
  titleHighlights: "adapt",
  description: para("One platform, shaped for every screen and every person who uses it."),
  cards: [
    ["Web apps", "Booking engines, portals and internal tools that run fast in any browser.", "monitor"],
    ["Dashboards", "Real time data and controls, laid out for the people who run your operations.", "board"],
    ["Mobile apps", "The same platform in your customers' pocket, on iOS and Android.", "phone"],
    ["Websites", "A responsive front door that feeds your platform with bookings and leads.", "globe"],
  ],
};

const PROCESS = {
  title: "How it works",
  titleHighlights: "works",
  description: para("From the first call to years of support, one team handles every step."),
  steps: [
    ["Free consultation", "We meet to understand your business, your operations and your goals."],
    ["Research and strategy", "We map your users, roles, flows and data, and plan the architecture."],
    ["Wireframes and UX", "We lay out every journey, from a customer booking to a manager approving."],
    ["Interface design", "A clean, easy interface tailored to your brand and to every role."],
    ["Development", "A well structured backend, database and APIs, with every integration connected."],
    ["Testing and optimization", "Performance, security and every flow checked on real devices and real data."],
    ["Fine tuning and launch", "Final adjustments, data migration and training, then your platform goes live."],
    ["Ongoing technical support", "Monitoring, updates, fixes and new features, under a support agreement of its own."],
  ],
};

// Heading for the logo wall of the software we built.
const MORE_ABOUT = {
  title: "Brands that run on our software",
  titleHighlights: "run",
  description: para("A few of the platforms we designed and built."),
};

// ── Run ─────────────────────────────────────────────────────────────────────

async function api(path, init = {}) {
  const res = await fetch(`${STRAPI}${path}`, { ...init, headers });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} → ${res.status} ${JSON.stringify(body?.error ?? body)}`);
  return body;
}

const q = [
  "populate[hero][populate]=*",
  "populate[weGotYou][populate]=*",
  "populate[whyUs][populate][cards][populate]=*",
  "populate[designsAdapt][populate][cards][populate]=*",
  "populate[process][populate][processCards][populate]=*",
  "populate[moreAbout][populate][cards][populate]=*",
].join("&");
const page = (await api(`/api/service-pages?status=draft&filters[slug][$eq]=custom&${q}`)).data[0];
const { hero: h, weGotYou: w, whyUs: y, designsAdapt: d, process: p, moreAbout: m } = page;
// An image already on the page, for components whose schema requires one the design doesn't show.
const filler = id(m?.cards?.[0]?.image) ?? id(p?.processCards?.[0]?.image) ?? id(w?.image);

const hero = {
  id: h.id, subTitle: h.subTitle, reverseLayout: h.reverseLayout, image: id(h.image),
  cta: h.cta && { id: h.cta.id, label: h.cta.label, href: h.cta.href },
  ...HERO,
};
const weGotYou = {
  id: w.id, titleTag: w.titleTag, theme: w.theme, imagePosition: w.imagePosition, image: id(w.image),
  cta: w.cta && { id: w.cta.id, label: w.cta.label, href: w.cta.href },
  ...WE_GOT_YOU,
};
const whyUs = {
  ...(y ? { id: y.id } : {}), variant: "slider",
  title: WHY_US.title, titleHighlights: WHY_US.titleHighlights, description: WHY_US.description,
  cards: WHY_US.cards.map(([title, text, icon], i) => ({ title, description: para(text), icon, image: id(y?.cards?.[i]?.image) ?? filler })),
};
const designsAdapt = {
  id: d.id, title: DESIGNS_ADAPT.title, titleHighlights: DESIGNS_ADAPT.titleHighlights, description: DESIGNS_ADAPT.description,
  cards: DESIGNS_ADAPT.cards.map(([title, text, icon], i) => ({ title, description: para(text), icon, image: id(d.cards?.[i]?.image) ?? filler })),
};
const processSection = {
  id: p.id, title: PROCESS.title, titleHighlights: PROCESS.titleHighlights, description: PROCESS.description,
  eyebrow: p.eyebrow, closingTitle: p.closingTitle, closingText: p.closingText,
  processCards: PROCESS.steps.map(([title, text], i) => ({ stepNumber: i + 1, title, description: para(text), summary: text, image: filler })),
};
// The design doesn't show these cards, but the schema needs at least one.
const moreAbout = {
  id: m.id, ...MORE_ABOUT,
  cards: [{ title: "Software", description: para("Platforms we designed and built."), image: filler }],
};

console.log("custom:", {
  hero: hero.title, whyUs: whyUs.cards.length, designsAdapt: designsAdapt.cards.length,
  steps: processSection.processCards.length, moreAbout: moreAbout.title,
});
if (DRY) process.exit(0);
await api(`/api/service-pages/${page.documentId}?status=published`, {
  method: "PUT",
  body: JSON.stringify({ data: { hero, weGotYou, whyUs, designsAdapt, process: processSection, moreAbout } }),
});
console.log("published");
