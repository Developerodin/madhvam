"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin/fetch";

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
  const [status, setStatus] = useState("");

  async function updateStatus(id: string, next: string) {
    setStatus("");
    const res = await adminFetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: next }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Update failed");
      return;
    }
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: next } : r)),
    );
    setStatus("Updated");
  }

  return (
    <section>
      <h1 style={{ fontSize: "1.5rem" }}>Enquiries</h1>
      <div style={{ overflowX: "auto", marginTop: "1rem" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr>
              <th style={th}>When</th>
              <th style={th}>Name</th>
              <th style={th}>Phone</th>
              <th style={th}>Email</th>
              <th style={th}>Message</th>
              <th style={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td style={td}>
                  {row.createdAt
                    ? new Date(row.createdAt).toLocaleString("en-IN")
                    : "—"}
                </td>
                <td style={td}>{row.name}</td>
                <td style={td}>{row.phone}</td>
                <td style={td}>{row.email || "—"}</td>
                <td style={td}>{row.message || "—"}</td>
                <td style={td}>
                  <select
                    value={row.status}
                    onChange={(e) => void updateStatus(row.id, e.target.value)}
                  >
                    <option value="new">new</option>
                    <option value="contacted">contacted</option>
                    <option value="closed">closed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {status ? <p style={{ marginTop: "0.75rem" }}>{status}</p> : null}
    </section>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  borderBottom: "1px solid #ccc",
  padding: "0.4rem",
};
const td: React.CSSProperties = {
  borderBottom: "1px solid #eee",
  padding: "0.4rem",
  verticalAlign: "top",
};
