import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE.canonical}/`,
      lastModified: "2026-10-12",
    },
    {
      url: `${SITE.canonical}/disclaimer-privacy`,
      lastModified: "2026-10-12",
    },
    {
      url: `${SITE.canonical}/terms`,
      lastModified: "2026-10-12",
    },
    {
      url: `${SITE.canonical}/contact`,
      lastModified: "2026-10-22",
    },
  ];
}
