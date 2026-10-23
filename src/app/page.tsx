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
import { buildHomeJsonLd } from "@/lib/jsonld-home";
import {
  getDocumentsPayload,
  getFaqsPayload,
  getGalleryPayload,
  getPageSectionsPayload,
  getPlotsPayload,
  getSiteSettings,
} from "@/lib/content/getters";
import { fallbackSite } from "@/lib/site-fallback";
import { MADHAVAM_PLOTS } from "@/data/plots";
import { DOCUMENTS_SEED } from "@/data/documents-seed";
import { FAQS_SEED } from "@/data/faqs-seed";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

function homeMetadata(
  title: string,
  description: string,
  canonical: string,
  ogImage: string,
): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonical,
      siteName: "Madhavam",
      title,
      description,
      images: [
        {
          url: ogImage,
          alt: "Madhavam gated community entrance at Rajnagar Extension, Ghaziabad",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const site = await getSiteSettings();
    return homeMetadata(
      site.seo.homeTitle,
      site.seo.homeDescription,
      `${site.canonical}/`,
      site.ogImage,
    );
  } catch {
    return homeMetadata(
      fallbackSite.seo.homeTitle,
      fallbackSite.seo.homeDescription,
      `${fallbackSite.canonical}/`,
      fallbackSite.ogImage,
    );
  }
}

export default async function HomePage() {
  let site = fallbackSite;
  let plotsData: Record<string, unknown> = MADHAVAM_PLOTS as unknown as Record<
    string,
    unknown
  >;
  let gallery = { slides: undefined as undefined | Awaited<ReturnType<typeof getGalleryPayload>>["slides"], filters: undefined as undefined | Awaited<ReturnType<typeof getGalleryPayload>>["filters"] };
  let faqs = FAQS_SEED.map((f, i) => ({
    id: `seed-${i}`,
    question: f.question,
    answerHtml: f.answerHtml,
    order: f.order,
    featured: f.featured,
  }));
  let documents = DOCUMENTS_SEED.map((d) => ({ ...d }));
  let sections: Awaited<ReturnType<typeof getPageSectionsPayload>> = {};

  try {
    const bundle = await Promise.all([
      getSiteSettings(),
      getPlotsPayload(),
      getGalleryPayload(),
      getFaqsPayload(),
      getDocumentsPayload(),
      getPageSectionsPayload(),
    ]);
    site = bundle[0];
    plotsData = bundle[1] as Record<string, unknown>;
    gallery = bundle[2];
    faqs = bundle[3];
    documents = bundle[4] as unknown as typeof documents;
    sections = bundle[5];
  } catch (err) {
    console.error("[HomePage] DB unavailable; using seed fallbacks", err);
  }

  const faqSection = sections.faq?.content ?? {};
  const docsSection = sections.documents?.content ?? {};
  const jsonLd = buildHomeJsonLd(site, faqs);

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <Hero />
        <Location />
        <Gallery slides={gallery.slides} filters={gallery.filters} />
        <Arrival />
        <Plots plotsData={plotsData} />
        <Documents
          documents={documents}
          kicker={String(docsSection.kicker ?? "Document Center")}
          titleHtml={String(
            docsSection.titleHtml ??
              'Approvals and <span class="text-gold">paperwork</span>',
          )}
          lead={String(
            docsSection.lead ??
              "Official records for Madhavam, supplied by Earth Waves Developers.",
          )}
          reraQr={
            (docsSection.reraQr as {
              image: string;
              label: string;
              noteHtml: string;
            }) ?? undefined
          }
        />
        <Quality />
        <TrackRecord />
        <Faq
          faqs={faqs}
          headingHtml={String(
            faqSection.headingHtml ??
              'Questions about <span class="text-gold">Madhavam</span>',
          )}
          lead={String(
            faqSection.lead ??
              "Clear answers for buyers exploring gated residential plots in Rajnagar Extension, Delhi NCR.",
          )}
        />
      </main>
    </SiteShell>
  );
}
