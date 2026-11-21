import type { ComponentProps } from "react";
import NextImage from "next/image";

/**
 * Light grey shimmer shown behind every image while it loads. next/image
 * paints it as the image's background and clears it the moment the image
 * has loaded, so transparent logos and icons end up on their own background.
 */
const SHIMMER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#ececec"/><stop offset="0.5" stop-color="#f7f7f7"/><stop offset="1" stop-color="#ececec"/></linearGradient></defs><rect width="400" height="300" fill="#ececec"/><rect width="400" height="300" fill="url(#g)"><animate attributeName="x" from="-400" to="400" dur="1.3s" repeatCount="indefinite"/></rect></svg>`;

export const IMAGE_SHIMMER = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(SHIMMER_SVG)}` as `data:image/${string}`;

/**
 * next/image with the site's loading state: a light grey shimmer until the
 * picture arrives. Same props as next/image; pass `placeholder="empty"` to
 * opt out (e.g. tiny icons).
 */
export default function Image(props: ComponentProps<typeof NextImage>) {
  return <NextImage placeholder={IMAGE_SHIMMER} {...props} />;
}
