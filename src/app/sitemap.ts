import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE.canonical}/`,
      lastModified: new Date("2026-10-23"),
    },
    {
      url: `${SITE.canonical}/contact`,
      lastModified: new Date("2026-10-23"),
    },
    {
      url: `${SITE.canonical}/disclaimer-privacy`,
      lastModified: new Date("2026-10-12"),
    },
    {
      url: `${SITE.canonical}/terms`,
      lastModified: new Date("2026-10-12"),
    },
  ];
}
