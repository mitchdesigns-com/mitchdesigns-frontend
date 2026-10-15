/**
 * Project covers for the case-studies list, fitted to its 940:580 frame
 * (front-end only — built from Case-studies/Cover-images by
 * Case-studies/_pipeline/list-covers/fit_covers.py). Projects not listed
 * here keep their CMS cover.
 */
const SLUGS = new Set([
  "abu-auf", "axton-robotics", "cifc", "ecral", "el-gouna", "exception", "fam-beef",
  "fort-arabesque", "fregys", "g-developments", "geely", "im-motors", "kemetland",
  "kouider", "la-poire", "laverde", "n-development", "ntg", "people-and-places",
  "rihlati", "sage", "sale-sucre", "sally-helmy", "smart-light", "soueast", "tank",
]);

export function listCover(slug: string): string | undefined {
  return SLUGS.has(slug) ? `/images/case-studies/covers/${slug}.webp` : undefined;
}
