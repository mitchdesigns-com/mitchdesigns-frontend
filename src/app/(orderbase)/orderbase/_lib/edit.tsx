import { Editable } from "@/lib/cms/Editable";

export const OB_UID = "api::orderbase-page.orderbase-page";

export type Edit = { mode: boolean; documentId?: string };

type FeType =
  | "text"
  | "richtext"
  | "image"
  | "number"
  | "bool"
  | "date"
  | "email"
  | "url"
  | "enum";

/** A field-editor bound to the orderbase entry. `f` is the nested component path
 *  (e.g. "hero.titleLead", "pricing.plans.1.name"). Passed down to sections so
 *  they stay free of uid/documentId/editMode plumbing. Renders a plain wrapper
 *  when edit mode is off. */
export type Ed = (props: {
  f: string;
  as?: React.ElementType;
  type?: FeType;
  enumValues?: string[];
  raw?: string;
  className?: string;
  children?: React.ReactNode;
}) => React.ReactElement;

export function makeEd(edit?: Edit): Ed {
  return function Ed({ f, children, ...rest }) {
    return (
      <Editable
        uid={OB_UID}
        documentId={edit?.documentId}
        field={f}
        editMode={Boolean(edit?.mode)}
        shared={false}
        {...rest}
      >
        {children}
      </Editable>
    );
  };
}
