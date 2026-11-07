// Rewrites em/en dashes in copy (Malak's rule: no "—" in site text).
//   undash("isn't just a bonus—it's critical")  → "isn't just a bonus. It's critical"
//   undash("results — conversions, traffic — not vanity") → "results, conversions, traffic, not vanity"
//   undash("10–14 weeks") → "10 to 14 weeks";  undash("X — Case Study", { title: true }) → "X | Case Study"
const DASH = /[ \t]*[—–][ \t]*/;
// A new sentence starts after the dash when the next word opens a clause.
const CLAUSE = /^(it|it's|it’s|it'll|it’ll|they|they're|they’re|they'll|they’ll|we|we're|we’re|we'll|we’ll|you|you're|you’re|you'll|you’ll|that's|that’s|this|these|those|there|there's|there’s|here's|here’s|he|she|i|i'm|i’m|everything|nothing|everyone|most|many|some|one|our|your|their|guess)$/i;
const JOIN = /^(and|but|or|not|so|which|while|whether|where|when|whatever)$/i;

export function undash(text, { title = false, inline = false } = {}) {
  if (typeof text !== "string" || !/[—–]/.test(text)) return text;
  let s = text;
  // Number ranges: 10–14, 500 — 2,000
  s = s.replace(/(\d[\d,.]*)\s*[—–]\s*(\d)/g, "$1 to $2");
  // Titles ("Abu Auf — Case Study", "X — MitchDesigns") get a bar.
  if (title || /[—–]\s*(Case Study|MitchDesigns|Mitch Designs)\s*$/.test(s)) return s.replace(/[ \t]*[—–][ \t]*/g, " | ");
  // A dash at either end of the text. Inside rich text (`inline`) it joins
  // this run to its neighbour, so it becomes a comma; on its own it just goes.
  s = s.replace(/^\s*[—–]\s*/, inline ? ", " : "");
  s = s.replace(/\s*[—–]\s*$/, inline ? ", " : "");
  // Headings in Title Case keep a comma ("Stage One, Discovery").
  const words = s.split(/\s+/).filter((w) => /^\p{L}/u.test(w));
  const titleCase = words.length > 1 && words.filter((w) => /^\p{Lu}/u.test(w)).length / words.length > 0.6;
  // Work left to right so a "— aside —" pair becomes ", aside,".
  let out = "";
  let rest = s;
  let openAside = false;
  while (true) {
    const m = rest.match(DASH);
    if (!m) { out += rest; break; }
    const before = rest.slice(0, m.index);
    const after = rest.slice(m.index + m[0].length);
    const word = (after.match(/^[\p{L}'’]+/u) ?? [""])[0];
    const sentenceEnd = /[.!?…]$/.test(before);
    let sep;
    if (sentenceEnd) sep = " ";
    else if (openAside) { sep = ", "; openAside = false; }
    else if (
      !titleCase &&
      ((CLAUSE.test(word) && !/^(I|Our|Your|Their)$/.test(word)) ||
        (/^\p{Lu}\p{Ll}/u.test(word) && word !== "I"))
    ) {
      // New sentence: "bonus. It's critical"
      out += before + ". ";
      rest = after.replace(/^\p{L}/u, (c) => c.toUpperCase());
      continue;
    } else if (JOIN.test(word)) sep = ", ";
    else {
      // An aside closes with a second dash later in the same sentence.
      const nextDash = after.search(/[—–]/);
      const nextStop = after.search(/[.!?]/);
      openAside = nextDash !== -1 && (nextStop === -1 || nextDash < nextStop);
      sep = ", ";
    }
    // Keep the next word's case unless it was only capitalised by the dash style.
    out += before.replace(/[,;]$/, "") + sep;
    rest = after;
  }
  // Tidy spaces only; line breaks (paragraphs in text fields) stay.
  return out.replace(/[ \t]+,/g, ",").replace(/,{2,}/g, ",").replace(/[ \t]{2,}/g, " ");
}

// Quick self-check: node scripts/undash.mjs
if (import.meta.url === `file://${process.argv[1]}`) {
  const cases = [
    "Your website isn’t just an online brochure—it’s your digital storefront.",
    "We measure success by real impact — conversions, traffic, and operational efficiency — not vanity metrics.",
    "Hear it from the brands and people who trusted us — genuine feedback that tells our story better than we can.",
    "Do you use ChatGPT in your daily life? Guess what—Your customers do too!",
    "Stage One – Discovery",
    "1. Customers Won’t Wait—They’ll Leave",
    "500 — 2,000 EGP",
    "—keeping things running smoothly after the initial design excitement.",
    "If people see your ad too many times, they’ll start to tune it out—or worse, get annoyed.",
    "Expert Media Buying Strategies for Brand Growth. Say Goodbye to Trial and Error – Save Time and Money with Proven Strategies That Deliver Results.",
  ];
  for (const c of cases) console.log(undash(c));
  console.log(undash("Abu Auf — Case Study", { title: true }));
}
