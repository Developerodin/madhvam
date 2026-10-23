import { SiteShell } from "@/components/layout/SiteShell";
import { Arrival } from "@/components/home/Arrival";
import { Documents } from "@/components/home/Documents";
import { Faq } from "@/components/home/Faq";
import { Gallery } from "@/components/home/Gallery";
import { Hero } from "@/components/home/Hero";
import { Location } from "@/components/home/Location";
import { Plots } from "@/components/home/Plots";
import { Quality } from "@/components/home/Quality";
import { TrackRecord } from "@/components/home/TrackRecord";
import { homeJsonLd } from "@/lib/jsonld-home";
import { SITE } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Madhavam | Approved Gated Plots in Raj Nagar Extension, Ghaziabad",
  description:
    "Madhavam by Earth Waves Developers — approved gated residential plots at Raj Nagar Extension, Ghaziabad (Delhi NCR). Enquire for a site visit.",
  alternates: { canonical: `${SITE.canonical}/` },
};

export default function HomePage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <main>
        <Hero />
        <Location />
        <Gallery />
        <Arrival />
        <Plots />
        <Documents />
        <Quality />
        <TrackRecord />
        <Faq />
      </main>
    </SiteShell>
  );
}
