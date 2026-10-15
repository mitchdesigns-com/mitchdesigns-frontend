/**
 * Fast project montages shown in service heroes. Front-end only: these are
 * curated portfolio shots in /public, not CMS content.
 */
export type ReelShot = {
  src: string;
  alt: string;
  label: string;
  /** The shot's flat backdrop colour — fills the box around the uncropped
   *  shot so it never shows bars, whatever the box's aspect ratio. */
  backdrop: string;
  /** Photographic shots (no flat backdrop): fill the box edge to edge
   *  (cover) instead of fitting whole. */
  cover?: boolean;
};

const DARK = "#1d1d1b";

const reelShot =
  (folder: string, kind: string) =>
  (file: string, label: string, backdrop: string): ReelShot => ({
    src: `/images/services/${folder}/${file}.webp`,
    alt: `${label} ${kind} designed by MitchDesigns`,
    label,
    backdrop,
  });

const shot = reelShot("corporate-reel", "website layout");
const storeShot = reelShot("ecommerce-reel", "online store layout");

/** Flat UI layouts (cards, heroes, forms, configurators) from our corporate
 *  projects — no cover mockups. Each design is cut out of its case-study
 *  export and set on a clean backdrop picked by a contrast check (≥1.6:1
 *  against the design's edge); pale-on-pale shots and Geely's dark purple
 *  were left out. Interleaved so neighbouring shots differ. */
export const CORPORATE_REEL: ReelShot[] = [
  shot("01-g-developments-pair1", "G Developments", DARK),
  shot("02-soueast-pair1", "Soueast", DARK),
  shot("03-cifc-pair2", "CIFC", "#eaeaea"),
  shot("04-laverde-pair1", "Laverde", "#efefef"),
  shot("05-im-motors-pair2", "IM Motors", "#999793"),
  shot("06-ntg-pair2", "NTG", "#eaeaea"),
  shot("07-geely-pair1", "Geely", "#a2aff6"),
  shot("08-people-and-places-pair1", "People & Places", DARK),
  shot("09-g-developments-pair2", "G Developments", "#eaeaea"),
  shot("10-ecral-pair1", "Ecral", DARK),
  shot("11-smart-light-pair2", "Smart Light", "#f3f3f5"),
  shot("12-n-development-pair1", "N Development", "#eeebc5"),
  shot("13-axton-robotics-pair2", "Axton Robotics", DARK),
  shot("14-cifc-pair1", "CIFC", "#eaeaea"),
  shot("15-soueast-pair2", "Soueast", DARK),
  shot("16-el-gouna-pair1", "El Gouna", "#9eabb0"),
  shot("17-laverde-pair2", "Laverde", "#a3aeaf"),
  shot("18-rihlati-pair1", "Rihlati", DARK),
  shot("19-fort-arabesque-pair2", "Fort Arabesque", "#f6f6f6"),
  shot("20-ntg-pair1", "NTG", "#eaeaea"),
];

/** Flat store UI (product cards, product pages, promos, reviews) from our
 *  eCommerce projects, built by Case-studies/_pipeline/service-reels/
 *  build_reel.py; photo-only exports left out. Sally Helmy's cards, Abu
 *  Auf's card and tracker and Exception's tabs play as animated beats
 *  instead (src/features/services/ecommerceReel). */
export const ECOMMERCE_SHOTS = {
  fregys1: storeShot("02-fregys-pair1", "Fregys", "#ffeaef"),
  kouider1: storeShot("03-kouider-pair1", "Kouider", DARK),
  exception2: storeShot("04-exception-pair2", "Exception", "#f3f3f5"),
  saleSucre1: storeShot("05-sale-sucre-pair1", "Sale Sucre", DARK),
  sallyHelmy2: storeShot("07-sally-helmy-pair2", "Sally Helmy", DARK),
  kouider2: storeShot("08-kouider-pair2", "Kouider", DARK),
  fregys2: storeShot("10-fregys-pair2", "Fregys", DARK),
  saleSucre2: storeShot("11-sale-sucre-pair2", "Sale Sucre", DARK),
};

/** Mobile-app shots: finished phone photos from /public/images/mobile-app,
 *  filling the box edge to edge; unlabelled (no project name on the files). */
const appPhoto = (frame: string): ReelShot => ({
  src: encodeURI(`/images/mobile-app/Frame ${frame}.webp`),
  alt: "Mobile app screens designed by MitchDesigns",
  label: "",
  backdrop: DARK,
  cover: true,
});

// Interleaved so similar apps (finance, rides, food, travel) never sit together.
export const MOBILE_REEL: ReelShot[] = [
  "2147227611", "2147227615", "2147227620", "2147227612", "2147227617", "2147227621",
  "2147227614", "2147227616", "2147227622", "2147227613", "2147227618",
].map(appPhoto);

/** Custom platform shots: our designers' own 1680×900 exports for Ecral
 *  and Rihlati (/public/images/custom-design, transparent backgrounds),
 *  alternating, on the dark backdrop. `custom- 5` duplicates `custom- 4`. */
const customShot = (n: number, label: string): ReelShot => ({
  src: encodeURI(`/images/custom-design/custom- ${n}.webp`),
  alt: `${label} custom platform designed by MitchDesigns`,
  label,
  backdrop: DARK,
});

export const CUSTOM_REEL: ReelShot[] = [
  customShot(1, "Ecral"),
  customShot(6, "Rihlati"),
  customShot(3, "Ecral"),
  customShot(7, "Rihlati"),
  customShot(4, "Ecral"),
  customShot(8, "Rihlati"),
  customShot(2, "Ecral"),
];
