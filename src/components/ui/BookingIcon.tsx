import { CalendarCheckIcon } from "@/components/icons/CalendarCheckIcon";
import { isLeadFunnelHref } from "@/config/nav";

/**
 * Calendar icon for CTAs that book a consultation (links into the lead
 * funnel); renders nothing for any other link. Tilts a little on hover when
 * the button has the `group` class.
 */
export function BookingIcon({ href, size = 18 }: { href?: string | null; size?: number }) {
  if (!isLeadFunnelHref(href)) return null;
  return (
    <CalendarCheckIcon
      size={size}
      className="shrink-0 transition-transform duration-300 ease-out-soft group-hover:-rotate-12 group-hover:scale-110"
    />
  );
}
