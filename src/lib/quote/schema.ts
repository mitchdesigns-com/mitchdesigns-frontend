export const QUOTE_SERVICES = [
  "corporate-website",
  "ecommerce",
  "mobile-app",
  "custom-web",
] as const;

export type QuoteService = (typeof QUOTE_SERVICES)[number];

export type QuoteStepKind =
  | "form"
  | "service-select"
  | "radio"
  | "file-upload"
  | "completion-choice"
  | "schedule"
  | "summary";

export type QuoteInputType =
  | "text"
  | "url"
  | "email"
  | "tel"
  | "textarea"
  | "select"
  | "markets"
  | "radio"
  | "checkbox-group";

export type QuoteFieldKey =
  // shared / entry
  | "firstName"
  | "service"
  | "lastName"
  | "mobileNumber"
  | "email"
  | "companyName"
  | "markets"
  | "companyStage"
  | "timeline"
  | "projectDrivers"
  | "additionalNotes"
  | "nextAction"
  | "schedule"
  // corporate
  | "currentWebsite"
  | "currentWebsiteUrl"
  | "hasSitemap"
  | "sitemapFile"
  | "websiteLanguages"
  | "industry"
  | "websitePurpose"
  | "websiteSections"
  | "specialFeatures"
  | "companyProfile"
  // ecommerce
  | "avgPrice"
  | "productCount"
  | "fulfilment"
  | "hasStore"
  | "storeUrl"
  | "storePlatform"
  | "wantsMobileApp"
  // mobile app
  | "appGoal"
  | "appBusinessType"
  | "hasBrief"
  | "briefFile"
  | "appFeatures"
  | "appIntegrations"
  | "integrationUrl"
  // custom web
  | "customPurpose"
  | "customBusinessType"
  | "customFeatures"
  | "systemParts"
  | "onlinePayments"
  // legacy (kept for back-compat with submitLead / older data)
  | "companyCountry"
  | "budget"
  | "brief"
  | "contact";

export type QuoteOutcome =
  | {
      readonly type: "step";
      readonly step: number;
    }
  | {
      readonly type: "route";
      readonly href: `/quote/${string}` | "/";
    };

/** Show a field only when another field's answer matches. */
export type QuoteFieldCondition = {
  readonly field: QuoteFieldKey;
  /** For radio/text source fields — exact match. */
  readonly equals?: string;
  /** For checkbox-group source fields — value present in the selected array. */
  readonly includes?: string;
};

export type QuoteValidationRule = {
  readonly required?: boolean;
  readonly minSelected?: number;
  readonly maxSelected?: number;
  readonly acceptedFileTypes?: readonly string[];
  readonly maxFileSizeMb?: number;
  readonly minLength?: number;
  readonly maxLength?: number;
};

export type QuoteStepOption = {
  readonly label: string;
  readonly value: string;
  readonly description?: string;
  readonly helperText?: string;
  readonly recommended?: boolean;
  readonly service?: QuoteService;
  readonly nextStep?: number;
  readonly outcome?: QuoteOutcome;
};

export type QuoteField = {
  readonly id: QuoteFieldKey;
  readonly label: string;
  readonly type: QuoteInputType;
  readonly required?: boolean;
  readonly helperText?: string;
  readonly placeholder?: string;
  readonly defaultValue?: string;
  readonly prefix?: string;
  readonly options?: readonly QuoteStepOption[];
  readonly validation?: QuoteValidationRule;
  readonly showWhen?: QuoteFieldCondition;
};

export type QuoteStepBase = {
  readonly id: QuoteFieldKey;
  readonly step: number;
  readonly kind: QuoteStepKind;
  readonly title: string;
  readonly eyebrow?: string;
  readonly description?: string;
  readonly nextLabel?: string;
  readonly validation?: QuoteValidationRule;
  readonly outcome?: QuoteOutcome;
};

export type QuoteFormStep = QuoteStepBase & {
  readonly kind: "form";
  readonly fields: readonly QuoteField[];
  /** Route to a different step based on a field's answer. */
  readonly branch?: {
    readonly field: QuoteFieldKey;
    readonly cases: Readonly<Record<string, number>>;
  };
};

export type QuoteChoiceStep = QuoteStepBase & {
  readonly kind: "service-select" | "radio" | "completion-choice";
  readonly label?: string;
  readonly helperText?: string;
  readonly defaultValue?: string;
  readonly options: readonly QuoteStepOption[];
};

export type QuoteFileUploadStep = QuoteStepBase & {
  readonly kind: "file-upload";
  readonly uploadLabel: string;
  readonly helperText?: string;
};

export type QuoteScheduleStep = QuoteStepBase & {
  readonly kind: "schedule";
  readonly outcome: QuoteOutcome;
};

export type QuoteSummaryStep = QuoteStepBase & {
  readonly kind: "summary";
  readonly submitLabel: string;
  readonly outcome: QuoteOutcome;
};

export type QuoteStep =
  | QuoteFormStep
  | QuoteChoiceStep
  | QuoteFileUploadStep
  | QuoteScheduleStep
  | QuoteSummaryStep;

