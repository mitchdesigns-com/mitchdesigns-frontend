/**
 * Local fixtures — used as a fallback when Strapi is unreachable (e.g. on
 * first run before Strapi is provisioned). Shapes match `lib/cms/types`.
 * Remove or trim once Strapi has real content.
 */
import { LEADS_URL } from "@/config/nav";
import type {
  AboutContent,
  Career,
  CareersPageData,
  CaseStudy,
  ClientLogo,
  CtaBannerData,
  FAQ,
  HomePageData,
  OrderbasePageData,
  Service,
  Talk,
  TeamMember,
  TechItem,
  TechStackSection,
  Testimonial,
  TrustReason,
} from "./types";

type WithId<T> = T & { id: number };

export const fixtureClientLogos: Array<WithId<ClientLogo>> = [
  {
    id: 1,
    name: "El Gouna",
    logo: {
      url: "/images/client-logos/d4adcf3bc98557a16755015c4af3cc3f4e4a3f92.png",
      alternativeText: "El Gouna",
    },
    order: 1,
  },
  {
    id: 2,
    name: "Joula",
    logo: { url: "/images/client-logos/Joula.png", alternativeText: "Joula" },
    order: 2,
  },
  {
    id: 3,
    name: "Sally Helmy",
    logo: {
      url: "/images/client-logos/sh.png",
      alternativeText: "Sally Helmy",
    },
    order: 3,
  },
  {
    id: 4,
    name: "MG",
    logo: { url: "/images/client-logos/mg.png", alternativeText: "MG" },
    order: 4,
  },
  {
    id: 5,
    name: "Exception Pâtissier",
    logo: {
      url: "/images/client-logos/exc.png",
      alternativeText: "Exception Pâtissier",
    },
    order: 5,
  },
  {
    id: 6,
    name: "Cairo Cooking",
    logo: {
      url: "/images/client-logos/b15c5fd6de0f860a24f79b5cae3a4ec0d8850e85.png",
      alternativeText: "Cairo Cooking",
    },
    order: 6,
  },
  {
    id: 7,
    name: "Ras Soma",
    logo: {
      url: "/images/client-logos/25adc2a1534f6d2da6a579e0b4fa63c517a1cd3e.png",
      alternativeText: "Ras Soma",
    },
    order: 7,
  },
  {
    id: 8,
    name: "Gobill",
    logo: { url: "/images/client-logos/gobill.png", alternativeText: "Gobill" },
    order: 8,
  },
  {
    id: 9,
    name: "Almaza Bay",
    logo: {
      url: "/images/client-logos/Almaza.png",
      alternativeText: "Almaza Bay",
    },
    order: 9,
  },
  {
    id: 10,
    name: "Lychee",
    logo: { url: "/images/client-logos/lychee.png", alternativeText: "Lychee" },
    order: 10,
  },
  {
    id: 11,
    name: "gobus",
    logo: { url: "/images/client-logos/gobus.png", alternativeText: "gobus" },
    order: 11,
  },
  {
    id: 12,
    name: "G Developments",
    logo: {
      url: "/images/client-logos/gdev.png",
      alternativeText: "G Developments",
    },
    order: 12,
  },
  {
    id: 13,
    name: "Mountain View",
    logo: {
      url: "/images/client-logos/mv.png",
      alternativeText: "Mountain View",
    },
    order: 13,
  },
  {
    id: 14,
    name: "qwell",
    logo: { url: "/images/client-logos/qwell.png", alternativeText: "qwell" },
    order: 14,
  },
  {
    id: 15,
    name: "Abu Auf",
    logo: {
      url: "/images/client-logos/abu-auf.png",
      alternativeText: "Abu Auf",
    },
    order: 15,
  },
];

export const fixtureServices: Array<WithId<Service>> = [
  {
    id: 1,
    slug: "mobile-app",
    title: "Build A Mobile App",
    tagline: "Native and cross-platform apps designed for conversion.",
    description:
      "Every mobile app we build is tailored to your business goals — no templates, no shortcuts. We design native-feel experiences on iOS and Android using React Native, with animations that delight and flows that convert. Each app is built for performance, App Store approval, and post-launch growth.",
  },
  {
    id: 2,
    slug: "corporate",
    title: "Build A Corporate Website",
    tagline: "Planning user journeys that drive engagement and clarity.",
    description:
      "Every corporate website we build is tailored with no templates and brought to life with custom animations. We use a React frontend powered by Next.js and a headless CMS with Strapi.io to give businesses flexibility and control. Each project is designed to generate qualified leads with SEO-friendly structure, user-focused experience, and high performance speeds. After launch we provide full maintenance and technical support.",
  },
  {
    id: 3,
    slug: "ecommerce",
    title: "Build An eCommerce Platform",
    tagline: "Crafting a responsive, fast, and scalable experience.",
    description:
      "We build eCommerce platforms that turn browsers into buyers. Custom storefronts, seamless checkout flows, and performance-optimised pages designed to reduce drop-off at every step. Integrated with your payment gateway, inventory, and logistics — built to scale.",
  },
  {
    id: 4,
    slug: "custom",
    title: "Build A Custom Platform",
    tagline: "Continuous testing, optimization, and team training.",
    description:
      "When off-the-shelf software doesn't cut it, we build exactly what you need. Booking systems, SaaS dashboards, internal tools, or client portals — architected for reliability, designed for the people who use them every day.",
  },
  {
    id: 5,
    slug: "media-buying",
    title: "Scale with Media Buying",
    tagline: "Paid campaigns that reach the right audience at scale.",
    description:
      "We run paid social and display campaigns that don't burn budget. Data-driven targeting, creative testing, and funnel optimisation across Meta, TikTok, and Snapchat — built around your cost-per-acquisition, not just impressions.",
  },
  {
    id: 6,
    slug: "seo",
    title: "Rank with SEO",
    tagline: "Organic growth through technical and content excellence.",
    description:
      "We combine technical SEO, content strategy, and link building into a single growth engine. Audits, on-page fixes, and a publishing roadmap that compounds — so you rank for the searches that bring buyers, not just traffic.",
  },
  {
    id: 7,
    slug: "google-ads",
    title: "Scale with Google Ads",
    tagline: "Search and Performance Max campaigns that convert.",
    description:
      "We manage Google Ads accounts built around profitable keywords and tight negative lists. Search, Performance Max, and remarketing — continuously tested and optimised so every dirham in ad spend works harder.",
  },
];

