"use client";

import { useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin/fetch";
import { Card, PageHeader, StatusBadge } from "@/components/admin/ui";

type EnquiryRow = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  status: string;
  createdAt?: string;
};

export function EnquiriesAdmin({ initial }: { initial: EnquiryRow[] }) {
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState("all");
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);

  const filtered = useMemo(() => {
    if (filter === "all") return rows;
    return rows.filter((r) => r.status === filter);
  }, [rows, filter]);

  async function updateStatus(id: string, next: string) {
    setStatus("");
    setError(false);
    const res = await adminFetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: next }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Update failed");
      setError(true);
      return;
    }
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: next } : r)),
    );
    setStatus("Enquiry updated");
  }

  return (
    <div className="admin-stack">
      <PageHeader
        title="Enquiries"
        description="Leads from the contact form. Update status as your team follows up."
      />

      <Card>
        <div className="admin-toolbar">
          <select
            className="admin-select admin-toolbar-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
          <span className="admin-muted">
            {filtered.length} enquir{filtered.length === 1 ? "y" : "ies"}
          </span>
        </div>

        {filtered.length === 0 ? (
          <p className="admin-empty">No enquiries in this filter.</p>
        ) : (
          <div className="admin-enquiry-list">
            {filtered.map((row) => (
              <article key={row.id} className="admin-enquiry-card">
                <div className="admin-enquiry-top">
                  <div>
                    <h3 className="admin-enquiry-name">{row.name}</h3>
                    <p className="admin-enquiry-meta">
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleString("en-IN")
                        : "—"}
                    </p>
                  </div>
                  <StatusBadge status={row.status} />
                </div>
                <dl className="admin-enquiry-dl">
                  <div>
                    <dt>Phone</dt>
                    <dd>
                      <a href={`tel:${row.phone}`}>{row.phone}</a>
                    </dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>
                      {row.email ? (
                        <a href={`mailto:${row.email}`}>{row.email}</a>
                      ) : (
                        "—"
                      )}
                    </dd>
                  </div>
                </dl>
                {row.message ? (
                  <p className="admin-enquiry-message">{row.message}</p>
                ) : null}
                <label className="admin-field admin-field--inline">
                  <span className="admin-field-label">Status</span>
                  <select
                    className="admin-select"
                    value={row.status}
                    onChange={(e) => void updateStatus(row.id, e.target.value)}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </label>
              </article>
            ))}
          </div>
        )}
      </Card>

      {status ? (
        <p className={`admin-status${error ? " is-error" : " is-ok"}`}>{status}</p>
      ) : null}
    </div>
  );
}
