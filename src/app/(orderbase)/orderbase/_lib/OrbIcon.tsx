import { ORB_ICONS, ORB_ICON_DEFS, type Orb3DIconName } from "./icons3d";

/** Renders the shared gradient <defs> once. Drop near the top of the page. */
export function OrbIconDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      dangerouslySetInnerHTML={{ __html: ORB_ICON_DEFS }}
    />
  );
}

/** A single 3D icon by name. Size is controlled by the parent's width/height. */
export function OrbIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const inner = ORB_ICONS[name as Orb3DIconName] ?? ORB_ICONS.cube;
  return (
    <span
      aria-hidden="true"
      className={`ob-i3d inline-flex items-center justify-center overflow-visible ${className ?? ""}`}
      dangerouslySetInnerHTML={{
        __html: `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`,
      }}
    />
  );
}
