import { SITE } from "@/lib/site";

export const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.canonical}/#organization`,
      name: "Earthwaves Developers Pvt Ltd",
      alternateName: "Earth Waves Developers",
      url: SITE.companyUrl,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.canonical}/assets/hero.png`,
      },
      vatID: SITE.gstin,
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
        telephone: "+91-80699-82711",
        contactType: "sales",
        email: SITE.enquiryEmail,
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.canonical}/#website`,
      url: `${SITE.canonical}/`,
      name: "Madhavam",
      description:
        "Madhavam by Earth Waves Developers — approved gated residential plots at Raj Nagar Extension, Ghaziabad (Delhi NCR).",
      inLanguage: "en-IN",
      publisher: { "@id": `${SITE.canonical}/#organization` },
    },
    {
      "@type": "Residence",
      "@id": `${SITE.canonical}/#residence`,
      name: "Madhavam",
      url: `${SITE.canonical}/`,
      description:
        "Approved gated residential plotted development of about 4 acres with 87 plots on freehold, GDA-approved land at Rajnagar Extension, Ghaziabad, Delhi NCR. UP RERA UPRERAPRJ245925/09/2026.",
      image: SITE.ogImage,
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
  ],
};
