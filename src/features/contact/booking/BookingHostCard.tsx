import Image from "next/image";

import { ClockIcon } from "@/components/icons/ClockIcon";
import { VideoIcon } from "@/components/icons/VideoIcon";

type Props = {
  name?: string;
  meetingTitle?: string;
  duration?: string;
  conferencing?: string;
};

/**
 * Who the visitor is booking with and what the meeting is, above the
 * calendar. Same card as md-leads' CalHostCard in the funnel, for the same
 * Cal.com event. Copy comes from the contact page in Strapi.
 */
export function BookingHostCard({ name, meetingTitle, duration, conferencing }: Props) {
  if (!name && !meetingTitle) return null;
  return (
    <div className="flex items-start gap-4 border-b border-border pb-6">
      <div className="relative size-14 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
        <Image src="/images/christina-host.webp" alt={name ?? ""} fill sizes="56px" className="object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {name && <p className="text-sm text-fg-muted text-balance">{name}</p>}
        {meetingTitle && <h3 className="text-xl font-bold leading-tight text-fg text-balance">{meetingTitle}</h3>}
        <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-fg">
          {duration && (
            <span className="flex items-center gap-2 font-medium">
              <ClockIcon size={18} className="shrink-0" />
              {duration}
            </span>
          )}
          {conferencing && (
            <span className="flex items-center gap-2">
              <VideoIcon size={18} className="shrink-0" />
              {conferencing}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
