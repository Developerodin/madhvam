import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { SiteShell } from "@/components/layout/SiteShell";
import { Reveal } from "@/components/motion/Reveal";
import { SITE } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Contact Us | Madhavam Enquiry" },
  description:
    "Enquire about Madhavam gated residential plots in Raj Nagar Extension, Ghaziabad. Book a site visit or leave your number — sales aims to reply within one working day.",
  alternates: { canonical: `${SITE.canonical}/contact` },
  openGraph: {
    url: `${SITE.canonical}/contact`,
    title: "Contact Us | Madhavam Enquiry",
    description:
      "Enquire about Madhavam gated residential plots in Raj Nagar Extension, Ghaziabad.",
  },
};

export default function ContactPage() {
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
                <p>{SITE.siteAddress}</p>
              </div>
              <div>
                <span>Email</span>
                <p>
                  <a href={`mailto:${SITE.enquiryEmail}`}>
                    {SITE.enquiryEmail}
                  </a>
                </p>
                <p>
                  <a href={SITE.companyUrl} rel="noopener noreferrer">
                    www.ewdevelopers.com
                  </a>
                </p>
              </div>
              <div>
                <span>Phone</span>
                <p>
                  <a href={`tel:${SITE.phoneTel}`}>{SITE.phone}</a>
                </p>
                <p>
                  <a href={SITE.whatsapp} rel="noopener noreferrer">
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
