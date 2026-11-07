#!/usr/bin/env node
// eCommerce service page copy (Strapi `service-page` slug=ecommerce) and its
// cost/timeline FAQs (Strapi `faq`, category "eCommerce website").
// Sends whole components back so images, CTAs and other fields stay intact.
// Uploads the Orderbase logo once for the Food & Beverage audience tab.
//
//   STRAPI_WRITE_TOKEN=... node scripts/cms-update-ecommerce-page.mjs [--dry] [--faqs]
import { readFile } from "node:fs/promises";

const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://cms.mitchdesigns.com";
const TOKEN = process.env.STRAPI_WRITE_TOKEN;
const DRY = process.argv.includes("--dry");
// --faqs: only the FAQs (leaves page copy as edited in Strapi).
const ONLY_FAQS = process.argv.includes("--faqs");
// --app writes only the app section (the `process` component).
const ONLY_APP = process.argv.includes("--app");
// --features writes only the features list section.
const ONLY_FEATURES = process.argv.includes("--features");
// --wegotyou writes only the We Got You section.
const ONLY_WGY = process.argv.includes("--wegotyou");
if (!TOKEN) throw new Error("Set STRAPI_WRITE_TOKEN (a full-access Strapi API token).");
const auth = { Authorization: `Bearer ${TOKEN}` };
const headers = { ...auth, "Content-Type": "application/json" };

const para = (...texts) => texts.map((text) => ({ type: "paragraph", children: [{ type: "text", text }] }));
const id = (m) => m?.id ?? null;

// ── Page copy ───────────────────────────────────────────────────────────────

const HERO = {
  title: "eCommerce Agency For B2B & B2C Brands",
  titleHighlights: "B2B & B2C",
  description: para(
    "If your brand sells products and you're not selling online, you're leaving money on the table. Whether you sell to consumers or to businesses, we build the platform that does it. Your own online store and mobile app, with the engine, the data, the payments and the customers all yours.",
  ),
};

const WE_GOT_YOU = {
  // Orderbase against off-the-shelf platforms and custom-coded stores.
  title: "Tired of eCommerce Platforms That Hold You Back?",
  titleHighlights: "Hold You Back?",
  label: "We Got You",
  // Reads on its own too (sites without the toggle still show this line).
  description: para("One platform, tailored to how you sell, whether to consumers, food lovers or other businesses."),
  tabs: [
    {
      label: "B2C Brands",
      title: "Sell direct to every customer",
      description: para(
        "Your own online store and mobile app, built to turn browsers into buyers and buyers into repeat customers. Fast checkout, local payments, loyalty and promotions, all under your brand and with no marketplace fees.",
      ),
    },
    {
      label: "Food & Beverage",
      title: "Ordering built for food brands",
      description: para(
        "Orderbase is our ordering platform for restaurants, cafés and food brands. Online ordering on web and app, menus and stock per branch, delivery zones, pickup, scheduled orders and loyalty, so you take orders directly instead of paying aggregator commissions.",
      ),
      orderbaseLogo: true,
    },
    {
      label: "B2B",
      title: "Wholesale ordering, made simple",
      description: para(
        "Built for distributors, wholesalers and manufacturers, with bulk orders, customer tiers and segments, contract and volume pricing, subscriptions and recurring orders, and company accounts with several buyers, all synced with your ERP.",
      ),
    },
  ],
};

const WHY_US = {
  description: para("We know eCommerce from the inside. We know what sells, what converts and what keeps customers coming back."),
  cards: [
    ["eCommerce Experience", "Years of building and running online stores taught us what makes them profitable, not just pretty.", "trend"],
    ["Conversion First", "Every page, from product to checkout, is designed and tested to turn visitors into orders.", "funnel"],
    ["Website + Mobile App", "One platform for web and app, so customers buy wherever they are and come back more often.", "phone"],
    ["Digital Marketing In-House", "Our media buying and SEO teams bring the traffic, so your store launches ready to sell.", "target"],
    ["You Own Everything", "Your engine, data, payments and customers. No marketplace fees and no lock-in.", "lock"],
    ["Performance Optimization", "Fast on every device, because every extra second of loading costs sales.", "gauge"],
    ["Dedicated Support Team", "A local team you can reach directly whenever your store needs anything.", "headset"],
    ["Security and Reliability", "Secure payments, SSL and regular backups keep your store and your customers safe.", "server"],
  ],
};

