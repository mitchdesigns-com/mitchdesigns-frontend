import type { Metadata } from "next";
import { LegalDocument } from "@/features/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Terms of Service — MitchDesigns",
  description:
    "The terms and conditions that govern your use of the MitchDesigns website and services.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const UPDATED = "June 4, 2026";

export default function TermsPage() {
  return (
    <LegalDocument title="Terms of Service" updated={UPDATED}>
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use
        of the MitchDesigns website and services. By using our website or
        engaging our services, you agree to these Terms.
      </p>

      <h2>Services</h2>
      <p>
        MitchDesigns provides website design, mobile app development, eCommerce,
        custom platform development, media buying, and SEO services. The specific
        scope, deliverables, timeline, and fees for any engagement are defined in
        a separate proposal or agreement.
      </p>

      <h2>Proposals &amp; Payment</h2>
      <p>
        Proposals are valid for the period stated within them. Project fees,
        payment schedules, and milestones are set out in your agreement. Late
        payments may pause work until resolved.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        Upon full payment, ownership of the final deliverables transfers to you,
        except for third-party assets and any pre-existing tools or frameworks we
        retain rights to. We may showcase completed work in our portfolio unless
        otherwise agreed in writing.
      </p>

      <h2>Client Responsibilities</h2>
      <ul>
        <li>Provide timely content, feedback, and approvals.</li>
        <li>Ensure you have rights to any materials you supply to us.</li>
        <li>Designate a point of contact for decisions.</li>
      </ul>

      <h2>Warranties &amp; Liability</h2>
      <p>
        Our services are provided with reasonable skill and care. To the extent
        permitted by law, MitchDesigns is not liable for indirect or
        consequential damages, and our total liability is limited to the fees
        paid for the relevant engagement.
      </p>

      <h2>Termination</h2>
      <p>
        Either party may terminate an engagement as set out in the applicable
        agreement. Fees for work completed up to termination remain payable.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of our website
        or services after changes take effect constitutes acceptance of the
        revised Terms.
      </p>

      <h2>Contact Us</h2>
      <p>
        Questions about these Terms? Email{" "}
        <a href="mailto:hello@mitchdesigns.com">hello@mitchdesigns.com</a>.
      </p>
    </LegalDocument>
  );
}