export type QuoteFlow = {
  readonly service: QuoteService;
  readonly label: string;
  /** Short tagline shown on the service-picker card. */
  readonly tagline: string;
  readonly description: string;
  readonly startHref: `/quote/${QuoteService}/1`;
  readonly steps: readonly QuoteStep[];
};

// ─── Shared option sets ───────────────────────────────────────────────────────

const uploadValidation = {
  acceptedFileTypes: [".jpeg", ".jpg", ".png", ".pdf"],
  maxFileSizeMb: 50,
} as const satisfies QuoteValidationRule;

const languageOptions = [
  { label: "Arabic only", value: "arabic-only" },
  { label: "English only", value: "english-only" },
  { label: "Arabic and English", value: "arabic-english" },
  {
    label: "Arabic and English and a third language",
    value: "arabic-english-third",
  },
] as const satisfies readonly QuoteStepOption[];

const timelineOptions = [
  { label: "As soon as possible", value: "asap" },
  { label: "Within 1-3 months", value: "within-1-3-months" },
  { label: "3-6 months", value: "3-6-months" },
  { label: "6+ months", value: "6-plus-months" },
  { label: "Just exploring", value: "just-exploring" },
] as const satisfies readonly QuoteStepOption[];

const companyStageOptions = [
  { label: "Just me for now", value: "just-me" },
  { label: "Small team (1-10)", value: "small-team" },
  { label: "Growing business (11-50)", value: "growing-business" },
  { label: "Established company (51-200)", value: "established-company" },
  { label: "Enterprise (200+)", value: "enterprise" },
  { label: "Company setup in progress", value: "setup-in-progress" },
] as const satisfies readonly QuoteStepOption[];

const ecommerceStageOptions = [
  { label: "Just me for now", value: "just-me" },
  { label: "Small team (1-10)", value: "small-team" },
  { label: "Growing business (11-50)", value: "growing-business" },
  { label: "Established company (51-200)", value: "established-company" },
  { label: "Enterprise (200+)", value: "enterprise" },
  { label: "Still setting things up / pre-launch", value: "pre-launch" },
] as const satisfies readonly QuoteStepOption[];

/** Name + service-picker stages that precede the service-specific flow steps. */
export const PICKER_STAGES = 2;

// ─── Shared tail builders ─────────────────────────────────────────────────────

const contextStep = (
  step: number,
  drivers: readonly QuoteStepOption[],
): QuoteFormStep => ({
  id: "timeline",
  step,
  kind: "form",
  title: "Last bit of context before we wrap",
  description: "The more context, the sharper the estimate.",
  fields: [
    {
      id: "timeline",
      label: "When are you hoping to launch?",
      type: "radio",
      required: true,
      options: timelineOptions,
    },
    {
      id: "projectDrivers",
      label: "What's driving this project right now?",
      type: "checkbox-group",
      helperText: "Pick all that apply",
      options: drivers,
    },
    {
      id: "additionalNotes",
      label: "Anything else we should know, {firstName}?",
      type: "textarea",
      placeholder:
        "Mention competitors you admire, references you've seen, or what success looks like for you.",
      validation: { maxLength: 2500 },
    },
  ],
});

const contactStep = (
  step: number,
  title: string,
  description?: string,
): QuoteFormStep => ({
  id: "lastName",
  step,
  kind: "form",
  title,
  description,
  fields: [
    {
      id: "lastName",
      label: "Last Name",
      type: "text",
      required: true,
    },
    {
      id: "mobileNumber",
      label: "Mobile Number",
      type: "tel",
      required: true,
      defaultValue: "+20",
      helperText: "Best number to reach you, WhatsApp included.",
    },
    {
      id: "email",
      label: "E-mail Address",
      type: "email",
      required: true,
      helperText: "We'll send your estimate here within 48 hours.",
    },
  ],
});

const companyStep = (
  step: number,
  title: string,
  stageOptions: readonly QuoteStepOption[],
): QuoteFormStep => ({
  id: "companyName",
  step,
  kind: "form",
  title,
  fields: [
    {
      id: "companyName",
      label: "What's your company name?",
      type: "text",
      required: true,
    },
    {
      id: "markets",
      label: "What markets do you serve?",
      type: "markets",
      required: true,
      validation: { required: true, minSelected: 1 },
    },
    {
      id: "companyStage",
      label: "Which best describes where your company is right now?",
      type: "checkbox-group",
      required: true,
      validation: { required: true, minSelected: 1 },
      options: stageOptions,
    },
  ],
});

const whatsNextStep = (step: number, scheduleStepNum: number): QuoteChoiceStep => ({
  id: "nextAction",
  step,
  kind: "completion-choice",
  title: "Thanks. What's next is up to you",
  description:
    "Your details are with our team. While they prep your strategy, pick how you'd like to move forward.",
  validation: { required: true },
  defaultValue: "schedule-call",
  options: [
    {
      label: "Schedule an Online Meeting",
      value: "schedule-call",
      description:
        "30-minute consultation, free. Get answers and direction in real time.",
      recommended: true,
      nextStep: scheduleStepNum,
    },
    {
      label: "Get A Quick Estimate",
      value: "quick-estimate",
      description: "Email-only proposal within 48 hours. No call needed.",
      outcome: { type: "route", href: "/quote/thank-you" },
    },
  ],
});