export const fixtureCaseStudies: Array<WithId<CaseStudy>> = [
  {
    id: 1,
    slug: "el-gouna",
    title: "El-Gouna\nDigital Revamp LOCAL FIX",
    websiteUrl: "https://elgouna.com/",
    client: "Orascom Development",
    tagline: "Transforming Tourist Engagement through El Gouna's website design",
    excerpt: "A renowned self-sufficient premier destination by the Red Sea, sought to unify its multiple service offerings—from hotels to community services—into one comprehensive website.",
    services: [
      "Digital roadmap & strategy",
      "Website design & development",
      "SEO",
    ],
    category: "Corporate",
    year: 2018,
    cover: { url: "/images/case-studies/el-gouna.webp" },
    logo: {
      url: "/images/client-logos/d4adcf3bc98557a16755015c4af3cc3f4e4a3f92.png",
      alternativeText: "El Gouna",
    },
    testimonial: {
      quote: "Very professional team. Their work is outstanding!",
      author: "Mona Maher",
      role: "Marketing specialist",
      avatar: { url: "/images/client-logos/gobus.png" },
    },
    content: [
      { __component: "blocks.case-point" as const, title: "Strategic Goal", body: "The aim was to enhance brand visibility, streamline user engagement, and extend market reach." },
      { __component: "blocks.case-point" as const, title: "Tech. Stack", body: "Challenged with a vast dataset and the need for multifunctional capabilities, our web design and development solution incorporated cutting-edge technologies including Next.js, PHP, and Tailwind CSS." },
      { __component: "blocks.case-point" as const, title: "Performance & Scalability", body: "This approach ensured a robust and intuitive user experience with a backend supported by WordPress for streamlined content management and scalability." },
      { __component: "blocks.image-pair" as const, left: { url: "/images/case-studies/el-gouna.webp", alternativeText: "El Gouna website" }, right: { url: "/images/case-studies/el-gouna.webp", alternativeText: "El Gouna website" } },
      { __component: "blocks.case-point" as const, title: "Core Outcome", body: "The new website significantly enhanced El Gouna's digital presence." },
      { __component: "blocks.case-point" as const, title: "Seamless User Experience", body: "It serves as a central hub for both visitors and residents, with a design that showcases El Gouna's attractions through a modern, visually captivating interface, promoting ease of exploration and interaction." },
      { __component: "blocks.case-point" as const, title: "Unique User Interface", body: "The project is successfully setting a new standard for online tourism platforms. The website now effectively supports El Gouna's mission to be recognized as the ultimate destination on the Red Sea." },
      { __component: "blocks.color-palette" as const, swatches: [{ name: "Brick Ember", hex: "#b93524" }] },
    ],
    featured: true,
    bgColor: "#0b3a53",
    publishedAt: "2024-08-12",
  },
  {
    id: 2,
    slug: "lychee",
    title: "GO limo\nmobile App Design",
    client: "Lychee",
    tagline: "A unified ordering platform for restaurants.",
    excerpt: "",
    services: [
      "Digital roadmap & strategy",
      "Website design & development",
      "Content creation",
    ],
    category: "Mobile App",
    year: 2021,
    cover: { url: "/images/case-studies/lychee.webp" },
    logo: { url: "/images/client-logos/lychee.png", alternativeText: "Lychee" },
    testimonial: {
      quote: "I am always happy to work with them, thank you!",
      author: "Mona Nassief",
      role: "Partner, Marketing Director",
      avatar: { url: "/images/client-logos/lychee.png" },
    },
    featured: true,
    bgColor: "#e5484d",
    publishedAt: "2024-06-01",
  },
  {
    id: 3,
    slug: "sally-helmy",
    title: "MG motors\nsleek website design",
    client: "Sally Helmy",
    tagline: "A personal brand built for impact.",
    excerpt: "",
    services: [
      "Digital roadmap & strategy",
      "Website design & development",
      "Website administration",
    ],
    category: "Corporate",
    year: 2020,
    cover: { url: "/images/case-studies/sally-helmy.webp" },
    logo: { url: "/images/client-logos/mv.png", alternativeText: "MG Motors" },
    testimonial: {
      quote: "They definitely exceeded our expectations!",
      author: "Malak El-Hennawy",
      role: "Marketing Specialist",
      avatar: { url: "/images/client-logos/mv.png" },
    },
    featured: true,
    bgColor: "#1f7a5a",
    publishedAt: "2020-10-01",
  },
  {
    id: 4,
    slug: "g-developments",
    title: "G Developments\nWebsite Redesign",
    client: "G Developments",
    tagline: "A digital roadmap for a destination brand.",
    excerpt: "",
    services: [
      "Digital roadmap & strategy",
      "Website design & development",
      "SEO",
    ],
    category: "Corporate",
    year: 2022,
    cover: { url: "/images/case-studies/el-gouna.webp" },
    logo: {
      url: "/images/client-logos/gdev.png",
      alternativeText: "G Developments",
    },
    testimonial: {
      quote:
        "From discovery to launch, every detail was considered. Our conversion rate jumped 38% in the first quarter.",
      author: "Nour El-Din",
      role: "Head of Product",
      avatar: { url: "/images/client-logos/gdev.png" },
    },
    featured: true,
    bgColor: "#5b3fb0",
    publishedAt: "2024-08-12",
  },
];

export const fixtureTestimonials: Array<WithId<Testimonial>> = [
  {
    id: 1,
    quote:
      "Very professional team. Their work is outstanding! They definitely exceeded our expectations!",
    author: "Mona Maher",
    role: "CEO",
    company: "GoBus",
    googleReview: true,
    companyLogo: { url: "/images/client-logos/gobus.png" },
  },
  {
    id: 2,
    quote:
      "MitchDesigns built our entire digital presence from scratch. The team is sharp, fast, and a pleasure to work with.",
    author: "Sarah Mansour",
    role: "VP Marketing",
    company: "El Gouna",
    googleReview: true,
    companyLogo: {
      url: "/images/client-logos/d4adcf3bc98557a16755015c4af3cc3f4e4a3f92.png",
    },
  },
  {
    id: 3,
    quote:
      "From discovery to launch, every detail was considered. Our conversion rate jumped 38% in the first quarter.",
    author: "Karim Hassan",
    role: "Founder",
    company: "Almaza Bay",
    googleReview: true,
    companyLogo: { url: "/images/client-logos/Almaza.png" },
  },
  {
    id: 4,
    quote:
      "They translated our brand into a digital experience that finally feels like us. Highly recommend.",
    author: "Nour El-Din",
    role: "Head of Product",
    company: "G Developments",
    googleReview: true,
    companyLogo: { url: "/images/client-logos/gdev.png" },
  },
  {
    id: 5,
    quote:
      "Best agency we've worked with — and we've tried a few. They care about outcomes, not just deliverables.",
    author: "Layla Farouk",
    role: "CMO",
    company: "Mountain View",
    googleReview: true,
    companyLogo: { url: "/images/client-logos/mv.png" },
  },
  {
    id: 6,
    quote:
      "The attention to detail and the way they approached our brand story was exceptional. Real pros.",
    author: "Ahmed Galal",
    role: "CEO",
    company: "Lychee",
    googleReview: true,
    companyLogo: { url: "/images/client-logos/lychee.png" },
  },
  {
    id: 7,
    quote:
      "We launched on time, on budget, and the results speak for themselves. Couldn't ask for more.",
    author: "Dina Khalil",
    role: "Marketing Director",
    company: "Abu Auf",
    googleReview: true,
    companyLogo: { url: "/images/client-logos/abu-auf.png" },
  },
  {
    id: 8,
    quote:
      "Our booking system handled launch day traffic with zero issues. The team really understood our needs.",
    author: "Omar Sharaf",
    role: "Operations Lead",
    company: "Ras Soma",
    googleReview: true,
    companyLogo: {
      url: "/images/client-logos/25adc2a1534f6d2da6a579e0b4fa63c517a1cd3e.png",
    },
  },
];

export const fixtureTrustReasons: Array<WithId<TrustReason>> = [
  {
    id: 1,
    title: "Expertise Led By The Founder",
    body: "Every project is guided by direct founder insight — blending business strategy, UX design, and conversion logic to ensure every outcome feels intentional and high-performing.",
    image: { url: "/images/trust-reasons/expertise.png", alternativeText: "Expertise Led By The Founder" },
    order: 1,
  },
  {
    id: 2,
    title: "Tailor-Made Digital Systems",
    body: "We don't rely on templates. We build from the ground up — fully custom platforms that match how your business operates, not the other way around.",
    image: { url: "/images/trust-reasons/tailor-made.png", alternativeText: "Tailor-Made Digital Systems" },
    order: 2,
  },
  {
    id: 3,
    title: "Smooth Tech Integration",
    body: "From ERPs and CRMs to payments and logistics — we connect every moving part into a smooth, automated system.",
    image: { url: "/images/trust-reasons/smooth-tech.png", alternativeText: "Smooth Tech Integration" },
    order: 3,
  },
  {
    id: 4,
    title: "Design That Drives Business",
    body: "Our designs are not just beautiful — they're designed and built for growth, clarity, and conversion.",
    image: { url: "/images/trust-reasons/design.png", alternativeText: "Design That Drives Business" },
    order: 4,
  },
  {
    id: 5,
    title: "Partnership After Launch",
    body: "We don't disappear after go-live. Our shared support team and monthly retainer model keep every website secure, updated, and optimized.",
    image: { url: "/images/trust-reasons/partnership.png", alternativeText: "Partnership After Launch" },
    order: 5,
  },
  {
    id: 6,
    title: "Performance Mindset",
    body: "We measure success by real impact — conversions, traffic, and operational efficiency — not vanity metrics.",
    image: { url: "/images/trust-reasons/performance.png", alternativeText: "Performance Mindset" },
    order: 6,
  },
];

export const fixtureTechStackSection: TechStackSection = {
  title: "Craft seamless digital platforms with our modern tech stack",
  description:
    "More than a stack — it's how we build reliable, scalable, and secure digital ecosystems for every client.",
  highlight: "with our modern tech stack",
};

