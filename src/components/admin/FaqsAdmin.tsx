"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin/fetch";
import { Card, Field, FieldGrid, PageHeader, SaveBar } from "@/components/admin/ui";

type FaqRow = {
  id?: string;
  question: string;
  answerHtml: string;
  order: number;
  featured: boolean;
};

export function FaqsAdmin({ initial }: { initial: FaqRow[] }) {
  const [faqs, setFaqs] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);

  function update(index: number, patch: Partial<FaqRow>) {
    setFaqs((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  function addFaq() {
    setFaqs((prev) => [
      ...prev,
      {
        question: "",
        answerHtml: "",
        order: prev.length + 1,
        featured: true,
      },
    ]);
  }

  async function save() {
    setSaving(true);
    setStatus("");
    setError(false);
    try {
      const res = await adminFetch("/api/admin/faqs", {
        method: "PUT",
        body: JSON.stringify({
          faqs: faqs.map((f, index) => ({
            question: f.question,
            answerHtml: f.answerHtml,
            order: f.order || index + 1,
            featured: Boolean(f.featured),
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || "Save failed");
        setError(true);
        return;
      }
      if (data.faqs) setFaqs(data.faqs);
      setStatus("FAQs saved");
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
        title="FAQs"
        description="Questions and answers shown on the homepage FAQ section."
        actions={
          <button type="button" className="admin-btn admin-btn-outline" onClick={addFaq}>
            Add FAQ
          </button>
        }
      />

      {faqs.length === 0 ? (
        <Card>
          <p className="admin-empty">No FAQs yet. Add your first question.</p>
        </Card>
      ) : null}

      {faqs.map((faq, index) => (
        <Card
          key={faq.id || `new-${index}`}
          title={`FAQ ${index + 1}`}
          actions={
            <button
              type="button"
              className="admin-btn admin-btn-danger-ghost"
              onClick={() => setFaqs((prev) => prev.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          }
        >
          <FieldGrid>
            <Field label="Question">
              <input
                className="admin-input"
                value={faq.question}
                placeholder="What is Madhavam?"
                onChange={(e) => update(index, { question: e.target.value })}
              />
            </Field>
            <Field label="Display order">
              <input
                className="admin-input"
                type="number"
                min={1}
                value={faq.order}
                onChange={(e) => update(index, { order: Number(e.target.value) || 0 })}
              />
            </Field>
            <Field label="Show on site">
              <select
                className="admin-select"
                value={faq.featured ? "yes" : "no"}
                onChange={(e) => update(index, { featured: e.target.value === "yes" })}
              >
                <option value="yes">Yes — featured</option>
                <option value="no">No — hidden from featured list</option>
              </select>
            </Field>
          </FieldGrid>
          <Field label="Answer" hint="Basic HTML allowed (links, bold).">
            <textarea
              className="admin-textarea"
              rows={5}
              value={faq.answerHtml}
              placeholder="Madhavam is an approved gated residential plotted development…"
              onChange={(e) => update(index, { answerHtml: e.target.value })}
            />
          </Field>
        </Card>
      ))}

      <SaveBar onSave={() => void save()} saving={saving} status={status} error={error} />
    </div>
  );
}
