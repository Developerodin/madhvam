"use client";

import { useEffect, useRef, useState } from "react";
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

function newDocKey() {
  return `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function fileLabel(href?: string) {
  if (!href) return "";
  try {
    return decodeURIComponent(href.split("/").pop() || href);
  } catch {
    return href.split("/").pop() || href;
  }
}

function withFileState(doc: DocRow, href?: string): DocRow {
  const hasFile = Boolean(href?.trim());
  return {
    ...doc,
    actionHref: hasFile ? href : undefined,
    actionPending: !hasFile,
    actionLabel: hasFile ? "Download PDF" : "Available on request",
  };
}

function forSave(docs: DocRow[]): DocRow[] {
  return docs.map((doc, index) => {
    const title = (doc.name || doc.tabLabel || "Document").trim() || "Document";
    const hasFile = Boolean(doc.actionHref?.trim());
    return {
      ...doc,
      key: doc.key || newDocKey(),
      name: title,
      tabLabel: title,
      order: index + 1,
      meta: (doc.meta || [])
        .map((row) => ({
          label: (row.label || "").trim(),
          value: (row.value || "").trim(),
          ...(row.href?.trim() ? { href: row.href.trim() } : {}),
        }))
        .filter((row) => row.label || row.value),
      noteHtml: doc.noteHtml || "",
      actionHref: hasFile ? doc.actionHref : undefined,
      actionPending: !hasFile,
      actionLabel: hasFile ? "Download PDF" : "Available on request",
    };
  });
}

export function DocumentsAdmin({ initial }: { initial: DocRow[] }) {
  const [documents, setDocuments] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  const pendingScrollKey = useRef<string | null>(null);
  const cardEls = useRef<Map<string, HTMLElement>>(new Map());
  const fileInputs = useRef<Map<number, HTMLInputElement | null>>(new Map());

  useEffect(() => {
    const key = pendingScrollKey.current;
    if (!key) return;
    const el = cardEls.current.get(key);
    if (!el) return;
    pendingScrollKey.current = null;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [documents]);

  function update(index: number, patch: Partial<DocRow>) {
    setDocuments((prev) =>
      prev.map((d, i) => (i === index ? { ...d, ...patch } : d)),
    );
  }

  function setTitle(index: number, title: string) {
    update(index, { name: title, tabLabel: title });
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
    const key = newDocKey();
    pendingScrollKey.current = key;
    setDocuments((prev) => [
      withFileState(
        {
          key,
          tabLabel: "New document",
          name: "New document",
          order: 1,
          meta: [],
          noteHtml: "",
        },
        undefined,
      ),
      ...prev,
    ]);
    setStatus("New document added — attach a file if you have one, then Save.");
    setError(false);
  }

  async function uploadFile(index: number, file: File | null) {
    if (!file) return;
    setUploadingIndex(index);
    setStatus("");
    setError(false);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await adminFetch("/api/admin/uploads", {
        method: "POST",
        body,
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setStatus(data.error || "Upload failed");
        setError(true);
        return;
      }
      setDocuments((prev) =>
        prev.map((d, i) => (i === index ? withFileState(d, data.url) : d)),
      );
      setStatus(`File attached: ${fileLabel(data.url)}. Click Save changes.`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Upload failed");
      setError(true);
    } finally {
      setUploadingIndex(null);
      const input = fileInputs.current.get(index);
      if (input) input.value = "";
    }
  }

  async function save() {
    setSaving(true);
    setStatus("");
    setError(false);
    try {
      const res = await adminFetch("/api/admin/documents", {
        method: "PUT",
        body: JSON.stringify({ documents: forSave(documents) }),
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
        description="Add paperwork tabs for the Document Center. Attach a PDF when you have one."
        actions={
          <button type="button" className="admin-btn admin-btn-outline" onClick={addDocument}>
            Add document
          </button>
        }
      />

      {documents.length === 0 ? (
        <Card>
          <p className="admin-empty">No documents yet.</p>
          <button type="button" className="admin-btn admin-btn-outline" onClick={addDocument}>
            Add document
          </button>
        </Card>
      ) : null}

      {documents.map((doc, index) => {
        const hasFile = Boolean(doc.actionHref?.trim());
        const uploading = uploadingIndex === index;
        return (
          <div
            key={doc.id || doc.key || `new-${index}`}
            ref={(node) => {
              const mapKey = doc.id || doc.key;
              if (node) cardEls.current.set(mapKey, node);
              else cardEls.current.delete(mapKey);
            }}
          >
            <Card
              title={doc.name || doc.tabLabel || `Document ${index + 1}`}
              actions={
                <button
                  type="button"
                  className="admin-btn admin-btn-danger-ghost"
                  onClick={() =>
                    setDocuments((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  Remove
                </button>
              }
            >
              <Field label="Title" hint="Shown as the tab and document heading on the website">
                <input
                  className="admin-input"
                  value={doc.name}
                  placeholder="UP RERA Registration Certificate"
                  onChange={(e) => setTitle(index, e.target.value)}
                />
              </Field>

              <Field label="Note for visitors" hint="Short explanation under the document">
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
                  <h3 className="admin-subblock-title">File</h3>
                </div>
                <div className="admin-file-box">
                  {hasFile ? (
                    <>
                      <p className="admin-file-name">
                        Attached:{" "}
                        <a href={doc.actionHref} target="_blank" rel="noopener noreferrer">
                          {fileLabel(doc.actionHref)}
                        </a>
                      </p>
                      <p className="admin-field-hint">
                        Visitors will see a Download button for this file.
                      </p>
                      <div className="admin-file-actions">
                        <button
                          type="button"
                          className="admin-btn admin-btn-outline"
                          disabled={uploading}
                          onClick={() => fileInputs.current.get(index)?.click()}
                        >
                          {uploading ? "Uploading…" : "Replace file"}
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger-ghost"
                          disabled={uploading}
                          onClick={() =>
                            setDocuments((prev) =>
                              prev.map((d, i) =>
                                i === index ? withFileState(d, undefined) : d,
                              ),
                            )
                          }
                        >
                          Remove file
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="admin-file-empty">No file attached yet.</p>
                      <p className="admin-field-hint">
                        Without a file, the website shows “Available on request”.
                      </p>
                      <button
                        type="button"
                        className="admin-btn"
                        disabled={uploading}
                        onClick={() => fileInputs.current.get(index)?.click()}
                      >
                        {uploading ? "Uploading…" : "Attach PDF or image"}
                      </button>
                    </>
                  )}
                  <input
                    ref={(node) => {
                      fileInputs.current.set(index, node);
                    }}
                    type="file"
                    className="admin-file-input"
                    accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp"
                    onChange={(e) =>
                      void uploadFile(index, e.target.files?.[0] ?? null)
                    }
                  />
                </div>
              </div>

              <div className="admin-subblock">
                <div className="admin-subblock-head">
                  <h3 className="admin-subblock-title">Details</h3>
                  <button
                    type="button"
                    className="admin-btn admin-btn-outline"
                    onClick={() =>
                      update(index, {
                        meta: [...(doc.meta || []), { label: "", value: "" }],
                      })
                    }
                  >
                    Add detail
                  </button>
                </div>
                {(doc.meta || []).length === 0 ? (
                  <p className="admin-field-hint">
                    Optional facts like registration number or date.
                  </p>
                ) : null}
                {(doc.meta || []).map((row, metaIndex) => (
                  <div key={metaIndex} className="admin-repeat-item">
                    <FieldGrid>
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
                      Remove detail
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );
      })}

      {documents.length > 0 ? (
        <div className="admin-page-header-actions">
          <button type="button" className="admin-btn admin-btn-outline" onClick={addDocument}>
            Add document
          </button>
        </div>
      ) : null}

      <SaveBar onSave={() => void save()} saving={saving} status={status} error={error} />
    </div>
  );
}
