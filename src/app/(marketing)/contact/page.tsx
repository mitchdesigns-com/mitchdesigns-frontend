import type { Metadata } from "next";

import { ContactConnect } from "@/features/contact/ContactConnect";
import { ContactHero } from "@/features/contact/ContactHero";
import { ContactInfo } from "@/features/contact/ContactInfo";
import { getContactPage, getSiteSettings } from "@/lib/cms/queries";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage();
  const title = page.seo?.title ?? "Contact MitchDesigns";
  const description = page.seo?.description;
  return {
    title,
    description,
    openGraph: { title, description, url: "https://mitchdesigns.com/contact" },
    alternates: { canonical: "/contact" },
  };
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([getContactPage(), getSiteSettings()]);
  // No dedicated phone in Site Settings yet → the WhatsApp number, as the
  // site's structured data already does.
  const phone = settings.contactPhone || settings.whatsappNumber;

  return (
    <main>
      <ContactConnect
        copy={page}
        intro={<ContactHero {...page.hero} />}
        info={
          <ContactInfo
            phone={phone}
            email={settings.contactEmail}
            address={settings.officeAddress}
            mapUrl={settings.officeMapUrl}
            labels={{
              phone: page.phoneLabel,
              email: page.emailLabel,
              address: page.addressLabel,
              map: page.mapLabel,
            }}
          />
        }
      />
    </main>
  );
}
