"use client";

import { Reveal } from "@/components/motion/Reveal";
import { useCallback, useRef, useState, type KeyboardEvent } from "react";

export type DocumentView = {
  key: string;
  tabLabel: string;
  name: string;
  order: number;
  meta: { label: string; value: string; href?: string }[];
  noteHtml: string;
  actionLabel: string;
  actionHref?: string;
  actionPending?: boolean;
};

type DocumentsProps = {
  documents: DocumentView[];
  kicker?: string;
  titleHtml?: string;
  lead?: string;
  reraQr?: {
    image: string;
    label: string;
    noteHtml: string;
  };
};

const DEFAULT_RERA_QR = {
  image: "/assets/documents/up-rera-qr.png",
  label: "UP RERA QR",
  noteHtml: `Scan to verify registration <a href="https://www.up-rera.in/" rel="noopener noreferrer">UPRERAPRJ245925/09/2026</a> on <a href="https://www.up-rera.in/" rel="noopener noreferrer">up-rera.in</a>.`,
};

export function Documents({
  documents,
  kicker = "Document Center",
  titleHtml = 'Approvals and <span class="text-gold">paperwork</span>',
  lead = "Official records for Madhavam, supplied by Earth Waves Developers.",
  reraQr = DEFAULT_RERA_QR,
}: DocumentsProps) {
  const sorted = [...documents].sort((a, b) => a.order - b.order);
  const [activeTab, setActiveTab] = useState(sorted[0]?.key ?? "rera");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activateTab = useCallback((key: string) => {
    setActiveTab(key);
  }, []);

  const onTabKeyDown = (index: number, event: KeyboardEvent<HTMLButtonElement>) => {
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (index + 1) % sorted.length;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (index - 1 + sorted.length) % sorted.length;
    }
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = sorted.length - 1;
    if (next < 0) return;
    event.preventDefault();
    tabRefs.current[next]?.focus();
    activateTab(sorted[next].key);
  };

  return (
    <section className="paper band documents" id="documents" aria-labelledby="documentsTitle">
      <div className="sheet">
        <Reveal className="documents-head">
          <p className="documents-kicker">{kicker}</p>
          <h2
            id="documentsTitle"
            dangerouslySetInnerHTML={{ __html: titleHtml }}
          />

          <p className="lead-copy">{lead}</p>
          <div
            className="documents-tabs"
            role="tablist"
            aria-label="Project documents"
          >
            {sorted.map((tab, index) => {
              const on = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  type="button"
                  className={`documents-tab${on ? " is-active" : ""}`}
                  role="tab"
                  id={`docTab-${tab.key}`}
                  aria-selected={on}
                  aria-controls={`docPanel-${tab.key}`}
                  data-doc-tab={tab.key}
                  tabIndex={on ? 0 : -1}
                  onClick={() => activateTab(tab.key)}
                  onKeyDown={(event) => onTabKeyDown(index, event)}
                >
                  {tab.tabLabel}
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal className="documents-body">
          <div className="documents-panels">
            {sorted.map((doc) => {
              const on = activeTab === doc.key;
              return (
                <div
                  key={doc.key}
                  className={`documents-panel${on ? " is-active" : ""}`}
                  role="tabpanel"
                  id={`docPanel-${doc.key}`}
                  aria-labelledby={`docTab-${doc.key}`}
                  hidden={!on}
                >
                  <article className="document-card">
                    <h3 className="document-name">{doc.name}</h3>
                    <dl className="document-meta">
                      {doc.meta.map((m) => (
                        <div key={`${doc.key}-${m.label}`}>
                          <dt>{m.label}</dt>
                          <dd>
                            {m.href ? (
                              <a href={m.href} rel="noopener noreferrer">
                                {m.value}
                              </a>
                            ) : (
                              m.value
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <p
                      className="document-note"
                      dangerouslySetInnerHTML={{ __html: doc.noteHtml }}
                    />
                    {doc.actionPending || !doc.actionHref ? (
                      <span className="document-action is-pending" aria-disabled="true">
                        {doc.actionLabel}
                      </span>
                    ) : (
                      <a
                        className="document-action"
                        href={doc.actionHref}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {doc.actionLabel}
                      </a>
                    )}
                  </article>
                </div>
              );
            })}
          </div>

          <aside className="documents-rera" aria-label="UP RERA verification">
            <div className="documents-rera-qr">
              <img
                src={reraQr.image}
                alt="UP RERA QR code for Madhavam project registration"
                width={128}
                height={128}
                loading="lazy"
              />
            </div>
            <p className="documents-rera-label">{reraQr.label}</p>
            <p
              className="documents-rera-note"
              dangerouslySetInnerHTML={{ __html: reraQr.noteHtml }}
            />
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