// Features list: the top Orderbase features for B2C and B2B (no product names).
const FEATURES = {
  // No count in the title: the list shows its own counter and can grow.
  title: "Every Feature You Need, Simplified",
  titleHighlights: "Simplified",
  description: para("One platform for B2C and B2B selling, on the web and in your app."),
  cards: [
    ["Website & Mobile App", "Your store on the web and native iOS and Android, run from one dashboard.", "Popular"],
    ["Custom UI Design", "A storefront designed for your brand, not a shared template."],
    ["Unlimited Catalog", "Unlimited products and categories, with images and descriptions."],
    ["Product Variants", "Size, colour or any option, each with its own price, stock and SKU."],
    ["Add-ons & Bundles", "Extras, combos and bundles that lift every basket."],
    ["Build Your Own", "Guided, step-by-step product builders.", "New"],
    ["Collections", "Hand-picked and automatic collections that stay up to date."],
    ["Search & Filters", "Fast search with filters, sorting and comparison."],
    ["Fast Checkout", "A focused two-step checkout that cuts abandoned carts.", "Popular"],
    ["Guest Checkout", "Customers order as a guest or with an account."],
    ["Payment Gateways", "Cards, cash on delivery and wallets, connected to local banks."],
    ["Apple Pay & Saved Cards", "One-tap payments and securely saved cards."],
    ["Multi-Branch Inventory", "Stock, pricing and availability per branch or warehouse."],
    ["Delivery Zones & Rates", "Shipping rates by zone, distance and order value."],
    ["Store Pickup", "Click-and-collect from any branch."],
    ["Scheduled Delivery", "Customers choose their delivery date and time slot."],
    ["Order Management", "One dashboard to receive, track and fulfil every order."],
    ["Promo Codes", "Percentage, fixed-amount and free-delivery codes."],
    ["Automatic Discounts", "Rule-based offers that apply without a code."],
    ["Flash Sales", "Time-limited offers with strike-through pricing."],
    ["Gift Cards & Vouchers", "Vouchers customers can buy, send and redeem."],
    ["Loyalty Points", "Points and rewards that bring customers back.", "Trending"],
    ["Wallet", "Stored credit and instant refunds in the customer's wallet."],
    ["Upsells & Cross-sells", "Smart suggestions while customers shop."],
    ["Wishlist & One-Tap Reorder", "Saved favourites and repeat orders in one tap."],
    ["Customer Accounts", "Profiles, saved addresses and full order history."],
    ["Bulk Orders", "Large-quantity ordering with quick order forms for B2B buyers.", "New"],
    ["Customer Tiers & Segments", "Group customers by tier, region or account type."],
    ["Tiered & Custom Pricing", "Different prices per customer group, volume or contract.", "New"],
    ["Subscriptions", "Recurring orders delivered on the customer's schedule.", "Trending"],
    ["Company Accounts", "Several buyers per company, with roles and approvals."],
    ["Arabic & English", "A fully bilingual store, right-to-left included."],
    ["Multi-Currency & Markets", "Sell across countries and currencies from one platform."],
    ["ERP & POS Integration", "Orders, stock and prices synced with your ERP and point of sale."],
    ["Reports & Analytics", "Sales, product, customer and branch reports in real time."],
    ["Staff Roles & Permissions", "The right access for every team member."],
  ],
};

