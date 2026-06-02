import Link from "next/link";
import type { Talk, BlogSection } from "@/lib/cms/types";
import { Section } from "@/components/layout/Section";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { TocSidebar } from "./TocSidebar";
import { BlockImage } from "./BlockImage";

// ── Strapi Blocks types ────────────────────────────────────────────────────

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

type ParagraphBlock = { type: "paragraph"; children: InlineNode[] };
type HeadingBlock = {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: InlineNode[];
};
type QuoteBlock = { type: "quote"; children: InlineNode[] };
type ImageBlock = {
  type: "image";
  image: {
    url: string;
    alternativeText?: string | null;
    caption?: string | null;
  };
  children: InlineNode[];
};
type ListItemBlock = { type: "list-item"; children: InlineNode[] };
type ListBlock = {
  type: "list";
  format: "ordered" | "unordered";
  children: ListItemBlock[];
};
type CodeBlock = { type: "code"; children: InlineNode[] };

type Block =
  | ParagraphBlock
  | HeadingBlock
  | QuoteBlock
  | ImageBlock
  | ListBlock
  | CodeBlock;

// ── TOC extraction ─────────────────────────────────────────────────────────

export type TocItem = { label: string; href: string };

function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeRichTextHref(href: string) {
  if (href.startsWith("/")) return href;

  try {
    const url = new URL(href);
    if (url.hostname === "mitchdesigns.com" || url.hostname === "www.mitchdesigns.com") {
      const path = url.pathname.replace(/\/+$/, "");
      const segments = path.split("/").filter(Boolean);
      if (path.startsWith("/talks/")) {
        return `${path}${url.search}${url.hash}`;
      }
      if (segments.length && segments[0].startsWith("talks")) {
        return `/talks/${segments[segments.length - 1]}${url.search}${url.hash}`;
      }
      return `${path}${url.search}${url.hash}`;
    }
  } catch {
    // ignore invalid URLs and return original href
  }

  return href;
}

function blockText(children: InlineNode[]): string {
  return children
    .map((c) =>
      c.type === "text" ? c.text : c.type === "link" ? c.children.map((child) => child.text).join("") : ""
    )
    .join("");
}

export function extractToc(sections: BlogSection[] | undefined): TocItem[] {
  if (!sections) return [];
  const toc: TocItem[] = [];
  for (const section of sections) {
    if (section.__component !== "blocks.rich-text") continue;
    if (!Array.isArray(section.body)) continue;
    for (const block of section.body as Block[]) {
      if (block.type === "heading" && block.level <= 3) {
        const label = blockText(block.children);
        toc.push({ label, href: `#${headingId(label)}` });
      }
    }
  }
  return toc;
}

// ── Inline text renderer ───────────────────────────────────────────────────

function Inline({ nodes }: { nodes: InlineNode[] }) {
  return (
    <>
      {nodes.map((node, i) => {
        if (node.type === "link") {
          return (
            <Link
              key={i}
              href={normalizeRichTextHref(node.url)}
              className="underline underline-offset-2 hover:opacity-70"
            >
              {node.children.map((child, j) => {
                let el: React.ReactNode = child.text;
                if (child.bold) el = <strong key={j}>{el}</strong>;
                if (child.italic) el = <em key={j}>{el}</em>;
                if (child.underline) el = <u key={j}>{el}</u>;
                if (child.strikethrough) el = <s key={j}>{el}</s>;
                if (child.code)
                  el = (
                    <code
                      key={j}
                      className="rounded-xs bg-panel px-1 font-mono text-code-inline"
                    >
                      {el}
                    </code>
                  );
                return <span key={j}>{el}</span>;
              })}
            </Link>
          );
        }

        let el: React.ReactNode = node.text;
        if (node.bold) el = <strong key={i}>{el}</strong>;
        if (node.italic) el = <em key={i}>{el}</em>;
        if (node.underline) el = <u key={i}>{el}</u>;
        if (node.strikethrough) el = <s key={i}>{el}</s>;
        if (node.code)
          el = (
            <code
              key={i}
              className="rounded-xs bg-panel px-1 font-mono text-code-inline"
            >
              {el}
            </code>
          );
        return <span key={i}>{el}</span>;
      })}
    </>
  );
}

// ── Block renderers ────────────────────────────────────────────────────────

function BlockParagraph({ block }: { block: ParagraphBlock }) {
  return (
    <p className="text-pretty text-blog-body text-black">
      <Inline nodes={block.children} />
    </p>
  );
}

