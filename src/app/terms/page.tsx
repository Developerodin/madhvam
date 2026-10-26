import { SiteShell } from "@/components/layout/SiteShell";
import { buildWebPageJsonLd } from "@/lib/jsonld-page";
import { SITE } from "@/lib/site";
import type { Metadata } from "next";

const PAGE_TITLE = "Terms & Conditions | Madhavam";
const PAGE_DESCRIPTION =
  "Website terms for madhavam.ewdevelopers.com — Madhavam by Earthwaves Developers Private Limited.";
const PAGE_URL = `${SITE.canonical}/terms`;

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: PAGE_URL,
    siteName: "Madhavam",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [
      {
        url: SITE.ogImage,
        alt: "Madhavam gated community entrance at Rajnagar Extension, Ghaziabad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [SITE.ogImage],
  },
};

const html = '<div class="sheet legal-prose">\n      <p class="legal-kicker"><a href="/">Madhavam</a> · Legal</p>\n      <h1>Terms &amp; Conditions</h1>\n      <p class="legal-meta">Last updated: 12 October 2026 · Madhavam by Earthwaves Developers Private Limited</p>\n      <p class="legal-note">These terms govern use of this website only. They do not replace a registered agreement for sale or allotment letter. Verify project particulars on <a href="https://www.up-rera.in/" rel="noopener noreferrer">UP-RERA</a> before any purchase decision. Counsel should review these terms if you intend to rely on them as a binding legal document.</p>\n\n      <h2 id="acceptance">1. Acceptance of terms</h2>\n      <p>By accessing <a href="https://madhavam.ewdevelopers.com/">madhavam.ewdevelopers.com</a> (the “Site”), you agree to these Terms &amp; Conditions and to our <a href="/disclaimer-privacy">Disclaimer &amp; Privacy Policy</a>. If you do not agree, please do not use the Site.</p>\n\n      <h2 id="about-site">2. About the Site and Madhavam</h2>\n      <p>The Site provides information about <strong>Madhavam</strong>, an approved gated residential plotted development by <strong>Earthwaves Developers Private Limited</strong> at Kh. No. 385M, 386M, Bhovapur / Bhowapur, Raj Nagar Extension, Ghaziabad, Uttar Pradesh, 201017 (Delhi NCR). Brochure particulars include about 4 acres, 87 plots, freehold GDA-approved land, UP RERA registration <strong>UPRERAPRJ245925/09/2026</strong>, Authority website <a href="https://www.up-rera.in/" rel="noopener noreferrer">https://www.up-rera.in</a>, and launch date 01/09/2026.</p>\n      <p>Content is informational. It is not an offer to sell, an invitation to treat, or a substitute for sanctioned plans, the agreement for sale, or disclosures maintained on the Authority’s website under the Real Estate (Regulation and Development) Act, 2016.</p>\n\n      <h2 id="no-reliance">3. No investment or legal reliance</h2>\n      <p>You must not rely solely on website copy, images, or amenities lists when making financial or legal decisions. Artistic impressions may differ from the completed development. Specifications and layouts may change subject to competent authority approval. Always verify current status with Earthwaves and on UP-RERA.</p>\n\n      <h2 id="enquiry">4. Enquiries and communications</h2>\n      <p>Submitting the enquiry form or contacting us by phone, WhatsApp, or email does not create a booking, allotment, or reservation. We aim to respond within one working day but do not guarantee response times. Personal data is handled as described in the <a href="/disclaimer-privacy#privacy">Privacy Policy</a>.</p>\n\n      <h2 id="ip">5. Intellectual property</h2>\n      <p>Unless otherwise stated, text, branding, logos, photographs, videos, plans, and design on the Site are owned by or licensed to Earthwaves Developers Private Limited. You may view and share links to public pages for personal, non-commercial use. You may not copy, scrape, republish, or commercially exploit Site content without prior written permission, except as allowed by applicable law.</p>\n\n      <h2 id="acceptable-use">6. Acceptable use</h2>\n      <p>You agree not to misuse the Site, including by attempting to disrupt its operation, introducing malware, harvesting contact details for spam, submitting false information, or using the Site for unlawful purposes.</p>\n\n      <h2 id="third-party">7. Third-party sites</h2>\n      <p>Links to <a href="https://www.ewdevelopers.com/" rel="noopener noreferrer">ewdevelopers.com</a>, UP-RERA, WhatsApp, or other third-party services are provided for convenience. Earthwaves is not responsible for the content or practices of third-party sites.</p>\n\n      <h2 id="liability">8. Limitation of liability</h2>\n      <p>To the fullest extent permitted by law, Earthwaves and its directors, employees, and agents are not liable for any loss or damage arising from use of, or inability to use, the Site or from reliance on Site content, including indirect or consequential loss. Nothing in these terms excludes liability that cannot be excluded under applicable Indian law.</p>\n\n      <h2 id="changes">9. Changes</h2>\n      <p>We may update these terms or the Site content at any time. The “Last updated” date at the top of this page will change when we do. Continued use of the Site after updates constitutes acceptance of the revised terms.</p>\n\n      <h2 id="law">10. Governing law and jurisdiction</h2>\n      <p>These terms are governed by the laws of India. Subject to mandatory consumer protections, courts at <strong>New Delhi</strong> (corporate office seat) shall have jurisdiction over disputes arising from use of this Site.</p>\n\n      <h2 id="contact">11. Contact</h2>\n      <p><strong>Madhavam enquiry</strong></p>\n      <ul>\n        <li>Email: <a href="mailto:admin@earthwavesdevelopers.com">admin@earthwavesdevelopers.com</a></li>\n        <li>Phone: <a href="tel:+918069982711">+91 80699 82711</a> · WhatsApp: <a href="https://wa.me/919319976589" rel="noopener noreferrer">+91 93199 76589</a></li>\n      </ul>\n      <p><strong>Company / brochure lines</strong></p>\n      <ul>\n        <li>Email: <a href="mailto:sales@earthwavesdevelopers.com">sales@earthwavesdevelopers.com</a></li>\n        <li>Call / IVR: <a href="tel:+918826458080">+91 88264 58080</a></li>\n        <li>General: <a href="tel:+919319976589">+91 93199 76589</a></li>\n        <li>Website: <a href="https://www.ewdevelopers.com/" rel="noopener noreferrer">www.ewdevelopers.com</a></li>\n      </ul>\n      <p>Site office: Kh. No. 385M, 386M, Bhovapur, Raj Nagar Extension, Ghaziabad, Uttar Pradesh, 201017.<br>\n      Corporate office: G1, South Extension, Block G, South Extension II, New Delhi, Delhi 110049.</p>\n\n      <p>Related: <a href="/disclaimer-privacy">Disclaimer &amp; Privacy Policy</a> · <a href="/">Madhavam home</a></p>\n    </div>';

export default function TermsPage() {
  const jsonLd = buildWebPageJsonLd({
    path: "/terms",
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    dateModified: "2026-10-12",
  });

  return (
    <SiteShell solidHeader footerTopHref="#legalMain">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main
        id="legalMain"
        className="paper band legal-main"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </SiteShell>
  );
}
