#!/usr/bin/env node
// Mobile app service page copy (Strapi `service-page` slug=mobile-app).
// Sends whole components back so images, CTAs and other fields stay intact.
// Headlines in sentence case. No em dashes, no colons, "brands" not "clients".
//
//   STRAPI_WRITE_TOKEN=... node scripts/cms-update-mobile-page.mjs [--dry]
const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://cms.mitchdesigns.com";
const TOKEN = process.env.STRAPI_WRITE_TOKEN;
const DRY = process.argv.includes("--dry");
// --labels also writes support card badges (once Strapi has the field).
const WITH_LABELS = process.argv.includes("--labels");
if (!TOKEN) throw new Error("Set STRAPI_WRITE_TOKEN (a full-access Strapi API token).");
const headers = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

const para = (...texts) => texts.map((text) => ({ type: "paragraph", children: [{ type: "text", text }] }));
const id = (m) => m?.id ?? null;

// ── Page copy ───────────────────────────────────────────────────────────────

const HERO = {
  title: "Mobile apps that convert and keep customers coming back",
  titleHighlights: "coming back",
  description: para(
    "We design and build native feel iOS and Android apps in Flutter and React Native. A tailored user experience and a clean, stunning interface that turn first downloads into loyal, repeat customers.",
  ),
};

// The app is for customers who already chose you and want to keep coming back.
const WE_GOT_YOU = {
  title: "Turn one time buyers into lifelong customers",
  titleHighlights: "lifelong",
  label: "We Got You",
  description: para(
    "A customer who downloads your app has already chosen you. We design it around their daily habits, so they do what they came for in seconds and keep coming back for years.",
  ),
};

const WHY_US = {
  title: "Why choose MitchDesigns?",
  titleHighlights: "MitchDesigns",
  description: para(
    "A great app is more than beautiful screens. We study your customers, test every key flow and refine it until using your app feels effortless.",
  ),
  cards: [
    ["Product design", "We start from your customers and your business goals, so every screen and feature earns its place.", "target"],
    ["Seamless user experience", "We prototype, split test and refine the key flows until users finish what they came for in seconds.", "ab"],
    ["Scalable development", "Flutter and React Native apps on a solid backend, ready to grow from your first users to millions.", "server"],
    ["Ongoing support", "We keep improving your app from real usage data, with updates, new features and monitoring.", "headset"],
  ],
};

// The 3D phone scene: four steps, then the closing pose (five stops in all).
const PROCESS = {
  title: "How we build mobile apps",
  titleHighlights: "mobile apps",
  // Yellow label above the title, like "We Got You".
  eyebrow: "How we do it",
  closingTitle: "Launch and grow",
  closingText: "Your app goes live on the App Store and Google Play, and we keep improving it with every release.",
  steps: [
    ["Discovery", "We study your customers, their daily habits and your goals, then map the shortest path to every action."],
    ["UX and UI design", "Wireframes and prototypes we try with real users, then a clean, stunning interface tailored to your brand."],
    ["Development", "Flutter or React Native on a scalable backend, with a native feel on iOS and Android."],
    ["Optimization", "Real device checks and A/B comparisons of the key flows, until every task feels effortless."],
  ],
};

// Common app features we build (a plain grid on the page).
const FEATURES = {
  title: "Every feature your app needs",
  titleHighlights: "app",
  description: para("From sign in to payments, we build the features your customers expect, tailored to your brand."),
  cards: [
    ["Sign up and social login", "Email, phone, Apple and Google sign in, in one tap.", "Popular"],
    ["Face ID and fingerprint", "Biometric login that keeps accounts safe and fast."],
    ["OTP verification", "One time codes by SMS, WhatsApp or email."],
    ["Onboarding", "Short, friendly first steps that get users to value fast."],
    ["User profiles", "Profiles, saved addresses and preferences."],
    ["Push notifications", "Targeted offers and updates on the lock screen.", "Popular"],
    ["In app messages", "Banners and pop ups at the right moment."],
    ["Live chat and support", "Chat with your team without leaving the app."],
    ["AI assistant", "A smart assistant that answers questions and guides users.", "New"],
    ["Smart recommendations", "Personal suggestions based on what each user likes.", "Trending"],
    ["Cart and checkout", "A fast checkout built to cut abandoned carts."],
    ["Payment gateways", "Cards and wallets, connected to local banks."],
    ["Apple Pay and Google Pay", "One tap payments with saved cards."],
    ["In app purchases", "Digital products and upgrades through the stores."],
    ["Subscriptions and memberships", "Recurring plans with trials and renewals.", "Trending"],
    ["Wallet", "Stored credit, top ups and instant refunds."],
    ["Loyalty points and rewards", "Points and tiers that bring users back.", "Popular"],
    ["Referrals", "Invite friends and reward both sides."],
    ["Promo codes and offers", "Codes, discounts and limited time deals."],
    ["Booking and scheduling", "Pick a date, time and branch in seconds."],
    ["Reminders and calendar", "Reminders that keep appointments on track."],
    ["Maps and location", "Nearby branches, addresses and directions."],
    ["Real time tracking", "Live order, driver or trip tracking on a map.", "Popular"],
    ["Search and filters", "Fast search with filters and sorting."],
    ["Ratings and reviews", "Feedback that builds trust and improves service."],
    ["Favourites and reorder", "Saved favourites and repeat orders in one tap."],
    ["Order history", "Every order, booking and receipt in one place."],
    ["QR and barcode scanner", "Scan to pay, check in or find a product."],
    ["Photo and video upload", "Upload, crop and share media from the camera."],
    ["Social sharing", "Share products and content to any app."],
    ["Deep links", "Links that open the exact screen in your app."],
    ["Offline mode", "Key screens keep working without a connection."],
    ["Dark mode", "A comfortable dark theme that follows the phone."],
    ["Arabic and English", "Fully bilingual, right to left included."],
    ["Home screen widgets", "Glanceable info without opening the app.", "New"],
    ["Apple Watch and wearables", "Quick actions and alerts on the wrist."],
    ["Health and fitness data", "Apple Health and Google Fit integration."],
    ["Analytics and events", "See how users move through your app."],
    ["Split testing", "Test screens and flows to find what converts."],
    ["Crash reporting", "Catch and fix issues before users notice."],
    ["Admin dashboard", "Manage content, users and orders from the web."],
    ["Roles and permissions", "The right access for every team member."],
  ],
};

