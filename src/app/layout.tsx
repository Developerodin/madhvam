import type { Metadata, Viewport } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/style.css";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.canonical),
  title: {
    default: "Madhavam | Approved Gated Plots in Raj Nagar Extension, Ghaziabad",
    template: "%s | Madhavam",
  },
  description:
    "Madhavam by Earth Waves Developers — approved gated residential plots at Raj Nagar Extension, Ghaziabad (Delhi NCR). Enquire for a site visit.",
  authors: [{ name: "Earthwaves Developers Pvt Ltd" }],
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  other: {
    "geo.region": "IN-UP",
    "geo.placename": "Rajnagar Extension, Ghaziabad, Delhi NCR",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Madhavam",
    url: SITE.canonical,
    title: "Madhavam | Approved Gated Plots in Raj Nagar Extension, Ghaziabad",
    description:
      "Approved gated residential plots by Earth Waves Developers at Raj Nagar Extension, Ghaziabad — Delhi NCR. Landscaped living and indoor amenities.",
    images: [
      {
        url: SITE.ogImage,
        alt: "Madhavam gated community entrance at Rajnagar Extension, Ghaziabad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Madhavam | Approved Gated Plots in Raj Nagar Extension, Ghaziabad",
    description:
      "Approved gated residential plots by Earth Waves Developers at Raj Nagar Extension, Ghaziabad — Delhi NCR.",
    images: [SITE.ogImage],
  },
  alternates: {
    canonical: `${SITE.canonical}/`,
    types: {
      "text/plain": [
        { url: `${SITE.canonical}/llms.txt`, title: "llms.txt AI summary" },
      ],
    },
  },
};

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="js">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Noto+Serif+Devanagari:wght@500;600&family=Outfit:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