const scheduleStep = (step: number): QuoteScheduleStep => ({
  id: "schedule",
  step,
  kind: "schedule",
  title: "Pick a time that works for you",
  description:
    "We'll walk through your project together and map out the smartest next step.",
  outcome: { type: "route", href: "/quote/thank-you" },
});

// ─── Flows ────────────────────────────────────────────────────────────────────

export const quoteFlows = {
  "corporate-website": {
    service: "corporate-website",
    label: "Corporate Website",
    tagline: "Brand presence, leads, info site",
    description: "A brand, marketing, or company website built to convert.",
    startHref: "/quote/corporate-website/1",
    steps: [
      {
        id: "currentWebsite",
        step: 1,
        kind: "form",
        title: "Let's understand where you're coming from",
        description:
          "Two fast questions to help us understand your starting point.",
        branch: { field: "hasSitemap", cases: { yes: 2, "not-yet": 3 } },
        fields: [
          {
            id: "currentWebsite",
            label: "Do you have a current website?",
            type: "radio",
            required: true,
            options: [
              { label: "Yes, I have one already", value: "yes" },
              { label: "No", value: "no" },
            ],
          },
          {
            id: "currentWebsiteUrl",
            label: "What's the link?",
            type: "url",
            required: true,
            helperText: "(We'll take a look before the call.)",
            placeholder: "https://www.yourcompany.com/",
            showWhen: { field: "currentWebsite", equals: "yes" },
          },
          {
            id: "hasSitemap",
            label:
              "Got a sitemap ready for the new one, or starting from scratch?",
            type: "radio",
            required: true,
            helperText:
              "A sitemap is just a map of your site's pages and how they connect. If you've got one, share it. If not, we'll help you shape it.",
            options: [
              { label: "Yes, I have it ready", value: "yes" },
              {
                label: "Not yet, let's figure it out together",
                value: "not-yet",
              },
            ],
          },
        ],
      },
      {
        id: "sitemapFile",
        step: 2,
        kind: "file-upload",
        title: "Awesome! Drop your sitemap in here",
        description:
          "If it's not a formal sitemap, no problem, a sketch, screenshot, or even a list of page names works.",
        uploadLabel: "Browse File",
        helperText: "Choose a file or drag & drop it here.",
        validation: uploadValidation,
        outcome: { type: "step", step: 3 },
      },
      {
        id: "websiteLanguages",
        step: 3,
        kind: "form",
        title: "Let's shape the website around your business",
        fields: [
          {
            id: "websiteLanguages",
            label: "What languages will your website support?",
            type: "radio",
            required: true,
            options: languageOptions,
          },
          {
            id: "industry",
            label: "Which industry is your business in?",
            type: "text",
            required: true,
            helperText: "e.g. real estate, finance, F&B, manufacturing",
          },
          {
            id: "websitePurpose",
            label: "What's the main purpose of your website?",
            type: "checkbox-group",
            required: true,
            validation: { required: true, minSelected: 1 },
            options: [
              { label: "Generate leads or sales", value: "leads" },
              {
                label: "Build brand credibility and trust",
                value: "credibility",
              },
              {
                label: "Showcase our work, services, or projects",
                value: "showcase",
              },
              { label: "Recruit or attract talent", value: "recruit" },
              { label: "Inform and educate visitors", value: "educate" },
              {
                label: "Serve and support existing customers",
                value: "support",
              },
              { label: "Other", value: "other" },
            ],
          },
        ],
      },
      {
        id: "websiteSections",
        step: 4,
        kind: "form",
        title: "What should your site actually do?",
        fields: [
          {
            id: "websiteSections",
            label: "What pages do you want on your site?",
            type: "checkbox-group",
            required: true,
            helperText: "You can choose multiple options",
            validation: { required: true, minSelected: 1 },
            options: [
              { label: "About us", value: "about-us" },
              { label: "Our projects", value: "our-projects" },
              { label: "Blog", value: "blog" },
              { label: "Portfolio", value: "portfolio" },
              { label: "Product Catalog", value: "product-catalog" },
              { label: "FAQ", value: "faq" },
              { label: "Project status updates", value: "project-updates" },
              { label: "Campaign or promo page", value: "campaign-page" },
              { label: "News", value: "news" },
              { label: "Events", value: "events" },
              { label: "Contact us", value: "contact-us" },
              { label: "Services", value: "services" },
              { label: "Team / Leadership", value: "team" },
              { label: "Testimonials", value: "testimonials" },
              { label: "Locations or branches", value: "locations" },
              { label: "Press / Media", value: "press" },
              { label: "Case studies", value: "case-studies" },
            ],
          },
          {
            id: "specialFeatures",
            label: "Do you need any special website feature?",
            type: "checkbox-group",
            required: true,
            helperText:
              "Pick anything that sounds useful. We'll explain what each does on the call.",
            validation: { required: true, minSelected: 1 },
            options: [
              { label: "Finance calculator", value: "finance-calculator" },
              { label: "Chatbot", value: "chatbot" },
              {
                label: "Connect to my CRM (Salesforce, HubSpot, Zoho, etc.)",
                value: "crm",
              },
              { label: "Multi-language support", value: "multi-language" },
              {
                label: "Online payments (deposits, service fees, donations)",
                value: "payments",
              },
              {
                label:
                  "Analytics and ad-tracking setup (Google, Meta, LinkedIn)",
                value: "analytics",
              },
              {
                label: "Booking or appointment system",
                value: "booking",
              },
              {
                label: "Newsletter signup and email capture",
                value: "newsletter",
              },
              {
                label: "Job listings and careers section with apply form",
                value: "careers",
              },
              { label: "WhatsApp integration", value: "whatsapp" },
              { label: "Site-wide search", value: "search" },
              {
                label: "Client / member login area (gated content, portal)",
                value: "member-area",
              },
              { label: "Map or branch locator", value: "map-locator" },
              {
                label:
                  "Resource library (whitepapers, brochures, downloads)",
                value: "resource-library",
              },
              { label: "Pop-ups and lead-gen forms", value: "lead-gen-forms" },
              { label: "Other", value: "other" },
            ],
          },
        ],
      },
      {
        id: "companyProfile",
        step: 5,
        kind: "file-upload",
        title: "Got a company profile or pitch deck handy?",
        description:
          "Toss it in if you have one, or skip ahead. It helps us match your tone and audience before we propose anything.",
        uploadLabel: "Browse File",
        helperText: "Choose a file or drag & drop it here.",
        validation: uploadValidation,
      },
      contextStep(6, [
        { label: "Rebrand or refresh", value: "rebrand" },
        { label: "Current site is outdated", value: "outdated" },
        {
          label: "Launching a new product or business",
          value: "new-launch",
        },
        {
          label: "Scaling and need a stronger presence",
          value: "scaling",
        },
        { label: "Pressure from competition", value: "competition" },
        { label: "Other", value: "other" },
      ]),
      contactStep(
        7,
        "Where should we send your estimate?",
        "Last details, and you're done. We'll use these to send your estimate and follow up.",
      ),
      companyStep(8, "Last stretch, a bit about your company", companyStageOptions),
      whatsNextStep(9, 10),
      scheduleStep(10),
    ],
  },

  ecommerce: {
    service: "ecommerce",
    label: "E-Commerce Website",
    tagline: "Online store with checkout",
    description: "An online store, catalog, or commerce experience.",
    startHref: "/quote/ecommerce/1",
    steps: [
      {
        id: "industry",
        step: 1,
        kind: "form",
        title: "Let's set the scene for your store",
        fields: [
          {
            id: "industry",
            label: "Which industry best describes your business?",
            type: "radio",
            required: true,
            options: [
              { label: "Desserts & pastries", value: "desserts" },
              { label: "Fast food or restaurants", value: "food" },
              { label: "Home appliances", value: "home-appliances" },
              { label: "Furniture & decor", value: "furniture" },
              { label: "Fashion or beauty", value: "fashion-beauty" },
              { label: "Electronics", value: "electronics" },
              { label: "Books, media, art", value: "books-media" },
              {
                label: "Health, wellness, supplements",
                value: "health-wellness",
              },
              { label: "Pet supplies", value: "pet-supplies" },
              { label: "Sports & outdoor", value: "sports-outdoor" },
              { label: "Kids & toys", value: "kids-toys" },
              {
                label: "Manufacturing & industrial",
                value: "manufacturing",
              },
              { label: "Other", value: "other" },
            ],
          },
          {
            id: "avgPrice",
            label: "What's the average selling price per product?",
            type: "radio",
            required: true,
            options: [
              { label: "Under 500 EGP", value: "under-500" },
              { label: "500 — 2,000 EGP", value: "500-2000" },
              { label: "2,000 — 5,000 EGP", value: "2000-5000" },
              { label: "5,000 EGP+", value: "5000-plus" },
            ],
          },
          {
            id: "productCount",
            label: "How many products will you sell?",
            type: "radio",
            required: true,
            options: [
              { label: "Under 20", value: "under-20" },
              { label: "20 - 100", value: "20-100" },
              { label: "100 - 500", value: "100-500" },
              { label: "500 - 2,000", value: "500-2000" },
              { label: "2,000+", value: "2000-plus" },
              { label: "Not sure yet", value: "not-sure" },
            ],
          },
        ],
      },
      {
        id: "fulfilment",
        step: 2,
        kind: "radio",
        title: "How do your orders reach customers?",
        validation: { required: true },
        options: [
          { label: "From one central warehouse", value: "central-warehouse" },
          { label: "From multiple warehouses", value: "multiple-warehouses" },
          { label: "From multiple branches", value: "multiple-branches" },
          {
            label: "From a mix of branches and warehouses",
            value: "mix",
          },
        ],
      },
      {
        id: "hasStore",
        step: 3,
        kind: "form",
        title: "Do you have a store running already?",
        fields: [
          {
            id: "hasStore",
            label: "Do you already have an eCommerce website?",
            type: "radio",
            required: true,
            options: [
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ],
          },
          {
            id: "storeUrl",
            label: "What's the link?",
            type: "url",
            required: true,
            helperText: "(We'll take a look before the call.)",
            placeholder: "https://www.yourcompany.com/",
            showWhen: { field: "hasStore", equals: "yes" },
          },
          {
            id: "storePlatform",
            label: "What platform is it built on?",
            type: "radio",
            required: true,
            showWhen: { field: "hasStore", equals: "yes" },
            options: [
              { label: "Shopify", value: "shopify" },
              { label: "WooCommerce", value: "woocommerce" },
              { label: "Magento", value: "magento" },
              {
                label: "A regional / local eCommerce builder",
                value: "regional-builder",
              },
              { label: "Custom website", value: "custom" },
              { label: "Other", value: "other" },
            ],
          },
        ],
      },
      {
        id: "specialFeatures",
        step: 4,
        kind: "form",
        title: "Any must-have features on your wishlist?",
        description:
          "Pick what sounds useful. We'll explain what each does on the call.",
        fields: [
          {
            id: "specialFeatures",
            label: "Do you need any special website features?",
            type: "checkbox-group",
            required: true,
            helperText: "You can choose multiple options",
            validation: { required: true, minSelected: 1 },
            options: [
              { label: "AI chatbot / virtual assistant", value: "ai-chatbot" },
              { label: "Live chat with your team", value: "live-chat" },
              { label: "WhatsApp integration", value: "whatsapp" },
              { label: "Loyalty or rewards program", value: "loyalty" },
              {
                label: "Product reviews and ratings",
                value: "reviews",
              },
              {
                label: "Abandoned cart recovery emails",
                value: "cart-recovery",
              },
              {
                label: "Email marketing integration",
                value: "email-marketing",
              },
              {
                label: "Shipping integrations (Aramex, Bosta, DHL)",
                value: "shipping",
              },
              {
                label: "Connect to my CRM (Salesforce, HubSpot, Zoho)",
                value: "crm",
              },
              {
                label:
                  "Multiple payment options (cards, wallets, COD, installments)",
                value: "payments",
              },
              {
                label:
                  "Analytics and ad-tracking setup (Google, Meta, TikTok)",
                value: "analytics",
              },
              { label: "Other", value: "other" },
            ],
          },
        ],
      },
      {
        id: "wantsMobileApp",
        step: 5,
        kind: "form",
        title: "Last bit of context before we wrap",
        description: "The more context, the sharper the estimate.",
        fields: [
          {
            id: "wantsMobileApp",
            label: "Thinking about a mobile app too?",
            type: "radio",
            required: true,
            options: [
              {
                label: "I want to build it now (with the website)",
                value: "now",
              },
              {
                label: "I want to build it in phase 2 (after the website)",
                value: "phase-2",
              },
              {
                label: "Not interested in a mobile app for now",
                value: "no",
              },
            ],
          },
          {
            id: "timeline",
            label: "When are you hoping to launch?",
            type: "radio",
            required: true,
            options: timelineOptions,
          },
          {
            id: "projectDrivers",
            label: "What's driving this project right now?",
            type: "checkbox-group",
            options: [
              { label: "Launching a new brand", value: "new-brand" },
              {
                label: "Expanding from physical to online",
                value: "expand-online",
              },
              {
                label: "Current site isn't converting",
                value: "not-converting",
              },
              {
                label: "Need better operations (inventory, shipping, etc.)",
                value: "operations",
              },
              {
                label: "Scaling and need a stronger platform",
                value: "scaling",
              },
              { label: "Pressure from competition", value: "competition" },
              { label: "Other", value: "other" },
            ],
          },
          {
            id: "additionalNotes",
            label: "Anything else we should know, {firstName}?",
            type: "textarea",
            placeholder:
              "Mention competitors you admire, references you've seen, or what success looks like for you.",
            validation: { maxLength: 2500 },
          },
        ],
      },
      contactStep(
        6,
        "Where should we send your estimate?",
        "Just need a number & email to reach you on.",
      ),
      companyStep(7, "Last stretch! A bit about your company", ecommerceStageOptions),
      whatsNextStep(8, 9),
      scheduleStep(9),
    ],
  },

  "mobile-app": {
    service: "mobile-app",
    label: "Mobile App",
    tagline: "iOS and/or Android",
    description: "A mobile product for iOS, Android, or both.",
    startHref: "/quote/mobile-app/1",
    steps: [
      {
        id: "appGoal",
        step: 1,
        kind: "form",
        title: "What's your app for, exactly?",
        fields: [
          {
            id: "appGoal",
            label: "What's the main goal of your mobile app?",
            type: "checkbox-group",
            required: true,
            helperText: "Maximum two choices",
            validation: { required: true, minSelected: 1, maxSelected: 2 },
            options: [
              {
                label: "Sell physical products (e-commerce app)",
                value: "sell-physical",
              },
              {
                label:
                  "Sell digital products or subscriptions (e.g., software, memberships, courses)",
                value: "sell-digital",
              },
              {
                label:
                  "Allow users to book a service (e.g., salon, doctor, trainer)",
                value: "book-service",
              },
              { label: "Book a venue, room, or cabin", value: "book-venue" },
              {
                label: "Collect or submit applications/forms",
                value: "forms",
              },
              {
                label: "Community or social engagement (users connect/interact)",
                value: "community",
              },
              { label: "Content or media streaming", value: "streaming" },
              { label: "Other", value: "other" },
            ],
          },
        ],
      },
      {
        id: "appBusinessType",
        step: 2,
        kind: "form",
        title: "Is this a fresh idea, or part of something already running?",
        fields: [
          {
            id: "appBusinessType",
            label: "Is this app for a new business or an existing one?",
            type: "radio",
            required: true,
            options: [
              {
                label:
                  "A new business, and the app will be the main platform for operations",
                value: "new",
              },
              {
                label:
                  "An existing business, building the app as part of our digital transformation",
                value: "existing",
              },
              { label: "Not sure yet", value: "not-sure" },
            ],
          },
        ],
      },
      {
        id: "hasBrief",
        step: 3,
        kind: "form",
        title: "Do you have a written brief for your app?",
        branch: { field: "hasBrief", cases: { yes: 4, "not-yet": 5 } },
        fields: [
          {
            id: "hasBrief",
            label: "Do you have a BRD (Business Requirement Document)?",
            type: "radio",
            required: true,
            helperText: "A short doc that outlines what your app should do",
            options: [
              { label: "Yes, I have it ready", value: "yes" },
              {
                label: "Not yet, let's figure it out together",
                value: "not-yet",
              },
            ],
          },
        ],
      },
      {
        id: "briefFile",
        step: 4,
        kind: "file-upload",
        title: "Awesome! Drop your brief in here.",
        uploadLabel: "Browse File",
        helperText: "Choose a file or drag & drop it here.",
        validation: uploadValidation,
        outcome: { type: "step", step: 6 },
      },
      {
        id: "appFeatures",
        step: 5,
        kind: "form",
        title: "What should your app actually do?",
        fields: [
          {
            id: "appFeatures",
            label: "What key features do you want in your app?",
            type: "checkbox-group",
            required: true,
            helperText: "You can choose multiple options",
            validation: { required: true, minSelected: 1 },
            options: [
              {
                label: "Account creation (email, phone, or social login)",
                value: "account-creation",
              },
              { label: "User profiles & settings", value: "profiles" },
              { label: "Push notifications", value: "push" },
              {
                label: "AI chatbot / virtual assistant",
                value: "ai-chatbot",
              },
              { label: "Live chat with your team", value: "live-chat" },
              { label: "Maps and location services", value: "maps" },
              {
                label: "Booking or appointment system",
                value: "booking",
              },
              { label: "Reviews and ratings", value: "reviews" },
              { label: "Multi-language support", value: "multi-language" },
              { label: "Loyalty or rewards program", value: "loyalty" },
              {
                label: "CRM integration (Salesforce, HubSpot, Zoho)",
                value: "crm",
              },
              {
                label: "In-app messaging between users",
                value: "in-app-messaging",
              },
              {
                label:
                  "In-app payments (cards, wallets, Apple Pay, Google Pay)",
                value: "payments",
              },
              {
                label: "Analytics and event tracking (Google, Meta, TikTok)",
                value: "analytics",
              },
              { label: "Other", value: "other" },
            ],
          },
        ],
      },
      {
        id: "appIntegrations",
        step: 6,
        kind: "form",
        title: "Should your app talk to anything you already use?",
        fields: [
          {
            id: "appIntegrations",
            label: "Pick anything you'd like the app to connect with",
            type: "checkbox-group",
            required: true,
            validation: { required: true, minSelected: 1 },
            options: [
              { label: "Our Website", value: "our-website" },
              {
                label: "Our CRM (Salesforce, HubSpot, Zoho)",
                value: "crm",
              },
              {
                label: "Our ERP or operations system (SAP, Oracle, Odoo)",
                value: "erp",
              },
              {
                label: "Our point of sale or in-store system",
                value: "pos",
              },
              { label: "Our accounting software", value: "accounting" },
              { label: "Something else", value: "other" },
              { label: "None of these for now", value: "none" },
            ],
          },
          {
            id: "integrationUrl",
            label: "What's the link?",
            type: "url",
            required: true,
            helperText: "(We'll take a look before the call.)",
            placeholder: "https://www.yourcompany.com/",
            showWhen: { field: "appIntegrations", includes: "our-website" },
          },
        ],
      },
      contextStep(7, [
        {
          label: "Launching a new product or service",
          value: "new-launch",
        },
        {
          label: "Going mobile-first (we have a website, now we need an app)",
          value: "mobile-first",
        },
        {
          label: "Replacing a manual process with an app",
          value: "replace-manual",
        },
        { label: "Scaling our operations", value: "scaling" },
        { label: "Pressure from competition", value: "competition" },
        { label: "Other", value: "other" },
      ]),
      contactStep(
        8,
        "Where should we send your estimate?",
        "Just need a number & email to reach you on.",
      ),
      companyStep(9, "Last stretch! A bit about your company.", companyStageOptions),
      scheduleStep(10),
    ],
  },

  "custom-web": {
    service: "custom-web",
    label: "Custom Website",
    tagline: "SaaS, marketplace, LMS, anything custom",
    description: "A tailored web app, portal, dashboard, or internal platform.",
    startHref: "/quote/custom-web/1",
    steps: [
      {
        id: "customPurpose",
        step: 1,
        kind: "form",
        title: "What's the main purpose of your custom website?",
        fields: [
          {
            id: "customPurpose",
            label:
              "Not sure which one fits? Pick the closest. We'll dig in on the call.",
            type: "checkbox-group",
            required: true,
            helperText: "Maximum two choices",
            validation: { required: true, minSelected: 1, maxSelected: 2 },
            options: [
              { label: "Software people pay to use (SaaS)", value: "saas" },
              {
                label: "Marketplace (connecting buyers & sellers)",
                value: "marketplace",
              },
              {
                label: "Internal dashboard or CRM for your team",
                value: "dashboard",
              },
              {
                label: "Booking or reservation system",
                value: "booking",
              },
              {
                label: "Online course or learning platform (LMS)",
                value: "lms",
              },
              {
                label: "Subscription or membership system",
                value: "subscription",
              },
              {
                label: "Inventory or order management system",
                value: "inventory",
              },
              { label: "Other", value: "other" },
            ],
          },
        ],
      },
      {
        id: "customBusinessType",
        step: 2,
        kind: "form",
        title: "Is this a brand new idea, or growing something existing?",
        fields: [
          {
            id: "customBusinessType",
            label: "Is this a new business idea or part of an existing company?",
            type: "radio",
            required: true,
            options: [
              {
                label:
                  "A new business, and the website will be the core product",
                value: "new",
              },
              {
                label:
                  "An existing business, this will digitize or automate operations",
                value: "existing",
              },
              { label: "Not sure yet", value: "not-sure" },
            ],
          },
        ],
      },
      {
        id: "hasBrief",
        step: 3,
        kind: "form",
        title: "Got a project brief already, or starting from scratch?",
        branch: { field: "hasBrief", cases: { yes: 4, "not-yet": 6 } },
        fields: [
          {
            id: "hasBrief",
            label: "Do you have a BRD (Business Requirement Document)?",
            type: "radio",
            required: true,
            options: [
              { label: "Yes, I have it ready", value: "yes" },
              {
                label: "Not yet, let's figure it out together",
                value: "not-yet",
              },
            ],
          },
        ],
      },
      {
        id: "briefFile",
        step: 4,
        kind: "file-upload",
        title: "Awesome! Drop your brief in here.",
        description:
          "Not a formal brief? No problem. Notes, a presentation, or even a rough sketch works.",
        uploadLabel: "Browse File",
        helperText: "Choose a file or drag & drop it here.",
        validation: uploadValidation,
        outcome: { type: "step", step: 5 },
      },
      {
        id: "websiteLanguages",
        step: 5,
        kind: "form",
        title: "A couple more preferences",
        outcome: { type: "step", step: 8 },
        fields: [
          {
            id: "websiteLanguages",
            label: "What languages will your website support?",
            type: "radio",
            required: true,
            options: languageOptions,
          },
          {
            id: "onlinePayments",
            label: "Will your website include online payments?",
            type: "radio",
            required: true,
            options: [
              {
                label: "Yes, for products or services",
                value: "yes-products",
              },
              {
                label: "Yes, for subscriptions or memberships",
                value: "yes-subscriptions",
              },
              { label: "No, no payment needed", value: "no" },
              { label: "Not sure yet", value: "not-sure" },
            ],
          },
        ],
      },
      {
        id: "customFeatures",
        step: 6,
        kind: "form",
        title: "A couple more details",
        fields: [
          {
            id: "customFeatures",
            label: "What key features do you want in your app?",
            type: "checkbox-group",
            required: true,
            helperText: "You can choose multiple options",
            validation: { required: true, minSelected: 1 },
            options: [
              {
                label: "User login & signup (email, phone, or social)",
                value: "login",
              },
              { label: "User profiles & settings", value: "profiles" },
              { label: "Push notifications", value: "push" },
              { label: "Shopping cart & checkout", value: "cart" },
              { label: "Payment gateway", value: "payment-gateway" },
              {
                label: "Google Tags Manager & Pixel Code Integration",
                value: "gtm-pixel",
              },
              { label: "Other", value: "other" },
            ],
          },
        ],
      },
      {
        id: "systemParts",
        step: 7,
        kind: "form",
        title: "Let's spec out what we're building",
        outcome: { type: "step", step: 8 },
        fields: [
          {
            id: "systemParts",
            label: "What parts of the system do you want us to build?",
            type: "radio",
            required: true,
            options: [
              {
                label:
                  "A full website (everything users see plus the behind-the-scenes system)",
                value: "full-website",
              },
              {
                label:
                  "An admin dashboard only (for your team to manage things)",
                value: "admin-only",
              },
              {
                label:
                  "API and backend only (to plug into another system you already use)",
                value: "api-only",
              },
              {
                label: "A full website plus a mobile app",
                value: "website-plus-app",
              },
              { label: "Not sure yet", value: "not-sure" },
            ],
          },
          {
            id: "websiteLanguages",
            label: "What languages will your website support?",
            type: "radio",
            required: true,
            options: languageOptions,
          },
          {
            id: "onlinePayments",
            label: "Will your website include online payments?",
            type: "radio",
            required: true,
            options: [
              {
                label: "Yes, for products or services",
                value: "yes-products",
              },
              {
                label: "Yes, for subscriptions or memberships",
                value: "yes-subscriptions",
              },
              { label: "No, no payment needed", value: "no" },
              { label: "Not sure yet", value: "not-sure" },
            ],
          },
        ],
      },
      contextStep(8, [
        {
          label: "Building a new product from scratch",
          value: "new-product",
        },
        {
          label: "Replacing an outdated internal system",
          value: "replace-system",
        },
        {
          label: "Connecting tools we already use",
          value: "connect-tools",
        },
        {
          label: "Going digital with a manual process",
          value: "go-digital",
        },
        { label: "Scaling our operations", value: "scaling" },
        { label: "Pressure from competition", value: "competition" },
        { label: "Other", value: "other" },
      ]),
      contactStep(9, "Let's Complete Your Contact Information"),
      companyStep(10, "Last stretch! A bit about your company", companyStageOptions),
      scheduleStep(11),
    ],
  },
} as const satisfies Record<QuoteService, QuoteFlow>;

