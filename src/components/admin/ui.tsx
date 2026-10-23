"use client";

import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="admin-page-header">
      <div>
        <h1 className="admin-page-title">{title}</h1>
        {description ? <p className="admin-muted">{description}</p> : null}
      </div>
      {actions ? <div className="admin-page-header-actions">{actions}</div> : null}
    </header>
  );
}

export function Card({
  title,
  description,
  children,
  actions,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="admin-card">
      {(title || actions) && (
        <div className="admin-card-head">
          <div>
            {title ? <h2 className="admin-card-title">{title}</h2> : null}
            {description ? (
              <p className="admin-card-desc">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="admin-card-actions">{actions}</div> : null}
        </div>
      )}
      <div className="admin-card-body">{children}</div>
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <label className="admin-field" htmlFor={htmlFor}>
      <span className="admin-field-label">{label}</span>
      {children}
      {hint ? <span className="admin-field-hint">{hint}</span> : null}
    </label>
  );
}

export function FieldGrid({
  cols = 2,
  children,
}: {
  cols?: 1 | 2 | 3;
  children: ReactNode;
}) {
  return (
    <div className={`admin-field-grid admin-field-grid--${cols}`}>{children}</div>
  );
}

export function SaveBar({
  onSave,
  saving,
  status,
  error,
  label = "Save changes",
}: {
  onSave: () => void;
  saving?: boolean;
  status?: string;
  error?: boolean;
  label?: string;
}) {
  return (
    <div className="admin-save-bar">
      <button
        type="button"
        className="admin-btn"
        onClick={onSave}
        disabled={saving}
      >
        {saving ? "Saving…" : label}
      </button>
      {status ? (
        <span className={`admin-status${error ? " is-error" : " is-ok"}`}>
          {status}
        </span>
      ) : null}
    </div>
  );
}

export function StatusBadge({
  status,
}: {
  status: string;
}) {
  const key = status.toLowerCase().replace(/\s+/g, "-");
  return (
    <span className={`admin-badge admin-badge--${key}`}>{status}</span>
  );
}

export function StringListEditor({
  values,
  onChange,
  placeholder = "Add item…",
  addLabel = "Add",
}: {
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}) {
  return (
    <div className="admin-list-editor">
      {values.map((value, index) => (
        <div key={index} className="admin-list-row">
          <input
            className="admin-input"
            value={value}
            placeholder={placeholder}
            onChange={(e) => {
              const next = [...values];
              next[index] = e.target.value;
              onChange(next);
            }}
          />
          <button
            type="button"
            className="admin-btn admin-btn-danger-ghost"
            aria-label="Remove"
            onClick={() => onChange(values.filter((_, i) => i !== index))}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="admin-btn admin-btn-outline"
        onClick={() => onChange([...values, ""])}
      >
        {addLabel}
      </button>
    </div>
  );
}