function BlockHeading({ block }: { block: HeadingBlock }) {
  const text = blockText(block.children);
  const id = headingId(text);

  const Tag = `h${block.level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  const className =
    block.level <= 2
      ? "text-hero-4 text-black mt-10 text-pretty"
      : "text-blog-h3 text-black border-l-[3px] border-yellow pl-3";

  return (
    <Tag id={id} className={className}>
      <Inline nodes={block.children} />
    </Tag>
  );
}

function BlockQuote({ block }: { block: QuoteBlock }) {
  return (
    <blockquote className="inline-flex items-center border-l-[3px] border-yellow px-3 py-1">
      <span className="text-blog-quote text-black">
        <Inline nodes={block.children} />
      </span>
    </blockquote>
  );
}


function BlockList({ block }: { block: ListBlock }) {
  const Tag = block.format === "ordered" ? "ol" : "ul";
  const markerClass = block.format === "ordered" ? "list-decimal" : "list-disc";
  return (
    <Tag
      className={`flex flex-col gap-2 pl-6 text-blog-body text-black ${markerClass}`}
    >
      {block.children.map((item, i) => (
        <li key={i}>
          <Inline nodes={item.children} />
        </li>
      ))}
    </Tag>
  );
}

function BlockCode({ block }: { block: CodeBlock }) {
  return (
    <pre className="overflow-x-auto rounded-xs bg-space-grey p-6 text-sm leading-[1.6] text-bej">
      <code>{blockText(block.children)}</code>
    </pre>
  );
}

// ── Rich text section ──────────────────────────────────────────────────────

function RichTextSection({ body }: { body: unknown }) {
  if (!Array.isArray(body)) return null;
  return (
    <div className="flex flex-col gap-5 blog-content">
      {(body as Block[]).map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return <BlockParagraph key={i} block={block} />;
          case "heading":
            return <BlockHeading key={i} block={block} />;
          case "quote":
            return <BlockQuote key={i} block={block} />;
          case "image":
            return (
              <BlockImage
                key={i}
                url={block.image.url}
                alt={block.image.alternativeText ?? ""}
                caption={block.image.caption ?? block.image.alternativeText}
              />
            );
          case "list":
            return <BlockList key={i} block={block} />;
          case "code":
            return <BlockCode key={i} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

// ── Sections renderer ──────────────────────────────────────────────────────

function TalkSections({ sections }: { sections?: BlogSection[] }) {
  if (!sections?.length) return null;
  return (
    <>
      {sections.map((section, i) => {
        if (section.__component === "blocks.rich-text") {
          return <RichTextSection key={i} body={section.body} />;
        }
        if (section.__component === "blocks.media-block") {
          return (
            <BlockImage
              key={i}
              url={section.file.url}
              alt={section.file.alternativeText ?? section.caption ?? ""}
              caption={section.caption}
            />
          );
        }
        return null;
      })}
    </>
  );
}

// ── TOC sidebar ────────────────────────────────────────────────────────────

// ── Social share ───────────────────────────────────────────────────────────

function ShareButtons({ url, title }: { url: string; title: string }) {
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
          <path
            d="M20 6h-3a5 5 0 0 0-5 5v3H9v4h3v8h4v-8h3l1-4h-4V11a1 1 0 0 1 1-1h3V6Z"
            fill="#ffdb00"
          />
        </svg>
      ),
    },
    {
      label: "Instagram",
      href: `https://www.instagram.com/`,
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
          <rect
            x="4"
            y="4"
            width="24"
            height="24"
            rx="6"
            stroke="#ffdb00"
            strokeWidth="2"
          />
          <circle cx="16" cy="16" r="5" stroke="#ffdb00" strokeWidth="2" />
          <circle cx="22.5" cy="9.5" r="1.5" fill="#ffdb00" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encoded}&title=${encodedTitle}`,
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
          <path
            d="M8 12h4v12H8V12ZM10 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM14 12h3.6v1.7h.05c.5-.95 1.7-1.95 3.5-1.95C24.6 11.75 25 14 25 17v7h-4v-6.2c0-1.5-.03-3.4-2.1-3.4-2.1 0-2.4 1.6-2.4 3.3V24H14V12Z"
            fill="#ffdb00"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-black">
        Share Talk via:
      </span>
      <div className="flex gap-3">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${l.label}`}
            className="flex size-10 items-center justify-center rounded-sm bg-black p-1"
          >
            {l.icon}
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Nav buttons ────────────────────────────────────────────────────────────

function NavButton({
  href,
  label,
  direction,
}: {
  href: string;
  label: string;
  direction: "prev" | "next";
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-pill bg-space-grey px-9 py-4 text-base font-medium text-white"
    >
      {direction === "prev" && <ArrowRight size={20} className="rotate-180" />}
      {label}
      {direction === "next" && <ArrowRight size={20} />}
    </Link>
  );
}

// ── Main export ────────────────────────────────────────────────────────────

export interface TalkContentProps {
  talk: Talk;
  toc?: TocItem[];
  prev?: Pick<Talk, "slug" | "title">;
  next?: Pick<Talk, "slug" | "title">;
  pageUrl?: string;
}

export function TalkContent({
  talk,
  toc = [],
  prev,
  next,
  pageUrl = `https://mitchdesigns.com/talks/${talk.slug}`,
}: TalkContentProps) {
  return (
    <Section className="py-10">
      <div className="flex gap-10">
        {/* Left sticky sidebar */}
        <aside className="w-blog-sidebar shrink-0">
          <div className="sticky top-24 flex flex-col gap-7.5 py-10">
            <TocSidebar items={toc} />
            <ShareButtons url={pageUrl} title={talk.title} />
          </div>
        </aside>

        {/* Right content */}
        <div className="flex flex-1 flex-col gap-[100px]">
          <TalkSections sections={talk.sections} />

          {(prev || next) && (
            <div className="flex items-center justify-between">
              {prev ? (
                <NavButton
                  href={`/talks/${prev.slug}`}
                  label="Previous Talk"
                  direction="prev"
                />
              ) : (
                <span />
              )}
              {next ? (
                <NavButton
                  href={`/talks/${next.slug}`}
                  label="Next Talk"
                  direction="next"
                />
              ) : (
                <span />
              )}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