// Same scroll stack as eCommerce ("Why brands stay with us"), for apps.
const SUPPORT = {
  title: "Why brands stay with us",
  titleHighlights: "stay with us",
  description: para("Launch is only the start. Our ongoing service keeps your app growing."),
  cards: [
    ["Strategic clarity", "A clear product roadmap for your app, tied to your business goals and reviewed as you grow.", "compass"],
    ["Retention first", "We study how people use your app and keep refining it, so they open it more often and stay longer.", "funnel"],
    ["AI & Automation", "We're an AI company too. We add smart features, automate the busywork and keep your app up to date with what's next.", "sparkle", "Trending"],
    ["Ongoing partnership", "Updates for every new iOS and Android release, bug fixes, monitoring and new features, from a team that knows your app inside out.", "team"],
  ],
};

// Logo wall + projects of the apps we built (shows once case studies exist).
const MORE_ABOUT = {
  title: "Brands that grow with our apps",
  titleHighlights: "grow",
  description: para("A few of the mobile apps we designed and built."),
};

const TECH_STACK = {
  title: "The tech behind our apps",
  highlight: "our apps",
  description: "Flutter and React Native on the front, a secure and scalable backend behind them.",
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
  "populate[featuresSimplified][populate]=*",
  "populate[support][populate][cards][populate]=*",
  "populate[process][populate][processCards][populate]=*",
  "populate[process][populate][appScreens]=true",
  "populate[moreAbout][populate][cards][populate]=*",
  "populate[techStack]=true",
].join("&");
const page = (await api(`/api/service-pages?status=draft&filters[slug][$eq]=mobile-app&${q}`)).data[0];
const { hero: h, weGotYou: w, whyUs: y, featuresSimplified: f, support: s, process: p, moreAbout: m } = page;
// An image already on the page, for components whose schema requires one the design doesn't show.
const filler = id(p?.processCards?.[0]?.image) ?? id(w?.image) ?? id(h?.image);

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
  id: y.id, variant: y.variant, title: WHY_US.title, titleHighlights: WHY_US.titleHighlights, description: WHY_US.description,
  cards: WHY_US.cards.map(([title, text, icon], i) => ({ title, description: para(text), icon, image: id(y.cards?.[i]?.image) ?? filler })),
};
const processSection = {
  id: p.id, title: PROCESS.title, titleHighlights: PROCESS.titleHighlights, eyebrow: PROCESS.eyebrow, closingTitle: PROCESS.closingTitle, closingText: PROCESS.closingText,
  appScreens: (p.appScreens ?? []).map((x) => x.id),
  processCards: PROCESS.steps.map(([title, text], i) => ({ stepNumber: i + 1, title, description: para(text), summary: text, image: filler })),
};
const featuresSimplified = {
  ...(f ? { id: f.id } : {}), image: id(f?.image) ?? filler,
  title: FEATURES.title, titleHighlights: FEATURES.titleHighlights, description: FEATURES.description,
  featureCards: FEATURES.cards.map(([title, text, label]) => ({ title, description: para(text), label: label ?? null })),
};
const support = {
  id: s.id, title: SUPPORT.title, titleHighlights: SUPPORT.titleHighlights, description: SUPPORT.description,
  // The 4th entry is the card badge (needs the support-card `label` field in Strapi).
  cards: SUPPORT.cards.map(([title, text, icon, label], i) => ({ title, description: para(text), icon, ...(WITH_LABELS ? { label: label ?? null } : {}), image: id(s.cards?.[i]?.image) ?? filler })),
};
// The design doesn't show these cards, but the schema needs at least one.
const moreAbout = {
  ...(m ? { id: m.id } : {}), ...MORE_ABOUT,
  cards: m?.cards?.length
    ? m.cards.map((c) => ({ title: c.title, description: c.description, icon: c.icon, image: id(c.image) ?? filler }))
    : [{ title: "Mobile apps", description: para("Apps we designed and built."), image: filler }],
};
const techStack = { ...(page.techStack ? { id: page.techStack.id } : {}), ...TECH_STACK };

console.log("mobile-app:", {
  hero: hero.title, whyUs: whyUs.cards.length, steps: processSection.processCards.length,
  features: featuresSimplified.featureCards.length, support: support.cards.length, moreAbout: moreAbout.title,
});
if (DRY) process.exit(0);
await api(`/api/service-pages/${page.documentId}?status=published`, {
  method: "PUT",
  body: JSON.stringify({ data: { hero, weGotYou, whyUs, process: processSection, featuresSimplified, support, moreAbout, techStack } }),
});
console.log("published");
