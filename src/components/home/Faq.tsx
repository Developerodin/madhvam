"use client";

import { Reveal } from "@/components/motion/Reveal";
import { useState } from "react";

export type FaqItem = {
  id: string;
  question: string;
  answerHtml: string;
  order: number;
  featured: boolean;
};

type FaqProps = {
  faqs: FaqItem[];
  headingHtml?: string;
  lead?: string;
};

export function Faq({
  faqs,
  headingHtml = 'Questions about <span class="text-gold">Madhavam</span>',
  lead = "Clear answers for buyers exploring gated residential plots in Rajnagar Extension, Delhi NCR.",
}: FaqProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const featured = faqs.filter((f) => f.featured);
  const more = faqs.filter((f) => !f.featured);

  return (
    <section className="paper band faq" id="faq" aria-labelledby="faqTitle">
      <div className="sheet">
        <Reveal className="faq-head">
          <h2
            id="faqTitle"
            dangerouslySetInnerHTML={{ __html: headingHtml }}
          />
          <div className="title-arrows title-arrows--start" aria-hidden="true">
            <span className="pillar-arrow pillar-arrow--flip" />
            <span className="pillar-arrow" />
          </div>
          <p className="lead-copy">{lead}</p>
        </Reveal>
        <div className="faq-list">
          {featured.map((item) => (
            <Reveal as="details" className="faq-item" key={item.id}>
              <summary>{item.question}</summary>
              <p dangerouslySetInnerHTML={{ __html: item.answerHtml }} />
            </Reveal>
          ))}
          <div className="faq-more" id="faqMore" hidden={!moreOpen}>
            {more.map((item) => (
              <Reveal as="details" className="faq-item" key={item.id}>
                <summary>{item.question}</summary>
                <p dangerouslySetInnerHTML={{ __html: item.answerHtml }} />
              </Reveal>
            ))}
          </div>
        </div>
        {more.length > 0 ? (
          <button
            type="button"
            className={`faq-more-btn${moreOpen ? " is-open" : ""}`}
            id="faqMoreBtn"
            aria-expanded={moreOpen}
            aria-controls="faqMore"
            onClick={() => setMoreOpen((prev) => !prev)}
          >
            <span className="faq-more-label">
              {moreOpen ? "Show less" : "Show more"}
            </span>
            <svg
              className="faq-more-arrow"
              viewBox="0 0 16 16"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M3.2 5.8 8 10.6l4.8-4.8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
      </div>
    </section>
  );
}