// The app section (shown on the 3D phone). Uses the page's `process` component.
const APP = {
  title: "Your Brand Deserves an App",
  eyebrow: "Website + mobile app",
  closingTitle: "Scale With Every Order",
  closingText: "Website plus app means one engine, one dashboard, and a business that grows faster with every repeat customer.",
  // One chip per app feature; the phone plays each one (order matters, it matches the scenes).
  steps: [
    ["Points", "Every order earns points, so the next one is already on its way."],
    ["Wallet", "Refunds and credit land in their wallet, ready for the next order."],
    ["Push Notifications", "Offers reach their lock screen directly, with no ad spend."],
    ["Apple Pay", "Double click and done. Checkout takes a second."],
    ["Credit Card", "Any card, paid securely without leaving the app."],
    ["Saved Cards", "Their card is saved, so the next order or reorder is one tap."],
    ["Order Tracking", "Customers watch their order travel from your store to their door."],
    ["Smart AI", "Item out of stock? AI swaps in the closest match before they ask."],
  ],
};

const SUPPORT = {
  title: "Why Brands Stay With Us",
  titleHighlights: "Stay With Us",
  description: para("Launch is only the start. Our ongoing service keeps your store growing."),
  cards: [
    ["Strategic Clarity", "A clear roadmap for your store, tied to your sales goals and reviewed as you grow.", "compass"],
    ["Conversion First", "We keep testing and refining your store to turn more visitors into orders.", "funnel"],
    ["AI & Automation", "We're an AI company too. We automate the busywork, from order flows to customer messages, and keep your store up to date with what's next.", "sparkle"],
    ["Ongoing Partnership", "We've supported many brands through good times and tough ones, so when something goes wrong, we know how to respond online and protect your brand.", "team"],
  ],
};

// ── FAQs (category "eCommerce website") ─────────────────────────────────────
// What store owners actually ask: cost, time, and how much we take off their
// hands. Each entry rewrites an existing FAQ (matched by its current or former
// question, so nothing is deleted) or is created when missing.

const CATEGORY = "eCommerce website";
const FAQS = [
  {
    question: "How much does an eCommerce platform cost?",
    answer: para("Most eCommerce platforms we build cost between EGP 240,000 and EGP 1,000,000. Where yours falls depends on the number of products and pages, the features you need (B2B pricing, subscriptions, a mobile app) and your integrations. Tell us about your business and we'll send a detailed proposal."),
  },
  {
    from: ["How long does it take to design and develop an ecommerce website?"],
    question: "How long does it take to build an eCommerce platform?",
    answer: para("Usually 3 to 6 months from kickoff to launch. It depends on the complexity of the design, the size of the catalogue and sitemap, and the number of features. We share a schedule with clear milestones at the start, so you always know what comes next."),
  },
  {
    from: ["Do you provide media buying services for ecommerce brands?"],
    question: "Do you also run our ads on Meta, TikTok and Google?",
    answer: para("Yes. Our media buying team runs your campaigns on Meta, TikTok and Google Ads, built as full funnels with performance creative. Because we built your store, we track every sale back to the ad that brought it, so your budget goes where it sells."),
  },
  {
    from: ["Do you offer SEO services for ecommerce businesses?"],
    question: "Does the platform come with a mobile app?",
    answer: para("It can. The same engine powers your website and native iOS and Android apps, so products, stock, orders and customers stay in sync. We design the app for your brand, add push notifications and publish it on the App Store and Google Play for you."),
  },
  {
    from: ["Do you provide email marketing services?"],
    question: "Can customers pay with Apple Pay and save their cards?",
    answer: para("Yes. Customers can pay by card through local bank gateways, with Apple Pay, from their wallet or cash on delivery. Cards can be saved securely as tokens, so repeat orders take one tap."),
  },
  {
    from: ["Do you use SEO-friendly website design and development practices?"],
    question: "Do you support wallets, loyalty points and memberships?",
    answer: para("Yes. Customers earn and spend loyalty points, keep store credit and refunds in a wallet, and can join paid or tiered memberships. Add gift cards, vouchers and automatic discounts, and you have everything you need to bring customers back."),
  },
  {
    from: ["Is WooCommerce good for large ecommerce stores (10,000 products and more)?"],
    question: "Can you manage the store for us?",
    answer: para("Yes. You get a dedicated eCommerce account manager who looks after your store with you, from new products and collections to campaigns, offers, reports and improvements. Running an online store is a big responsibility, and you don't have to carry it alone."),
  },
  {
    from: ["Which technology is used in ecommerce website development?"],
    question: "What does your support and maintenance include?",
    answer: para("Technical support with a guaranteed response time, security monitoring, updates, bug fixes and performance tuning, with priority handling when it matters. We keep your store fast, secure and selling, so your team can focus on the business."),
  },
  {
    from: ["Do you handle the website hosting, servers, domain names, SSL, and backups?"],
    question: "Do you handle hosting, domain, SSL and backups?",
    answer: para("Yes. We set up and manage hosting, servers, your domain, SSL certificates and regular backups, so the technical side is fully taken care of."),
  },
  {
    from: ["Do you handle data entry for ecommerce websites before launching?"],
    question: "Do you add our products before launch?",
    answer: para("Yes. We enter your products, categories, prices, images and descriptions, so your store launches complete and ready to sell."),
  },
  {
    from: ["Do you design and develop Arabic ecommerce websites?"],
    question: "Do you build Arabic stores?",
    answer: para("Yes. Every store we build can be fully bilingual in Arabic and English, right-to-left layout included, on the website and the app."),
  },
  {
    question: "Who owns the store, the data and the customers?",
    answer: para("You do. The platform runs under your brand, and your sales data, payments and customer list belong to you. No marketplace sits between you and your customers."),
  },
];

