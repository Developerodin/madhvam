import { SiteShell } from "@/components/layout/SiteShell";
import { buildWebPageJsonLd } from "@/lib/jsonld-page";
import { SITE } from "@/lib/site";
import type { Metadata } from "next";

const PAGE_TITLE = "Disclaimer & Privacy Policy | Madhavam";
const PAGE_DESCRIPTION =
  "Disclaimer, RERA marketing notice, and privacy policy for Madhavam by Earthwaves Developers Private Limited.";
const PAGE_URL = `${SITE.canonical}/disclaimer-privacy`;

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

const html = '<div class="sheet legal-prose">\n      <p class="legal-kicker"><a href="/">Madhavam</a> · Legal</p>\n      <h1>Disclaimer &amp; Privacy Policy</h1>\n      <p class="legal-meta">Last updated: 12 October 2026 · Madhavam by Earthwaves Developers Private Limited</p>\n      <p class="legal-note">This page is an informational template for website visitors. It is not a substitute for advice from your legal counsel. Project details should be verified on the official <a href="https://www.up-rera.in/" rel="noopener noreferrer">UP-RERA</a> portal and in registered documents before any purchase decision.</p>\n\n      <h2 id="disclaimer">1. Disclaimer &amp; RERA marketing notice</h2>\n      <p>The content on <a href="https://madhavam.ewdevelopers.com/">madhavam.ewdevelopers.com</a> and related Madhavam marketing materials is for general information about <strong>Madhavam</strong>, an approved gated residential plotted development by <strong>Earthwaves Developers Private Limited</strong> (“Earthwaves”, “we”, “us”). Nothing on this website constitutes a legal offer, contract, booking, invitation to treat, or invitation to purchase a plot under the Real Estate (Regulation and Development) Act, 2016 or the Uttar Pradesh Real Estate (Regulation and Development) Rules, 2016.</p>\n      <p>Photographs, imagery, site plans, landscape visuals, clubhouse views, and other media used on this website or in brochures are indicative artistic impressions or renditions for representation only. Interiors, surroundings, and location views may be digitally enhanced or altered and do not represent guaranteed actual views. Designs, dimensions, facilities, plans, furniture, fittings, decorative items, finishing materials, and other details shown are illustrative of a possible layout and do not form part of any standard specification unless expressly agreed in a registered agreement and approved by the competent authority.</p>\n      <p>Earthwaves reserves the right to revise area, plan, amenities, specifications, timelines, and availability, subject to approval of the competent authority(ies). Conversion scale for reference: 1 sq. mtr. = 10.76 sq. ft. = 1.196 sq. yd. Prospective buyers must independently verify approvals, title, RERA disclosures, and documentation before making any decision.</p>\n\n      <h3>1.1 Project registration (Madhavam)</h3>\n      <ul>\n        <li><strong>Project:</strong> MADHAVAM — approved gated residential plots</li>\n        <li><strong>Promoter:</strong> Earthwaves Developers Private Limited (GSTIN 09AADCE7736P1ZX)</li>\n        <li><strong>Site:</strong> Kh. No. 385M, 386M, Bhovapur / Bhowapur, Raj Nagar Extension, Ghaziabad, Uttar Pradesh, 201017</li>\n        <li><strong>Scale (brochure):</strong> Spread across about 4 acres; 87 thoughtfully planned plots; freehold, GDA-approved land</li>\n        <li><strong>UP RERA registration no.:</strong> UPRERAPRJ245925/09/2026</li>\n        <li><strong>Authority website:</strong> <a href="https://www.up-rera.in/" rel="noopener noreferrer">https://www.up-rera.in</a></li>\n        <li><strong>Launch date (brochure):</strong> 01/09/2026</li>\n      </ul>\n      <p>Under Section 11(2) of the Real Estate (Regulation and Development) Act, 2016, advertisements or prospectuses for a registered project are to mention prominently the Authority’s website and the registration number obtained from the Authority. Please review Madhavam’s registered particulars on the <a href="https://www.up-rera.in/" rel="noopener noreferrer">UP-RERA</a> website. See also the Act text hosted by UP-RERA: <a href="https://www.up-rera.in/pdf/reraact.pdf" rel="noopener noreferrer">up-rera.in/pdf/reraact.pdf</a>.</p>\n\n      <h3>1.2 Other Earthwaves projects</h3>\n      <p>Do not confuse Madhavam (khasra 385M &amp; 386M) with other Earthwaves projects. For example, material on <a href="https://ewdevelopers.com/" rel="noopener noreferrer">ewdevelopers.com</a> may refer to other developments (including different khasra numbers). Just 500 metres from Madhavam, Earthwaves delivered <strong>Radhe Radhe Aaradhayam</strong>, a residential plotted development of 71 plots (separate project; registration referenced on public trackers as UPRERAPRJ458010). Statements about Aaradhayam do not automatically apply to Madhavam.</p>\n\n      <h2 id="promoter">2. About the promoter</h2>\n      <p>Earthwaves Developers Private Limited is an emerging and progressive name in the Delhi-NCR real estate landscape, driven by a management team with over 15 years of experience in real estate development and the regional property market. The company is committed to thoughtfully planned residential communities and the concept of “Plotted Development for Housing,” giving families the freedom to own land and create a home that reflects their lifestyle.</p>\n      <p>Corporate office: G1, South Extension, Block G, South Extension II, New Delhi, Delhi 110049. Company website: <a href="https://www.ewdevelopers.com/" rel="noopener noreferrer">www.ewdevelopers.com</a>.</p>\n\n      <h2 id="privacy">3. Privacy Policy</h2>\n      <p>This Privacy Policy explains how Earthwaves Developers Private Limited processes personal data in connection with Madhavam enquiries on this website. It is intended to be readable on its own, in the spirit of notice requirements under the Digital Personal Data Protection Act, 2023 (DPDP Act) and related rules, while India’s IT Act / SPDI Rules may also continue to apply during the phased DPDP implementation. Official Act text: <a href="https://www.indiacode.nic.in/handle/123456789/22037?locale=en" rel="noopener noreferrer">India Code — DPDP Act, 2023</a>.</p>\n\n      <h3>3.1 Who we are (Data Fiduciary)</h3>\n      <p>For Madhavam website enquiries, Earthwaves Developers Private Limited acts as the organisation responsible for deciding how enquiry-related personal data is processed.</p>\n\n      <h3>3.2 Personal data we collect</h3>\n      <p>When you use the enquiry form or contact us, we may collect:</p>\n      <ul>\n        <li>Full name</li>\n        <li>Phone number</li>\n        <li>Email address (optional)</li>\n        <li>Message / enquiry text (optional)</li>\n        <li>Basic technical data such as browser type or approximate access logs if our hosting provider records them for security and delivery</li>\n      </ul>\n      <p>If you contact us by phone, WhatsApp, or email, we process the details you choose to share in that conversation.</p>\n\n      <h3>3.3 Purposes of processing</h3>\n      <ul>\n        <li>Responding to Madhavam enquiries and booking site visits</li>\n        <li>Sales follow-up and sharing project information you requested</li>\n        <li>Maintaining records of communications for customer service and compliance</li>\n        <li>Protecting the website and systems against abuse or security incidents</li>\n      </ul>\n      <p>We do not use the enquiry form to invent pricing or to complete a booking online. Allotment and sale, if any, follow registered project processes and documentation.</p>\n\n      <h3>3.4 Consent and your choices</h3>\n      <p>By submitting the enquiry form or contacting us with a request, you ask us to process the details you provide for the purposes above. You may withdraw consent or ask us to stop sales follow-up by emailing or calling the contacts below; we will honour reasonable requests subject to any legal retention needs.</p>\n\n      <h3>3.5 Sharing and retention</h3>\n      <p>Enquiry details are handled by Earthwaves’ sales / admin desk for Madhavam. We do not sell your personal data. Hosting, email, or messaging providers may process data as service providers necessary to operate communications. We retain enquiry records only as long as needed for the purposes above or as required by applicable law, then delete or anonymise them where practicable.</p>\n\n      <h3>3.6 Cookies and similar technologies</h3>\n      <p>This site is primarily a static brochure experience. We do not intentionally run advertising trackers. Essential hosting or security logs may still be generated by the server or CDN. If analytics tools are added later, this policy will be updated.</p>\n\n      <h3>3.7 Your rights and grievances</h3>\n      <p>Subject to applicable law, you may request access, correction, or erasure of personal data we hold about you in connection with Madhavam enquiries, or raise a grievance about processing. Contact us using the details below. Under the DPDP framework, individuals may also have rights to complain to the Data Protection Board of India once that mechanism is fully operational.</p>\n\n      <h3>3.8 Contact for privacy &amp; enquiries</h3>\n      <p><strong>Madhavam enquiry</strong></p>\n      <ul>\n        <li>Email: <a href="mailto:admin@earthwavesdevelopers.com">admin@earthwavesdevelopers.com</a></li>\n        <li>Phone / WhatsApp: <a href="tel:+918069982711">+91 80699 82711</a> · <a href="https://wa.me/918069982711" rel="noopener noreferrer">WhatsApp</a></li>\n      </ul>\n      <p><strong>Company / brochure lines</strong></p>\n      <ul>\n        <li>Email: <a href="mailto:sales@earthwavesdevelopers.com">sales@earthwavesdevelopers.com</a></li>\n        <li>Call / IVR: <a href="tel:+918826458080">+91 88264 58080</a></li>\n        <li>General: <a href="tel:+919319976589">+91 93199 76589</a></li>\n        <li>Website: <a href="https://www.ewdevelopers.com/" rel="noopener noreferrer">www.ewdevelopers.com</a></li>\n      </ul>\n      <p>Site office: Kh. No. 385M, 386M, Bhovapur, Raj Nagar Extension, Ghaziabad, Uttar Pradesh, 201017.<br>\n      Corporate office: G1, South Extension, Block G, South Extension II, New Delhi, Delhi 110049.</p>\n\n      <h2 id="related">4. Related documents</h2>\n      <p>Website use is also governed by our <a href="/terms">Terms &amp; Conditions</a>. Returning to the project site: <a href="/">Madhavam home</a>.</p>\n    </div>';

export default function DisclaimerPrivacyPage() {
  const jsonLd = buildWebPageJsonLd({
    path: "/disclaimer-privacy",
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
