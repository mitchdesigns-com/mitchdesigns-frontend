/**
 * No orphans: glue a block's last two words with a non-breaking space so its
 * last line never holds a single word. Wrapping then breaks one word earlier
 * (works in every browser, unlike `text-wrap: pretty`). Skipped for blocks of
 * fewer than three words, and when the glued pair would be too long to fit
 * a narrow column (`max` chars; body text can afford more than headings).
 * Hyphens in the glued pair get a word joiner so "high-performing" can't
 * leave "performing" alone either. When the pair is too long but the first
 * word is hyphenated, only its last part is glued ("Strategy-" then
 * "Led Transformation").
 */
const NBSP = "\u00a0";
const WJ = "\u2060";
const MAX_PAIR = 24;

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
// A hyphen allows a break even before a no-break space, so join every hyphen
// inside the glued pair (but not one that ends it).
const joinHyphens = (s: string) => s.replace(/-(?!$)/g, "-" + WJ);

/** Where the glued run starts in `end` (trimmed text whose last word follows
 *  `gap`), or -1 when even the shortest run is longer than `max`. */
function runStart(end: string, gap: number, max: number) {
  const prev = end.slice(0, gap).search(/\S+$/);
  if (end.length - prev <= max) return prev;
  const hyphen = end.lastIndexOf("-", gap - 1);
  return hyphen > prev && end.length - (hyphen + 1) <= max ? hyphen + 1 : -1;
}

export function noOrphan<T extends string | null | undefined>(text: T, max = MAX_PAIR): T {
  if (!text || wordCount(text) < 3) return text;
  const end = text.trimEnd();
  const gap = end.search(/\s+\S+$/);
  if (gap < 0) return text;
  const start = runStart(end, gap, max);
  if (start < 0) return text;
  const pair = joinHyphens(end.slice(start, gap) + NBSP + end.slice(gap).trimStart());
  return (end.slice(0, start) + pair + text.slice(end.length)) as T;
}

type Leaf = { text: string };
type Inline = { type: string; text?: string; children?: Leaf[] };

/** `noOrphan` for Strapi rich-text inline nodes (text and link children):
 *  returns copies with the space before the block's last word made
 *  non-breaking, wherever it falls across node boundaries. */
export function noOrphanInline<N extends Inline>(nodes: N[], max = MAX_PAIR): N[] {
  const leaves: { node: number; child: number | null; text: string }[] = [];
  nodes.forEach((n, i) => {
    if (n.children) n.children.forEach((c, j) => leaves.push({ node: i, child: j, text: c.text ?? "" }));
    else if (typeof n.text === "string") leaves.push({ node: i, child: null, text: n.text });
  });
  const full = leaves.map((l) => l.text).join("");
  if (wordCount(full) < 3) return nodes;
  const end = full.trimEnd();
  const gap = end.search(/\s\S+$/);
  const start = gap < 0 ? -1 : runStart(end, gap, max);
  if (start < 0) return nodes;

  // Rewrite only the characters of the glued pair, leaf by leaf, in copies.
  const texts = new Map<string, string>();
  let offset = 0;
  for (const leaf of leaves) {
    let text = "";
    for (let k = 0; k < leaf.text.length; k++) {
      const at = offset + k;
      const ch = leaf.text[k];
      if (at === gap) text += NBSP;
      else if (ch === "-" && at >= start && at < end.length - 1) text += "-" + WJ;
      else text += ch;
    }
    if (text !== leaf.text) texts.set(`${leaf.node}:${leaf.child}`, text);
    offset += leaf.text.length;
  }
  return nodes.map((n, i) => {
    if (n.children) {
      const kids = n.children.map((c, j) => {
        const t = texts.get(`${i}:${j}`);
        return t === undefined ? c : { ...c, text: t };
      });
      return kids.some((c, j) => c !== n.children![j]) ? { ...n, children: kids } : n;
    }
    const t = texts.get(`${i}:null`);
    return t === undefined ? n : { ...n, text: t };
  });
}
