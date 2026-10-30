import { config as loadEnv } from "dotenv";
import { resolve } from "path";

loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

import { connectDb, disconnectDb } from "../lib/db";
import { hashPassword } from "../lib/auth/password";
import { SITE, HOME_NAV } from "../lib/site";
import { MADHAVAM_PLOTS } from "../data/plots";
import { GALLERY_SLIDES, GALLERY_FILTERS } from "../data/gallery";
import { FAQS_SEED } from "../data/faqs-seed";
import { DOCUMENTS_SEED } from "../data/documents-seed";
import { PAGE_SECTIONS_SEED } from "../data/sections-seed";
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
} from "../models";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed admin");
  }
  const passwordHash = await hashPassword(password);
  await Admin.findOneAndUpdate(
    { email: email.toLowerCase() },
    { email: email.toLowerCase(), passwordHash },
    { upsert: true, new: true },
  );
  console.log(`Admin upserted: ${email}`);
}

async function seedSiteSettings() {
  await SiteSettings.findOneAndUpdate(
    { key: "default" },
    {
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
        homeTitle:
          "Madhavam | Approved Gated Plots in Raj Nagar Extension, Ghaziabad",
        homeDescription:
          "Madhavam by Earthwaves Developers — approved gated residential plots at Raj Nagar Extension, Ghaziabad (Delhi NCR). Enquire for a site visit.",
      },
    },
    { upsert: true, new: true },
  );
  console.log("SiteSettings seeded");
}

async function seedPlots() {
  const { plots, ...config } = MADHAVAM_PLOTS;
  await PlotsConfig.findOneAndUpdate(
    { key: "default" },
    { key: "default", ...config },
    { upsert: true, new: true },
  );

  await Plot.deleteMany({});
  if (plots.length) {
    await Plot.insertMany(
      plots.map((p) => ({
        ...p,
        isCommercial: false,
      })),
    );
  }
  console.log(`Plots seeded: ${plots.length} + config`);
}

async function seedGallery() {
  await GalleryItem.deleteMany({});
  await GalleryItem.insertMany(
    GALLERY_SLIDES.map((slide, index) => ({
      ...slide,
      order: index,
    })),
  );
  await GalleryFilters.findOneAndUpdate(
    { key: "default" },
    {
      key: "default",
      filters: GALLERY_FILTERS.map((f) => ({
        id: f.id,
        label: f.label,
        icon: f.icon,
      })),
    },
    { upsert: true, new: true },
  );
  console.log(`Gallery seeded: ${GALLERY_SLIDES.length} items`);
}

async function seedFaqs() {
  await Faq.deleteMany({});
  await Faq.insertMany(FAQS_SEED);
  console.log(`FAQs seeded: ${FAQS_SEED.length}`);
}

async function seedDocuments() {
  for (const doc of DOCUMENTS_SEED) {
    await DocumentItem.findOneAndUpdate({ key: doc.key }, doc, {
      upsert: true,
      new: true,
    });
  }
  console.log(`Documents seeded: ${DOCUMENTS_SEED.length}`);
}

async function seedSections() {
  for (const section of PAGE_SECTIONS_SEED) {
    await PageSection.findOneAndUpdate({ key: section.key }, section, {
      upsert: true,
      new: true,
    });
  }
  console.log(`Page sections seeded: ${PAGE_SECTIONS_SEED.length}`);
}

export async function runSeed() {
  await connectDb();
  await seedAdmin();
  await seedSiteSettings();
  await seedPlots();
  await seedGallery();
  await seedFaqs();
  await seedDocuments();
  await seedSections();
}

async function main() {
  try {
    await runSeed();
    console.log("Seed complete.");
  } finally {
    await disconnectDb();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
