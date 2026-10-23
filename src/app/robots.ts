import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const disallow = ["/admin/", "/api/admin/", "/api/auth/"];

const publicAllowRules: MetadataRoute.Robots["rules"] = [
  {
    userAgent: "*",
    allow: "/",
    disallow,
  },
  {
    userAgent: "Googlebot",
    allow: "/",
    disallow,
  },
  {
    userAgent: "Google-Extended",
    allow: "/",
    disallow,
  },
  {
    userAgent: "GPTBot",
    allow: "/",
    disallow,
  },
  {
    userAgent: "ChatGPT-User",
    allow: "/",
    disallow,
  },
  {
    userAgent: "ClaudeBot",
    allow: "/",
    disallow,
  },
  {
    userAgent: "anthropic-ai",
    allow: "/",
    disallow,
  },
  {
    userAgent: "PerplexityBot",
    allow: "/",
    disallow,
  },
  {
    userAgent: "Applebot-Extended",
    allow: "/",
    disallow,
  },
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: publicAllowRules,
    sitemap: `${SITE.canonical}/sitemap.xml`,
    host: SITE.canonical,
  };
}