export const quoteServiceOptions = QUOTE_SERVICES.map((service) => ({
  service,
  label: quoteFlows[service].label,
  tagline: quoteFlows[service].tagline,
  description: quoteFlows[service].description,
  href: quoteFlows[service].startHref,
}));

export type QuoteFormValue =
  | string
  | readonly string[]
  | File
  | null
  | Record<string, string>;

export type QuoteFormState = Partial<Record<QuoteFieldKey, QuoteFormValue>> & {
  /** Free-text companions for "Other" options, stored as `${fieldId}Other`. */
  readonly [key: string]: QuoteFormValue | undefined;
};

export function isQuoteService(value: string): value is QuoteService {
  return QUOTE_SERVICES.includes(value as QuoteService);
}

export function getQuoteFlow(service: QuoteService): QuoteFlow {
  return quoteFlows[service];
}

export function getStepConfig(
  service: QuoteService,
  step: number,
): QuoteStep | undefined {
  return quoteFlows[service].steps.find((item) => item.step === step);
}

export function getStepCount(service: QuoteService): number {
  return quoteFlows[service].steps.length;
}

export function getPreviousStep(
  service: QuoteService,
  step: number,
): number | null {
  const previousStep = quoteFlows[service].steps
    .map((item) => item.step)
    .filter((candidate) => candidate < step)
    .at(-1);

  return previousStep ?? null;
}

