import type { PublicSiteSettings } from "@/lib/content/getters";
import { SITE, HOME_NAV } from "@/lib/site";

export const fallbackSite: PublicSiteSettings = {
  ...SITE,
  hero: {
    kicker: "Madhavam",
    titleLead: "Land is the",
    titleAccent: "New Gold",
    line: "Approved gated residential plots amidst nature",
    ctaPrimary: "Enquire Now",
    ctaSecondary: "Book a Site Visit",
    poster: "/assets/hero-poster.webp",
    videoWebm: "/assets/hero.webm",
    videoMp4: "/assets/hero.mp4",
  },
  nav: HOME_NAV.map((item) => ({
    href: item.href,
    label: item.label,
    mobileOnly: "mobileOnly" in item ? Boolean(item.mobileOnly) : false,
  })),
  seo: {
    homeTitle:
      "Madhavam | Approved Gated Plots in Raj Nagar Extension, Ghaziabad",
    homeDescription:
      "Madhavam by Earth Waves Developers — approved gated residential plots at Raj Nagar Extension, Ghaziabad (Delhi NCR). Enquire for a site visit.",
  },
};
