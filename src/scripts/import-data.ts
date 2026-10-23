import { config as loadEnv } from "dotenv";
import { resolve } from "path";
import { readFile } from "fs/promises";

loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

import { connectDb, disconnectDb } from "../lib/db";
import {
  SiteSettings,
  PlotsConfig,
  Plot,
  GalleryItem,
  GalleryFilters,
  Faq,
  DocumentItem,
  PageSection,
} from "../models";

type ExportPayload = {
  siteSettings: Record<string, unknown>[];
  plotsConfig: Record<string, unknown>[];
  plots: Record<string, unknown>[];
  galleryItems: Record<string, unknown>[];
  galleryFilters: Record<string, unknown>[];
  faqs: Record<string, unknown>[];
  documents: Record<string, unknown>[];
  pageSections: Record<string, unknown>[];
};

function stripMeta(doc: Record<string, unknown>) {
  const { _id, __v, createdAt, updatedAt, ...rest } = doc;
  return rest;
}

async function main() {
  const file =
    process.argv[2] || resolve(process.cwd(), "exports/madhavam-seed.json");
  const raw = await readFile(file, "utf8");
  const data = JSON.parse(raw) as ExportPayload;

  await connectDb();

  if (data.siteSettings?.length) {
    for (const doc of data.siteSettings) {
      const clean = stripMeta(doc);
      await SiteSettings.findOneAndUpdate(
        { key: clean.key || "default" },
        clean,
        { upsert: true },
      );
    }
  }

  if (data.plotsConfig?.length) {
    for (const doc of data.plotsConfig) {
      const clean = stripMeta(doc);
      await PlotsConfig.findOneAndUpdate(
        { key: clean.key || "default" },
        clean,
        { upsert: true },
      );
    }
  }

  if (data.plots?.length) {
    await Plot.deleteMany({});
    await Plot.insertMany(data.plots.map(stripMeta));
  }

  if (data.galleryItems?.length) {
    await GalleryItem.deleteMany({});
    await GalleryItem.insertMany(data.galleryItems.map(stripMeta));
  }

  if (data.galleryFilters?.length) {
    for (const doc of data.galleryFilters) {
      const clean = stripMeta(doc);
      await GalleryFilters.findOneAndUpdate(
        { key: clean.key || "default" },
        clean,
        { upsert: true },
      );
    }
  }

  if (data.faqs?.length) {
    await Faq.deleteMany({});
    await Faq.insertMany(data.faqs.map(stripMeta));
  }

  if (data.documents?.length) {
    for (const doc of data.documents) {
      const clean = stripMeta(doc);
      const key = String(clean.key ?? "");
      if (!key) continue;
      await DocumentItem.findOneAndUpdate({ key }, clean, {
        upsert: true,
      });
    }
  }

  if (data.pageSections?.length) {
    for (const doc of data.pageSections) {
      const clean = stripMeta(doc);
      const key = String(clean.key ?? "");
      if (!key) continue;
      await PageSection.findOneAndUpdate({ key }, clean, {
        upsert: true,
      });
    }
  }

  console.log(`Imported content from ${file}`);
  console.log("Note: admin user is not imported — run `npm run seed` or create manually.");
  await disconnectDb();
}

main().catch(async (err) => {
  console.error(err);
  await disconnectDb();
  process.exit(1);
});
