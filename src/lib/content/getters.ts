import { connectDb } from "@/lib/db";
import {
  SiteSettings,
  PlotsConfig,
  Plot,
  GalleryItem,
  GalleryFilters,
  Faq,
  DocumentItem,
  PageSection,
} from "@/models";
import type { GallerySlide } from "@/data/gallery";

export type PublicSiteSettings = {
  name: string;
  canonical: string;
  themeColor: string;
  rera: string;
  reraUrl: string;
  gstin: string;
  company: string;
  brand: string;
  enquiryEmail: string;
  salesEmail: string;
  phone: string;
  phoneTel: string;
  whatsapp: string;
  ivr: string;
  ivrTel: string;
  generalPhone: string;
  generalTel: string;
  companyUrl: string;
  siteAddress: string;
  corporateAddress: string;
  logoLight: string;
  logoDark: string;
  ogImage: string;
  hero: {
    kicker: string;
    titleLead: string;
    titleAccent: string;
    line: string;
    ctaPrimary: string;
    ctaSecondary: string;
    poster: string;
    videoWebm: string;
    videoMp4: string;
  };
  nav: { href: string; label: string; mobileOnly?: boolean }[];
  seo: { homeTitle: string; homeDescription: string };
};

function leanSite(doc: Record<string, unknown> | null): PublicSiteSettings {
  if (!doc) {
    throw new Error(
      "SiteSettings missing. Run `npm run seed` after starting MongoDB.",
    );
  }
  const { _id, __v, key, createdAt, updatedAt, ...rest } = doc;
  return rest as PublicSiteSettings;
}

export async function getSiteSettings(): Promise<PublicSiteSettings> {
  await connectDb();
  const doc = await SiteSettings.findOne({ key: "default" }).lean();
  return leanSite(doc as Record<string, unknown> | null);
}

export type PlotsPayload = {
  plots: Record<string, unknown>[];
  pricing?: { ratePerSqYd?: number; priceLabel?: string; currency?: string; rateNote?: string };
  [key: string]: unknown;
};

export async function getPlotsPayload(): Promise<PlotsPayload> {
  await connectDb();
  const config = await PlotsConfig.findOne({ key: "default" }).lean();
  if (!config) {
    throw new Error("PlotsConfig missing. Run `npm run seed`.");
  }
  const plots = await Plot.find({}).lean();
  const { _id, __v, key, createdAt, updatedAt, ...configRest } =
    config as Record<string, unknown>;

  const plotList = plots.map((p) => {
    const row = p as Record<string, unknown>;
    const {
      _id: pid,
      __v: pv,
      createdAt: pc,
      updatedAt: pu,
      isCommercial,
      ...plot
    } = row;
    return plot;
  });

  return {
    ...configRest,
    plots: plotList,
  };
}

export async function getGalleryPayload(): Promise<{
  slides: GallerySlide[];
  filters: { id: string; label: string; icon: string }[];
}> {
  await connectDb();
  const items = await GalleryItem.find({}).sort({ order: 1 }).lean();
  const filtersDoc = await GalleryFilters.findOne({ key: "default" }).lean();
  const slides = items.map((item) => {
    const row = item as Record<string, unknown>;
    const { _id, __v, order, createdAt, updatedAt, ...slide } = row;
    return slide as GallerySlide;
  });
  return {
    slides,
    filters: (filtersDoc?.filters as { id: string; label: string; icon: string }[]) ?? [],
  };
}

export async function getFaqsPayload() {
  await connectDb();
  const faqs = await Faq.find({}).sort({ order: 1 }).lean();
  return faqs.map((f) => {
    const row = f as Record<string, unknown>;
    return {
      id: String(row._id),
      question: row.question as string,
      answerHtml: row.answerHtml as string,
      order: row.order as number,
      featured: Boolean(row.featured),
    };
  });
}

export async function getDocumentsPayload() {
  await connectDb();
  const docs = await DocumentItem.find({}).sort({ order: 1 }).lean();
  return docs.map((d) => {
    const row = d as Record<string, unknown>;
    const { _id, __v, createdAt, updatedAt, ...rest } = row;
    return { id: String(_id), ...rest };
  });
}

export async function getPageSectionsPayload() {
  await connectDb();
  const sections = await PageSection.find({}).lean();
  const map: Record<string, { title?: string; content: Record<string, unknown> }> =
    {};
  for (const s of sections) {
    const row = s as Record<string, unknown>;
    map[String(row.key)] = {
      title: row.title as string | undefined,
      content: (row.content as Record<string, unknown>) ?? {},
    };
  }
  return map;
}

export async function getPublicBundle() {
  const [site, plots, gallery, faqs, documents, sections] = await Promise.all([
    getSiteSettings(),
    getPlotsPayload(),
    getGalleryPayload(),
    getFaqsPayload(),
    getDocumentsPayload(),
    getPageSectionsPayload(),
  ]);
  return { site, plots, gallery, faqs, documents, sections };
}
