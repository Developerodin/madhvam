"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin/fetch";
import { Card, Field, FieldGrid, PageHeader, SaveBar } from "@/components/admin/ui";

type MetaRow = { label: string; value: string; href?: string };

type DocRow = {
  id?: string;
  key: string;
  tabLabel: string;
  name: string;
  order: number;
  meta: MetaRow[];
  noteHtml?: string;
  actionLabel?: string;
  actionHref?: string;
  actionPending?: boolean;
};

export function DocumentsAdmin({ initial }: { initial: DocRow[] }) {
  const [documents, setDocuments] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);

  function update(index: number, patch: Partial<DocRow>) {
    setDocuments((prev) =>
      prev.map((d, i) => (i === index ? { ...d, ...patch } : d)),
    );
  }

  function updateMeta(docIndex: number, metaIndex: number, patch: Partial<MetaRow>) {
    setDocuments((prev) =>
      prev.map((d, i) => {
        if (i !== docIndex) return d;
        const meta = [...(d.meta || [])];
        meta[metaIndex] = { ...meta[metaIndex], ...patch };
        return { ...d, meta };
      }),
    );
  }

  function addDocument() {
    setDocuments((prev) => [
      ...prev,
      {
        key: `doc-${Date.now()}`,
        tabLabel: "New document",
        name: "New document",
        order: prev.length + 1,
        meta: [{ label: "Label", value: "Value" }],
        noteHtml: "",
        actionLabel: "Available on request",
        actionPending: true,
      },
    ]);
  }

  async function save() {
    setSaving(true);
    setStatus("");
    setError(false);
    try {
      const res = await adminFetch("/api/admin/documents", {
        method: "PUT",
        body: JSON.stringify({ documents }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || "Save failed");
        setError(true);
        return;
      }
      if (data.documents) setDocuments(data.documents);
      setStatus("Documents saved");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Save failed");
      setError(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-stack">
      <PageHeader
        title="Documents"
        description="Approvals and paperwork tabs shown in the Document Center."
        actions={
          <button type="button" className="admin-btn admin-btn-outline" onClick={addDocument}>
            Add document
          </button>
        }
      />

      {documents.map((doc, index) => (
        <Card
          key={doc.id || doc.key}
          title={doc.name || doc.tabLabel || `Document ${index + 1}`}
          actions={
            <button
              type="button"
              className="admin-btn admin-btn-danger-ghost"
              onClick={() => setDocuments((prev) => prev.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          }
        >
          <FieldGrid>
            <Field label="Internal key" hint="Stable id used by the system (don’t change casually)">
              <input
                className="admin-input"
                value={doc.key}
                placeholder="rera"
                onChange={(e) => update(index, { key: e.target.value })}
              />
            </Field>
            <Field label="Tab label">
              <input
                className="admin-input"
                value={doc.tabLabel}
                placeholder="UP RERA Certificate"
                onChange={(e) => update(index, { tabLabel: e.target.value })}
              />
            </Field>
            <Field label="Document name">
              <input
                className="admin-input"
                value={doc.name}
                placeholder="UP RERA Registration Certificate"
                onChange={(e) => update(index, { name: e.target.value })}
              />
            </Field>
            <Field label="Order">
              <input
                className="admin-input"
                type="number"
                min={1}
                value={doc.order}
                onChange={(e) => update(index, { order: Number(e.target.value) || 0 })}
              />
            </Field>
            <Field label="Action button label">
              <input
                className="admin-input"
                value={doc.actionLabel || ""}
                placeholder="Download PDF"
                onChange={(e) => update(index, { actionLabel: e.target.value })}
              />
            </Field>
            <Field label="Action link (optional)">
              <input
                className="admin-input"
                value={doc.actionHref || ""}
                placeholder="/assets/documents/madhavam-brochure.pdf"
                onChange={(e) => update(index, { actionHref: e.target.value })}
              />
            </Field>
            <Field label="Action status">
              <select
                className="admin-select"
                value={doc.actionPending ? "pending" : "ready"}
                onChange={(e) =>
                  update(index, { actionPending: e.target.value === "pending" })
                }
              >
                <option value="ready">Ready — link works</option>
                <option value="pending">Pending — available on request</option>
              </select>
            </Field>
          </FieldGrid>

          <Field label="Note" hint="Shown under the document. HTML links allowed.">
            <textarea
              className="admin-textarea"
              rows={3}
              value={doc.noteHtml || ""}
              placeholder="Verify live status at up-rera.in…"
              onChange={(e) => update(index, { noteHtml: e.target.value })}
            />
          </Field>

          <div className="admin-subblock">
            <div className="admin-subblock-head">
              <h3 className="admin-subblock-title">Details (meta rows)</h3>
              <button
                type="button"
                className="admin-btn admin-btn-outline"
                onClick={() =>
                  update(index, {
                    meta: [...(doc.meta || []), { label: "", value: "" }],
                  })
                }
              >
                Add row
              </button>
            </div>
            {(doc.meta || []).map((row, metaIndex) => (
              <div key={metaIndex} className="admin-repeat-item">
                <FieldGrid cols={3}>
                  <Field label="Label">
                    <input
                      className="admin-input"
                      value={row.label}
                      placeholder="Registration"
                      onChange={(e) =>
                        updateMeta(index, metaIndex, { label: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Value">
                    <input
                      className="admin-input"
                      value={row.value}
                      placeholder="UPRERAPRJ245925/09/2026"
                      onChange={(e) =>
                        updateMeta(index, metaIndex, { value: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Link (optional)">
                    <input
                      className="admin-input"
                      value={row.href || ""}
                      placeholder="https://www.up-rera.in/"
                      onChange={(e) =>
                        updateMeta(index, metaIndex, { href: e.target.value })
                      }
                    />
                  </Field>
                </FieldGrid>
                <button
                  type="button"
                  className="admin-btn admin-btn-danger-ghost"
                  onClick={() =>
                    update(index, {
                      meta: (doc.meta || []).filter((_, i) => i !== metaIndex),
                    })
                  }
                >
                  Remove row
                </button>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <SaveBar onSave={() => void save()} saving={saving} status={status} error={error} />
    </div>
  );
}
