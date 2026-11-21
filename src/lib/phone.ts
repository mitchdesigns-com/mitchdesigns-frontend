/** "+20 101 443 0669" from however the number is stored ("201014430669",
 *  "+201014430669"). Numbers in another shape are shown as entered. */
export function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  const eg = digits.match(/^20(\d{3})(\d{3})(\d{4})$/);
  if (eg) return `+20 ${eg[1]} ${eg[2]} ${eg[3]}`;
  return raw.trim().startsWith("+") || !/^\d+$/.test(raw.trim()) ? raw.trim() : `+${raw.trim()}`;
}
