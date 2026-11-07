#!/usr/bin/env node
// Corporate service page copy (Strapi `service-page` slug=corporate) and its
// FAQs (Strapi `faq`, category "Corporate Website").
// Sends whole components back so images, CTAs and other fields stay intact.
//
//   STRAPI_WRITE_TOKEN=... node scripts/cms-update-corporate-page.mjs [--dry]
const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://cms.mitchdesigns.com";
const TOKEN = process.env.STRAPI_WRITE_TOKEN;
const DRY = process.argv.includes("--dry");
if (!TOKEN) throw new Error("Set STRAPI_WRITE_TOKEN (a full-access Strapi API token).");
const headers = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

const para = (...texts) => texts.map((text) => ({ type: "paragraph", children: [{ type: "text", text }] }));
const id = (m) => m?.id ?? null;

// ── Page copy ───────────────────────────────────────────────────────────────

const HERO_DESCRIPTION = para(
  "A trusted brand deserves a premium website. We design and build corporate websites that earn your customers' confidence and turn visitors into enquiries.",
);

// "We Got You": why we're different.
const WE_GOT_YOU_DESCRIPTION = para(
  "We put your users first. Every site starts with real UX work and ends in a stunning design made for your brand, never a template.",
  "And we keep it hassle-free. We maintain, manage, update and scale your website for you, with a support team on hand whenever you need us, all on a high-end tech stack.",
);

// Why Us cards, by current title → new title + text. Titles not listed are removed.
const WHY_US = [
  ["Global Standards", "Global Standards", "World-class quality that holds its own next to international brands."],
  ["Custom Solutions", "Tailored to You", "Design and features built around your business and your users, never a template."],
  ["Dedicated Support Team", "Dedicated Support Team", "A local team you can reach directly, keeping your website running smoothly."],
  ["Culturally Aligned Design", "Culturally Aligned Design", "Designs that feel right for your audience in Egypt and the MENA region, in Arabic and English."],
  ["Performance Optimization", "Performance Optimization", "Fast on desktop and mobile, tuned for speed from the first line of code."],
  ["SEO-Driven Approach", "SEO-Driven Approach", "Built SEO-ready from day one, so customers find you on Google and in AI answers."],
  ["Security and Reliability", "Security and Reliability", "SSL, firewalls, regular backups and updates keep your website safe and online."],
  // "Cost-Effective Solutions" is dropped.
];

// Process ("Your Website's Journey"): one line per stage (`summary` is what shows).
const PROCESS_TITLE = "From Idea to Launch";
const PROCESS_HIGHLIGHT = "Launch";
const STEPS = [
  ["Discovery", "Competitor analysis, personas, marketing analysis, sitemap and information architecture, the plan the whole site is built on."],
  ["User Experience (UX)", "Wireframes for every page, shaped around your users' goals and your business goals."],
  ["UI Design", "Everything visual, from layout and typography to colour, photography and composition, designed to look stunning on every screen."],
  ["Copywriting", "Clear, persuasive copy written for your audience and your brand's voice."],
  ["Coding", "We build it on a modern, fast stack, with a CMS your team can use without a developer."],
  ["Testing & Data Entry", "Every page, image and detail entered for you, then every page, form and journey checked across browsers and devices."],
  ["Deployment", "Hosting, domain and security set up, and the site moved to its live servers."],
  ["Quality Assurance", "A final pass on the live site, checking speed, content, SEO basics and accessibility."],
  ["Website Launch 🚀", "Your website goes live, and we stay on for support, maintenance and updates."],
];

// ── FAQs (category "Corporate Website") ─────────────────────────────────────

const CORPORATE = "Corporate Website";
// By current question (trimmed) → new question, answer, order. `null` answer keeps the CMS answer.
const FAQ_EDITS = {
  "How long does it take to design and develop a corporate website?": [
    "How long does it take to build a corporate website?",
    para("Usually 3 to 6 months from kickoff to launch. It depends on the complexity of the design, the size of the sitemap and the number of features. We share a schedule with clear milestones at the start, so you always know what comes next."),
    2,
  ],
  "Do you use ready-made website design templates?": [
    "Do you use ready-made templates?",
    para("No. Every website we build is designed from scratch for your brand and your users. Templates make brands look alike; a trusted brand needs a website that looks and works like no one else's."),
    3,
  ],
  "Who owns the source code after the website launch?": [
    "Who owns the website and source code after launch?",
    para("You do. After launch you own the source code, the content and the data, and we hand over every access credential and the documentation you need."),
    4,
  ],
  "How do I keep my website running smoothly?": [
    "Can you manage and update the website for us?",
    para("Yes. We can take care of your website after launch, from content and page updates to new sections and features, performance checks and scaling as your business grows, so your team doesn't have to."),
    5,
  ],
  "Do you offer website maintenance and tech support services?": [
    "Do you offer maintenance and technical support?",
    para("Yes. Our maintenance and support plans cover technical support, regular updates, security monitoring, bug fixes, performance tuning and content updates, so your website stays fast, secure and up to date."),
    6,
  ],
  "What happens if a website crashes? Will the data be gone?": [
    "What happens if the website goes down? Will we lose data?",
    para("No. Our maintenance plans include regular backups, so if anything goes wrong we restore the website and its data quickly, with minimal disruption."),
    7,
  ],
  "What website security measures do you implement?": [
    "How do you keep the website secure?",
    para("SSL certificates encrypt every connection, firewalls block unauthorized access, and regular backups and updates keep your website and your customers' data protected."),
    8,
  ],
  "Do you provide website content creation services?": [
    "Do you write the content and enter the data?",
    para("Yes. Our copywriters write clear, persuasive content in your brand's voice, and we enter every page, image and detail into the website for you."),
    9,
  ],
  "Do you integrate the website with company CRM systems?": [
    "Can you connect the website to our CRM?",
    para("Yes. We connect your website to your CRM so every lead lands in the right place, sales follow-ups can be automated and you can track each customer from first visit to deal."),
    10,
  ],
  "Why is a sitemap important for my website?": [
    "Why does my website need a sitemap?",
    para("A sitemap helps search engines find, understand and index all your important pages, which helps your website show up in search results."),
    11,
  ],
};
// Questions that belong to another service: moved to that service's category.
const FAQ_MOVES = {
  "What makes the SEO services at MitchDesigns unique?": "SEO / AGO",
  "Is having a blog important for websites?": "SEO / AGO",
  "How long does it take to start seeing results from media buying?": "Media Buying",
  "What makes MitchDesigns landing pages more effective in driving conversions?": "Media Buying",
};
const FAQ_NEW = [
  {
    question: "How much does a corporate website cost?",
    answer: para("Most corporate websites we build cost between EGP 240,000 and EGP 1,000,000. Where yours falls depends on the number of pages, the features you need and how much content we create for you. Tell us about your project and we'll send a detailed proposal."),
    category: CORPORATE,
    order: 1,
  },
];

