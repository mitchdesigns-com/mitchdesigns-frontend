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
export function blocksToText(raw: unknown): string | undefined {
  if (typeof raw === "string") return raw || undefined;
  if (!Array.isArray(raw)) return undefined;
  const text = raw
    .map((block: any) =>
      Array.isArray(block?.children)
        ? block.children.map((c: any) => c?.text ?? "").join("")
        : "",
    )
    .join("\n\n")
    .trim();
  return text || undefined;
}
