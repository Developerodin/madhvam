"use client";

import { createContext, useContext } from "react";
import type { PublicSiteSettings } from "@/lib/content/getters";
import { fallbackSite } from "@/lib/site-fallback";

const SiteContext = createContext<PublicSiteSettings>(fallbackSite);

export function SiteProvider({
  site,
  children,
}: {
  site: PublicSiteSettings;
  children: React.ReactNode;
}) {
  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}

export { fallbackSite };