// ── Run ─────────────────────────────────────────────────────────────────────

async function api(path, init = {}) {
  const res = await fetch(`${STRAPI}${path}`, { ...init, headers });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} → ${res.status} ${JSON.stringify(body?.error ?? body)}`);
  return body;
}
const put = (path, data) => (DRY ? console.log("[dry] PUT", path) : api(path, { method: "PUT", body: JSON.stringify({ data }) }));

// Page
const q = "&populate[hero][populate]=*&populate[weGotYou][populate]=*&populate[whyUs][populate][cards][populate]=*&populate[process][populate][processCards][populate]=*&populate[process][populate][appScreens]=true";
const page = (await api(`/api/service-pages?status=draft&filters[slug][$eq]=corporate${q}`)).data[0];
const { hero: h, weGotYou: w, whyUs: y, process: p } = page;

const hero = { id: h.id, title: h.title, titleHighlights: h.titleHighlights, subTitle: h.subTitle, description: HERO_DESCRIPTION, reverseLayout: h.reverseLayout, image: id(h.image), cta: h.cta && { id: h.cta.id, label: h.cta.label, href: h.cta.href } };
const weGotYou = { id: w.id, title: w.title, titleHighlights: w.titleHighlights, titleTag: w.titleTag, label: w.label, theme: w.theme, imagePosition: w.imagePosition, description: WE_GOT_YOU_DESCRIPTION, image: id(w.image), cta: w.cta && { id: w.cta.id, label: w.cta.label, href: w.cta.href }, story: (w.story ?? []).map((s) => s.id) };
const whyUs = {
  id: y.id, title: y.title, titleHighlights: y.titleHighlights, description: y.description, variant: y.variant,
  cards: WHY_US.map(([from, title, text]) => {
    // Match the original title or the new one, so the script can run again.
    const c = y.cards.find((x) => [from, title].includes(x.title.trim()));
    if (!c) throw new Error(`Why Us card not found: ${from}`);
    return { id: c.id, title, description: para(text), image: id(c.image), icon: c.icon };
  }),
};
const images = p.processCards.map((c) => id(c.image)).filter(Boolean);
const processSection = {
  id: p.id, title: PROCESS_TITLE, titleHighlights: Array.isArray(p.titleHighlights) ? [PROCESS_HIGHLIGHT] : PROCESS_HIGHLIGHT, description: p.description, eyebrow: p.eyebrow, closingTitle: p.closingTitle, closingText: p.closingText,
  appScreens: (p.appScreens ?? []).map((s) => s.id),
  // The page shows only title + summary; the schema requires an image, so the existing ones are reused.
  processCards: STEPS.map(([title, summary], i) => ({ stepNumber: i + 1, title, summary, description: para(summary), image: images[i % images.length], stepIcon: null })),
};
console.log("corporate page:", { hero: "description", weGotYou: "description", whyUs: whyUs.cards.map((c) => c.title), process: processSection.processCards.map((c) => c.title) });
// --process writes only the process section.
if (process.argv.includes("--process")) {
  await put(`/api/service-pages/${page.documentId}?status=published`, { process: processSection });
  process.exit(0);
}
await put(`/api/service-pages/${page.documentId}?status=published`, { hero, weGotYou, whyUs, process: processSection });

// FAQs
const faqs = (await api(`/api/faqs?status=draft&pagination[pageSize]=200`)).data;
// Match by the original question or the new one, so the script can run again.
const byNewQuestion = Object.fromEntries(Object.entries(FAQ_EDITS).map(([from, edit]) => [edit[0], from]));
for (const f of faqs) {
  const key = byNewQuestion[f.question.trim()] ?? f.question.trim();
  if (FAQ_EDITS[key] && f.category === CORPORATE) {
    const [question, answer, order] = FAQ_EDITS[key];
    console.log(`faq ${order}: ${question}`);
    await put(`/api/faqs/${f.documentId}?status=published`, { question, answer: answer ?? f.answer, order });
  } else if (FAQ_MOVES[key] && f.category === CORPORATE) {
    console.log(`faq moved to ${FAQ_MOVES[key]}: ${key}`);
    await put(`/api/faqs/${f.documentId}?status=published`, { category: FAQ_MOVES[key] });
  }
}
for (const n of FAQ_NEW) {
  if (faqs.some((f) => f.question.trim() === n.question)) continue;
  console.log(`faq ${n.order} (new): ${n.question}`);
  if (!DRY) await api(`/api/faqs?status=published`, { method: "POST", body: JSON.stringify({ data: n }) });
}