export const fixtureTechStack: Array<WithId<TechItem>> = [
  {
    id: 1,
    name: "Next.js",
    category: "frontend",
    logo: { url: "/images/tech/nextjs.png" },
  },
  {
    id: 2,
    name: "React",
    category: "frontend",
    logo: { url: "/images/tech/react.png" },
  },
  {
    id: 3,
    name: "TypeScript",
    category: "frontend",
    logo: { url: "/images/tech/typescript.png" },
  },
  {
    id: 4,
    name: "Tailwind",
    category: "frontend",
    logo: { url: "/images/tech/tailwind.png" },
  },
  {
    id: 5,
    name: "PHP 8.4",
    category: "backend",
    logo: { url: "/images/tech/php.png" },
  },
  {
    id: 6,
    name: "Laveral PHP",
    category: "backend",
    logo: { url: "/images/tech/laravel.png" },
  },
  {
    id: 7,
    name: "Strapi",
    category: "backend",
    logo: { url: "/images/tech/strapi.png" },
  },
  {
    id: 8,
    name: "Node.js",
    category: "backend",
    logo: { url: "/images/tech/node.png" },
  },
  {
    id: 9,
    name: "AWS",
    category: "infra",
    logo: { url: "/images/tech/aws.png" },
  },
  {
    id: 10,
    name: "Cloudflare",
    category: "infra",
    logo: { url: "/images/tech/cloudflare.png" },
  },
  {
    id: 11,
    name: "Github",
    category: "infra",
    logo: { url: "/images/tech/github.png" },
  },
  {
    id: 13,
    name: "Flutter",
    category: "mobile",
    logo: { url: "/images/tech/flutter.png" },
  },
];

export const fixtureFAQs: Array<WithId<FAQ>> = [
  // Mobile Apps
  {
    id: 1,
    category: "Mobile Apps",
    question: "Do you build for iOS, Android, or both? LOCAL FIXTURE",
    answer:
      "Both. We build cross-platform apps with React Native so you ship to iOS and Android from a single codebase — without sacrificing native feel.",
    order: 1,
  },
  {
    id: 2,
    category: "Mobile Apps",
    question: "Can you integrate my app with an existing backend or CRM?",
    answer:
      "Yes. We regularly connect apps to REST and GraphQL APIs, Salesforce, HubSpot, custom ERPs, and payment gateways like Stripe and Paymob.",
    order: 2,
  },
  {
    id: 3,
    category: "Mobile Apps",
    question: "How long does a typical mobile app take to build?",
    answer:
      "An MVP usually takes 10–16 weeks. Full-featured apps with custom backends run 4–6 months. We share a phased timeline after discovery.",
    order: 3,
  },
  {
    id: 4,
    category: "Mobile Apps",
    question: "Do you handle App Store and Google Play submissions?",
    answer:
      "Yes — we manage the full submission process, including app review guidelines, screenshots, metadata, and any compliance requirements.",
    order: 4,
  },
  {
    id: 5,
    category: "Mobile Apps",
    question: "What happens after launch?",
    answer:
      "We offer retainer-based support covering OS updates, bug fixes, performance tuning, and feature iterations. You're never left on your own.",
    order: 5,
  },

  // Corporate Websites
  {
    id: 6,
    category: "Corporate Websites",
    question: "How long does it take to build a website with OJJA?",
    answer:
      "It depends on the project scope. Most corporate websites take around 6–10 weeks from kickoff to launch, while e-commerce platforms can take 12–16 weeks, especially when integrations or custom features are involved. We work in clear, defined phases — design, development, testing, and launch — so you always know where your project stands.",
    order: 1,
  },
  {
    id: 7,
    category: "Corporate Websites",
    question:
      "What's the difference between your corporate websites and e-commerce platforms?",
    answer:
      "Corporate websites focus on brand presentation, lead generation, and trust-building. E-commerce platforms are built around product catalogues, checkout flows, inventory, and conversion optimisation. Both are custom-built — we don't use off-the-shelf themes.",
    order: 2,
  },
  {
    id: 8,
    category: "Corporate Websites",
    question: "Do you work with small businesses or only big brands?",
    answer:
      "Both. We've worked with startups, SMEs, and enterprise clients across Egypt and the region. What matters is that you're serious about growth — not the size of your company.",
    order: 3,
  },
  {
    id: 9,
    category: "Corporate Websites",
    question:
      "Can you redesign our existing website or do you only build from scratch?",
    answer:
      "We do both. If you have an existing site we'll audit it first, then decide together whether a redesign or rebuild makes more sense for your goals.",
    order: 4,
  },
  {
    id: 10,
    category: "Corporate Websites",
    question:
      "Do you handle everything — from design to development to content?",
    answer:
      "Yes. Our team covers UX/UI design, frontend and backend development, CMS setup, copywriting, and post-launch support — all under one roof.",
    order: 5,
  },
  {
    id: 11,
    category: "Corporate Websites",
    question: "What platforms or technologies do you use to build websites?",
    answer:
      "We use Next.js, React, and headless CMS platforms like Strapi and Sanity for most projects. For simpler sites, we evaluate the best fit per project.",
    order: 6,
  },
  {
    id: 12,
    category: "Corporate Websites",
    question:
      "Can you integrate my ERP, CRM, or custom systems with the website?",
    answer:
      "Yes. We regularly integrate websites with Salesforce, HubSpot, SAP, and custom internal systems via REST and GraphQL APIs.",
    order: 7,
  },
  {
    id: 13,
    category: "Corporate Websites",
    question: "Do you offer digital marketing and SEO services after launch?",
    answer:
      "Yes. We offer ongoing SEO, Google Ads management, and performance marketing through retainer packages so your site keeps generating results after launch.",
    order: 8,
  },

  // eCommerce
  {
    id: 14,
    category: "eCommerce",
    question: "Do you build on Shopify or custom platforms?",
    answer:
      "Both. We build custom e-commerce on Next.js with headless commerce APIs, and we also do Shopify builds when the product catalogue and ops fit that model.",
    order: 1,
  },
  {
    id: 15,
    category: "eCommerce",
    question: "Can you integrate local Egyptian payment gateways?",
    answer:
      "Yes — Paymob, Fawry, Vodafone Cash, and card gateways are all supported. We handle the full payment flow including installment options.",
    order: 2,
  },
  {
    id: 16,
    category: "eCommerce",
    question: "How do you handle inventory and order management?",
    answer:
      "We integrate with your existing ERP or set up a headless OMS. For smaller operations we configure a lightweight CMS-based solution.",
    order: 3,
  },
  {
    id: 17,
    category: "eCommerce",
    question: "Can you migrate my existing store to a new platform?",
    answer:
      "Yes. We handle full data migrations — products, orders, customers, and SEO URLs — with zero downtime using staged cutover.",
    order: 4,
  },

  // Booking Systems
  {
    id: 18,
    category: "Booking Systems",
    question: "What kinds of booking systems do you build?",
    answer:
      "Appointment scheduling, venue and resource reservations, multi-provider calendars, and event ticketing. Each is custom-built to your business rules.",
    order: 1,
  },
  {
    id: 19,
    category: "Booking Systems",
    question: "Can the system handle real-time availability?",
    answer:
      "Yes. We build with real-time availability logic, conflict prevention, and instant confirmation — no double bookings.",
    order: 2,
  },
  {
    id: 20,
    category: "Booking Systems",
    question: "Do you integrate with Google Calendar or Outlook?",
    answer:
      "Yes. Two-way calendar sync with Google Calendar and Microsoft Outlook is standard. We also support Calendly and Cal.com as scheduling layers.",
    order: 3,
  },
  {
    id: 21,
    category: "Booking Systems",
    question: "Can customers pay at the time of booking?",
    answer:
      "Yes — we wire in payment gateways so deposits or full payments are collected at checkout, with automated receipts and reminders.",
    order: 4,
  },

  // Custom Software
  {
    id: 22,
    category: "Custom Software",
    question: "What kinds of custom software do you build?",
    answer:
      "Internal tools, admin dashboards, workflow automation platforms, client portals, and data-heavy web apps. If it's logic-heavy and needs a custom UI, we build it.",
    order: 1,
  },
  {
    id: 23,
    category: "Custom Software",
    question: "Can you work with our existing team?",
    answer:
      "Absolutely. We embed with in-house product, design, and engineering teams regularly — async-first, with regular syncs to keep momentum.",
    order: 2,
  },
  {
    id: 24,
    category: "Custom Software",
    question: "How do you handle scope changes mid-project?",
    answer:
      "We work in defined sprints. Scope changes are logged, estimated, and approved before we build — no surprise invoices.",
    order: 3,
  },
  {
    id: 25,
    category: "Custom Software",
    question: "Do you provide documentation and source code ownership?",
    answer:
      "Yes. You own the code from day one. We deliver full documentation, CI/CD setup, and handoff training so your team can take over confidently.",
    order: 4,
  },

  // Media Buying
  {
    id: 26,
    category: "Media Buying",
    question: "Which platforms do you run ads on?",
    answer:
      "Meta (Facebook & Instagram), Google, TikTok, Snapchat, and programmatic display. We pick channels based on where your audience actually converts.",
    order: 1,
  },
  {
    id: 27,
    category: "Media Buying",
    question: "Do you handle creative as well as buying?",
    answer:
      "Yes. Our team covers ad creative, copy, A/B testing, and media buying — so the message and placement are aligned from the start.",
    order: 2,
  },
  {
    id: 28,
    category: "Media Buying",
    question: "What's your minimum ad spend?",
    answer:
      "We work with budgets starting from EGP 20,000/month in ad spend. Below that, the optimisation margin doesn't justify a managed service.",
    order: 3,
  },
  {
    id: 29,
    category: "Media Buying",
    question: "How do you report on performance?",
    answer:
      "Weekly performance reports with ROAS, CPA, CTR, and spend breakdowns — plus a monthly strategy review to adjust targeting and creative.",
    order: 4,
  },

  // SEO / AGO
  {
    id: 30,
    category: "SEO / AGO",
    question: "Do you do technical SEO or just content?",
    answer:
      "Both. We cover technical audits (Core Web Vitals, crawlability, structured data), on-page optimisation, and content strategy — all in one engagement.",
    order: 1,
  },
  {
    id: 31,
    category: "SEO / AGO",
    question: "How long before we see results from SEO?",
    answer:
      "For competitive keywords, expect meaningful movement in 3–5 months. Technical fixes and quick wins often show results within 4–6 weeks.",
    order: 2,
  },
  {
    id: 32,
    category: "SEO / AGO",
    question: "Do you offer Arabic SEO?",
    answer:
      "Yes. We optimise for Arabic search intent, handle RTL technical requirements, and build Arabic content strategies targeting Egyptian and regional audiences.",
    order: 3,
  },
  {
    id: 33,
    category: "SEO / AGO",
    question: "What's AGO?",
    answer:
      "AGO stands for AI-Generative Optimisation — structuring your content so it surfaces in AI-powered search results (Google SGE, ChatGPT, Perplexity). It's the next layer beyond traditional SEO.",
    order: 4,
  },
];

