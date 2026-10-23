import { connectDb } from "@/lib/db";
import { SITE } from "@/lib/site";
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

/**
 * Deep-clone via JSON so ObjectIds/Dates become plain strings.
 * Required before passing Mongo lean docs to Client Components.
 */
function toPlain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Strip Mongo meta fields from a plain record (after toPlain). */
function stripMeta(doc: Record<string, unknown>): Record<string, unknown> {
  const { _id, __v, createdAt, updatedAt, ...rest } = doc;
  return rest;
}

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
  const plain = toPlain(doc);
  const { key: _key, ...rest } = stripMeta(plain);
  // Nested subdocs (hero, seo) may still carry _id from older seeds
  if (rest.hero && typeof rest.hero === "object") {
    rest.hero = stripMeta(rest.hero as Record<string, unknown>);
  }
  if (rest.seo && typeof rest.seo === "object") {
    rest.seo = stripMeta(rest.seo as Record<string, unknown>);
  }
  const settings = rest as PublicSiteSettings;
  if (!settings.ogImage) settings.ogImage = SITE.ogImage;
  if (!settings.canonical) settings.canonical = SITE.canonical;
  return settings;
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
  const plainConfig = toPlain(config) as Record<string, unknown>;
  const { key: _key, ...configRest } = stripMeta(plainConfig);

  const plotList = toPlain(plots).map((p) => {
    const row = p as Record<string, unknown>;
    const { isCommercial: _c, ...plot } = stripMeta(row);
    return plot;
  });

  return toPlain({
    ...configRest,
    plots: plotList,
  });
}

export async function getGalleryPayload(): Promise<{
  slides: GallerySlide[];
  filters: { id: string; label: string; icon: string }[];
}> {
  await connectDb();
  const items = await GalleryItem.find({}).sort({ order: 1 }).lean();
  const filtersDoc = await GalleryFilters.findOne({ key: "default" }).lean();
  const slides = toPlain(items).map((item) => {
    const row = item as Record<string, unknown>;
    const { order: _order, ...slide } = stripMeta(row);
    return slide as GallerySlide;
  });
  const rawFilters =
    (toPlain(filtersDoc)?.filters as {
      id?: string;
      label?: string;
      icon?: string;
      _id?: unknown;
    }[]) ?? [];
  const filters = rawFilters.map((f) => ({
    id: String(f.id ?? ""),
    label: String(f.label ?? ""),
    icon: String(f.icon ?? ""),
  }));
  return { slides, filters };
}

export async function getFaqsPayload() {
  await connectDb();
  const faqs = await Faq.find({}).sort({ order: 1 }).lean();
  return toPlain(faqs).map((f) => {
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
  return toPlain(docs).map((d) => {
    const row = d as Record<string, unknown>;
    const id = String(row._id);
    return { id, ...stripMeta(row) };
  });
}

export async function getPageSectionsPayload() {
  await connectDb();
  const sections = await PageSection.find({}).lean();
  const map: Record<string, { title?: string; content: Record<string, unknown> }> =
    {};
  for (const s of toPlain(sections)) {
    const row = s as Record<string, unknown>;
    map[String(row.key)] = {
      title: row.title as string | undefined,
      content: toPlain((row.content as Record<string, unknown>) ?? {}),
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
