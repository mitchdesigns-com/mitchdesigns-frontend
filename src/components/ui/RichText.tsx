"use client";

import Link from "next/link";
import type { RichText as RichTextContent } from "@/lib/cms/types";
import { normalizeRichTextHref } from "@/lib/richTextHref";

type TextNode = {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

type LinkNode = {
  type: "link";
  url: string;
  children: TextNode[];
};

type InlineNode = TextNode | LinkNode;

type ListItemNode = {
  type: "list-item";
  children: InlineNode[];
};

type BlockNode =
  | { type: "paragraph"; children: InlineNode[] }
  | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; children: InlineNode[] }
  | { type: "list"; format: "ordered" | "unordered"; children: ListItemNode[] }
  | { type: "quote"; children: InlineNode[] }
  | { type: "code"; children: TextNode[] }
  | { type: "image"; image: { url: string; alternativeText?: string | null }; children: InlineNode[] };

function renderInline(node: InlineNode, key: number) {
  if (node.type === "link") {
    return (
      <Link key={key} href={normalizeRichTextHref(node.url)} className="underline underline-offset-2 hover:opacity-70">
        {node.children.map((c, i) => renderInline(c, i))}
      </Link>
    );
  }
  let content: React.ReactNode = node.text;
  if (node.bold) content = <strong key={key}>{content}</strong>;
  if (node.italic) content = <em key={key}>{content}</em>;
  if (node.underline) content = <u key={key}>{content}</u>;
  if (node.strikethrough) content = <s key={key}>{content}</s>;
  if (node.code) content = <code key={key} className="rounded bg-panel px-1 py-0.5 font-mono text-sm">{content}</code>;
  return <span key={key}>{content}</span>;
}

const HEADING: Record<number, string> = {
  1: "text-hero-2 font-bold",
  2: "text-hero-3 font-bold",
  3: "text-2xl font-bold",
  4: "text-xl font-semibold",
  5: "text-lg font-semibold",
  6: "text-base font-semibold",
};

function renderBlock(block: BlockNode, key: number) {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={key} className="text-balance">
          {block.children.map((c, i) => renderInline(c, i))}
        </p>
      );
    case "heading": {
      const Tag = `h${block.level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      return (
        <Tag key={key} className={HEADING[block.level]}>
          {block.children.map((c, i) => renderInline(c, i))}
        </Tag>
      );
    }
    case "list": {
      const Tag = block.format === "ordered" ? "ol" : "ul";
      const listClass = block.format === "ordered" ? "list-decimal" : "list-disc";
      return (
        <Tag key={key} className={`${listClass} pl-5`}>
          {block.children.map((item, i) => (
            <li key={i}>
              {item.children.map((c, j) => renderInline(c, j))}
            </li>
          ))}
        </Tag>
      );
    }
    case "quote":
      return (
        <blockquote key={key} className="border-l-4 border-yellow pl-4 italic text-fg-muted">
          {block.children.map((c, i) => renderInline(c, i))}
        </blockquote>
      );
    case "code":
      return (
        <pre key={key} className="overflow-x-auto rounded-card-sm bg-panel p-4 font-mono text-sm">
          <code>{block.children.map((c) => c.text).join("")}</code>
        </pre>
      );
    case "image":
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={key}
          src={block.image.url}
          alt={block.image.alternativeText ?? ""}
          className="rounded-card-sm"
        />
      );
    default:
      return null;
  }
}

type Props = {
  content: RichTextContent;
  className?: string;
};

export function RichText({ content, className }: Props) {
  if (!content) return null;

  // Fixture fallback: plain string → single paragraph
  if (typeof content === "string") {
    return (
      <div className={className}>
        <p className="text-balance">{content}</p>
      </div>
    );
  }

  if (!Array.isArray(content)) return null;

  return (
    <div className={`flex flex-col gap-4 ${className ?? ""}`}>
      {(content as BlockNode[]).map((block, i) => renderBlock(block, i))}
    </div>
  );
}
