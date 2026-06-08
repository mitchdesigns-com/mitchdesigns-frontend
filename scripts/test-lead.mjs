#!/usr/bin/env node
// Fire a sample lead at the /api/leads endpoint to smoke-test the full chain
// (Strapi save + Trello card). This creates REAL records — use against local
// or a deploy you want to verify, then delete the test card/lead.
//
// Usage:
//   pnpm test:lead                         # -> http://localhost:3000
//   pnpm test:lead https://mitchdesigns.com
//   LEAD_TEST_URL=https://mitchdesigns.com pnpm test:lead

const base = (process.argv[2] || process.env.LEAD_TEST_URL || "http://localhost:3000").replace(/\/$/, "");
const endpoint = `${base}/api/leads`;
const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");

const lead = {
  firstName: "Smoke",
  lastName: "Test",
  email: "smoke-test@example.com",
  mobileNumber: "+20 100 000 0000",
  service: "corporate-website",
  companyName: "Smoke Test Co",
  companyCountry: "Egypt",
  industry: "E-commerce",
  // These are `json` fields in Strapi (multi-selects) — must be arrays/objects,
  // not bare strings, or Strapi 500s on insert.
  websitePurpose: ["Lead generation"],
  websiteSections: ["Home", "Services", "Contact"],
  specialFeatures: [],
  hasSitemap: "yes", // exercises the pre-checked checklist item
  budget: "$8,000–$12,000",
  timeline: "6–8 weeks",
  nextAction: "schedule-call",
  additionalNotes: `Automated smoke test — ${stamp}. Safe to delete.`,
  source: "smoke-test",
};

console.log(`→ POST ${endpoint}`);
const res = await fetch(endpoint, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ data: lead }),
});

const text = await res.text();
console.log(`← ${res.status} ${res.statusText}`);
console.log(text.slice(0, 500));

if (!res.ok) {
  console.error("\n❌ Lead creation failed. Check the server/Strapi config.");
  process.exit(1);
}
console.log(`\n✅ Lead sent. Check Trello "🌐 New Leads" for: ${lead.firstName} ${lead.lastName} - ${lead.companyName} - ${lead.service}`);
