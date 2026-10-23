import { SITE } from "@/lib/site";

type WebPageInput = {
  path: string;
  name: string;
  description: string;
  dateModified?: string;
  /** Extra @type values, e.g. ContactPage */
  additionalTypes?: string[];
};

export function buildWebPageJsonLd({
  path,
  name,
  description,
  dateModified = "2026-10-22",
  additionalTypes = [],
}: WebPageInput) {
  const url = path === "/" ? `${SITE.canonical}/` : `${SITE.canonical}${path}`;
  const types =
    additionalTypes.length > 0 ? ["WebPage", ...additionalTypes] : "WebPage";

  const breadcrumbName =
    path === "/contact"
      ? "Contact"
      : path === "/disclaimer-privacy"
        ? "Disclaimer & Privacy"
        : path === "/terms"
          ? "Terms"
          : "Home";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": types,
        "@id": `${url}#webpage`,
        url,
        name,
        description,
        isPartOf: { "@id": `${SITE.canonical}/#website` },
        publisher: { "@id": `${SITE.canonical}/#organization` },
        about: { "@id": `${SITE.canonical}/#residence` },
        dateModified,
        inLanguage: "en-IN",
        ...(path === "/contact"
          ? {
              mainEntity: {
                "@type": "ContactPoint",
                telephone: SITE.phoneTel,
                contactType: "sales",
                email: SITE.enquiryEmail,
                areaServed: "IN",
                availableLanguage: ["en", "hi"],
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE.canonical}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: breadcrumbName,
            item: url,
          },
        ],
      },
    ],
  };
}
