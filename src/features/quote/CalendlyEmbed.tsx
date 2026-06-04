"use client";

import { useEffect } from "react";

const CALENDLY_URL =
  "https://calendly.com/ola-ashraf-mitchdesigns/schedule-project-brief-meeting-1";

type Props = {
  /** Fired when the visitor completes a booking inside the embed. */
  onScheduled?: () => void;
};

function isCalendlyEvent(e: MessageEvent): boolean {
  return (
    typeof e.data === "object" &&
    e.data !== null &&
    "event" in e.data &&
    typeof (e.data as { event: unknown }).event === "string" &&
    (e.data as { event: string }).event.indexOf("calendly.") === 0
  );
}

export function CalendlyEmbed({ onScheduled }: Props) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!onScheduled) return;
    function handler(e: MessageEvent) {
      if (isCalendlyEvent(e) && (e.data as { event: string }).event === "calendly.event_scheduled") {
        onScheduled?.();
      }
    }
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onScheduled]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://assets.calendly.com/assets/external/widget.css"
      />
      <div
        className="calendly-inline-widget w-full"
        data-url={CALENDLY_URL}
        style={{ minWidth: 320, height: 700 }}
      />
    </>
  );
}
