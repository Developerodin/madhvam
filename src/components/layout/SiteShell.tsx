import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";

type SiteShellProps = {
  children: React.ReactNode;
  solidHeader?: boolean;
  footerTopHref?: string;
};

export function SiteShell({
  children,
  solidHeader,
  footerTopHref = "#top",
}: SiteShellProps) {
  return (
    <div className={solidHeader ? "legal-page" : undefined}>
      <Header solid={solidHeader} />
      {children}
      <Footer topHref={footerTopHref} />
      <WhatsAppFloat />
    </div>
  );
}
