import { NextResponse } from "next/server";

export const dynamic = "force-static";

// Single source of truth for indexability: the SAME NEXT_PUBLIC_INDEXABLE flag
// that drives the <meta robots> tag in app/layout.tsx. Flip it to "true" for the
// production build to open the crawl directive and the meta tag together — no
// second switch to forget. (NEXT_PUBLIC_* is inlined at build time.)
const INDEXABLE = process.env.NEXT_PUBLIC_INDEXABLE === "true";

// Content Signals — https://contentsignals.org/
//   search=yes     allow appearing in search results
//   ai-input=yes   allow use as context for AI answers (RAG / cited responses)
//   ai-train=no    opt out of model training
const BODY = `# Content Signals — https://contentsignals.org/
User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
${INDEXABLE ? "Allow: /" : "Disallow: /"}

Sitemap: https://mitchdesigns.com/sitemap.xml
`;

export function GET() {
  return new NextResponse(BODY, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
