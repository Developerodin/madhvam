import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { SiteShell } from "@/components/layout/SiteShell";
import { Reveal } from "@/components/motion/Reveal";
import { getSiteSettings } from "@/lib/content/getters";
import { fallbackSite } from "@/lib/site-fallback";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  let site = fallbackSite;
  try {
    site = await getSiteSettings();
  } catch {
    /* fallback */
  }
  return {
    title: { absolute: "Contact Us | Madhavam Enquiry" },
    description:
      "Enquire about Madhavam gated residential plots in Raj Nagar Extension, Ghaziabad. Book a site visit or leave your number — sales aims to reply within one working day.",
    alternates: { canonical: `${site.canonical}/contact` },
    openGraph: {
      url: `${site.canonical}/contact`,
      title: "Contact Us | Madhavam Enquiry",
      description:
        "Enquire about Madhavam gated residential plots in Raj Nagar Extension, Ghaziabad.",
    },
  };
}

export default async function ContactPage() {
  let site = fallbackSite;
  try {
    site = await getSiteSettings();
  } catch {
    /* fallback */
  }

  return (
    <SiteShell solidHeader footerTopHref="#contactMain">
      <main id="contactMain">
        <section className="paper band contact" id="contact">
          <div className="sheet contact-grid">
            <div>
              <Reveal as="h1">
                Begin your journey <span className="text-gold">home.</span>
              </Reveal>
              <div
                className="title-arrows title-arrows--start"
                aria-hidden="true"
              >
                <span className="pillar-arrow pillar-arrow--flip" />
                <span className="pillar-arrow" />
              </div>
              <Reveal as="p" className="lead-copy">
                Ask about Madhavam, book a site visit, or leave your number.
              </Reveal>
              <EnquiryForm />
            </div>
            <Reveal as="aside" className="contact-facts">
              <div>
                <span>Site office</span>
                <p>{site.siteAddress}</p>
              </div>
              <div>
                <span>Email</span>
                <p>
                  <a href={`mailto:${site.enquiryEmail}`}>
                    {site.enquiryEmail}
                  </a>
                </p>
                <p>
                  <a href={site.companyUrl} rel="noopener noreferrer">
                    www.ewdevelopers.com
                  </a>
                </p>
              </div>
              <div>
                <span>Phone</span>
                <p>
                  <a href={`tel:${site.phoneTel}`}>{site.phone}</a>
                </p>
                <p>
                  <a href={site.whatsapp} rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
