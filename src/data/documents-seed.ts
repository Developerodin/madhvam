export type DocumentSeed = {
  key: string;
  tabLabel: string;
  name: string;
  order: number;
  meta: { label: string; value: string; href?: string }[];
  noteHtml: string;
  actionLabel: string;
  actionHref?: string;
  actionPending: boolean;
};

export const DOCUMENTS_SEED: DocumentSeed[] = [
  {
    key: "rera",
    tabLabel: "UP RERA Certificate",
    name: "UP RERA Registration Certificate",
    order: 1,
    meta: [
      {
        label: "Registration",
        value: "UPRERAPRJ245925/09/2026",
        href: "https://www.up-rera.in/",
      },
      { label: "Dated", value: "01/09/2026" },
    ],
    noteHtml: `Verify live status at <a href="https://www.up-rera.in/" rel="noopener noreferrer">up-rera.in</a>.`,
    actionLabel: "Available on request",
    actionPending: true,
  },
  {
    key: "gda",
    tabLabel: "GDA Layout Plan",
    name: "GDA Approved Layout Plan",
    order: 2,
    meta: [
      { label: "Approval", value: "To be confirmed" },
      { label: "Dated", value: "To be confirmed" },
    ],
    noteHtml:
      "Ghaziabad Development Authority layout approval for Madhavam. Number and date will be published when Earth Waves Developers supplies the file.",
    actionLabel: "Available on request",
    actionPending: true,
  },
  {
    key: "bba",
    tabLabel: "Sample BBA",
    name: "Sample Builder-Buyer Agreement",
    order: 3,
    meta: [
      { label: "Type", value: "Specimen only" },
      { label: "Dated", value: "To be confirmed" },
    ],
    noteHtml:
      "A specimen for reference. It is not an offer to sell and does not form a binding agreement unless executed and registered.",
    actionLabel: "Available on request",
    actionPending: true,
  },
  {
    key: "brochure",
    tabLabel: "Project Brochure",
    name: "Project Brochure",
    order: 4,
    meta: [
      { label: "Document", value: "Madhavam brochure" },
      { label: "Dated", value: "01/09/2026" },
    ],
    noteHtml:
      "Official brochure for Madhavam by Earth Waves Developers. Scale, amenities, and registration details as published by the developer.",
    actionLabel: "Download PDF",
    actionHref: "/assets/documents/madhavam-brochure.pdf",
    actionPending: false,
  },
];

export const DOCUMENTS_SECTION_SEED = {
  kicker: "Document Center",
  titleHtml: 'Approvals and <span class="text-gold">paperwork</span>',
  lead: "Official records for Madhavam, supplied by Earth Waves Developers.",
  reraQr: {
    image: "/assets/documents/up-rera-qr.svg",
    label: "UP RERA QR",
    noteHtml: `Brochure QR pending. Verify registration <a href="https://www.up-rera.in/" rel="noopener noreferrer">UPRERAPRJ245925/09/2026</a> on <a href="https://www.up-rera.in/" rel="noopener noreferrer">up-rera.in</a>.`,
  },
};