export const fixtureTalks: Talk[] = [
  {
    slug: "design-for-conversion-not-compliments",
    title: "Design for Conversion, Not Compliments",
    publishedAt: "2027-02-21T00:00:00.000Z",
    excerpt:
      "Great design isn't the one that gets likes — it's the one that gets results. This talk breaks down how aesthetic decisions directly impact user behavior, trust, and revenue, and why 'pretty' alone is a business risk.",
    category: "Design",
    readTime: 6,
    featured: true,
    cover: {
      url: "/images/talks/featured.webp",
      alternativeText: "Design for Conversion talk",
    },
    sections: [
      {
        __component: "blocks.rich-text" as const,
        body: [
          {
            type: "paragraph",
            children: [{ type: "text", text: "Great design isn't about aesthetics alone — it's about outcomes. Every visual decision carries a behavioral consequence, and the most dangerous design is the kind that looks good but converts poorly." }],
          },
          {
            type: "heading",
            level: 2,
            children: [{ type: "text", text: "Why Pretty Isn't Enough" }],
          },
          {
            type: "paragraph",
            children: [{ type: "text", text: "Clients often measure design success by how much they like the result. But the real question is: does it work? Does it guide users toward action, build trust, and remove friction?" }],
          },
        ],
      },
    ],
  },
  {
    slug: "why-agency-websites-fail-ux",
    title: "Why Most Agency Websites Fail Their Own UX",
    publishedAt: "2026-12-15T00:00:00.000Z",
    excerpt:
      "Agencies often promote UX but overlook it on their own websites. This article analyzes typical agency website errors and highlights what clients seek in a digital partner.",
    category: "Design",
    readTime: 4,
    cover: {
      url: "/images/talks/agency-ux.webp",
      alternativeText: "Agency UX talk",
    },
  },
  {
    slug: "responsive-design-2027",
    title: "Responsive Design in 2027",
    publishedAt: "2027-01-02T00:00:00.000Z",
    excerpt:
      "Agencies often promote UX but overlook it on their own websites. This article analyzes typical agency website errors and highlights what clients seek in a digital partner.",
    category: "Development",
    readTime: 5,
    cover: {
      url: "/images/talks/responsive.webp",
      alternativeText: "Responsive design talk",
    },
  },
  {
    slug: "brand-identity-digital-products",
    title: "Building a Cohesive Brand Identity for Digital Products",
    publishedAt: "2026-05-15T00:00:00.000Z",
    excerpt:
      "A strong brand identity is essential for digital products. This article explores strategies for creating a cohesive brand experience across various platforms.",
    category: "Design",
    readTime: 4,
    cover: {
      url: "/images/talks/branding.webp",
      alternativeText: "Brand identity talk",
    },
  },
  {
    slug: "user-research-techniques",
    title: "Understanding User Needs Through Effective Research Techniques",
    publishedAt: "2026-05-15T00:00:00.000Z",
    excerpt:
      "Effective UX research techniques are crucial for understanding user needs. This piece delves into methods that can enhance your design process.",
    category: "Design",
    readTime: 4,
    cover: {
      url: "/images/talks/research.webp",
      alternativeText: "UX Research talk",
    },
  },
  {
    slug: "motion-graphics-ui",
    title: "Elevating User Interfaces with Advanced Motion Graphics",
    publishedAt: "2026-05-15T00:00:00.000Z",
    excerpt:
      "Explore how integrating motion graphics can transform static UIs into engaging, intuitive experiences that guide users and enhance brand perception.",
    category: "Design",
    readTime: 4,
    cover: {
      url: "/images/talks/motion.webp",
      alternativeText: "Motion design talk",
    },
  },
];

export const fixtureCareers: Array<WithId<Career>> = [
  {
    id: 1,
    slug: "product-designer",
    title: "Product Designer",
    team: "Design",
    type: "Full-time",
    location: "On-site",
    remote: true,
    excerpt:
      "Become a part of our dynamic team focused on cutting-edge product design. We value clear communication, maintain a collaborative environment, and give you the autonomy to take charge of your projects.",
    quote: "Innovation Distinguishes Between A Leader And A Follower.",
    sections: [
      {
        heading: "Job Responsibilities",
        body: "Conduct user interviews to understand their needs and preferences.\nAnalyze competitor products to identify strengths and weaknesses.\nUtilize analytics tools to track user behavior and engagement.",
      },
      {
        heading: "Qualifications",
        body: "Conduct user interviews to understand their needs and preferences.\nAnalyze competitor products to identify strengths and weaknesses.\nUtilize analytics tools to track user behavior and engagement.",
      },
      {
        heading: "Benefits",
        body: "Conduct user interviews to understand their needs and preferences.\nAnalyze competitor products to identify strengths and weaknesses.\nUtilize analytics tools to track user behavior and engagement.",
      },
      {
        heading: "Why join MitchDesigns?",
        body: "Conduct user interviews to understand their needs and preferences.\nAnalyze competitor products to identify strengths and weaknesses.\nUtilize analytics tools to track user behavior and engagement.",
      },
      {
        heading: "Our design principles",
        body: "Focus on user-centered design to enhance usability.\nMaintain a clean and modern aesthetic to appeal to contemporary tastes.\nEnsure accessibility for all users, regardless of their abilities.",
      },
      {
        heading: "How do we ensure project success?",
        body: "Define clear goals and objectives at the outset.\nFoster open communication among team members and stakeholders.\nIterate based on feedback to refine the design and functionality.",
      },
    ],
    publishedAt: "2026-05-01T00:00:00.000Z",
  },
  {
    id: 2,
    slug: "ui-ux-designer",
    title: "UI/UX Designer",
    team: "Design",
    type: "Part-time",
    location: "Remote",
    remote: true,
    excerpt: "Seeking a skilled UI/UX designer to enhance user experiences.",
    publishedAt: "2026-05-01T00:00:00.000Z",
  },
  {
    id: 3,
    slug: "visual-designer",
    title: "Visual Designer",
    team: "Design",
    type: "Contract",
    location: "Hybrid",
    remote: false,
    excerpt: "Hiring a visual designer to create compelling graphics.",
    publishedAt: "2026-05-01T00:00:00.000Z",
  },
];

