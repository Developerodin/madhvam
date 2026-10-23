import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";
import { SiteProvider } from "@/lib/site-context";
import { getSiteSettings } from "@/lib/content/getters";
import { fallbackSite } from "@/lib/site-fallback";

type SiteShellProps = {
  children: React.ReactNode;
  solidHeader?: boolean;
  footerTopHref?: string;
};

export async function SiteShell({
  children,
  solidHeader,
  footerTopHref = "#top",
}: SiteShellProps) {
  let site = fallbackSite;
  try {
    site = await getSiteSettings();
  } catch (err) {
    console.error(
      "[SiteShell] Mongo site settings unavailable; using static fallback. Run npm run seed.",
      err,
    );
  }

  return (
    <SiteProvider site={site}>
      <div className={solidHeader ? "legal-page" : undefined}>
        <Header solid={solidHeader} />
        {children}
        <Footer topHref={footerTopHref} site={site} />
        <WhatsAppFloat />
      </div>
    </SiteProvider>
  );
}
