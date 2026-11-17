import { BrochureForm } from "@/components/contact/BrochureForm";
import { SiteShell } from "@/components/layout/SiteShell";
import { Reveal } from "@/components/motion/Reveal";
import { getSiteSettings } from "@/lib/content/getters";
import { buildWebPageJsonLd } from "@/lib/jsonld-page";
import { fallbackSite } from "@/lib/site-fallback";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "Brochure | Madhavam";
const PAGE_DESCRIPTION =
  "Share your details to download the Madhavam project brochure for gated residential plots in Raj Nagar Extension, Ghaziabad.";

export async function generateMetadata(): Promise<Metadata> {
  let site = fallbackSite;
  try {
    site = await getSiteSettings();
  } catch {
    /* fallback */
  }
  const url = `${site.canonical}/brochure`;
  return {
    title: { absolute: PAGE_TITLE },
    description: PAGE_DESCRIPTION,
    robots: { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      siteName: "Madhavam",
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
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
      description: PAGE_DESCRIPTION,
      images: [site.ogImage],
    },
  };
}

export default async function BrochurePage() {
  let site = fallbackSite;
  try {
    site = await getSiteSettings();
  } catch {
    /* fallback */
  }

  const jsonLd = buildWebPageJsonLd({
    path: "/brochure",
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    dateModified: "2026-11-17",
    additionalTypes: ["ContactPage"],
  });

  return (
    <SiteShell solidHeader footerTopHref="#brochureMain">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="brochureMain">
        <section className="paper band contact" id="brochure">
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
              <BrochureForm />
            </div>
            <Reveal as="aside" className="contact-facts">
              <div>
                <span>Site office</span>
                <p>{site.siteAddress}</p>
              </div>
              <div>
                <span>Phone</span>
                <p>
                  <a href={`tel:${site.ivrTel}`}>IVR {site.ivr}</a>
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
