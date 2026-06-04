/**
 * Local fixtures — used as a fallback when Strapi is unreachable (e.g. on
 * first run before Strapi is provisioned). Shapes match `lib/cms/types`.
 * Remove or trim once Strapi has real content.
 */
import type {
  AboutContent,
  BlogSection,
  Career,
  CaseStudy,
  ClientLogo,
  CtaBannerData,
  FAQ,
  HomePageData,
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
    order: 1,
  },
  {
    id: 2,
    title: "Tailor-Made Digital Systems",
    body: "We don't rely on templates. We build from the ground up — fully custom platforms that match how your business operates, not the other way around.",
    order: 2,
  },
  {
    id: 3,
    title: "Smooth Tech Integration",
    body: "From ERPs and CRMs to payments and logistics — we connect every moving part into a smooth, automated system.",
    order: 3,
  },
  {
    id: 4,
    title: "Design That Drives Business",
    body: "Our designs are not just beautiful — they're designed and built for growth, clarity, and conversion.",
    order: 4,
  },
  {
    id: 5,
    title: "Partnership After Launch",
    body: "We don't disappear after go-live. Our shared support team and monthly retainer model keep every website secure, updated, and optimized.",
    order: 5,
  },
  {
    id: 6,
    title: "Performance Mindset",
    body: "We measure success by real impact — conversions, traffic, and operational efficiency — not vanity metrics.",
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
    intro:
      "Since 2005, I've built Mitch Designs in Egypt with one belief, businesses deserve more than templates. As a website design company in Egypt, we craft custom design that turns in",
    body: "to results. From mobile app development to e-commerce solutions, from custom platforms to booking systems, every project is built for conversions.\n\nWe don't chase “pretty” — we chase performance marketing, SEO, and measurable success. For us, it's always about the user, the customer, and their experience. That's why Mitch Designs has become the partner businesses trust when growth can't wait.",
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
  cta: { label: "Get Detailed Proposal", href: "/quote" },
  bgImage: "/images/cta-bg.webp",
};
