"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin/fetch";

type PlotsAdminProps = {
  initial: Record<string, unknown>;
};

export function PlotsAdmin({ initial }: PlotsAdminProps) {
  const plots = (initial.plots as Record<string, unknown>[]) || [];
  const { plots: _p, ...config } = initial;
  const [configText, setConfigText] = useState(JSON.stringify(config, null, 2));
  const [status, setStatus] = useState("");
  const [rows, setRows] = useState(plots);

  async function saveConfig() {
    setStatus("");
    try {
      const parsed = JSON.parse(configText) as Record<string, unknown>;
      const res = await adminFetch("/api/admin/plots", {
        method: "PUT",
        body: JSON.stringify({ config: parsed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || "Save failed");
        return;
      }
      setStatus("Config saved");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Invalid JSON");
    }
  }

  async function savePlotStatus(number: string | number, statusValue: string) {
    setStatus("");
    const res = await adminFetch(`/api/admin/plots/${encodeURIComponent(String(number))}`, {
      method: "PATCH",
      body: JSON.stringify({ status: statusValue }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Plot update failed");
      return;
    }
    setRows((prev) =>
      prev.map((p) =>
        p.number === number ? { ...p, status: statusValue } : p,
      ),
    );
    setStatus(`Plot ${number} → ${statusValue}`);
  }

  return (
    <section>
      <h1 style={{ fontSize: "1.5rem" }}>Plots</h1>
      <p style={{ color: "#555" }}>Update band/config JSON or plot availability.</p>

      <h2 style={{ marginTop: "1.5rem", fontSize: "1.15rem" }}>Config</h2>
      <textarea
        value={configText}
        onChange={(e) => setConfigText(e.target.value)}
        rows={16}
        style={{
          width: "100%",
          fontFamily: "ui-monospace, Menlo, monospace",
          fontSize: 12,
          padding: "0.75rem",
        }}
      />
      <button
        type="button"
        onClick={saveConfig}
        style={{
          marginTop: 8,
          background: "#0E4A32",
          color: "#fff",
          border: 0,
          padding: "0.5rem 1rem",
          cursor: "pointer",
        }}
      >
        Save config
      </button>

      <h2 style={{ marginTop: "1.5rem", fontSize: "1.15rem" }}>
        Inventory ({rows.length})
      </h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr>
              <th style={th}>#</th>
              <th style={th}>Size</th>
              <th style={th}>Status</th>
              <th style={th}>Update</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((plot) => (
              <tr key={String(plot.number)}>
                <td style={td}>{String(plot.number)}</td>
                <td style={td}>{String(plot.sizeSqYd ?? "")}</td>
                <td style={td}>{String(plot.status ?? "")}</td>
                <td style={td}>
                  <select
                    value={String(plot.status ?? "Available")}
                    onChange={(e) =>
                      void savePlotStatus(plot.number as string | number, e.target.value)
                    }
                  >
                    <option value="Available">Available</option>
                    <option value="Hold">Hold</option>
                    <option value="Sold">Sold</option>
                    <option value="Mortgage">Mortgage</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {status ? <p style={{ marginTop: "1rem" }}>{status}</p> : null}
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
};
