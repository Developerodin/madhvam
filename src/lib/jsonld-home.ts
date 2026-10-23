import type { PublicSiteSettings } from "@/lib/content/getters";
import type { FaqItem } from "@/components/home/Faq";

export function buildHomeJsonLd(
  site: PublicSiteSettings,
  faqs: FaqItem[] = [],
) {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": `${site.canonical}/#organization`,
      name: site.company,
      alternateName: site.brand,
      url: site.companyUrl,
      logo: {
        "@type": "ImageObject",
        url: `${site.canonical}/assets/hero.png`,
      },
      vatID: site.gstin,
      address: {
        "@type": "PostalAddress",
        streetAddress: "G1, South Extension, Block G, South Extension II",
        addressLocality: "New Delhi",
        addressRegion: "DL",
        postalCode: "110049",
        addressCountry: "IN",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: site.phoneTel,
        contactType: "sales",
        email: site.enquiryEmail,
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${site.canonical}/#website`,
      url: `${site.canonical}/`,
      name: site.name,
      description:
        "Madhavam by Earth Waves Developers — approved gated residential plots at Raj Nagar Extension, Ghaziabad (Delhi NCR).",
      inLanguage: "en-IN",
      publisher: { "@id": `${site.canonical}/#organization` },
    },
    {
      "@type": "Residence",
      "@id": `${site.canonical}/#residence`,
      name: site.name,
      url: `${site.canonical}/`,
      description: `Approved gated residential plotted development of about 4 acres with 87 plots on freehold, GDA-approved land at Rajnagar Extension, Ghaziabad, Delhi NCR. UP RERA ${site.rera}.`,
      image: site.ogImage,
      address: {
        "@type": "PostalAddress",
        streetAddress: "KH. No.385M, 386M, Bhowapur, Raj Nagar Extension",
        addressLocality: "Ghaziabad",
        addressRegion: "UP",
        postalCode: "201017",
        addressCountry: "IN",
      },
      containedInPlace: {
        "@type": "Place",
        name: "Rajnagar Extension, Ghaziabad, Delhi NCR",
      },
      areaServed: [
        { "@type": "City", name: "Delhi" },
        { "@type": "City", name: "Noida" },
        { "@type": "City", name: "Ghaziabad" },
        { "@type": "City", name: "Faridabad" },
        { "@type": "City", name: "Gurugram" },
      ],
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", name: "Lush green lawn with jogging track" },
        { "@type": "LocationFeatureSpecification", name: "Kids play area" },
        { "@type": "LocationFeatureSpecification", name: "Multi-purpose hall with pantry" },
        { "@type": "LocationFeatureSpecification", name: "Gymnasium" },
        { "@type": "LocationFeatureSpecification", name: "Yoga and zumba room" },
        { "@type": "LocationFeatureSpecification", name: "Indoor games room" },
        { "@type": "LocationFeatureSpecification", name: "Badminton court" },
        { "@type": "LocationFeatureSpecification", name: "Cricket net practice" },
      ],
    },
  ];

  if (faqs.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${site.canonical}/#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answerHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
