"use client";

import { Reveal } from "@/components/motion/Reveal";
import { useCallback, useRef, useState, type KeyboardEvent } from "react";

const TABS = [
  {
    id: "docTabRera",
    panelId: "docPanelRera",
    dataTab: "rera",
    label: "UP RERA Certificate",
  },
  {
    id: "docTabGda",
    panelId: "docPanelGda",
    dataTab: "gda",
    label: "GDA Layout Plan",
  },
  {
    id: "docTabBba",
    panelId: "docPanelBba",
    dataTab: "bba",
    label: "Sample BBA",
  },
  {
    id: "docTabBrochure",
    panelId: "docPanelBrochure",
    dataTab: "brochure",
    label: "Project Brochure",
  },
] as const;

type TabKey = (typeof TABS)[number]["dataTab"];

export function Documents() {
  const [activeTab, setActiveTab] = useState<TabKey>("rera");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activateTab = useCallback((dataTab: TabKey) => {
    setActiveTab(dataTab);
  }, []);

  const onTabKeyDown = (index: number, event: KeyboardEvent<HTMLButtonElement>) => {
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (index + 1) % TABS.length;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (index - 1 + TABS.length) % TABS.length;
    }
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = TABS.length - 1;
    if (next < 0) return;
    event.preventDefault();
    tabRefs.current[next]?.focus();
    activateTab(TABS[next].dataTab);
  };

  return (
    <section className="paper band documents" id="documents" aria-labelledby="documentsTitle">
      <div className="sheet">
        <Reveal className="documents-head">
          <p className="documents-kicker">Document Center</p>
          <h2 id="documentsTitle">
            Approvals and <span className="text-gold">paperwork</span>
          </h2>

          <p className="lead-copy">
            Official records for Madhavam, supplied by Earth Waves Developers.
          </p>
          <div
            className="documents-tabs"
            role="tablist"
            aria-label="Project documents"
          >
            {TABS.map((tab, index) => {
              const on = activeTab === tab.dataTab;
              return (
                <button
                  key={tab.dataTab}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  type="button"
                  className={`documents-tab${on ? " is-active" : ""}`}
                  role="tab"
                  id={tab.id}
                  aria-selected={on}
                  aria-controls={tab.panelId}
                  data-doc-tab={tab.dataTab}
                  tabIndex={on ? 0 : -1}
                  onClick={() => activateTab(tab.dataTab)}
                  onKeyDown={(event) => onTabKeyDown(index, event)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal className="documents-body">
          <div className="documents-panels">
            <div
              className={`documents-panel${activeTab === "rera" ? " is-active" : ""}`}
              role="tabpanel"
              id="docPanelRera"
              aria-labelledby="docTabRera"
              hidden={activeTab !== "rera"}
            >
              <article className="document-card">
                <h3 className="document-name">UP RERA Registration Certificate</h3>
                <dl className="document-meta">
                  <div>
                    <dt>Registration</dt>
                    <dd>
                      <a href="https://www.up-rera.in/" rel="noopener noreferrer">
                        UPRERAPRJ245925/09/2026
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>Dated</dt>
                    <dd>01/09/2026</dd>
                  </div>
                </dl>
                <p className="document-note">
                  Verify live status at{" "}
                  <a href="https://www.up-rera.in/" rel="noopener noreferrer">
                    up-rera.in
                  </a>
                  .
                </p>
                <span className="document-action is-pending" aria-disabled="true">
                  Available on request
                </span>
              </article>
            </div>

            <div
              className={`documents-panel${activeTab === "gda" ? " is-active" : ""}`}
              role="tabpanel"
              id="docPanelGda"
              aria-labelledby="docTabGda"
              hidden={activeTab !== "gda"}
            >
              <article className="document-card">
                <h3 className="document-name">GDA Approved Layout Plan</h3>
                <dl className="document-meta">
                  <div>
                    <dt>Approval</dt>
                    <dd>To be confirmed</dd>
                  </div>
                  <div>
                    <dt>Dated</dt>
                    <dd>To be confirmed</dd>
                  </div>
                </dl>
                <p className="document-note">
                  Ghaziabad Development Authority layout approval for Madhavam.
                  Number and date will be published when Earth Waves Developers
                  supplies the file.
                </p>
                <span className="document-action is-pending" aria-disabled="true">
                  Available on request
                </span>
              </article>
            </div>

            <div
              className={`documents-panel${activeTab === "bba" ? " is-active" : ""}`}
              role="tabpanel"
              id="docPanelBba"
              aria-labelledby="docTabBba"
              hidden={activeTab !== "bba"}
            >
              <article className="document-card">
                <h3 className="document-name">Sample Builder-Buyer Agreement</h3>
                <dl className="document-meta">
                  <div>
                    <dt>Type</dt>
                    <dd>Specimen only</dd>
                  </div>
                  <div>
                    <dt>Dated</dt>
                    <dd>To be confirmed</dd>
                  </div>
                </dl>
                <p className="document-note">
                  A specimen for reference. It is not an offer to sell and does
                  not form a binding agreement unless executed and registered.
                </p>
                <span className="document-action is-pending" aria-disabled="true">
                  Available on request
                </span>
              </article>
            </div>

            <div
              className={`documents-panel${activeTab === "brochure" ? " is-active" : ""}`}
              role="tabpanel"
              id="docPanelBrochure"
              aria-labelledby="docTabBrochure"
              hidden={activeTab !== "brochure"}
            >
              <article className="document-card">
                <h3 className="document-name">Project Brochure</h3>
                <dl className="document-meta">
                  <div>
                    <dt>Document</dt>
                    <dd>Madhavam brochure</dd>
                  </div>
                  <div>
                    <dt>Dated</dt>
                    <dd>01/09/2026</dd>
                  </div>
                </dl>
                <p className="document-note">
                  Official brochure for Madhavam by Earth Waves Developers. Scale,
                  amenities, and registration details as published by the
                  developer.
                </p>
                <a
                  className="document-action"
                  href="/assets/documents/madhavam-brochure.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download PDF
                </a>
              </article>
            </div>
          </div>

          <aside className="documents-rera is-pending" aria-label="UP RERA verification">
            <div className="documents-rera-qr" aria-hidden="true">
              <img
                src="/assets/documents/up-rera-qr.svg"
                alt=""
                width={128}
                height={128}
                loading="lazy"
              />
            </div>
            <p className="documents-rera-label">UP RERA QR</p>
            <p className="documents-rera-note">
              Brochure QR pending. Verify registration{" "}
              <a href="https://www.up-rera.in/" rel="noopener noreferrer">
                UPRERAPRJ245925/09/2026
              </a>{" "}
              on{" "}
              <a href="https://www.up-rera.in/" rel="noopener noreferrer">
                up-rera.in
              </a>
              .
            </p>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
