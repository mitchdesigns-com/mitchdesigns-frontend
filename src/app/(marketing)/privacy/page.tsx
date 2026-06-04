import type { Metadata } from "next";
import { LegalDocument } from "@/features/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy Policy — MitchDesigns",
  description:
    "How MitchDesigns collects, uses, and protects your personal data across our website and services.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const UPDATED = "June 4, 2026";

export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy Policy" updated={UPDATED}>
      <p>
        This Privacy Policy explains how MitchDesigns (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects, uses, and safeguards
        your information when you visit mitchdesigns.com or engage our design and
        development services. By using our website you agree to the practices
        described here.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We collect information you provide directly — such as your name, email
        address, phone number, and project details when you submit a proposal
        request, book a call, or contact us. We also collect limited technical
        data automatically, including IP address, browser type, device
        information, and pages visited, through cookies and analytics tools.
      </p>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To respond to your enquiries and prepare project proposals.</li>
        <li>To deliver, maintain, and improve our services.</li>
        <li>
          To send relevant updates and marketing communications where you have
          consented.
        </li>
        <li>To analyze website usage and improve performance and content.</li>
        <li>To comply with legal obligations and protect our rights.</li>
      </ul>

      <h2>Cookies &amp; Analytics</h2>
      <p>
        We use cookies and similar technologies to operate the site and measure
        traffic. You can control non-essential cookies through your browser
        settings or our consent banner. Disabling cookies may affect some
        features.
      </p>

      <h2>Sharing Your Information</h2>
      <p>
        We do not sell your personal data. We may share it with trusted service
        providers (e.g. hosting, analytics, email, and payment processors) who
        process it on our behalf under appropriate safeguards, or where required
        by law.
      </p>

      <h2>Data Retention &amp; Security</h2>
      <p>
        We retain personal data only as long as necessary for the purposes
        described or as required by law, and we apply reasonable technical and
        organizational measures to protect it against unauthorized access, loss,
        or misuse.
      </p>

      <h2>Your Rights</h2>
      <p>
        Depending on your location, you may have the right to access, correct,
        delete, or restrict the processing of your personal data, and to
        withdraw consent at any time. To exercise these rights, contact us at the
        address below.
      </p>

      <h2>Contact Us</h2>
      <p>
        For any questions about this Privacy Policy or your data, email us at{" "}
        <a href="mailto:hello@mitchdesigns.com">hello@mitchdesigns.com</a>.
      </p>
    </LegalDocument>
  );
}