// Empty `photo.url` → the card renders its space-grey fallback (no broken
// image). Real entries from Strapi supply a populated photo.
export const fixtureTeam: Array<WithId<TeamMember>> = [
  { id: 1, name: "Team Member", role: "Role", photo: { url: "" } },
  { id: 2, name: "Team Member", role: "Role", photo: { url: "" } },
];

export const fixtureAboutPage: AboutContent = {
  hero: {
    badge: "Since 2005",
    title: "About\nMitchDesigns",
    description:
      "We design and build high-performance digital platforms that turn user engagement into measurable business results.",
    panel: {
      title: "Clarity Before Creativity",
      body: "Founded in 2005, MitchDesigns empowers businesses across industries with custom digital solutions tailored for long-term impact.",
    },
    images: [
      { url: "/images/about/about-1.webp", alt: "About MitchDesigns" },
      { url: "/images/about/about-2.webp", alt: "About MitchDesigns" },
    ],
  },
  metrics: [
    { value: "20+", label: "Years of experience," },
    { value: "400+", label: "Projects Delivered" },
    { value: "30+", label: "Dedicated Experts" },
  ],
  approach: {
    eyebrow: "How We Work",
    title:
      "Every project follows a structured framework designed to align business objectives.",
    body: "At Mitch Designs, design is seen as the meeting point of a business’s goals and the customer’s needs. That’s why we put your customer at the center of our design process. We act as your customer advocates to design and develop digital products that help you scale your business.",
    image: null,
  },
  innovate: {
    text: "Innovate Or Die",
    photos: [],
  },
  team: {
    badge: "Our Team",
    heading:
      "We believe that positive change comes from diverse minds working together to make a difference.",
    groupPhoto: null,
  },
  story: {
    eyebrow: "Our Story",
    title:
      "Since 2005, we’ve partnered with over 200 clients across 15 industries to innovate and transform the digital landscape in Egypt and the MENA region.",
    cards: [
      {
        image: null,
        body: "We believe that positive change comes from diverse minds working together to make a difference.",
      },
      {
        image: null,
        body: "We act as your customer advocates to develop products that help you scale efficiently.",
      },
    ],
  },
};

export const fixtureHomePage: HomePageData = {
  hero: {
    eyebrow:
      "MitchDesigns — Website & Mobile App Design Company Based in Egypt",
    headline: "Start Building Digital Experiences that",
    rotatingWords: ["Convert", "Engage", "Interact", "Succeed", "Grow"],
  },
  about: {
    body: "Since 2005, I've built Mitch Designs in Egypt with one belief, businesses deserve more than templates. As a website design company in Egypt, we craft custom design that turns into results. From mobile app development to e-commerce solutions, from custom platforms to booking systems, every project is built for conversions.\n\nWe don't chase “pretty” — we chase performance marketing, SEO, and measurable success. For us, it's always about the user, the customer, and their experience. That's why Mitch Designs has become the partner businesses trust when growth can't wait.",
    signature: "Mitch",
    stats: [
      { value: "20+", unit: "Years", label: "Years of experience," },
      { value: "400+", unit: "Projects", label: "Delivered with Impact" },
      { value: "30+", unit: "Experts", label: "Dedicated Team Members" },
    ],
    cta: { label: "About Us", href: "/about" },
  },
  orderbaseOverview: {
    heading: "A Platform to Manage Your Food Business Operation",
    description:
      "OrderBase brings everything into one connected system giving you full control, real-time visibility, and smoother operations from kitchen to customer.",
    descriptionHighlight: "OrderBase",
    countValue: "+5",
    countLabel:
      "Active Well-known food businesses in Egypt already run on Orderbase",
    cta: { label: "Know More", href: "/orderbase" },
    cards: [
      {
        icon: "bell",
        title: "No More Stock Confusion",
        description:
          "Real-time inventory alerts so you never run out mid-service.",
      },
      {
        icon: "dashboard",
        title: "All Orders in One Place",
        description:
          "Aggregate orders from every channel into one clean dashboard.",
      },
      {
        icon: "scooter",
        title: "Delivery Under Control",
        description:
          "Track every rider, every order, every minute from dispatch to door.",
      },
      {
        icon: "layout-grid",
        title: "Clear Operational Visibility",
        description: "Shift reports and live KPIs to keep your team aligned.",
      },
    ],
  },
};

export const fixtureCtaBanner: CtaBannerData = {
  title: "Ready For Your Next Project?",
  description:
    "Get a fully detailed proposal tailored to your business and users. After a short discovery meeting, our team prepares everything within 48 hours.",
  cta: { label: "Get Detailed Proposal", href: LEADS_URL },
  bgImage: "/images/cta-bg.webp",
};

export const fixtureCareersPage: CareersPageData = {
  hero: {
    eyebrow: "Join Our Team",
    title: "Be Part Of Our Team",
    description:
      "Join our team of passionate individuals dedicated to innovative web design. We embrace open communication, flat hierarchies, and empower you with full ownership of your work.",
  },
  drives: [
    { label: "Open Communication" },
    { label: "Flat Hierarchies" },
    { label: "Full Ownership" },
    { label: "Innovative Culture" },
  ],
};

