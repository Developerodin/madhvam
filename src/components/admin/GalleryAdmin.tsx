"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin/fetch";
import { Card, Field, FieldGrid, PageHeader, SaveBar, StringListEditor } from "@/components/admin/ui";

type FilterRow = { id: string; label: string; icon: string };

type SlideRow = {
  category: string;
  also?: string | string[];
  title: string;
  lines?: string[];
  caption?: string;
  feature?: boolean;
  png?: string;
  webp?: string;
  placeholder?: boolean;
  contain?: boolean;
};

function alsoToText(also?: string | string[]) {
  if (!also) return "";
  return Array.isArray(also) ? also.join(", ") : also;
}

function textToAlso(text: string): string | string[] | undefined {
  const parts = text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return undefined;
  if (parts.length === 1) return parts[0];
  return parts;
}

export function GalleryAdmin({
  initial,
}: {
  initial: { slides: SlideRow[]; filters: FilterRow[] };
}) {
  const [slides, setSlides] = useState(initial.slides);
  const [filters, setFilters] = useState(initial.filters);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);

  function updateSlide(index: number, patch: Partial<SlideRow>) {
    setSlides((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function updateFilter(index: number, patch: Partial<FilterRow>) {
    setFilters((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  async function save() {
    setSaving(true);
    setStatus("");
    setError(false);
    try {
      const res = await adminFetch("/api/admin/gallery", {
        method: "PUT",
        body: JSON.stringify({ slides, filters }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || "Save failed");
        setError(true);
        return;
      }
      if (data.slides) setSlides(data.slides);
      if (data.filters) setFilters(data.filters);
      setStatus("Gallery saved");
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
        title="Gallery"
        description="Homepage gallery slides and filter chips."
        actions={
          <button
            type="button"
            className="admin-btn admin-btn-outline"
            onClick={() =>
              setSlides((prev) => [
                ...prev,
                {
                  category: "amenities",
                  title: "New slide",
                  caption: "",
                  png: "",
                  webp: "",
                },
              ])
            }
          >
            Add slide
          </button>
        }
      />

      <Card
        title="Filters"
        description="Category chips visitors use to filter the gallery."
        actions={
          <button
            type="button"
            className="admin-btn admin-btn-outline"
            onClick={() =>
              setFilters((prev) => [
                ...prev,
                { id: "new", label: "New filter", icon: "gallery-ico-image" },
              ])
            }
          >
            Add filter
          </button>
        }
      >
        <div className="admin-repeat-list">
          {filters.map((filter, index) => (
            <div key={index} className="admin-repeat-item">
              <FieldGrid cols={3}>
                <Field label="ID" hint="Matches slide category / also tags">
                  <input
                    className="admin-input"
                    value={filter.id}
                    placeholder="amenities"
                    onChange={(e) => updateFilter(index, { id: e.target.value })}
                  />
                </Field>
                <Field label="Label">
                  <input
                    className="admin-input"
                    value={filter.label}
                    placeholder="Amenities"
                    onChange={(e) => updateFilter(index, { label: e.target.value })}
                  />
                </Field>
                <Field label="Icon class">
                  <input
                    className="admin-input"
                    value={filter.icon}
                    placeholder="gallery-ico-megaphone"
                    onChange={(e) => updateFilter(index, { icon: e.target.value })}
                  />
                </Field>
              </FieldGrid>
              <button
                type="button"
                className="admin-btn admin-btn-danger-ghost"
                onClick={() => setFilters((prev) => prev.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>

      {slides.map((slide, index) => (
        <Card
          key={index}
          title={slide.title || `Slide ${index + 1}`}
          actions={
            <button
              type="button"
              className="admin-btn admin-btn-danger-ghost"
              onClick={() => setSlides((prev) => prev.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          }
        >
          <FieldGrid>
            <Field label="Title">
              <input
                className="admin-input"
                value={slide.title}
                placeholder="Park Gazebo"
                onChange={(e) => updateSlide(index, { title: e.target.value })}
              />
            </Field>
            <Field label="Caption">
              <input
                className="admin-input"
                value={slide.caption || ""}
                placeholder="Relax. Reconnect. Belong."
                onChange={(e) => updateSlide(index, { caption: e.target.value })}
              />
            </Field>
            <Field label="Primary category">
              <input
                className="admin-input"
                value={slide.category}
                placeholder="amenities"
                onChange={(e) => updateSlide(index, { category: e.target.value })}
              />
            </Field>
            <Field label="Also in categories" hint="Comma-separated, e.g. landscapes, clubhouse">
              <input
                className="admin-input"
                value={alsoToText(slide.also)}
                placeholder="landscapes, clubhouse"
                onChange={(e) =>
                  updateSlide(index, { also: textToAlso(e.target.value) })
                }
              />
            </Field>
            <Field label="PNG path">
              <input
                className="admin-input"
                value={slide.png || ""}
                placeholder="/assets/example.png"
                onChange={(e) => updateSlide(index, { png: e.target.value })}
              />
            </Field>
            <Field label="WebP path">
              <input
                className="admin-input"
                value={slide.webp || ""}
                placeholder="/assets/example.webp"
                onChange={(e) => updateSlide(index, { webp: e.target.value })}
              />
            </Field>
            <Field label="Featured slide">
              <select
                className="admin-select"
                value={slide.feature ? "yes" : "no"}
                onChange={(e) =>
                  updateSlide(index, { feature: e.target.value === "yes" })
                }
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </Field>
            <Field label="Placeholder (no image yet)">
              <select
                className="admin-select"
                value={slide.placeholder ? "yes" : "no"}
                onChange={(e) =>
                  updateSlide(index, { placeholder: e.target.value === "yes" })
                }
              >
                <option value="no">No — has image</option>
                <option value="yes">Yes — show placeholder</option>
              </select>
            </Field>
          </FieldGrid>
          <Field label="Title lines (optional)" hint="One line per row for stacked titles">
            <StringListEditor
              values={slide.lines || []}
              onChange={(lines) => updateSlide(index, { lines })}
              placeholder="Line of title"
              addLabel="Add title line"
            />
          </Field>
        </Card>
      ))}

      <SaveBar onSave={() => void save()} saving={saving} status={status} error={error} />
    </div>
  );
}
