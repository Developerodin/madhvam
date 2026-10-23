"use client";

import { useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin/fetch";
import {
  Card,
  Field,
  FieldGrid,
  PageHeader,
  SaveBar,
  StatusBadge,
  StringListEditor,
} from "@/components/admin/ui";

type PlotRow = {
  number: string | number;
  sizeSqYd?: number | null;
  sizeSqM?: number | null;
  sizeSqFt?: number | null;
  facing?: string;
  ratePerSqYd?: number | null;
  amountMonth?: number | null;
  totalPrice?: number | string | null;
  status?: string;
  dimensions?: string;
  mortgage?: boolean;
  label?: string;
  bandKey?: string;
  [key: string]: unknown;
};

type Pricing = {
  ratePerSqYd?: number;
  currency?: string;
  priceLabel?: string;
  rateNote?: string;
};

type Band = {
  label?: string;
  from?: number;
  to?: number;
  sizeSqYd?: number;
  sizeSqYdLabel?: string;
  color?: string;
  bandKey?: string;
  tentativeRatePerSqYd?: number;
  count?: number;
};

const STATUS_OPTIONS = ["Available", "Hold", "Sold", "Mortgage"] as const;

function numOrEmpty(v: unknown): string {
  if (v == null || v === "") return "";
  return String(v);
}

function parseNum(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function PlotsAdmin({ initial }: { initial: Record<string, unknown> }) {
  const initialPlots = ((initial.plots as PlotRow[]) || []).map((p) => ({ ...p }));
  const initialPricing = (initial.pricing as Pricing) || {};
  const initialBands = ((initial.bands as Band[]) || []).map((b) => ({ ...b }));

  const [pricing, setPricing] = useState<Pricing>({ ...initialPricing });
  const [paymentPlanHighlights, setPaymentPlanHighlights] = useState<string[]>(
    Array.isArray(initial.paymentPlanHighlights)
      ? [...(initial.paymentPlanHighlights as string[])]
      : [],
  );
  const [notes, setNotes] = useState<string[]>(
    Array.isArray(initial.notes) ? [...(initial.notes as string[])] : [],
  );
  const [bands, setBands] = useState<Band[]>(initialBands);
  const [rows, setRows] = useState<PlotRow[]>(initialPlots);
  const [applyRateToAll, setApplyRateToAll] = useState(true);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dirtyPlots, setDirtyPlots] = useState<Set<string>>(new Set());
  const [savingConfig, setSavingConfig] = useState(false);
  const [savingPlot, setSavingPlot] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return rows.filter((plot) => {
      if (statusFilter !== "all" && String(plot.status) !== statusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        String(plot.number).toLowerCase().includes(q) ||
        String(plot.facing || "")
          .toLowerCase()
          .includes(q) ||
        String(plot.bandKey || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [rows, filter, statusFilter]);

  const counts = useMemo(() => {
    const c = { Available: 0, Hold: 0, Sold: 0, Mortgage: 0, total: rows.length };
    for (const p of rows) {
      const s = String(p.status || "Available");
      if (s in c) (c as Record<string, number>)[s] += 1;
    }
    return c;
  }, [rows]);

  function markDirty(number: string | number) {
    setDirtyPlots((prev) => new Set(prev).add(String(number)));
  }

  function updatePlot(number: string | number, patch: Partial<PlotRow>) {
    setRows((prev) =>
      prev.map((p) => (String(p.number) === String(number) ? { ...p, ...patch } : p)),
    );
    markDirty(number);
  }

  function updateBand(index: number, patch: Partial<Band>) {
    setBands((prev) => prev.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  }

  async function saveConfig() {
    setSavingConfig(true);
    setStatus("");
    setError(false);
    try {
      const rate = pricing.ratePerSqYd;
      let nextRows = rows;
      if (applyRateToAll && rate != null && Number.isFinite(rate)) {
        nextRows = rows.map((p) => ({
          ...p,
          ratePerSqYd: rate,
          amountMonth:
            p.sizeSqYd != null ? Number((rate * Number(p.sizeSqYd)).toFixed(2)) : p.amountMonth,
        }));
        setRows(nextRows);
      }

      const { plots: _p, ...rest } = initial;
      const config = {
        ...rest,
        pricing,
        paymentPlanHighlights: paymentPlanHighlights.filter((x) => x.trim()),
        notes: notes.filter((x) => x.trim()),
        bands,
      };

      const res = await adminFetch("/api/admin/plots", {
        method: "PUT",
        body: JSON.stringify({
          config,
          plots: applyRateToAll && rate != null ? nextRows : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || "Save failed");
        setError(true);
        return;
      }
      if (Array.isArray(data.plots)) setRows(data.plots);
      if (data.pricing) setPricing(data.pricing);
      if (Array.isArray(data.bands)) setBands(data.bands);
      setDirtyPlots(new Set());
      setStatus(
        applyRateToAll && rate != null
          ? "Pricing saved and applied to all plots"
          : "Pricing & notes saved",
      );
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Save failed");
      setError(true);
    } finally {
      setSavingConfig(false);
    }
  }

  async function savePlot(plot: PlotRow) {
    const key = String(plot.number);
    setSavingPlot(key);
    setStatus("");
    setError(false);
    try {
      const rate =
        plot.ratePerSqYd != null
          ? Number(plot.ratePerSqYd)
          : pricing.ratePerSqYd != null
            ? Number(pricing.ratePerSqYd)
            : null;
      const size = plot.sizeSqYd != null ? Number(plot.sizeSqYd) : null;
      const amountMonth =
        plot.amountMonth != null
          ? Number(plot.amountMonth)
          : rate != null && size != null
            ? Number((rate * size).toFixed(2))
            : null;

      const payload = {
        status: plot.status,
        sizeSqYd: size,
        sizeSqM: plot.sizeSqM != null ? Number(plot.sizeSqM) : null,
        sizeSqFt: plot.sizeSqFt != null ? Number(plot.sizeSqFt) : null,
        facing: plot.facing || "",
        dimensions: plot.dimensions || "",
        ratePerSqYd: rate,
        amountMonth,
        totalPrice: plot.totalPrice ?? null,
        mortgage: plot.status === "Mortgage" || Boolean(plot.mortgage),
      };

      const res = await adminFetch(
        `/api/admin/plots/${encodeURIComponent(key)}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || `Plot ${key} update failed`);
        setError(true);
        return;
      }
      if (data.plot) {
        setRows((prev) =>
          prev.map((p) =>
            String(p.number) === key ? { ...p, ...data.plot, ...payload } : p,
          ),
        );
      }
      setDirtyPlots((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      setStatus(`Plot ${key} saved`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Save failed");
      setError(true);
    } finally {
      setSavingPlot(null);
    }
  }

  async function saveAllDirty() {
    const dirty = rows.filter((p) => dirtyPlots.has(String(p.number)));
    for (const plot of dirty) {
      await savePlot(plot);
    }
  }

  return (
    <div className="admin-stack">
      <PageHeader
        title="Plots & pricing"
        description="Update default rates, band labels, and per-plot size, price, and availability. Changes appear on the public plot map."
      />

      <div className="admin-stat-grid">
        <div className="admin-stat-card admin-stat-card--static">
          <div className="admin-stat-label">Total plots</div>
          <div className="admin-stat-value">{counts.total}</div>
        </div>
        <div className="admin-stat-card admin-stat-card--static">
          <div className="admin-stat-label">Available</div>
          <div className="admin-stat-value">{counts.Available}</div>
        </div>
        <div className="admin-stat-card admin-stat-card--static">
          <div className="admin-stat-label">Hold</div>
          <div className="admin-stat-value">{counts.Hold}</div>
        </div>
        <div className="admin-stat-card admin-stat-card--static">
          <div className="admin-stat-label">Sold</div>
          <div className="admin-stat-value">{counts.Sold}</div>
        </div>
        <div className="admin-stat-card admin-stat-card--static">
          <div className="admin-stat-label">Mortgage</div>
          <div className="admin-stat-value">{counts.Mortgage}</div>
        </div>
      </div>

      <Card
        title="Default pricing"
        description="Used when a plot has no individual rate. Amount/month = rate × size (sq yd)."
      >
        <FieldGrid>
          <Field label="Rate per sq. yd (₹)" hint="e.g. 31.5 means ₹31.5 / sq yd (tentative)">
            <input
              className="admin-input"
              type="number"
              step="0.01"
              min="0"
              value={numOrEmpty(pricing.ratePerSqYd)}
              placeholder="31.5"
              onChange={(e) =>
                setPricing((p) => ({
                  ...p,
                  ratePerSqYd: parseNum(e.target.value) ?? undefined,
                }))
              }
            />
          </Field>
          <Field label="Currency">
            <input
              className="admin-input"
              value={pricing.currency || ""}
              placeholder="INR"
              onChange={(e) => setPricing((p) => ({ ...p, currency: e.target.value }))}
            />
          </Field>
          <Field label="Price label" hint="Shown when rate is not set, e.g. Tentative / On request">
            <input
              className="admin-input"
              value={pricing.priceLabel || ""}
              placeholder="Tentative"
              onChange={(e) =>
                setPricing((p) => ({ ...p, priceLabel: e.target.value }))
              }
            />
          </Field>
          <Field label="Rate note">
            <input
              className="admin-input"
              value={pricing.rateNote || ""}
              placeholder="Tentative rate from project plot list (₹/sq yd)…"
              onChange={(e) =>
                setPricing((p) => ({ ...p, rateNote: e.target.value }))
              }
            />
          </Field>
        </FieldGrid>
        <label className="admin-check">
          <input
            type="checkbox"
            checked={applyRateToAll}
            onChange={(e) => setApplyRateToAll(e.target.checked)}
          />
          <span>Also apply this rate to every plot when saving</span>
        </label>
      </Card>

      <Card title="Payment plan highlights">
        <StringListEditor
          values={paymentPlanHighlights}
          onChange={setPaymentPlanHighlights}
          placeholder="Booking amount and milestones shared at enquiry"
          addLabel="Add highlight"
        />
      </Card>

      <Card title="Public notes" description="Disclaimers under the plots section.">
        <StringListEditor
          values={notes}
          onChange={setNotes}
          placeholder="Indicative / tentative figures only…"
          addLabel="Add note"
        />
      </Card>

      <Card
        title="Size bands (legend)"
        description="Labels and colours for the plot map legend. Rate here is optional band default."
      >
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Label</th>
                <th>Size label</th>
                <th>Colour</th>
                <th>Band rate ₹/yd²</th>
              </tr>
            </thead>
            <tbody>
              {bands.map((band, index) => (
                <tr key={band.bandKey || index}>
                  <td>
                    <input
                      className="admin-input admin-input--compact"
                      value={band.label || ""}
                      placeholder="01 – 27"
                      onChange={(e) => updateBand(index, { label: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      className="admin-input admin-input--compact"
                      value={band.sizeSqYdLabel || String(band.sizeSqYd ?? "")}
                      placeholder="120"
                      onChange={(e) =>
                        updateBand(index, { sizeSqYdLabel: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <div className="admin-color-field">
                      <input
                        type="color"
                        className="admin-color"
                        value={band.color || "#cccccc"}
                        onChange={(e) => updateBand(index, { color: e.target.value })}
                      />
                      <input
                        className="admin-input admin-input--compact"
                        value={band.color || ""}
                        onChange={(e) => updateBand(index, { color: e.target.value })}
                      />
                    </div>
                  </td>
                  <td>
                    <input
                      className="admin-input admin-input--compact"
                      type="number"
                      step="0.01"
                      value={numOrEmpty(band.tentativeRatePerSqYd)}
                      placeholder={numOrEmpty(pricing.ratePerSqYd) || "31.5"}
                      onChange={(e) =>
                        updateBand(index, {
                          tentativeRatePerSqYd: parseNum(e.target.value) ?? undefined,
                        })
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <SaveBar
        onSave={() => void saveConfig()}
        saving={savingConfig}
        status={status}
        error={error}
        label="Save pricing & notes"
      />

      <Card
        title={`Inventory (${filtered.length}${filtered.length !== rows.length ? ` of ${rows.length}` : ""})`}
        description="Edit size, rate, and status per plot. Amount/month updates from rate × size when you leave amount blank."
        actions={
          dirtyPlots.size > 0 ? (
            <button
              type="button"
              className="admin-btn"
              onClick={() => void saveAllDirty()}
              disabled={savingPlot != null}
            >
              Save {dirtyPlots.size} changed plot{dirtyPlots.size === 1 ? "" : "s"}
            </button>
          ) : null
        }
      >
        <div className="admin-toolbar">
          <input
            className="admin-input admin-toolbar-search"
            value={filter}
            placeholder="Search plot #, facing, band…"
            onChange={(e) => setFilter(e.target.value)}
          />
          <select
            className="admin-select admin-toolbar-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-table-wrap admin-table-wrap--wide">
          <table className="admin-table admin-table--plots">
            <thead>
              <tr>
                <th>#</th>
                <th>Status</th>
                <th>Size (yd²)</th>
                <th>Rate ₹/yd²</th>
                <th>₹ / month</th>
                <th>Facing</th>
                <th>Dimensions</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((plot) => {
                const key = String(plot.number);
                const dirty = dirtyPlots.has(key);
                return (
                  <tr key={key} className={dirty ? "is-dirty" : undefined}>
                    <td>
                      <div className="admin-plot-num">
                        <strong>{key}</strong>
                        {plot.status ? <StatusBadge status={String(plot.status)} /> : null}
                      </div>
                    </td>
                    <td>
                      <select
                        className="admin-select"
                        value={String(plot.status || "Available")}
                        onChange={(e) =>
                          updatePlot(plot.number, {
                            status: e.target.value,
                            mortgage: e.target.value === "Mortgage",
                          })
                        }
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        className="admin-input admin-input--compact"
                        type="number"
                        step="0.01"
                        value={numOrEmpty(plot.sizeSqYd)}
                        placeholder="120"
                        onChange={(e) =>
                          updatePlot(plot.number, {
                            sizeSqYd: parseNum(e.target.value),
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="admin-input admin-input--compact"
                        type="number"
                        step="0.01"
                        value={numOrEmpty(plot.ratePerSqYd)}
                        placeholder={numOrEmpty(pricing.ratePerSqYd) || "31.5"}
                        onChange={(e) =>
                          updatePlot(plot.number, {
                            ratePerSqYd: parseNum(e.target.value),
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="admin-input admin-input--compact"
                        type="number"
                        step="0.01"
                        value={numOrEmpty(plot.amountMonth)}
                        placeholder="auto"
                        onChange={(e) =>
                          updatePlot(plot.number, {
                            amountMonth: parseNum(e.target.value),
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="admin-input admin-input--compact"
                        value={String(plot.facing || "")}
                        placeholder="East"
                        onChange={(e) =>
                          updatePlot(plot.number, { facing: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="admin-input admin-input--compact"
                        value={String(plot.dimensions || "")}
                        placeholder="30 × 40"
                        onChange={(e) =>
                          updatePlot(plot.number, { dimensions: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`admin-btn${dirty ? "" : " admin-btn-outline"}`}
                        disabled={savingPlot === key || !dirty}
                        onClick={() => void savePlot(plot)}
                      >
                        {savingPlot === key ? "…" : dirty ? "Save" : "Saved"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {status ? (
        <p className={`admin-status${error ? " is-error" : " is-ok"}`}>{status}</p>
      ) : null}
    </div>
  );
}
