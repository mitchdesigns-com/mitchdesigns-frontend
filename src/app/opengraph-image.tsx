import { ImageResponse } from "next/og";

export const alt = "MitchDesigns - Website & Mobile App Design Agency in Egypt";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg
            width="40"
            height="40"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="48" height="48" fill="#FFDB00" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M39.9048 40.9604L39.8694 6.40039L24.0839 19.3979L8.90306 6.41873L8.86836 6.40039V6.41114L8.87825 6.40326L8.89707 6.42246L8.80078 40.9604L17.5075 40.937V24.7063L24.0499 31.0666L31.1628 24.3874V40.937L39.9048 40.9604Z"
              fill="#171717"
            />
          </svg>
          <span style={{ color: "#ffffff", fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px" }}>
            MitchDesigns
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p
            style={{
              color: "#888888",
              fontSize: "18px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Website &amp; Mobile App Design, Egypt </p>
          <h1
            style={{
              color: "#ffffff",
              fontSize: "64px",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-2px",
              margin: 0,
              maxWidth: "800px",
            }}
          >
            We build digital experiences that convert.
          </h1>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #222222",
            paddingTop: "24px",
          }}
        >
          <span style={{ color: "#555555", fontSize: "16px" }}>
            mitchdesigns.com
          </span>
          <span style={{ color: "#555555", fontSize: "16px" }}>
            Premium design. No templates.
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
