/**
 * front-edit annotation helper. Renders a plain wrapper in normal mode; in edit
 * mode it adds the `data-fe` attribute the overlay looks for. Zero runtime cost
 * when edit mode is off. Safe in Server Components (pure render).
 *
 * `field` accepts a nested component path resolved by the plugin's save service:
 *   "hero.titleLead", "pricing.plans.1.name", "pricing.compare.groups.0.rows.2.standard"
 *
 * type: text | richtext | image | images | number | bool | date | email | url | enum
 * Non-localized fields: pass `shared` and omit `locale`.
 */
type FeType =
  | "text"
  | "richtext"
  | "image"
  | "images"
  | "number"
  | "bool"
  | "date"
  | "email"
  | "url"
  | "enum";

export function Editable({
  uid,
  documentId,
  field,
  locale = "",
  type = "text",
  shared = true,
  enumValues,
  raw,
  as: Tag = "span",
  editMode = false,
  children,
  ...rest
}: {
  uid: string;
  documentId?: string;
  field: string;
  locale?: string;
  type?: FeType;
  shared?: boolean;
  enumValues?: string[];
  raw?: string;
  as?: React.ElementType;
  editMode?: boolean;
  children?: React.ReactNode;
} & Record<string, unknown>) {
  if (!editMode || !documentId) return <Tag {...rest}>{children}</Tag>;
  return (
    <Tag
      {...rest}
      data-fe={`${uid}|${documentId}|${field}|${shared ? "" : locale}|${type}|${shared ? "1" : ""}`}
      {...(enumValues ? { "data-fe-enum": enumValues.join("|") } : {})}
      {...(raw !== undefined ? { "data-fe-raw": raw } : {})}
    >
      {children}
    </Tag>
  );
}