export const fixtureOrderbasePage: OrderbasePageData = {
  "meta": {
    "title": "Orderbase — eCommerce Platform for Food Brands | Mitch Designs",
    "description": "Orderbase is the headless eCommerce operating system for multi-branch food brands. Sell, manage and fulfill orders across every branch from one platform. Built by Mitch Designs, Cairo."
  },
  "nav": {
    "links": [
      {
        "label": "Challenges",
        "href": "#challenges"
      },
      {
        "label": "Platform",
        "href": "#platform"
      },
      {
        "label": "Features",
        "href": "#features"
      },
      {
        "label": "Integrations",
        "href": "#integrations"
      },
      {
        "label": "Pricing",
        "href": "#pricing"
      },
      {
        "label": "Contact",
        "href": "#contact"
      }
    ],
    "ctaLabel": "Talk to us",
    "ctaHref": "https://wa.me/201014430669"
  },
  "hero": {
    "pill": "Headless eCommerce for Food Brands",
    "titleLead": "The eCommerce ",
    "titleAccent": "operating system",
    "titleTail": " for food brands",
    "subtitle": "Built for multi-branch restaurants, bakeries and food stores selling directly to consumers — locally and internationally.",
    "primaryCta": {
      "label": "See pricing & plans",
      "href": "#pricing"
    },
    "secondaryCta": {
      "label": "Explore the platform",
      "href": "#platform"
    },
    "stats": [
      {
        "value": "20",
        "suffix": "+",
        "label": "years building digital platforms"
      },
      {
        "value": "4",
        "label": "flexible plans to launch & scale"
      },
      {
        "value": "D2C",
        "accent": true,
        "label": "own your customers & data"
      }
    ],
    "image": "/images/orderbase/landing/hero-dashboard.png",
    "imageAlt": "Orderbase analytics dashboard on mobile",
    "floatCards": [
      {
        "icon": "cart",
        "title": "Order placed",
        "subtitle": "Branch · 2 min ago"
      },
      {
        "icon": "check",
        "title": "Out for delivery",
        "subtitle": "Nearest branch · live"
      }
    ]
  },
  "ribbon": [
    "ORDER",
    "ONLINE",
    "SHOP",
    "FOOD",
    "EGYPT",
    "D2C",
    "DELIVERY",
    "ORDERBASE"
  ],
  "audience": {
    "eyebrow": "Built for food brands",
    "title": "Designed to sell, manage & fulfill across every branch",
    "lead": "If you sell food, drinks, desserts or groceries, this system is for you.",
    "cards": [
      {
        "num": "01",
        "title": "Operate restaurants, bakeries & dessert brands"
      },
      {
        "num": "02",
        "title": "Sell directly to consumers (D2C)"
      },
      {
        "num": "03",
        "title": "Run multiple branches & fulfill from the nearest location"
      },
      {
        "num": "04",
        "title": "Manage fresh inventory, fast delivery & high order volume"
      }
    ]
  },
  "challenges": {
    "eyebrow": "Your daily challenges",
    "title": "Selling direct is powerful — running it is hard",
    "items": [
      {
        "text": "Orders from your website and mobile app aren't always centralized in one system."
      },
      {
        "text": "Stock differs between branches because of real-time sales and walk-in customers."
      },
      {
        "text": "Customers expect fast checkout and live order tracking — like the delivery apps."
      },
      {
        "text": "Aggregator platforms own your customer data and your marketing insights."
      },
      {
        "text": "Most e-commerce solutions don't understand the complexity of food operations."
      }
    ],
    "image": "/images/orderbase/landing/challenge-bags.png",
    "imageAlt": "Food brand fulfilling multi-branch orders with Orderbase delivery bags"
  },
  "opportunity": {
    "eyebrow": "The opportunity",
    "title": "Growing food brands build their own digital sales channel",
    "lead": "They don't depend only on aggregators. Here's what a growing food brand needs today:",
    "cards": [
      {
        "icon": "phone",
        "title": "Branded web & app",
        "description": "Your own website and mobile app that customers recognize and trust."
      },
      {
        "icon": "stopwatch",
        "title": "Fast, beautiful ordering",
        "description": "A quick, well-designed ordering experience that reflects your brand."
      },
      {
        "icon": "cube",
        "title": "Real-time stock",
        "description": "Inventory synced across all branches to avoid selling unavailable items."
      },
      {
        "icon": "shield",
        "title": "Own your data",
        "description": "Full ownership of customer data to build loyalty and repeat orders."
      },
      {
        "icon": "rocket",
        "title": "Launch & scale",
        "description": "The ability to launch quickly and scale your channel independently."
      }
    ]
  },
  "platform": {
    "eyebrow": "Introducing Orderbase",
    "titleLead": "Your digital operating system for ",
    "titleAccent": "food brands",
    "lead": "Orderbase powers your website and mobile app while managing orders, stock and operations across all your branches.",
    "categories": [
      {
        "icon": "plate",
        "label": "Restaurants & food brands"
      },
      {
        "icon": "bag",
        "label": "Grocery & packaged food"
      },
      {
        "icon": "cupcake",
        "label": "Dessert shops & bakeries"
      },
      {
        "icon": "store",
        "label": "Multi-branch retail food"
      }
    ],
    "handleTitle": "Built to handle",
    "handleItems": [
      "High-volume order handling",
      "Web & mobile ordering",
      "Fast, branch-based delivery",
      "Real-time inventory tracking",
      "Loyalty & repeat purchase growth"
    ]
  },
  "showcase": {
    "eyebrow": "One platform, every screen",
    "titleLead": "Not a website. Your eCommerce ",
    "titleAccent": "operating system.",
    "image": "/images/orderbase/landing/showcase-mockup.png",
    "imageAlt": "Orderbase dashboard on laptop and mobile app",
    "features": [
      {
        "icon": "network",
        "title": "Sell & fulfill from all branches",
        "description": "One unified system across every location and channel."
      },
      {
        "icon": "cube",
        "title": "Real-time stock across branches",
        "description": "Never sell what you can't fulfill — inventory stays in sync."
      },
      {
        "icon": "pin",
        "title": "Live order tracking",
        "description": "Give customers the delivery-app experience they expect."
      },
      {
        "icon": "medal",
        "title": "Customers, wallets & loyalty",
        "description": "Accounts, points, order history and repeat-purchase growth."
      }
    ]
  },
  "core": {
    "eyebrow": "Core features",
    "title": "Everything that runs your digital food business",
    "cards": [
      {
        "num": "01",
        "title": "Unified order fulfillment",
        "description": "Sell and fulfill orders from all your branches in one system."
      },
      {
        "num": "02",
        "title": "Customer management",
        "description": "Accounts, wallets, loyalty points and full order history."
      },
      {
        "num": "03",
        "title": "Real-time inventory",
        "description": "Manage stock live across every branch."
      },
      {
        "num": "04",
        "title": "Order tracking",
        "description": "Live order tracking for every customer."
      },
      {
        "num": "05",
        "title": "Promotions engine",
        "description": "Control promos, vouchers, flash sales and marketing campaigns."
      },
      {
        "num": "06",
        "title": "Deep integrations",
        "description": "ERP, payment gateways and delivery operations, connected."
      }
    ]
  },
  "featureTabs": {
    "eyebrow": "Complete eCommerce features",
    "title": "Everything you need to run & grow",
    "lead": "A full commerce toolkit, purpose-built for food operations.",
    "tabs": [
      {
        "id": "orders",
        "label": "Checkout & Orders",
        "items": [
          {
            "label": "Fast checkout designed for high conversion",
            "infoKey": "fastCheckout"
          },
          {
            "label": "Guest checkout and registered accounts",
            "infoKey": "guestCheckout"
          },
          {
            "label": "Delivery notes and special instructions",
            "infoKey": "deliveryNotes"
          },
          {
            "label": "Multiple payment methods (card, cash, wallet)",
            "infoKey": "paymentMethods"
          },
          {
            "label": "Scheduled delivery with time slots",
            "infoKey": "scheduledDelivery"
          },
          {
            "label": "Store pickup / click-and-collect",
            "infoKey": "pickup"
          },
          {
            "label": "Wallet and stored credit",
            "infoKey": "wallet"
          },
          {
            "label": "Loyalty points and rewards",
            "infoKey": "loyalty"
          }
        ]
      },
      {
        "id": "catalog",
        "label": "Product Catalog",
        "items": [
          {
            "label": "Product options (sizes, flavors, attributes)",
            "infoKey": "variants"
          },
          {
            "label": "Add-ons and extras (sauces, toppings, packaging)",
            "infoKey": "addons"
          },
          {
            "label": "Bundles, combos and meal boxes",
            "infoKey": "bundlesCombos"
          },
          {
            "label": "Build Your Own / customize product with step-based options",
            "infoKey": "byo"
          },
          {
            "label": "Upsells and product add-ons",
            "infoKey": "upsells"
          },
          {
            "label": "Product search, filters, sorting and comparison",
            "infoKey": "searchFilter"
          }
        ]
      },
      {
        "id": "customer",
        "label": "Customer Features",
        "items": [
          {
            "label": "Easy account creation using mobile number",
            "infoKey": "mobileSignup"
          },
          {
            "label": "Favorites and wishlist",
            "infoKey": "wishlist"
          },
          {
            "label": "Reorder and repeat orders",
            "infoKey": "reorder"
          },
          {
            "label": "Address book for faster checkout",
            "infoKey": "addressBook"
          },
          {
            "label": "Wallet and stored credit",
            "infoKey": "wallet"
          },
          {
            "label": "Loyalty points and rewards",
            "infoKey": "loyalty"
          }
        ]
      },
      {
        "id": "promos",
        "label": "Promotions Engine",
        "items": [
          {
            "label": "Promo codes (fixed, percentage, free delivery)",
            "infoKey": "promoCodes"
          },
          {
            "label": "Minimum order rules and usage limits",
            "infoKey": "minOrderRules"
          },
          {
            "label": "Automatic rule-based discounts",
            "infoKey": "autoDiscounts"
          },
          {
            "label": "Flash sales and time-based offers",
            "infoKey": "flashSales"
          },
          {
            "label": "Sale pricing with strike-through display",
            "infoKey": "salePricing"
          },
          {
            "label": "Vouchers and gift cards",
            "infoKey": "vouchers"
          },
          {
            "label": "Campaign rules by product, category, branch or time window",
            "infoKey": "campaignRules"
          }
        ]
      },
      {
        "id": "reports",
        "label": "Reporting & Insights",
        "items": [
          {
            "label": "Sales reports by day, branch, product or channel",
            "infoKey": "salesReports"
          },
          {
            "label": "Revenue tracking and performance dashboards",
            "infoKey": "revenueDash"
          },
          {
            "label": "Order volume and operational reports",
            "infoKey": "opsReports"
          },
          {
            "label": "Customer behavior and purchase analytics",
            "infoKey": "custAnalytics"
          },
          {
            "label": "Product performance and best-selling items",
            "infoKey": "productPerf"
          },
          {
            "label": "Branch-level reporting and comparisons",
            "infoKey": "branchReports"
          }
        ]
      }
    ]
  },
  "payments": {
    "eyebrow": "Payments",
    "title": "Secure payments, saved for one-tap reorder",
    "lead": "Give customers the frictionless checkout they expect — with cards saved safely in your mobile app for instant repeat orders.",
    "features": [
      {
        "icon": "card",
        "title": "Save cards for one-tap reorder",
        "description": "Cards are securely tokenized (PCI-compliant — no raw card data stored), so customers save a card once in your app and reorder in a single tap."
      },
      {
        "icon": "shield",
        "title": "Payment inside your platform",
        "description": "Customers pay right inside your website or app via our direct MPGS / Crédit Agricole integration — no redirect to a third-party processor. One seamless, consistent experience end to end."
      },
      {
        "icon": "wallet",
        "title": "Wallet, Apple Pay & cash",
        "description": "In-app wallet and stored credit, Apple Pay, cards, and cash on delivery — whatever your customers prefer."
      },
      {
        "icon": "globe",
        "title": "Multi-currency gateways",
        "description": "Local and regional gateways across Egypt and the GCC, plus any local payment processor — ready for multiple markets and currencies."
      }
    ],
    "images": [
      {
        "src": "/images/orderbase/landing/pay-phone.png",
        "alt": "Orderbase mobile checkout screen",
        "slot": "phone"
      },
      {
        "src": "/images/orderbase/landing/pay-credit.png",
        "alt": "Credit card details form",
        "slot": "credit"
      },
      {
        "src": "/images/orderbase/landing/pay-wallet.png",
        "alt": "Use wallet balance toggle",
        "slot": "wallet"
      }
    ]
  },
  "integrations": {
    "eyebrow": "Seamless integrations",
    "title": "Connects with the systems you already use",
    "cards": [
      {
        "num": "01",
        "icon": "database",
        "title": "ERP integration",
        "description": "Connect your enterprise systems for end-to-end operations.",
        "chips": [
          "Microsoft Dynamics",
          "SAP",
          "Oracle",
          "Custom ERP"
        ]
      },
      {
        "num": "02",
        "icon": "pos",
        "title": "POS integration",
        "description": "Sync orders, menu and live stock with your in-store point-of-sale system.",
        "chips": [
          "In-store POS",
          "Unified menu & stock",
          "Branch sync"
        ]
      },
      {
        "num": "03",
        "icon": "truck",
        "title": "Shipping & delivery",
        "description": "Connect any shipping or delivery provider you prefer.",
        "chips": [
          "Logistics partners",
          "Delivery fleets",
          "Custom couriers"
        ]
      }
    ]
  },
  "why": {
    "eyebrow": "Who is behind Orderbase",
    "title": "Why Mitch Designs is the right partner",
    "lockupTag": "Software house & digital agency · since 2005",
    "points": [
      {
        "value": "20",
        "suffix": "+",
        "title": "Years of experience",
        "description": "In digital platforms, e-commerce and performance marketing."
      },
      {
        "value": "F&B",
        "title": "Trusted by leaders",
        "description": "By leading food and restaurant brands across Egypt."
      },
      {
        "value": "100%",
        "title": "Full in-house team",
        "description": "UX design, web & mobile development and digital marketing."
      },
      {
        "value": "24/7",
        "title": "Responsive support",
        "description": "A team that speaks the language of your business, not just tech."
      }
    ],
    "banner": "We don't just build systems — we help you grow your sales."
  },
  "pricing": {
    "eyebrow": "Pricing",
    "title": "Start with Orderbase in 4 ways",
    "lead": "Choose the plan that fits where your brand is today — and scale up anytime.",
    "plans": [
      {
        "icon": "planStandard",
        "name": "Standard",
        "tagline": "Launch Fast",
        "audience": "Best for new or small F&B brands starting online.",
        "priceRows": [
          {
            "label": "Setup fee",
            "value": "90,000",
            "unit": "EGP"
          },
          {
            "label": "Monthly",
            "value": "18,000",
            "unit": "EGP"
          }
        ],
        "features": [
          "Essential core store & product catalog",
          "Streamlined cart & fast checkout",
          "Cash + card payments, promo codes",
          "Single-branch inventory & basic reporting",
          "Up to 2 branches"
        ],
        "ctaLabel": "Choose Standard",
        "ctaHref": "#contact",
        "ctaVariant": "outline"
      },
      {
        "icon": "planPro",
        "name": "Pro",
        "tagline": "Custom & Scalable",
        "audience": "Best for growing brands with multiple branches.",
        "featured": true,
        "badge": "★ Most recommended",
        "priceRows": [
          {
            "label": "Setup fee",
            "value": "180,000",
            "unit": "EGP"
          },
          {
            "label": "Monthly base",
            "value": "25,000",
            "unit": "EGP"
          }
        ],
        "gmvNote": "+ 0.8% of monthly GMV above 500,000 EGP",
        "features": [
          "Everything in Standard, plus:",
          "Multi-branch inventory & nearest-branch fulfillment",
          "Fully custom UI/UX & user accounts",
          "Vouchers, flash sales & advanced discounts",
          "ERP, payments, shipping & marketing tracking",
          "Up to 10 branches"
        ],
        "ctaLabel": "Choose Pro",
        "ctaHref": "#contact",
        "ctaVariant": "red"
      },
      {
        "icon": "planElite",
        "name": "Elite",
        "tagline": "Full Digital Infrastructure",
        "audience": "For brands needing the ultimate optimized setup.",
        "priceRows": [
          {
            "label": "Setup fee",
            "value": "280,000",
            "unit": "EGP"
          },
          {
            "label": "Monthly base",
            "value": "40,000",
            "unit": "EGP"
          }
        ],
        "gmvNote": "+ 1.0% of monthly GMV above 1,000,000 EGP",
        "features": [
          "Everything in Pro, plus:",
          "Native iOS & Android mobile app",
          "Membership, loyalty points & wallet system",
          "Apple Pay, tokenized cards, multi-currency",
          "Dedicated account manager & priority support",
          "Up to 30 branches"
        ],
        "ctaLabel": "Choose Elite",
        "ctaHref": "#contact",
        "ctaVariant": "dark"
      },
      {
        "icon": "planCustom",
        "name": "Custom",
        "tagline": "Bespoke",
        "audience": "For enterprises needing a fully tailored build.",
        "priceRows": [
          {
            "label": "Setup fee",
            "value": "Negotiated",
            "small": true
          },
          {
            "label": "Monthly",
            "value": "Negotiated",
            "small": true
          }
        ],
        "gmvNote": "Custom GMV terms, tailored to your volume",
        "features": [
          "Everything in Elite, plus:",
          "Bespoke feature & workflow development",
          "Custom API & third-party integrations",
          "Dedicated infrastructure & white-glove SLA",
          "Multi-region & enterprise scale",
          "30+ branches"
        ],
        "ctaLabel": "Talk to us",
        "ctaHref": "#contact",
        "ctaVariant": "outline"
      }
    ],
    "gmv": {
      "title": "Monthly fee examples by GMV volume",
      "lead": "Transparent scaling — the GMV component applies only above each plan's threshold.",
      "columns": [
        "Monthly GMV",
        "Standard",
        "Pro",
        "Elite"
      ],
      "rows": [
        {
          "cells": [
            "500,000 EGP",
            "18,000",
            "25,000",
            "—"
          ]
        },
        {
          "cells": [
            "1,000,000 EGP",
            "18,000",
            "29,000",
            "40,000"
          ]
        },
        {
          "cells": [
            "2,000,000 EGP",
            "18,000",
            "37,000",
            "50,000"
          ]
        },
        {
          "cells": [
            "3,000,000 EGP",
            "18,000",
            "45,000",
            "60,000"
          ]
        },
        {
          "cells": [
            "5,000,000 EGP",
            "18,000",
            "57,000*",
            "80,000"
          ]
        }
      ],
      "footnote": "* All fees in EGP. The GMV component applies only above each package's stated threshold."
    },
    "compare": {
      "title": "Compare all features",
      "columns": [
        {
          "id": "s",
          "name": "Standard",
          "tagline": "Launch Fast"
        },
        {
          "id": "p",
          "name": "Pro",
          "tagline": "Custom & Scalable",
          "featured": true
        },
        {
          "id": "e",
          "name": "Elite",
          "tagline": "Full Infrastructure"
        },
        {
          "id": "c",
          "name": "Custom",
          "tagline": "Bespoke"
        }
      ],
      "groups": [
        {
          "name": "Storefront & Catalog",
          "rows": [
            {
              "label": "Shop website",
              "key": "shopWebsite",
              "values": [
                true,
                true,
                true,
                true
              ]
            },
            {
              "label": "Mobile app",
              "key": "mobileApp",
              "values": [
                false,
                false,
                true,
                true
              ]
            },
            {
              "label": "Custom interface design",
              "key": "customUi",
              "values": [
                false,
                true,
                true,
                true
              ]
            },
            {
              "label": "Website mobile friendly",
              "key": "mobileFriendly",
              "values": [
                true,
                true,
                true,
                true
              ]
            },
            {
              "label": "Product catalog",
              "key": "catalog",
              "values": [
                true,
                true,
                true,
                true
              ]
            },
            {
              "label": "Product options",
              "key": "variants",
              "values": [
                true,
                true,
                true,
                true
              ]
            },
            {
              "label": "Add-ons & extras",
              "key": "addons",
              "values": [
                true,
                true,
                true,
                true
              ]
            },
            {
              "label": "Bundles & combos",
              "key": "bundlesCombos",
              "values": [
                false,
                true,
                true,
                true
              ]
            },
            {
              "label": "Build your own product",
              "key": "byo",
              "values": [
                false,
                false,
                true,
                true
              ]
            },
            {
              "label": "Search / sort / filter products",
              "key": "searchFilter",
              "values": [
                true,
                true,
                true,
                true
              ]
            },
            {
              "label": "Localization (Efalse/AR)",
              "key": "localization",
              "values": [
                true,
                true,
                true,
                true
              ]
            }
          ]
        },
        {
          "name": "Checkout & Payments",
          "rows": [
            {
              "label": "Fast checkout",
              "key": "fastCheckout",
              "values": [
                true,
                true,
                true,
                true
              ]
            },
            {
              "label": "Payment gateways",
              "key": "paymentGateways",
              "values": [
                true,
                true,
                true,
                true
              ]
            },
            {
              "label": "Wallet system",
              "key": "wallet",
              "values": [
                false,
                false,
                true,
                true
              ]
            },
            {
              "label": "Save credit cards (tokenization)",
              "key": "tokenization",
              "values": [
                false,
                false,
                true,
                true
              ]
            },
            {
              "label": "Apple Pay",
              "key": "applePay",
              "values": [
                false,
                false,
                true,
                true
              ]
            },
            {
              "label": "Multiple currencies",
              "key": "currencies",
              "values": [
                false,
                false,
                true,
                true
              ]
            },
            {
              "label": "Multiple markets (countries)",
              "key": "markets",
              "values": [
                false,
                false,
                true,
                true
              ]
            }
          ]
        },
        {
          "name": "Customers & Loyalty",
          "rows": [
            {
              "label": "User accounts",
              "key": "userAccounts",
              "values": [
                false,
                true,
                true,
                true
              ]
            },
            {
              "label": "Loyalty points",
              "key": "loyalty",
              "values": [
                false,
                false,
                true,
                true
              ]
            },
            {
              "label": "Membership system",
              "key": "membership",
              "values": [
                false,
                false,
                true,
                true
              ]
            },
            {
              "label": "Send orders as a gift",
              "key": "gift",
              "values": [
                false,
                false,
                true,
                true
              ]
            }
          ]
        },
        {
          "name": "Marketing & Promotions",
          "rows": [
            {
              "label": "Promo codes",
              "key": "promoCodes",
              "values": [
                true,
                true,
                true,
                true
              ]
            },
            {
              "label": "Vouchers & gift cards",
              "key": "vouchers",
              "values": [
                false,
                true,
                true,
                true
              ]
            },
            {
              "label": "Flash sales",
              "key": "flashSales",
              "values": [
                false,
                true,
                true,
                true
              ]
            }
          ]
        },
        {
          "name": "Operations & Fulfilment",
          "rows": [
            {
              "label": "Branches",
              "key": "branches",
              "values": [
                "Up to 2",
                "Up to 10",
                "Up to 30",
                "30+"
              ]
            },
            {
              "label": "Order management",
              "key": "orderMgmt",
              "values": [
                true,
                true,
                true,
                true
              ]
            },
            {
              "label": "Stop sale per branch",
              "key": "stopSale",
              "values": [
                true,
                true,
                true,
                true
              ]
            },
            {
              "label": "User roles",
              "key": "userRoles",
              "values": [
                true,
                true,
                true,
                true
              ]
            },
            {
              "label": "Delivery driver app",
              "key": "driverApp",
              "values": [
                true,
                true,
                true,
                true
              ]
            },
            {
              "label": "Pick up from store",
              "key": "pickup",
              "values": [
                false,
                true,
                true,
                true
              ]
            },
            {
              "label": "Shipping & delivery rates",
              "key": "shippingRules",
              "values": [
                true,
                true,
                true,
                true
              ]
            }
          ]
        },
        {
          "name": "Integrations",
          "rows": [
            {
              "label": "ERP integration",
              "key": "erp",
              "values": [
                false,
                true,
                true,
                true
              ]
            },
            {
              "label": "POS integration",
              "key": "pos",
              "values": [
                false,
                true,
                true,
                true
              ]
            }
          ]
        },
        {
          "name": "Reporting & Insights",
          "rows": [
            {
              "label": "Reports & analytics",
              "key": "reports",
              "values": [
                true,
                true,
                true,
                true
              ]
            }
          ]
        },
        {
          "name": "Support & Service",
          "rows": [
            {
              "label": "Technical support",
              "key": "support",
              "values": [
                true,
                true,
                true,
                true
              ]
            },
            {
              "label": "SLA guarantee",
              "key": "sla",
              "values": [
                true,
                true,
                true,
                true
              ]
            },
            {
              "label": "Dedicated eCommerce account manager",
              "key": "accountManager",
              "values": [
                false,
                true,
                true,
                true
              ]
            },
            {
              "label": "Priority support",
              "key": "priority",
              "values": [
                false,
                true,
                true,
                true
              ]
            }
          ]
        }
      ],
      "footnote": "Setup & monthly fees shown in EGP. All plans include localization (EN/AR) and technical support."
    }
  },
  "contact": {
    "eyebrow": "Let's talk",
    "title": "Ready to launch your branded food channel?",
    "lead": "Tell us about your brand and we'll show you exactly how Orderbase fits. Reach us whichever way is easiest.",
    "methods": [
      {
        "icon": "wa",
        "label": "WhatsApp",
        "value": "+20 101 443 0669",
        "href": "https://wa.me/201014430669"
      },
      {
        "icon": "call",
        "label": "Call us",
        "value": "+20 101 443 0669",
        "href": "tel:+201014430669"
      },
      {
        "icon": "mail",
        "label": "Email",
        "value": "agency@mitchdesigns.com",
        "href": "mailto:agency@mitchdesigns.com"
      },
      {
        "icon": "web",
        "label": "Website",
        "value": "www.mitchdesigns.com",
        "href": "https://www.mitchdesigns.com"
      }
    ],
    "formTitle": "Request a demo",
    "formNote": "We'll reply via WhatsApp or email within one business day.",
    "planOptions": [
      "Not sure yet",
      "Standard — Launch Fast",
      "Pro — Custom & Scalable",
      "Elite — Full Infrastructure",
      "Custom — Bespoke"
    ],
    "whatsappNumber": "201014430669",
    "submitLabel": "Send via WhatsApp"
  },
  "footer": {
    "tagline": "The headless eCommerce operating system for multi-branch food brands. Built by Mitch Designs — Cairo, Egypt.",
    "columns": [
      {
        "title": "Explore",
        "links": [
          {
            "label": "Platform",
            "href": "#platform"
          },
          {
            "label": "Features",
            "href": "#features"
          },
          {
            "label": "Integrations",
            "href": "#integrations"
          },
          {
            "label": "Pricing",
            "href": "#pricing"
          }
        ]
      },
      {
        "title": "Get in touch",
        "links": [
          {
            "label": "WhatsApp",
            "href": "https://wa.me/201014430669"
          },
          {
            "label": "+20 101 443 0669",
            "href": "tel:+201014430669"
          },
          {
            "label": "agency@mitchdesigns.com",
            "href": "mailto:agency@mitchdesigns.com"
          },
          {
            "label": "www.mitchdesigns.com",
            "href": "https://www.mitchdesigns.com"
          }
        ]
      }
    ],
    "bottomLeft": "Mitch Designs · Software House & Digital Agency · 22 El Horeya Street, Heliopolis, Cairo",
    "bottomRight": "Orderbase™ — eCommerce for Food Brands"
  }
};