/** Is a conditional field currently visible given the answers so far? */
export function isFieldVisible(
  field: QuoteField,
  state: QuoteFormState,
): boolean {
  const condition = field.showWhen;
  if (!condition) return true;

  const source = state[condition.field];
  if (condition.equals !== undefined) {
    return source === condition.equals;
  }
  if (condition.includes !== undefined) {
    return Array.isArray(source) && source.includes(condition.includes);
  }
  return true;
}

export function getNextOutcome(
  service: QuoteService,
  step: number,
  state: QuoteFormState,
): QuoteOutcome {
  const config = getStepConfig(service, step);

  // Choice steps: an option may carry its own outcome / next step.
  if (
    config &&
    (config.kind === "radio" ||
      config.kind === "service-select" ||
      config.kind === "completion-choice")
  ) {
    const selectedValue = state[config.id];
    if (typeof selectedValue === "string") {
      const selectedOption = config.options.find(
        (option) => option.value === selectedValue,
      );
      if (selectedOption?.outcome) return selectedOption.outcome;
      if (selectedOption?.nextStep) {
        return { type: "step", step: selectedOption.nextStep };
      }
    }
  }

  // Form steps may branch on a field's answer.
  if (config && config.kind === "form" && config.branch) {
    const branchValue = state[config.branch.field];
    if (typeof branchValue === "string") {
      const target = config.branch.cases[branchValue];
      if (typeof target === "number") return { type: "step", step: target };
    }
  }

  if (config?.outcome) {
    return config.outcome;
  }

  const nextStep = quoteFlows[service].steps.find((item) => item.step > step);
  if (!nextStep) {
    return { type: "route", href: "/quote/thank-you" };
  }

  return { type: "step", step: nextStep.step };
}
