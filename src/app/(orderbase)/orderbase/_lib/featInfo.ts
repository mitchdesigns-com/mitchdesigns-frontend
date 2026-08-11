// Feature explainer popover content — keyed by feature id. Static technical reference;
// referenced by compare-table row `key` + feature-tab items to show hover/tap explainers.
export type FeatInfo = { w: string; b: string; v: string; s: string };
export const FEAT_INFO: Record<string, FeatInfo> = {
  "branches": {
    "w": "How many locations run on the platform, and full multi-branch operations across them.",
    "b": "Every branch operates independently while you manage them all from one dashboard.",
    "v": "Scale to new branches with no new setup, no data silos and one source of truth.",
    "s": "Standard: up to 2 · Pro: up to 10 · Elite: up to 30 · Custom: 30+ · per-branch stock, pricing, availability & nearest-branch routing."
  },
  "mobileApp": {
    "w": "A native iOS & Android ordering app branded entirely to your business.",
    "b": "A permanent icon on your customer's home screen plus push-notification reach.",
    "v": "Drives repeat orders and direct engagement you own — no aggregator commissions.",
    "s": "Native iOS & Android, push notifications, app-store publishing. Elite & Custom plans."
  },
  "shopWebsite": {
    "w": "Your branded online storefront for browsing and placing orders.",
    "b": "A fast, professional web presence customers recognise and trust.",
    "v": "Sell direct 24/7 and keep the customer relationship instead of renting it.",
    "s": "Responsive web store, custom domain, SEO-ready. All plans."
  },
  "customUi": {
    "w": "A UI/UX designed uniquely around your brand rather than a shared template.",
    "b": "A store that looks and feels unmistakably yours, top to bottom.",
    "v": "Stronger brand trust and measurably higher conversion than generic templates.",
    "s": "Bespoke design system, brand colours & typography, custom layouts. Pro, Elite & Custom."
  },
  "catalog": {
    "w": "The structured library of all your products, categories and menus.",
    "b": "Organise an unlimited menu that's effortless for customers to browse.",
    "v": "Faster discovery and cleaner merchandising lead to larger baskets.",
    "s": "Unlimited products & categories, images, descriptions, availability toggles."
  },
  "variants": {
    "w": "Sell both simple products and products with options like size, flavour or attribute.",
    "b": "One product page cleanly handles every variation — no duplicate listings.",
    "v": "A single flexible catalogue models your entire real-world menu and speeds up ordering.",
    "s": "Simple & variable products, multiple option sets, per-variant price, stock & SKU."
  },
  "addonsBundles": {
    "w": "Paid extras and grouped products offered on a single item.",
    "b": "Customers customise and buy more from one screen.",
    "v": "Higher average order value from add-ons, combos and meal boxes.",
    "s": "Add-on groups, required/optional rules, bundle & combo pricing."
  },
  "fastCheckout": {
    "w": "A focused two-page checkout: one page for order details, one dedicated to payment.",
    "b": "Customers move through a clear, distraction-free flow with nothing extra on screen.",
    "v": "Fewer abandoned carts and a delivery-app-grade experience that converts.",
    "s": "Two-step flow (order details → dedicated payment page), saved details, guest & express checkout, mobile-optimised."
  },
  "mobileFriendly": {
    "w": "A store that adapts perfectly to phones and tablets.",
    "b": "Flawless ordering on the devices most customers actually use.",
    "v": "Captures the majority mobile traffic instead of losing it to a broken layout.",
    "s": "Responsive breakpoints, touch-optimised UI, fast mobile load times."
  },
  "orderMgmt": {
    "w": "A central dashboard to receive, track and process every order.",
    "b": "Your team runs the whole operation from one screen.",
    "v": "Faster fulfilment, fewer mistakes and full visibility across branches.",
    "s": "Live order queue, statuses, branch routing, roles & notifications."
  },
  "promoCodes": {
    "w": "Discount codes — fixed amount, percentage or free delivery.",
    "b": "Launch targeted offers in minutes without developer help.",
    "v": "Drives campaigns, wins back customers and boosts slow periods on demand.",
    "s": "Fixed / % / free-delivery, expiry dates, usage limits, per-customer caps."
  },
  "paymentGateways": {
    "w": "Direct integration with the MPGS (MasterCard) gateway through Crédit Agricole Bank, plus any local processor.",
    "b": "Customers pay by credit card inside your own website or app — never handed off to a third-party processor's page.",
    "v": "A seamless, on-brand and trusted checkout that lifts payment completion.",
    "s": "MPGS / Crédit Agricole direct integration; connects to any local payment processor; card, wallet & cash."
  },
  "shippingRules": {
    "w": "Delivery and shipping rates configured by zone, distance and conditions, including multi-tier rates.",
    "b": "Delivery pricing matches exactly how your business operates, near or far.",
    "v": "Protects margins on long trips while staying competitive locally.",
    "s": "Zone & distance-based rates, multi-tier rate tables, free-delivery thresholds, per-branch rules."
  },
  "userRoles": {
    "w": "Permission levels for staff and administrators.",
    "b": "Each team member sees only what they should.",
    "v": "Safer operations and clear accountability as the team grows.",
    "s": "Role-based access, per-branch scoping, action permissions."
  },
  "reports": {
    "w": "Dashboards covering sales, orders and performance.",
    "b": "Decisions based on real numbers, not guesswork.",
    "v": "Spot trends, cut waste and double down on what sells.",
    "s": "Sales, revenue, order-volume and product reports; export-ready."
  },
  "localization": {
    "w": "Full English and Arabic support across the store.",
    "b": "Every customer shops in their preferred language.",
    "v": "Wider reach and a native feel for the Egyptian & regional market.",
    "s": "EN/AR content, RTL layout support, localised formatting."
  },
  "support": {
    "w": "A responsive support team for your platform.",
    "b": "Help is on hand when you need it.",
    "v": "Minimises downtime and keeps sales flowing.",
    "s": "Standard support on all plans; priority & SLA on higher tiers."
  },
  "searchFilter": {
    "w": "Product search with filters, sorting and comparison.",
    "b": "Customers find exactly what they want, fast.",
    "v": "Shorter path to purchase and less browsing frustration.",
    "s": "Keyword search, category & attribute filters, sort & compare."
  },
  "stopSale": {
    "w": "Instantly mark items unavailable at a specific branch.",
    "b": "Stop selling what a branch has run out of, in one click.",
    "v": "Prevents cancellations and refunds that damage customer trust.",
    "s": "Per-branch availability toggle, real-time, auto-hides sold-out items."
  },
  "driverApp": {
    "w": "A dedicated app for your delivery drivers.",
    "b": "Orders, routes and statuses flow straight to the driver.",
    "v": "Faster deliveries and live tracking without third-party fleets.",
    "s": "Driver order queue, status updates, assignment & tracking. Elite & Custom."
  },
  "sla": {
    "w": "A guaranteed service-level agreement for uptime and response.",
    "b": "Contractual assurance your platform stays fast and available.",
    "v": "Peace of mind that revenue-critical systems are protected.",
    "s": "Defined uptime & response targets, priority handling."
  },
  "userAccounts": {
    "w": "Customer accounts with profiles and order history.",
    "b": "Customers save details and reorder in a tap.",
    "v": "Builds a first-party database you own for retention and marketing.",
    "s": "Profiles, saved addresses, order history, secure login."
  },
  "vouchersFlash": {
    "w": "Gift vouchers plus limited-time flash-sale campaigns.",
    "b": "Create urgency and giftable value on demand.",
    "v": "Spikes demand in quiet periods and opens a new gifting revenue stream.",
    "s": "Voucher issuance & redemption, timed flash sales, stock caps."
  },
  "multiBranch": {
    "w": "Run inventory, pricing and fulfilment across many branches.",
    "b": "Each location operates correctly while you see the whole picture.",
    "v": "Scale to new branches without fragmenting your operation.",
    "s": "Per-branch stock, pricing, availability and nearest-branch routing."
  },
  "erp": {
    "w": "Integration with your ERP system.",
    "b": "Orders, stock and finance stay in sync automatically.",
    "v": "Eliminates double entry and keeps back-office data accurate.",
    "s": "Microsoft Dynamics, SAP, Oracle or custom ERP connectors."
  },
  "pos": {
    "w": "Integration with your in-store point-of-sale system.",
    "b": "Online and in-store share one menu, stock and order flow.",
    "v": "No conflicting inventory between walk-in and online sales.",
    "s": "Menu, stock and order sync; branch-level POS connectors."
  },
  "pickup": {
    "w": "Click-and-collect ordering for store pickup.",
    "b": "Customers order ahead and collect with no delivery fee.",
    "v": "Captures pickup demand and eases delivery load at peak times.",
    "s": "Per-branch pickup, time slots, order-ahead, ready notifications."
  },
  "deliveryRates": {
    "w": "Multiple delivery rate tiers by distance or zone.",
    "b": "Charge fairly for near and far deliveries.",
    "v": "Protects margins on long trips while staying competitive nearby.",
    "s": "Distance/zone tiers, min-order rules, per-branch rate tables."
  },
  "byo": {
    "w": "Build-Your-Own products with guided, step-based options.",
    "b": "Customers assemble their perfect order step by step.",
    "v": "Higher engagement and order value from customisable items.",
    "s": "Step flows, required/optional choices, live price updates."
  },
  "membership": {
    "w": "A paid or tiered membership programme.",
    "b": "Reward your best customers with exclusive perks.",
    "v": "Predictable recurring revenue and stronger loyalty.",
    "s": "Membership tiers, benefits, renewal handling. Elite & Custom."
  },
  "loyalty": {
    "w": "Points and rewards earned on orders.",
    "b": "Every purchase moves customers toward a reward.",
    "v": "Increases repeat orders and lifetime value measurably.",
    "s": "Configurable earn/redeem rules, points balance, reward catalogue."
  },
  "wallet": {
    "w": "An in-app wallet holding stored credit and refunds.",
    "b": "Faster checkout and instant, goodwill-preserving refunds.",
    "v": "Keeps money in your ecosystem and encourages repeat spend.",
    "s": "Stored balance, top-ups, refund-to-wallet, transaction history."
  },
  "applePay": {
    "w": "One-tap checkout with Apple Pay.",
    "b": "The fastest, most trusted mobile payment path.",
    "v": "Fewer drop-offs at payment on iPhone, a large customer share.",
    "s": "Apple Pay on web & app, tokenised, biometric confirmation. Elite & Custom."
  },
  "tokenization": {
    "w": "Securely saving cards as tokens for reuse.",
    "b": "Customers store a card once and check out in one tap.",
    "v": "Maximises repeat-purchase speed while staying fully compliant.",
    "s": "PCI-compliant tokenisation, no raw card data stored. Elite & Custom."
  },
  "markets": {
    "w": "Operate across multiple countries from one platform.",
    "b": "Expand internationally without rebuilding your store.",
    "v": "Sell to new markets on the infrastructure you already run.",
    "s": "Multi-country storefronts, region settings. Elite & Custom."
  },
  "currencies": {
    "w": "Display and charge in multiple currencies.",
    "b": "Customers see and pay in their own currency.",
    "v": "Removes friction for international and expat customers.",
    "s": "Multi-currency pricing & checkout, per-market rates. Elite & Custom."
  },
  "gift": {
    "w": "Send an order as a gift to someone else.",
    "b": "Customers order for friends and family with a message.",
    "v": "Opens a gifting occasion and brings in new customers.",
    "s": "Gift recipient details, gift message, separate delivery address. Elite & Custom."
  },
  "accountManager": {
    "w": "A dedicated eCommerce account manager.",
    "b": "A single expert who knows your business and goals.",
    "v": "Proactive guidance to grow sales, not just keep the lights on.",
    "s": "Named contact, regular reviews, growth support. Pro, Elite & Custom."
  },
  "priority": {
    "w": "Priority handling for support requests.",
    "b": "Your issues jump to the front of the queue.",
    "v": "Minimal downtime on the system your revenue depends on.",
    "s": "Faster response targets, escalated routing. Pro, Elite & Custom."
  },
  "guestCheckout": {
    "w": "Checkout as a guest or as a registered account.",
    "b": "No forced sign-up — customers buy the way they prefer.",
    "v": "Removes a top cause of cart abandonment while still growing your database.",
    "s": "Guest & account checkout, optional post-order sign-up."
  },
  "deliveryNotes": {
    "w": "Delivery notes and special instructions at checkout.",
    "b": "Customers tell you exactly how they want it.",
    "v": "Fewer errors and complaints, higher satisfaction on every order.",
    "s": "Free-text order notes, item-level instructions, driver notes."
  },
  "paymentMethods": {
    "w": "Multiple ways to pay: card, cash and wallet.",
    "b": "Every customer finds a payment method they trust.",
    "v": "More completed orders across all customer segments.",
    "s": "Card, cash-on-delivery, in-app wallet; extensible gateways."
  },
  "scheduledDelivery": {
    "w": "Schedule delivery for a chosen date and time slot.",
    "b": "Customers pick when their order arrives.",
    "v": "Smooths demand into your capacity and lifts pre-orders.",
    "s": "Time-slot scheduling, capacity limits, per-branch windows."
  },
  "addons": {
    "w": "Add-ons and extras like sauces, toppings and packaging.",
    "b": "Customers personalise orders and spend a little more.",
    "v": "Incremental revenue on nearly every order, at no extra acquisition cost.",
    "s": "Add-on groups, pricing, min/max rules per product."
  },
  "bundlesCombos": {
    "w": "Bundles, combos and meal boxes as single purchases.",
    "b": "Package best-sellers into easy, higher-value orders.",
    "v": "Raises average order value and simplifies choice.",
    "s": "Fixed & flexible bundles, combo pricing, meal-box builder."
  },
  "upsells": {
    "w": "Upsell and cross-sell suggestions during ordering.",
    "b": "Relevant add-ons appear at the perfect moment.",
    "v": "Lifts average order value automatically, order after order.",
    "s": "Product-linked upsells, cart suggestions, add-on prompts."
  },
  "mobileSignup": {
    "w": "Account creation using just a mobile number.",
    "b": "Sign-up takes seconds with no long forms.",
    "v": "More registered customers and a cleaner, verified database.",
    "s": "Mobile-number sign-up, OTP verification, minimal fields."
  },
  "wishlist": {
    "w": "Favourites and wishlists for saved products.",
    "b": "Customers bookmark what they love for later.",
    "v": "Brings customers back and surfaces intent you can market to.",
    "s": "Favourites, wishlist, saved items across sessions."
  },
  "reorder": {
    "w": "One-tap reorder of previous orders.",
    "b": "Regulars repeat their usual in a single tap.",
    "v": "Maximises repeat frequency from your most valuable customers.",
    "s": "Order history reorder, repeat-order shortcuts."
  },
  "addressBook": {
    "w": "A saved address book for faster checkout.",
    "b": "Home, work and other addresses are ready to select.",
    "v": "Speeds up repeat orders and cuts delivery errors.",
    "s": "Multiple saved addresses, default selection, map pinning."
  },
  "minOrderRules": {
    "w": "Minimum-order values and promo usage limits.",
    "b": "Offers stay profitable and controlled.",
    "v": "Protects margins while still driving the campaign's goal.",
    "s": "Min-order thresholds, per-code & per-customer usage caps."
  },
  "autoDiscounts": {
    "w": "Automatic, rule-based discounts with no code needed.",
    "b": "The right discount applies itself at checkout.",
    "v": "Frictionless promotions that lift conversion without manual codes.",
    "s": "Conditional rules by cart, product, quantity or customer."
  },
  "flashSales": {
    "w": "Flash sales and time-limited offers.",
    "b": "Create urgency that drives immediate action.",
    "v": "Spikes revenue in quiet windows and clears stock fast.",
    "s": "Scheduled start/end, countdowns, stock caps, auto-revert pricing."
  },
  "salePricing": {
    "w": "Sale pricing shown with a strike-through original price.",
    "b": "Customers instantly see the savings.",
    "v": "Perceived value that boosts conversion on discounted items.",
    "s": "Original vs sale price display, scheduled sale windows."
  },
  "vouchers": {
    "w": "Vouchers and gift cards customers can buy or receive.",
    "b": "Giftable, prepaid value for your brand.",
    "v": "New gifting revenue and prepaid cash that returns as orders.",
    "s": "Voucher & gift-card issuance, balances, redemption tracking."
  },
  "campaignRules": {
    "w": "Campaign targeting by product, category, branch or time window.",
    "b": "Run precise offers exactly where and when you want.",
    "v": "Higher ROI from promotions aimed at the right context.",
    "s": "Rules by product/category/branch/time; stackable conditions."
  },
  "salesReports": {
    "w": "Sales reports by day, branch, product or channel.",
    "b": "See what's selling, where and when.",
    "v": "Sharper decisions on stock, staffing and promotions.",
    "s": "Filter by date, branch, product & channel; exportable."
  },
  "revenueDash": {
    "w": "Revenue tracking and performance dashboards.",
    "b": "Your key numbers, live and at a glance.",
    "v": "Always know how the business is performing right now.",
    "s": "Real-time revenue, trends, KPI dashboards."
  },
  "opsReports": {
    "w": "Order-volume and operational reports.",
    "b": "Understand throughput and pressure points.",
    "v": "Staff and prep for peaks so service never slips.",
    "s": "Order volumes, timing, fulfilment metrics by branch."
  },
  "custAnalytics": {
    "w": "Customer behaviour and purchase analytics.",
    "b": "See how customers actually buy from you.",
    "v": "Target retention and marketing where it pays off most.",
    "s": "Cohorts, repeat rates, basket analysis, customer segments."
  },
  "productPerf": {
    "w": "Product performance and best-seller reporting.",
    "b": "Know your winners and your dead weight.",
    "v": "Optimise the menu around what genuinely drives revenue.",
    "s": "Best-sellers, per-product sales & margin views."
  },
  "branchReports": {
    "w": "Branch-level reporting and side-by-side comparisons.",
    "b": "Compare locations on a like-for-like basis.",
    "v": "Replicate what top branches do and fix the laggards.",
    "s": "Per-branch KPIs, comparison views, ranking."
  }
};