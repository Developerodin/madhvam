"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin/fetch";

type JsonEditorProps = {
  title: string;
  endpoint: string;
  initial: unknown;
  wrapKey?: string;
  responseKey?: string;
};

export function JsonEditor({
  title,
  endpoint,
  initial,
  wrapKey,
  responseKey,
}: JsonEditorProps) {
  const [text, setText] = useState(() => JSON.stringify(initial, null, 2));
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setStatus("");
    setSaving(true);
    try {
      const parsed = JSON.parse(text) as unknown;
      const body = wrapKey ? { [wrapKey]: parsed } : parsed;
      const res = await adminFetch(endpoint, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as Record<string, unknown>;
      if (!res.ok) {
        setStatus((data.error as string) || "Save failed");
        return;
      }
      setStatus("Saved");
      const key = responseKey || wrapKey;
      if (key && data[key] != null) {
        setText(JSON.stringify(data[key], null, 2));
      }
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Invalid JSON");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{title}</h1>
      <p style={{ marginBottom: "0.75rem", color: "#555" }}>
        Edit JSON carefully. Invalid JSON will not save.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={28}
        style={{
          width: "100%",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 13,
          padding: "0.75rem",
          border: "1px solid #ccc",
          borderRadius: 4,
        }}
      />
      <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          style={{
            background: "#0E4A32",
            color: "#fff",
            border: 0,
            padding: "0.55rem 1rem",
            cursor: "pointer",
          }}
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {status ? <span>{status}</span> : null}
      </div>
    </section>
  );
}
