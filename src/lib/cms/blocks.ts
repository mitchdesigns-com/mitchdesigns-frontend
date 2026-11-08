/**
 * Flatten Strapi blocks (rich text) into a plain string.
 *
 * Each top-level block becomes a paragraph joined by "\n\n"; inline marks
 * (bold/links/etc.) are intentionally dropped — callers that want formatted
 * output should render the raw blocks with <RichText> instead. Strings pass
 * through unchanged, so this is safe on legacy/fixture text and idempotent.
 *
 * Pure + client-safe (no server-only imports) so client components can use it.
 */
type InlineNode = { text?: string };
type Block = { children?: InlineNode[] };

export function blocksToText(raw: unknown): string | undefined {
  if (typeof raw === "string") return raw || undefined;
  if (!Array.isArray(raw)) return undefined;
  const text = (raw as Block[])
    .map((block) =>
      Array.isArray(block?.children)
        ? block.children.map((c) => c?.text ?? "").join("")
        : "",
    )
    .join("\n\n")
    .trim();
  return text || undefined;
}

/**
 * Bold runs in a `blocks` value, located in the string blocksToText returns
 * (same joining), e.g. to style words an editor bolded in Strapi.
 */
export function blocksBoldRuns(raw: unknown): { phrase: string; at: number }[] {
  if (!Array.isArray(raw)) return [];
  const runs: { phrase: string; at: number }[] = [];
  let at = 0;
  (raw as Block[]).forEach((block, b) => {
    if (b > 0) at += 2; // "\n\n" between blocks
    for (const c of Array.isArray(block?.children) ? block.children : []) {
      const t = c?.text ?? "";
      if ((c as { bold?: boolean })?.bold && t.trim()) runs.push({ phrase: t, at });
      at += t.length;
    }
  });
  // blocksToText trims the start; shift by what it removed.
  const joined = (raw as Block[]).map((bl) => (Array.isArray(bl?.children) ? bl.children.map((c) => c?.text ?? "").join("") : "")).join("\n\n");
  const lead = joined.length - joined.trimStart().length;
  return runs.map((r) => ({ ...r, at: r.at - lead }));
}
