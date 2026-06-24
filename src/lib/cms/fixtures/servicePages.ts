import type { Service, ServicePageData } from "../types";
import { LEADS_URL } from "@/config/nav";

export const fixtureServicePages: Record<Service["slug"], ServicePageData> = {
  corporate: {
    hero: {
      title: "Corporate Websites That Work as Hard as You Do",
      subTitle: "Corporate Website",
      description:
        "We design and build custom corporate websites on Next.js — no templates, no shortcuts. Every page is crafted for lead generation, brand clarity, and blazing performance.",
      cta: { label: "Get a Proposal", href: LEADS_URL },
    },
    prototypes: {
      image: "/images/services/corporate/prototype.webp",
      imageAlt: "Corporate website prototype screens",
      backgroundColor: "bg-panel",
    },
    weGotYou: {
      title: "We've Got You Covered from Strategy to Launch",
      titleHighlights: ["Strategy", "Launch"],
      label: "Full-Service Delivery",
      description:
        "From discovery workshops and UX strategy to pixel-perfect build and post-launch support — we own every phase so you don't have to manage multiple vendors.",
      image: "/images/services/corporate/we-got-you.webp",
      imageAlt: "Team collaboration on a corporate website project",
      cta: { label: "See How We Work", href: "/about" },
      imagePosition: "right",
    },
    whyUs: {
      title: "Why Leading Businesses Choose MitchDesigns",
      description: "Eight reasons our clients renew, refer, and grow with us.",
      variant: "grid",
      cards: [
        {
          title: "No-Template Guarantee",
          image: "/images/services/corporate/why-1.webp",
          imageAlt: "Custom design illustration",
          description:
            "Every design is built from scratch based on your brand, audience, and goals.",
        },
        {
          title: "Next.js Performance",
          image: "/images/services/corporate/why-2.webp",
          imageAlt: "Performance metrics chart",
          description:
            "Core Web Vitals-first builds that load fast and rank higher on Google.",
        },
        {
          title: "Headless CMS Ready",
          image: "/images/services/corporate/why-3.webp",
          imageAlt: "CMS dashboard interface",
          description:
            "Your team can update content without touching code — forever.",
        },
        {
          title: "Conversion-Optimised UX",
          image: "/images/services/corporate/why-4.webp",
          imageAlt: "UX wireframe and heatmap",
          description:
            "Every click path is designed to move visitors toward a decision.",
        },
        {
          title: "SEO From Day One",
          image: "/images/services/corporate/why-5.webp",
          imageAlt: "SEO ranking graph",
          description:
            "Technical SEO, semantic HTML, and schema markup baked in at build time.",
        },
        {
          title: "Arabic & RTL Support",
          image: "/images/services/corporate/why-6.webp",
          imageAlt: "Arabic website layout",
          description:
            "Full bilingual support with proper RTL layout and localised content strategy.",
        },
        {
          title: "Post-Launch Partnership",
          image: "/images/services/corporate/why-7.webp",
          imageAlt: "Ongoing support illustration",
          description:
            "We stay on as your growth partner — not just a one-off agency.",
        },
        {
          title: "MENA Market Expertise",
          image: "/images/services/corporate/why-8.webp",
          imageAlt: "MENA region map graphic",
          description:
            "Deep understanding of Egyptian and Gulf market expectations and buyer behaviour.",
        },
      ],
    },
    process: {
      title: "Our Proven 6-Step Process",
      description:
        "From your first brief to a live site — here's exactly what happens.",
      processCards: [
        {
          stepNumber: 1,
          title: "Discovery & Strategy",
          image: "/images/services/corporate/process-1.webp",
          imageAlt: "Discovery workshop",
          description: [
            "Stakeholder interviews and competitor analysis",
            "Define goals, KPIs, and user personas",
            "Content audit and information architecture",
          ],
        },
        {
          stepNumber: 2,
          title: "UX & Information Architecture",
          image: "/images/services/corporate/process-2.webp",
          imageAlt: "UX wireframes",
          description: [
            "Sitemaps and user journey mapping",
            "Low-fidelity wireframes for all key pages",
            "Stakeholder review and sign-off",
          ],
        },
        {
          stepNumber: 3,
          title: "UI Design",
          image: "/images/services/corporate/process-3.webp",
          imageAlt: "High-fidelity UI design",
          description: [
            "High-fidelity Figma designs with your brand system",
            "Responsive layouts for desktop, tablet, and mobile",
            "Design tokens and component library handoff",
          ],
        },
        {
          stepNumber: 4,
          title: "Development",
          image: "/images/services/corporate/process-4.webp",
          imageAlt: "Code editor on a laptop",
          description: [
            "Next.js build with headless CMS integration",
            "Animations, micro-interactions, and accessibility",
            "Weekly demos and asynchronous feedback rounds",
          ],
        },
        {
          stepNumber: 5,
          title: "QA & Performance",
          image: "/images/services/corporate/process-5.webp",
          imageAlt: "Browser QA testing",
          description: [
            "Cross-browser and device testing",
            "Lighthouse audit — 90+ on all Core Web Vitals",
            "Accessibility audit (WCAG 2.1 AA)",
          ],
        },
        {
          stepNumber: 6,
          title: "Launch & Handover",
          image: "/images/services/corporate/process-6.webp",
          imageAlt: "Launch celebration",
          description: [
            "DNS migration and zero-downtime deployment",
            "CMS training session for your team",
            "30-day post-launch monitoring and bug fixes",
          ],
        },
      ],
    },
    support: {
      title: "Full Support, Every Step of the Way",
      cards: [
        {
          title: "Dedicated Project Manager",
          image: "/images/services/corporate/support-1.webp",
          imageAlt: "Project manager icon",
          description:
            "One point of contact from kick-off to handover — no chasing multiple people.",
        },
        {
          title: "Async-First Communication",
          image: "/images/services/corporate/support-2.webp",
          imageAlt: "Communication tools",
          description:
            "Loom videos, Notion docs, and Slack updates keep everyone aligned without meetings.",
        },
        {
          title: "Staging Environment",
          image: "/images/services/corporate/support-3.webp",
          imageAlt: "Staging server",
          description:
            "Review every change in a private staging URL before anything goes live.",
        },
        {
          title: "Post-Launch Retainer",
          image: "/images/services/corporate/support-4.webp",
          imageAlt: "Retainer partnership",
          description:
            "Optional monthly retainer for content updates, new features, and growth experiments.",
        },
      ],
    },
  },

  ecommerce: {
    hero: {
      title: "eCommerce Stores Built to Sell",
      subTitle: "eCommerce Development",
      description:
        "Custom storefronts with seamless checkout, local payment gateways (Paymob, Fawry), and conversion-optimised UX. Built on Next.js — fast, scalable, and yours.",
      image: "/images/services/ecommerce/hero.webp",
      imageAlt: "eCommerce store product page on mobile and desktop",
      cta: { label: "Start Your Store", href: LEADS_URL },
    },
    prototypes: {
      image: "/images/services/ecommerce/prototype.webp",
      imageAlt: "eCommerce UI prototype screens",
      backgroundColor: "bg-panel",
    },
    weGotYou: {
      title: "Everything Your Store Needs to Compete and Convert",
      titleHighlights: ["Compete", "Convert"],
      label: "End-to-End eCommerce",
      description:
        "From product catalogue and search to cart, checkout, and post-purchase flows — we design and build every touchpoint with conversion as the north star.",
      image: "/images/services/ecommerce/we-got-you.webp",
      imageAlt: "eCommerce conversion flow diagram",
      cta: { label: "See Our Work", href: "/case-studies" },
      imagePosition: "right",
    },
    whyUs: {
      title: "Why Smart Brands Build With MitchDesigns",
      variant: "grid",
      cards: [
        {
          title: "Local Payment Gateways",
          image: "/images/services/ecommerce/why-1.webp",
          imageAlt: "Payment gateway logos",
          description:
            "Paymob, Fawry, and card payments integrated out of the box.",
        },
        {
          title: "Mobile-First Checkout",
          image: "/images/services/ecommerce/why-2.webp",
          imageAlt: "Mobile checkout flow",
          description:
            "70%+ of MENA purchases happen on mobile — every pixel is optimised for it.",
        },
        {
          title: "Blazing Fast Catalogue",
          image: "/images/services/ecommerce/why-3.webp",
          imageAlt: "Fast loading product grid",
          description:
            "ISR and edge caching keep thousands of products loading in milliseconds.",
        },
        {
          title: "Advanced Filtering & Search",
          image: "/images/services/ecommerce/why-4.webp",
          imageAlt: "Search and filter UI",
          description:
            "Faceted filters, full-text search, and smart sort options that shoppers expect.",
        },
        {
          title: "Custom Promotions Engine",
          image: "/images/services/ecommerce/why-5.webp",
          imageAlt: "Discount code system",
          description:
            "Flash sales, bundle offers, and discount codes built for your specific rules.",
        },
        {
          title: "Inventory & Order Management",
          image: "/images/services/ecommerce/why-6.webp",
          imageAlt: "Order management dashboard",
          description:
            "Real-time stock sync, low-stock alerts, and fulfilment status tracking.",
        },
        {
          title: "SEO Product Pages",
          image: "/images/services/ecommerce/why-7.webp",
          imageAlt: "Product SEO setup",
          description:
            "Schema markup, canonical URLs, and optimised meta for every product.",
        },
        {
          title: "Analytics & Attribution",
          image: "/images/services/ecommerce/why-8.webp",
          imageAlt: "eCommerce analytics dashboard",
          description:
            "GA4 eCommerce events, GTM, and Meta Pixel wired from day one.",
        },
      ],
    },
    featuresSimplified: {
      title: "Every Feature Your Store Needs",
      description:
        "12 core capabilities included in every MitchDesigns eCommerce build.",
      image: "/images/services/ecommerce/features.webp",
      imageAlt: "eCommerce feature overview",
      featureCards: [
        {
          title: "Product Catalogue",
          description:
            "Unlimited products with variants, images, and custom attributes.",
        },
        {
          title: "Smart Search",
          label: "Popular",
          description:
            "Algolia-powered search with typo tolerance and instant results.",
        },
        {
          title: "Wishlist & Save for Later",
          description: "Let shoppers curate and return to convert.",
        },
        {
          title: "Guest & Account Checkout",
          description:
            "Frictionless for first-timers, rewarding for returners.",
        },
        {
          title: "Paymob & Fawry Integration",
          label: "Popular",
          description:
            "Egypt's leading payment rails, fully integrated and tested.",
        },
        {
          title: "Order Tracking",
          description: "Real-time status updates via SMS and email.",
        },
        {
          title: "Returns Management",
          description: "Automated returns flow with label generation.",
        },
        {
          title: "Multi-Currency Support",
          label: "New",
          description: "EGP, AED, SAR, and USD with live FX rates.",
        },
        {
          title: "Abandoned Cart Recovery",
          description: "Automated email sequences to recover lost revenue.",
        },
        {
          title: "Product Reviews",
          description:
            "Star ratings and verified buyer reviews with moderation.",
        },
        {
          title: "Upsell & Cross-Sell",
          label: "Trending",
          description:
            "Algorithmic recommendations that increase average order value.",
        },
        {
          title: "Admin Dashboard",
          description: "Full-featured backoffice built for your ops team.",
        },
      ],
    },
    support: {
      title: "We Support You Beyond Launch",
      cards: [
        {
          title: "Payment Gateway Setup",
          image: "/images/services/ecommerce/support-1.webp",
          imageAlt: "Payment configuration",
          description:
            "We handle merchant onboarding, API keys, and testing — you just sell.",
        },
        {
          title: "Staff Training",
          image: "/images/services/ecommerce/support-2.webp",
          imageAlt: "Team training session",
          description:
            "Hands-on training for your team on managing products, orders, and promotions.",
        },
        {
          title: "Performance Monitoring",
          image: "/images/services/ecommerce/support-3.webp",
          imageAlt: "Performance dashboard",
          description:
            "We monitor Core Web Vitals and alert you before a slowdown hits conversions.",
        },
        {
          title: "Growth Sprints",
          image: "/images/services/ecommerce/support-4.webp",
          imageAlt: "Growth experiments",
          description:
            "Monthly CRO experiments — A/B tests, checkout tweaks, and feature rollouts.",
        },
      ],
    },
  },

  custom: {
    hero: {
      title: "Custom Platforms Built Around Your Business Logic",
      subTitle: "Custom Development",
      description:
        "Booking systems, SaaS dashboards, internal tools, and client portals — custom-architected for reliability and designed for the people who use them daily.",
      image: "/images/services/custom/hero.webp",
      imageAlt: "Custom platform dashboard on a large monitor",
      cta: { label: "Discuss Your Project", href: LEADS_URL },
    },
    prototypes: {
      image: "/images/services/custom/prototype.webp",
      imageAlt: "Custom platform prototype wireframes",
      backgroundColor: "bg-panel",
    },
    designsAdapt: {
      title: "Designs That Adapt to Every Device and Context",
      description:
        "We build interfaces that work beautifully — whether your users are on a phone in the field or a wide monitor in the office.",
      cards: [
        {
          title: "Desktop Dashboard",
          description:
            "Dense data layouts with multi-panel navigation built for power users.",
          image: "/images/services/custom/adapt-desktop.webp",
          imageAlt: "Desktop dashboard view",
        },
        {
          title: "Tablet Workflow",
          description:
            "Touch-optimised flows for field staff and hybrid work environments.",
          image: "/images/services/custom/adapt-tablet.webp",
          imageAlt: "Tablet workflow interface",
        },
        {
          title: "Mobile-First Access",
          description:
            "Critical actions available on mobile — approvals, alerts, and quick updates.",
          image: "/images/services/custom/adapt-mobile.webp",
          imageAlt: "Mobile app access screen",
        },
      ],
    },
    moreAbout: {
      title: "Built on Solid Foundations",
      description:
        "Every custom platform we deliver is production-grade — not a prototype dressed up for demos.",
      cards: [
        {
          title: "Role-Based Access Control",
          description:
            "Fine-grained permissions so every user sees exactly what they need and nothing they shouldn't.",
          image: "/images/services/custom/more-1.webp",
          imageAlt: "RBAC permission matrix",
        },
        {
          title: "Real-Time Data",
          description:
            "WebSocket and SSE integrations for live dashboards, notifications, and collaborative editing.",
          image: "/images/services/custom/more-2.webp",
          imageAlt: "Real-time data dashboard",
        },
        {
          title: "Third-Party Integrations",
          description:
            "CRMs, ERPs, payment rails, and communication tools — connected through clean, versioned APIs.",
          image: "/images/services/custom/more-3.webp",
          imageAlt: "Integration connectors diagram",
        },
      ],
    },
    accordion: {
      title: "Common Questions About Custom Platforms",
      image: "/images/services/custom/accordion.webp",
      imageAlt: "Developer working on a custom platform",
      accordion: [
        {
          id: "1",
          title: "How long does a custom platform take to build?",
          content:
            "Most custom platforms take between 3 and 6 months from kick-off to launch, depending on scope and integrations. We scope in phases so you can launch a working MVP faster and add features incrementally.",
        },
        {
          id: "2",
          title: "Do you build mobile apps as well as web platforms?",
          content:
            "Yes. We build React Native mobile apps that share business logic with your web platform — reducing cost and keeping both in sync. See our Mobile App service for details.",
        },
        {
          id: "3",
          title: "Can you integrate with our existing tools (ERP, CRM, etc.)?",
          content:
            "Absolutely. We've integrated with Odoo, HubSpot, Salesforce, SAP, Zoho, and many custom internal systems. As long as there's an API or data export, we can connect it.",
        },
        {
          id: "4",
          title: "Who owns the code after the project is done?",
          content:
            "You do — 100%. All source code is delivered to your repository at the end of the project. There are no licensing fees or lock-ins.",
        },
        {
          id: "5",
          title: "Do you offer ongoing maintenance after launch?",
          content:
            "Yes. We offer monthly retainers for maintenance, feature development, and performance monitoring. Most clients stay on a retainer so their platform keeps evolving.",
        },
      ],
    },
    process: {
      title: "How We Build Custom Platforms",
      processCards: [
        {
          stepNumber: 1,
          title: "Requirements & Architecture",
          image: "/images/services/custom/process-1.webp",
          imageAlt: "Architecture planning session",
          description: [
            "Deep-dive into your workflows, data models, and user roles",
            "System architecture and technology stack decision",
            "API contract definition and integration mapping",
          ],
        },
        {
          stepNumber: 2,
          title: "UX Design & Prototyping",
          image: "/images/services/custom/process-2.webp",
          imageAlt: "UX prototype",
          description: [
            "User flow mapping for all roles and tasks",
            "Interactive Figma prototype for stakeholder validation",
            "Edge-case and error-state design",
          ],
        },
        {
          stepNumber: 3,
          title: "Sprint-Based Development",
          image: "/images/services/custom/process-3.webp",
          imageAlt: "Sprint board",
          description: [
            "2-week sprints with working demos at each checkpoint",
            "Feature flags for incremental rollout",
            "Continuous integration with automated testing",
          ],
        },
        {
          stepNumber: 4,
          title: "QA & Security Audit",
          image: "/images/services/custom/process-4.webp",
          imageAlt: "Security audit checklist",
          description: [
            "Functional, regression, and load testing",
            "OWASP security review and penetration testing",
            "Data privacy and compliance check",
          ],
        },
        {
          stepNumber: 5,
          title: "Deployment & Handover",
          image: "/images/services/custom/process-5.webp",
          imageAlt: "Deployment pipeline",
          description: [
            "Infrastructure provisioning and CI/CD pipeline setup",
            "Team onboarding and admin documentation",
            "Runbook and escalation path for your ops team",
          ],
        },
      ],
    },
    weGotYou: {
      title: "We've Got Every Technical Challenge Covered",
      titleHighlights: ["Technical", "Challenge"],
      label: "End-to-End Ownership",
      description:
        "From database schema to pixel-perfect UI — we own the full stack so you get a cohesive product, not stitched-together modules from different vendors.",
      image: "/images/services/custom/we-got-you.webp",
      imageAlt: "Full-stack development team",
      cta: { label: "Get a Proposal", href: LEADS_URL },
      imagePosition: "right",
      theme: "beige",
    },
  },

  "media-buying": {
    hero: {
      title: "Media Buying That Turns Ad Spend Into Profit",
      subTitle: "Paid Social & Media Buying",
      description:
        "Data-driven paid campaigns across Meta, TikTok, and Snapchat. Creative testing, audience targeting, and funnel optimisation built around your CPA — not just impressions.",
      image: "/images/services/media-buying/hero.webp",
      imageAlt: "Media buying campaign performance dashboard",
      cta: { label: "Start Scaling", href: LEADS_URL },
    },
    prototypes: {
      image: "/images/services/media-buying/prototype.webp",
      imageAlt: "Campaign performance overview screens",
      backgroundColor: "bg-panel",
    },
    numbers: {
      numbers: [
        {
          value: "400+",
          title: "Campaigns Managed",
          description: "Across Meta, TikTok, and Snapchat",
        },
        {
          value: "3.8x",
          title: "Average ROAS",
          description: "Across all active accounts in 2024",
        },
        {
          value: "62%",
          title: "Average CPA Reduction",
          description: "Within the first 90 days",
        },
        {
          value: "14M+",
          title: "EGP in Ad Spend",
          description: "Managed and optimised to date",
        },
      ],
    },
    brief: {
      description:
        "Most agencies chase reach. We chase profit. Every campaign we run is structured around your unit economics — so as you spend more, you make more.",
      signature: "Mitch",
    },
    weGotYou: {
      title: "Full-Funnel Coverage, From Awareness to Purchase",
      titleHighlights: ["Awareness", "Purchase"],
      label: "Full-Funnel Media Strategy",
      description:
        "We map your customer journey and build a campaign structure that nurtures strangers into buyers — with the right creative, audience, and bid strategy at every stage.",
      image: "/images/services/media-buying/we-got-you.webp",
      imageAlt: "Full-funnel campaign structure diagram",
      cta: { label: "See Our Approach", href: "/about" },
      imagePosition: "right",
    },
    whyUs: {
      title: "Why Growth-Focused Brands Work With Us",
      variant: "grid",
      cards: [
        {
          title: "Creative-First Strategy",
          image: "/images/services/media-buying/why-1.webp",
          imageAlt: "Creative ad variations",
          description:
            "We test creative variables systematically — not randomly — to find what actually converts.",
        },
        {
          title: "Weekly Performance Reports",
          image: "/images/services/media-buying/why-2.webp",
          imageAlt: "Weekly performance report",
          description:
            "Plain-English reports every Monday — no vanity metrics, just numbers that matter.",
        },
        {
          title: "Audience Architecture",
          image: "/images/services/media-buying/why-3.webp",
          imageAlt: "Audience segmentation diagram",
          description:
            "Layered prospecting and retargeting audiences built on your real customer data.",
        },
        {
          title: "No Long-Term Lock-In",
          image: "/images/services/media-buying/why-4.webp",
          imageAlt: "Flexible contract",
          description:
            "Month-to-month engagements. We earn your business every month with results.",
        },
      ],
    },
  },

  "google-ads": {
    hero: {
      title: "Google Ads That Capture Intent and Convert It",
      subTitle: "Google Ads Management",
      description:
        "Search and Performance Max campaigns built around profitable keywords and tight negative lists. Continuously tested and optimised for every dirham in ad spend.",
      image: "/images/services/google-ads/hero.webp",
      imageAlt: "Google Ads campaign dashboard",
      cta: { label: "Get a Free Audit", href: LEADS_URL },
    },
    prototypes: {
      image: "/images/services/google-ads/prototype.webp",
      imageAlt: "Google Ads account structure overview",
      backgroundColor: "bg-panel",
    },
    numbers: {
      numbers: [
        {
          value: "5.2x",
          title: "Average ROAS",
          description: "Across all Google Ads accounts in 2024",
        },
        {
          value: "280+",
          title: "Campaigns Launched",
          description: "Search, Shopping, and Performance Max",
        },
        {
          value: "41%",
          title: "Average CPC Reduction",
          description: "Versus client's previous agency",
        },
        {
          value: "97%",
          title: "Impression Share",
          description: "On brand terms across managed accounts",
        },
      ],
    },
    brief: {
      description:
        "Google rewards relevance. We build campaigns where every keyword, ad copy, and landing page tells a consistent story — which means higher Quality Scores and lower CPCs than your competitors.",
      signature: "Mitch",
    },
    weGotYou: {
      title: "We Handle the Complexity So You Focus on Growth",
      titleHighlights: ["Complexity", "Growth"],
      label: "Full Account Management",
      description:
        "Keyword research, campaign structure, ad copy, bid strategy, negative keywords, and landing page alignment — all handled by certified specialists who live inside your account.",
      image: "/images/services/google-ads/we-got-you.webp",
      imageAlt: "Google Ads account management workflow",
      cta: { label: "Book a Free Audit", href: LEADS_URL },
      imagePosition: "right",
    },
    whyUs: {
      title: "What Sets Our Google Ads Practice Apart",
      variant: "grid",
      cards: [
        {
          title: "Structured Keyword Research",
          image: "/images/services/google-ads/why-1.webp",
          imageAlt: "Keyword research spreadsheet",
          description:
            "We build keyword lists from your actual sales data — not guesswork or auto-suggest.",
        },
        {
          title: "Ad Copy Testing Framework",
          image: "/images/services/google-ads/why-2.webp",
          imageAlt: "A/B ad copy test",
          description:
            "Systematic RSA variant testing with statistical significance — not arbitrary changes.",
        },
        {
          title: "Landing Page Alignment",
          image: "/images/services/google-ads/why-3.webp",
          imageAlt: "Landing page and ad alignment",
          description:
            "We audit and improve your landing pages to match ad intent and boost Quality Score.",
        },
        {
          title: "Transparent Monthly Billing",
          image: "/images/services/google-ads/why-4.webp",
          imageAlt: "Billing transparency",
          description:
            "You pay Google directly. Our management fee is flat and agreed upfront — no surprises.",
        },
      ],
    },
  },

  seo: {
    hero: {
      title: "Rank on Google. Surface in AI. Own Your Category.",
      subTitle: "SEO & AI-Generative Optimisation",
      description:
        "Technical SEO, content strategy, and AI-Generative Optimisation (AGO) to rank on Google and get cited in ChatGPT, Perplexity, and AI Overviews. Arabic SEO included.",
      image: "/images/services/seo/hero.webp",
      imageAlt: "SEO and AI search visibility dashboard",
      cta: { label: "Get an SEO Audit", href: LEADS_URL },
    },
    prototypes: {
      image: "/images/services/seo/prototype.webp",
      imageAlt: "SEO ranking improvement charts",
      backgroundColor: "bg-panel",
    },
    numbers: {
      numbers: [
        {
          value: "312%",
          title: "Average Organic Traffic Increase",
          description: "Within the first 6 months",
        },
        {
          value: "84",
          title: "Keywords Ranked #1",
          description: "Across all active SEO clients",
        },
        {
          value: "60+",
          title: "Technical Audits Completed",
          description: "Sites fully optimised for Core Web Vitals",
        },
        {
          value: "100%",
          title: "AGO Schema Coverage",
          description: "On all content we produce",
        },
      ],
    },
    brief: {
      description:
        "The rules of search changed when AI entered the game. We're one of the few agencies in the region building for both Google's algorithm and the AI models that now answer your customers' questions.",
      signature: "Mitch",
    },
    weGotYou: {
      title: "Technical Excellence Meets Content Strategy",
      titleHighlights: ["Technical", "Content"],
      label: "Full-Spectrum SEO",
      description:
        "We fix what's broken under the hood, then build the content infrastructure that earns authority — in Arabic and English, for humans and AI models alike.",
      image: "/images/services/seo/we-got-you.webp",
      imageAlt: "SEO strategy whiteboard session",
      cta: { label: "See Our Methodology", href: "/about" },
      imagePosition: "right",
    },
    whyUs: {
      title: "Why Businesses Serious About Search Choose Us",
      variant: "grid",
      cards: [
        {
          title: "Technical SEO Depth",
          image: "/images/services/seo/why-1.webp",
          imageAlt: "Technical SEO audit report",
          description:
            "Core Web Vitals, crawl budget, canonical strategy, and schema — not just meta tags.",
        },
        {
          title: "Arabic & Bilingual SEO",
          image: "/images/services/seo/why-2.webp",
          imageAlt: "Arabic SEO content",
          description:
            "Native Arabic content with proper hreflang implementation and RTL technical setup.",
        },
        {
          title: "AI Citation Optimisation",
          image: "/images/services/seo/why-3.webp",
          imageAlt: "AI search result citation",
          description:
            "We structure your content so ChatGPT, Perplexity, and AI Overviews cite you by name.",
        },
        {
          title: "Monthly Progress Reports",
          image: "/images/services/seo/why-4.webp",
          imageAlt: "SEO monthly report",
          description:
            "Ranking movement, traffic trends, and next-month priorities in a clear monthly report.",
        },
      ],
    },
  },

  "mobile-app": {
    hero: {
      title: "Mobile Apps That Feel Native and Convert",
      subTitle: "Mobile App Development",
      description:
        "Native-feel iOS and Android apps built with React Native. Designed for conversion, built for performance, and ready for App Store and Play Store submission.",
      image: "/images/services/mobile-app/hero.webp",
      imageAlt: "Mobile app screens on iPhone and Android devices",
      cta: { label: "Discuss Your App", href: LEADS_URL },
    },
    prototypes: {
      image: "/images/services/mobile-app/prototype.webp",
      imageAlt: "Mobile app prototype screens in Figma",
      backgroundColor: "bg-panel",
    },
    numbers: {
      numbers: [
        {
          value: "40+",
          title: "Apps Published",
          description: "On App Store and Google Play",
        },
        {
          value: "4.8",
          title: "Average App Store Rating",
          description: "Across all published apps",
        },
        {
          value: "2M+",
          title: "Total Downloads",
          description: "Across our client app portfolio",
        },
        {
          value: "98%",
          title: "First-Submission Approval Rate",
          description: "On both App Store and Play Store",
        },
      ],
    },
    brief: {
      description:
        "A great mobile app isn't just functional — it's effortless. We obsess over every swipe, load time, and empty state so your users never feel friction between their intent and their action.",
      signature: "Mitch",
    },
    weGotYou: {
      title: "From Concept to the App Store in One Partnership",
      titleHighlights: ["Concept", "App", "Store"],
      label: "Full Lifecycle Delivery",
      description:
        "We handle design, development, testing, App Store submission, and post-launch analytics — so you have one accountable partner from the first wireframe to the first 10,000 downloads.",
      image: "/images/services/mobile-app/we-got-you.webp",
      imageAlt: "Mobile app development lifecycle diagram",
      cta: { label: "See Our Apps", href: "/case-studies" },
      imagePosition: "right",
      theme: "beige",
    },
    whyUs: {
      title: "Why App Founders and Product Teams Choose Us",
      variant: "grid",
      cards: [
        {
          title: "React Native Expertise",
          image: "/images/services/mobile-app/why-1.webp",
          imageAlt: "React Native code",
          description:
            "One codebase, two platforms — without the performance compromises of lesser cross-platform tools.",
        },
        {
          title: "App Store Optimisation",
          image: "/images/services/mobile-app/why-2.webp",
          imageAlt: "App Store listing",
          description:
            "We write your listing copy, choose keywords, and design screenshots that convert browsers to installers.",
        },
        {
          title: "Offline-First Architecture",
          image: "/images/services/mobile-app/why-3.webp",
          imageAlt: "Offline mode illustration",
          description:
            "Apps that work without internet — essential for field teams and emerging market users.",
        },
        {
          title: "Push Notification Strategy",
          image: "/images/services/mobile-app/why-4.webp",
          imageAlt: "Push notification examples",
          description:
            "Personalised push campaigns built on user behaviour — not blasts that get turned off.",
        },
      ],
    },
  },
};
