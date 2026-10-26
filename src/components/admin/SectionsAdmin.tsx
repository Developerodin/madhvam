"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin/fetch";
import { Card, Field, FieldGrid, PageHeader, SaveBar } from "@/components/admin/ui";

type SectionValue = { title?: string; content: Record<string, unknown> };
type SectionsMap = Record<string, SectionValue>;

const SECTION_META: Record<
  string,
  { label: string; fields: { key: string; label: string; type?: "text" | "textarea"; hint?: string }[] }
> = {
  plots: {
    label: "Plots section",
    fields: [
      { key: "kicker", label: "Kicker", hint: "Small label above the title" },
      { key: "title", label: "Title" },
      { key: "intro", label: "Intro", type: "textarea" },
    ],
  },
  gallery: {
    label: "Gallery section",
    fields: [
      { key: "kicker", label: "Kicker" },
      { key: "titleHtml", label: "Title (HTML allowed)", hint: 'e.g. Life at <span class="text-gold">Madhavam</span>' },
    ],
  },
  faq: {
    label: "FAQ section",
    fields: [
      { key: "headingHtml", label: "Heading (HTML allowed)" },
      { key: "lead", label: "Lead text", type: "textarea" },
    ],
  },
  documents: {
    label: "Documents section",
    fields: [
      { key: "kicker", label: "Kicker" },
      { key: "titleHtml", label: "Title (HTML allowed)" },
      { key: "lead", label: "Lead text", type: "textarea" },
    ],
  },
};

function str(content: Record<string, unknown>, key: string) {
  const v = content[key];
  return typeof v === "string" ? v : "";
}

export function SectionsAdmin({ initial }: { initial: SectionsMap }) {
  const [sections, setSections] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);

  function updateContent(sectionKey: string, field: string, value: string) {
    setSections((prev) => {
      const current = prev[sectionKey] || { content: {} };
      const content = { ...current.content, [field]: value };
      return {
        ...prev,
        [sectionKey]: { ...current, content },
      };
    });
  }

  function updateReraQr(field: string, value: string) {
    setSections((prev) => {
      const current = prev.documents || { content: {} };
      const reraQr = {
        ...((current.content.reraQr as Record<string, string>) || {}),
        [field]: value,
      };
      return {
        ...prev,
        documents: {
          ...current,
          content: { ...current.content, reraQr },
        },
      };
    });
  }

  function updateTitle(sectionKey: string, title: string) {
    setSections((prev) => ({
      ...prev,
      [sectionKey]: { ...(prev[sectionKey] || { content: {} }), title },
    }));
  }

  async function save() {
    setSaving(true);
    setStatus("");
    setError(false);
    try {
      const res = await adminFetch("/api/admin/sections", {
        method: "PUT",
        body: JSON.stringify({ sections }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || "Save failed");
        setError(true);
        return;
      }
      if (data.sections) setSections(data.sections);
      setStatus("Sections saved");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Save failed");
      setError(true);
    } finally {
      setSaving(false);
    }
  }

  const editableKeys = Object.keys(SECTION_META);
  const otherKeys = Object.keys(sections).filter((k) => !SECTION_META[k]);

  return (
    <div className="admin-stack">
      <PageHeader
        title="Page sections"
        description="Headings and intro copy for homepage blocks. Layout stays fixed — you edit the words."
      />

      {editableKeys.map((key) => {
        const meta = SECTION_META[key];
        const section = sections[key] || { content: {} };
        const content = section.content || {};
        return (
          <Card key={key} title={meta.label} description={`Section key: ${key}`}>
            <FieldGrid cols={1}>
              <Field label="Admin label">
                <input
                  className="admin-input"
                  value={section.title || ""}
                  placeholder={meta.label}
                  onChange={(e) => updateTitle(key, e.target.value)}
                />
              </Field>
              {meta.fields.map((field) => (
                <Field key={field.key} label={field.label} hint={field.hint}>
                  {field.type === "textarea" ? (
                    <textarea
                      className="admin-textarea"
                      rows={3}
                      value={str(content, field.key)}
                      placeholder={field.label}
                      onChange={(e) => updateContent(key, field.key, e.target.value)}
                    />
                  ) : (
                    <input
                      className="admin-input"
                      value={str(content, field.key)}
                      placeholder={field.label}
                      onChange={(e) => updateContent(key, field.key, e.target.value)}
                    />
                  )}
                </Field>
              ))}
            </FieldGrid>

            {key === "documents" ? (
              <div className="admin-subblock">
                <h3 className="admin-subblock-title">RERA QR block</h3>
                <FieldGrid>
                  <Field label="QR image path">
                    <input
                      className="admin-input"
                      value={str((content.reraQr as Record<string, unknown>) || {}, "image")}
                      placeholder="/assets/documents/up-rera-qr.png"
                      onChange={(e) => updateReraQr("image", e.target.value)}
                    />
                  </Field>
                  <Field label="QR label">
                    <input
                      className="admin-input"
                      value={str((content.reraQr as Record<string, unknown>) || {}, "label")}
                      placeholder="UP RERA QR"
                      onChange={(e) => updateReraQr("label", e.target.value)}
                    />
                  </Field>
                  <Field label="Note (HTML allowed)">
                    <textarea
                      className="admin-textarea"
                      rows={3}
                      value={str((content.reraQr as Record<string, unknown>) || {}, "noteHtml")}
                      placeholder="Verify registration on up-rera.in…"
                      onChange={(e) => updateReraQr("noteHtml", e.target.value)}
                    />
                  </Field>
                </FieldGrid>
              </div>
            ) : null}
          </Card>
        );
      })}

      {otherKeys.length > 0 ? (
        <Card
          title="Layout-locked sections"
          description="These sections keep fixed markup in the site for now. Contacts and brand facts come from Settings."
        >
          <ul className="admin-plain-list">
            {otherKeys.map((key) => (
              <li key={key}>
                <strong>{sections[key]?.title || key}</strong>
                <span className="admin-muted"> — not editable as form fields yet</span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <SaveBar onSave={() => void save()} saving={saving} status={status} error={error} />
    </div>
  );
}
