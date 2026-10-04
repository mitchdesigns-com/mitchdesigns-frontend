/**
 * Fast project montages shown in service heroes. Front-end only: these are
 * curated portfolio shots in /public, not CMS content.
 */
export type ReelShot = { src: string; alt: string; label: string };

const shot = (file: string, label: string): ReelShot => ({
  src: `/images/services/corporate-reel/${file}.webp`,
  alt: `${label} website layout designed by MitchDesigns`,
  label,
});

/** Flat UI layouts (cards, heroes, forms, configurators) from our corporate
 *  projects — no cover mockups. Each design is cut out of its case-study
 *  export and set on a clean backdrop picked by a contrast check (≥1.6:1
 *  against the design's edge); pale-on-pale shots and Geely's dark purple
 *  were left out. Interleaved so neighbouring shots differ. */
export const CORPORATE_REEL: ReelShot[] = [
  shot("01-g-developments-pair1", "G Developments"),
  shot("02-soueast-pair1", "Soueast"),
  shot("03-cifc-pair2", "CIFC"),
  shot("04-laverde-pair1", "Laverde"),
  shot("05-im-motors-pair2", "IM Motors"),
  shot("06-ntg-pair2", "NTG"),
  shot("07-geely-pair1", "Geely"),
  shot("08-people-and-places-pair1", "People & Places"),
  shot("09-g-developments-pair2", "G Developments"),
  shot("10-ecral-pair1", "Ecral"),
  shot("11-smart-light-pair2", "Smart Light"),
  shot("12-n-development-pair1", "N Development"),
  shot("13-axton-robotics-pair2", "Axton Robotics"),
  shot("14-cifc-pair1", "CIFC"),
  shot("15-soueast-pair2", "Soueast"),
  shot("16-el-gouna-pair1", "El Gouna"),
  shot("17-laverde-pair2", "Laverde"),
  shot("18-rihlati-pair1", "Rihlati"),
  shot("19-fort-arabesque-pair2", "Fort Arabesque"),
  shot("20-ntg-pair1", "NTG"),
];