// ── Run ─────────────────────────────────────────────────────────────────────

async function api(path, init = {}) {
  const res = await fetch(`${STRAPI}${path}`, { ...init, headers: init.headers ?? headers });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} → ${res.status} ${JSON.stringify(body?.error ?? body)}`);
  return body;
}
const put = (path, data) => (DRY ? console.log("[dry] PUT", path) : api(path, { method: "PUT", body: JSON.stringify({ data }) }));

// Orderbase wordmark in the media library (uploaded once, then reused by name).
// Same wordmark as orderbase.mitchdesigns.com, letters in black for light sections.
async function orderbaseLogo() {
  const name = "orderbase-wordmark.svg";
  const found = await api(`/api/upload/files?filters[name][$eq]=${name}`);
  if (found?.length) return found[0].id;
  if (DRY) return null;
  const form = new FormData();
  const file = await readFile(new URL("../public/images/orderbase/wordmark.svg", import.meta.url));
  form.append("files", new Blob([file], { type: "image/svg+xml" }), name);
  form.append("fileInfo", JSON.stringify({ name, alternativeText: "Orderbase" }));
  const res = await fetch(`${STRAPI}/api/upload`, { method: "POST", headers: auth, body: form });
  if (!res.ok) throw new Error(`upload → ${res.status} ${await res.text()}`);
  return (await res.json())[0].id;
}

const q = [
  "populate[hero][populate]=*",
  "populate[weGotYou][populate][image]=true",
  "populate[weGotYou][populate][cta]=true",
  "populate[weGotYou][populate][story]=true",
  "populate[weGotYou][populate][tabs][populate][logo]=true",
  "populate[whyUs][populate][cards][populate]=*",
  "populate[featuresSimplified][populate]=*",
  "populate[support][populate][cards][populate]=*",
  "populate[process][populate][processCards][populate]=*",
  "populate[process][populate][appScreens]=true",
].join("&");
const page = (await api(`/api/service-pages?status=draft&filters[slug][$eq]=ecommerce&${q}`)).data[0];
const { hero: h, weGotYou: w, whyUs: y, featuresSimplified: f, support: s, process: p } = page;
// Any image already on the page, for components whose schema requires one
// that the design doesn't show (cards, steps).
const filler = id(w?.image) ?? id(f?.image) ?? id(y?.cards?.[0]?.image);
const logoId = ONLY_FAQS ? null : await orderbaseLogo();

const hero = {
  id: h.id, subTitle: h.subTitle, reverseLayout: h.reverseLayout, image: id(h.image),
  cta: h.cta && { id: h.cta.id, label: h.cta.label, href: h.cta.href },
  ...HERO,
};
const weGotYou = {
  id: w.id, titleTag: w.titleTag, theme: w.theme, imagePosition: w.imagePosition, image: id(w.image),
  cta: w.cta && { id: w.cta.id, label: w.cta.label, href: w.cta.href }, story: (w.story ?? []).map((m) => m.id),
  title: WE_GOT_YOU.title, titleHighlights: WE_GOT_YOU.titleHighlights, label: WE_GOT_YOU.label, description: WE_GOT_YOU.description,
  tabs: WE_GOT_YOU.tabs.map(({ orderbaseLogo: withLogo, ...t }) => ({ ...t, logo: withLogo ? logoId : null })),
};
const whyUs = {
  id: y.id, title: y.title, titleHighlights: y.titleHighlights, variant: y.variant, description: WHY_US.description,
  cards: WHY_US.cards.map(([title, text, icon], i) => ({ title, description: para(text), icon, image: id(y.cards[i]?.image) ?? filler })),
};
const featuresSimplified = {
  ...(f ? { id: f.id } : {}), image: id(f?.image) ?? filler,
  title: FEATURES.title, titleHighlights: FEATURES.titleHighlights, description: FEATURES.description,
  featureCards: FEATURES.cards.map(([title, text, label]) => ({ title, description: para(text), label: label ?? null })),
};
const processSection = {
  ...(p ? { id: p.id } : {}), title: APP.title, eyebrow: APP.eyebrow, closingTitle: APP.closingTitle, closingText: APP.closingText,
  appScreens: (p?.appScreens ?? []).map((m) => m.id),
  processCards: APP.steps.map(([title, text], i) => ({ stepNumber: i + 1, title, description: para(text), summary: text, image: filler })),
};
const support = {
  ...(s ? { id: s.id } : {}), title: SUPPORT.title, titleHighlights: SUPPORT.titleHighlights, description: SUPPORT.description,
  cards: SUPPORT.cards.map(([title, text, icon], i) => ({ title, description: para(text), icon, image: id(s?.cards?.[i]?.image) ?? filler })),
};

console.log("ecommerce:", {
  hero: hero.title, tabs: weGotYou.tabs.map((t) => t.label + (t.logo ? " (logo)" : "")),
  whyUs: whyUs.cards.length, features: featuresSimplified.featureCards.length, appSteps: processSection.processCards.length, support: support.cards.length,
});
if (ONLY_WGY) {
  await put(`/api/service-pages/${page.documentId}?status=published`, { weGotYou });
  process.exit(0);
}
if (ONLY_FEATURES) {
  await put(`/api/service-pages/${page.documentId}?status=published`, { featuresSimplified });
  process.exit(0);
}
if (ONLY_APP) {
  await put(`/api/service-pages/${page.documentId}?status=published`, { process: processSection });
  process.exit(0);
}
if (!ONLY_FAQS) await put(`/api/service-pages/${page.documentId}?status=published`, { hero, weGotYou, whyUs, featuresSimplified, process: processSection, support });

// FAQs, in this order.
const faqs = (await api(`/api/faqs?status=draft&filters[category][$eq]=${encodeURIComponent(CATEGORY)}&pagination[pageSize]=100`)).data;
const used = new Set();
for (const [i, entry] of FAQS.entries()) {
  const names = [entry.question, ...(entry.from ?? [])];
  const faq = faqs.find((x) => !used.has(x.documentId) && names.includes(x.question.trim()));
  const data = { question: entry.question, answer: entry.answer, order: i + 1 };
  if (faq) {
    used.add(faq.documentId);
    console.log(`faq ${i + 1}: ${entry.question}`);
    await put(`/api/faqs/${faq.documentId}?status=published`, data);
  } else {
    console.log(`faq ${i + 1} (new): ${entry.question}`);
    if (!DRY) await api(`/api/faqs?status=published`, { method: "POST", body: JSON.stringify({ data: { ...data, category: CATEGORY } }) });
  }
}
for (const faq of faqs.filter((x) => !used.has(x.documentId))) console.log(`faq left as is: ${faq.question}`);
