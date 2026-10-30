import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { SiteShell } from "@/components/layout/SiteShell";
import { Reveal } from "@/components/motion/Reveal";
import { getSiteSettings } from "@/lib/content/getters";
import { buildWebPageJsonLd } from "@/lib/jsonld-page";
import { fallbackSite } from "@/lib/site-fallback";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "Contact Us | Madhavam Enquiry";
const PAGE_DESCRIPTION =
  "Enquire about Madhavam gated residential plots in Raj Nagar Extension, Ghaziabad. Book a site visit or leave your number — sales aims to reply within one working day.";

export async function generateMetadata(): Promise<Metadata> {
  let site = fallbackSite;
  try {
    site = await getSiteSettings();
  } catch {
    /* fallback */
  }
  const url = `${site.canonical}/contact`;
  return {
    title: { absolute: PAGE_TITLE },
    description: PAGE_DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      siteName: "Madhavam",
      title: PAGE_TITLE,
      description:
        "Enquire about Madhavam gated residential plots in Raj Nagar Extension, Ghaziabad.",
      images: [
        {
          url: site.ogImage,
          alt: "Madhavam gated community entrance at Rajnagar Extension, Ghaziabad",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: PAGE_TITLE,
      description:
        "Enquire about Madhavam gated residential plots in Raj Nagar Extension, Ghaziabad.",
      images: [site.ogImage],
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

  const jsonLd = buildWebPageJsonLd({
    path: "/contact",
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    dateModified: "2026-10-22",
    additionalTypes: ["ContactPage"],
  });

  return (
    <SiteShell solidHeader footerTopHref="#contactMain">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
                  <a href={`tel:${site.generalTel}`}>{site.generalPhone}</a>
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
