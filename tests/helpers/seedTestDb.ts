import { hashPassword } from "@/lib/auth/password";
import { SITE, HOME_NAV } from "@/lib/site";
import { MADHAVAM_PLOTS } from "@/data/plots";
import { GALLERY_SLIDES, GALLERY_FILTERS } from "@/data/gallery";
import { FAQS_SEED } from "@/data/faqs-seed";
import { DOCUMENTS_SEED } from "@/data/documents-seed";
import { PAGE_SECTIONS_SEED } from "@/data/sections-seed";
import {
  Admin,
  SiteSettings,
  PlotsConfig,
  Plot,
  GalleryItem,
  GalleryFilters,
  Faq,
  DocumentItem,
  PageSection,
  Enquiry,
} from "@/models";

export async function seedTestDb() {
  await Promise.all([
    Admin.deleteMany({}),
    SiteSettings.deleteMany({}),
    PlotsConfig.deleteMany({}),
    Plot.deleteMany({}),
    GalleryItem.deleteMany({}),
    GalleryFilters.deleteMany({}),
    Faq.deleteMany({}),
    DocumentItem.deleteMany({}),
    PageSection.deleteMany({}),
    Enquiry.deleteMany({}),
  ]);

  const email = process.env.ADMIN_EMAIL!;
  const password = process.env.ADMIN_PASSWORD!;
  await Admin.create({
    email: email.toLowerCase(),
    passwordHash: await hashPassword(password),
  });

  await SiteSettings.create({
    key: "default",
    name: SITE.name,
    canonical: SITE.canonical,
    themeColor: SITE.themeColor,
    rera: SITE.rera,
    reraUrl: SITE.reraUrl,
    gstin: SITE.gstin,
    company: SITE.company,
    brand: SITE.brand,
    enquiryEmail: SITE.enquiryEmail,
    salesEmail: SITE.salesEmail,
    phone: SITE.phone,
    phoneTel: SITE.phoneTel,
    whatsapp: SITE.whatsapp,
    ivr: SITE.ivr,
    ivrTel: SITE.ivrTel,
    generalPhone: SITE.generalPhone,
    generalTel: SITE.generalTel,
    companyUrl: SITE.companyUrl,
    siteAddress: SITE.siteAddress,
    corporateAddress: SITE.corporateAddress,
    logoLight: SITE.logoLight,
    logoDark: SITE.logoDark,
    ogImage: SITE.ogImage,
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
      homeTitle: "Madhavam | Approved Gated Plots in Raj Nagar Extension, Ghaziabad",
      homeDescription:
        "Madhavam by Earthwaves Developers — approved gated residential plots at Raj Nagar Extension, Ghaziabad (Delhi NCR). Enquire for a site visit.",
    },
  });

  const { plots, ...config } = MADHAVAM_PLOTS;
  await PlotsConfig.create({ key: "default", ...config });
  await Plot.insertMany(plots.map((p) => ({ ...p, isCommercial: false })));

  await GalleryItem.insertMany(
    GALLERY_SLIDES.map((slide, index) => ({ ...slide, order: index })),
  );
  await GalleryFilters.create({
    key: "default",
    filters: GALLERY_FILTERS.map((f) => ({
      id: f.id,
      label: f.label,
      icon: f.icon,
    })),
  });

  await Faq.insertMany(FAQS_SEED);
  await DocumentItem.insertMany(DOCUMENTS_SEED);
  await PageSection.insertMany(PAGE_SECTIONS_SEED);
}
