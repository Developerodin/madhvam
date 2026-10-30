/** Editable prose blocks for home sections (layout stays in components). */
export const PAGE_SECTIONS_SEED: {
  key: string;
  title: string;
  content: Record<string, unknown>;
}[] = [
  {
    key: "faq",
    title: "FAQ",
    content: {
      headingHtml: 'Questions about <span class="text-gold">Madhavam</span>',
      lead:
        "Clear answers for buyers exploring gated residential plots in Rajnagar Extension, Delhi NCR.",
    },
  },
  {
    key: "documents",
    title: "Documents",
    content: {
      kicker: "Document Center",
      titleHtml: 'Approvals and <span class="text-gold">paperwork</span>',
      lead: "Official records for Madhavam, supplied by Earthwaves Developers.",
      reraQr: {
        image: "/assets/documents/up-rera-qr.png",
        label: "UP RERA QR",
        noteHtml: `Scan to verify registration <a href="https://www.up-rera.in/" rel="noopener noreferrer">UPRERAPRJ245925/09/2026</a> on <a href="https://www.up-rera.in/" rel="noopener noreferrer">up-rera.in</a>.`,
      },
    },
  },
  {
    key: "plots",
    title: "Plots",
    content: {
      kicker: "Plots and Pricing",
      title: "Plots and Pricing",
      intro:
        "Choose from a range of premium residential plots designed for modern living. Explore the available inventory, sizes and prices, and find the plot that fits your plans.",
    },
  },
  {
    key: "gallery",
    title: "Gallery",
    content: {
      kicker: "Gallery",
      titleHtml: 'Life at <span class="text-gold">Madhavam</span>',
    },
  },
  {
    key: "location",
    title: "Location",
    content: {
      editableNote:
        "Location section markup remains in Location.tsx; contacts/address come from siteSettings.",
    },
  },
  {
    key: "arrival",
    title: "Arrival",
    content: {
      editableNote:
        "Arrival section markup remains in Arrival.tsx; use siteSettings for brand facts.",
    },
  },
  {
    key: "quality",
    title: "Quality",
    content: {
      editableNote:
        "Quality pillars markup remains in Quality.tsx for v1 layout stability.",
    },
  },
  {
    key: "trackRecord",
    title: "Track record",
    content: {
      editableNote:
        "Track record markup remains in TrackRecord.tsx for v1 layout stability.",
    },
  },
];
