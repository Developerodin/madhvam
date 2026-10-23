import { config as loadEnv } from "dotenv";
import { resolve } from "path";
import { mkdir, writeFile } from "fs/promises";

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

async function main() {
  await connectDb();

  const [
    siteSettings,
    plotsConfig,
    plots,
    galleryItems,
    galleryFilters,
    faqs,
    documents,
    pageSections,
  ] = await Promise.all([
    SiteSettings.find({}).lean(),
    PlotsConfig.find({}).lean(),
    Plot.find({}).lean(),
    GalleryItem.find({}).sort({ order: 1 }).lean(),
    GalleryFilters.find({}).lean(),
    Faq.find({}).sort({ order: 1 }).lean(),
    DocumentItem.find({}).sort({ order: 1 }).lean(),
    PageSection.find({}).lean(),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    siteSettings,
    plotsConfig,
    plots,
    galleryItems,
    galleryFilters,
    faqs,
    documents,
    pageSections,
  };

  const outDir = resolve(process.cwd(), "exports");
  await mkdir(outDir, { recursive: true });
  const outFile = resolve(outDir, "madhavam-seed.json");
  await writeFile(outFile, JSON.stringify(payload, null, 2), "utf8");
  console.log(`Wrote ${outFile}`);
  await disconnectDb();
}

main().catch(async (err) => {
  console.error(err);
  await disconnectDb();
  process.exit(1);
});
