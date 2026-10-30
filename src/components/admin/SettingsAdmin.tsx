"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin/fetch";
import type { PublicSiteSettings } from "@/lib/content/getters";
import { Card, Field, FieldGrid, PageHeader, SaveBar } from "@/components/admin/ui";

type NavItem = { href: string; label: string; mobileOnly?: boolean };

export function SettingsAdmin({ initial }: { initial: PublicSiteSettings }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);

  function set<K extends keyof PublicSiteSettings>(key: K, value: PublicSiteSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setHero(key: keyof PublicSiteSettings["hero"], value: string) {
    setForm((prev) => ({ ...prev, hero: { ...prev.hero, [key]: value } }));
  }

  function setSeo(key: keyof PublicSiteSettings["seo"], value: string) {
    setForm((prev) => ({ ...prev, seo: { ...prev.seo, [key]: value } }));
  }

  function setNav(nav: NavItem[]) {
    setForm((prev) => ({ ...prev, nav }));
  }

  async function save() {
    setSaving(true);
    setStatus("");
    setError(false);
    try {
      const res = await adminFetch("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || "Save failed");
        setError(true);
        return;
      }
      if (data.site) {
        const { key: _k, _id, __v, createdAt, updatedAt, ...rest } = data.site;
        setForm({ ...form, ...rest });
      }
      setStatus("Settings saved");
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
        title="Site settings"
        description="Project identity, contacts, hero copy, and SEO shown on the public site."
      />

      <Card title="Project identity" description="Core project and developer details.">
        <FieldGrid>
          <Field label="Project name">
            <input
              className="admin-input"
              value={form.name || ""}
              placeholder="Madhavam"
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>
          <Field label="Brand line">
            <input
              className="admin-input"
              value={form.brand || ""}
              placeholder="Earthwaves Developers"
              onChange={(e) => set("brand", e.target.value)}
            />
          </Field>
          <Field label="Legal company name">
            <input
              className="admin-input"
              value={form.company || ""}
              placeholder="Earthwaves Developers Private Limited"
              onChange={(e) => set("company", e.target.value)}
            />
          </Field>
          <Field label="Company website">
            <input
              className="admin-input"
              value={form.companyUrl || ""}
              placeholder="https://www.ewdevelopers.com"
              onChange={(e) => set("companyUrl", e.target.value)}
            />
          </Field>
          <Field label="UP RERA number">
            <input
              className="admin-input"
              value={form.rera || ""}
              placeholder="UPRERAPRJ245925/09/2026"
              onChange={(e) => set("rera", e.target.value)}
            />
          </Field>
          <Field label="UP RERA portal URL">
            <input
              className="admin-input"
              value={form.reraUrl || ""}
              placeholder="https://www.up-rera.in"
              onChange={(e) => set("reraUrl", e.target.value)}
            />
          </Field>
          <Field label="GSTIN">
            <input
              className="admin-input"
              value={form.gstin || ""}
              placeholder="09AADCE7736P1ZX"
              onChange={(e) => set("gstin", e.target.value)}
            />
          </Field>
          <Field label="Canonical site URL">
            <input
              className="admin-input"
              value={form.canonical || ""}
              placeholder="https://madhavam.ewdevelopers.com"
              onChange={(e) => set("canonical", e.target.value)}
            />
          </Field>
          <Field label="Theme colour">
            <input
              className="admin-input"
              value={form.themeColor || ""}
              placeholder="#0e4a32"
              onChange={(e) => set("themeColor", e.target.value)}
            />
          </Field>
        </FieldGrid>
      </Card>

      <Card title="Contact details" description="Phones, WhatsApp, and enquiry emails.">
        <FieldGrid>
          <Field label="Enquiry email">
            <input
              className="admin-input"
              type="email"
              value={form.enquiryEmail || ""}
              placeholder="admin@earthwavesdevelopers.com"
              onChange={(e) => set("enquiryEmail", e.target.value)}
            />
          </Field>
          <Field label="Sales email">
            <input
              className="admin-input"
              type="email"
              value={form.salesEmail || ""}
              placeholder="sales@earthwavesdevelopers.com"
              onChange={(e) => set("salesEmail", e.target.value)}
            />
          </Field>
          <Field label="WhatsApp / primary phone (display)">
            <input
              className="admin-input"
              value={form.phone || ""}
              placeholder="+91 80699 82711"
              onChange={(e) => set("phone", e.target.value)}
            />
          </Field>
          <Field label="Primary phone (tel: link)" hint="Digits only, with country code">
            <input
              className="admin-input"
              value={form.phoneTel || ""}
              placeholder="+918069982711"
              onChange={(e) => set("phoneTel", e.target.value)}
            />
          </Field>
          <Field label="WhatsApp URL">
            <input
              className="admin-input"
              value={form.whatsapp || ""}
              placeholder="https://wa.me/919319976589"
              onChange={(e) => set("whatsapp", e.target.value)}
            />
          </Field>
          <Field label="IVR / call (display)">
            <input
              className="admin-input"
              value={form.ivr || ""}
              placeholder="+91 88264 58080"
              onChange={(e) => set("ivr", e.target.value)}
            />
          </Field>
          <Field label="IVR (tel: link)">
            <input
              className="admin-input"
              value={form.ivrTel || ""}
              placeholder="+918826458080"
              onChange={(e) => set("ivrTel", e.target.value)}
            />
          </Field>
          <Field label="General phone (display)">
            <input
              className="admin-input"
              value={form.generalPhone || ""}
              placeholder="+91 93199 76589"
              onChange={(e) => set("generalPhone", e.target.value)}
            />
          </Field>
          <Field label="General phone (tel: link)">
            <input
              className="admin-input"
              value={form.generalTel || ""}
              placeholder="+919319976589"
              onChange={(e) => set("generalTel", e.target.value)}
            />
          </Field>
        </FieldGrid>
      </Card>

      <Card title="Addresses">
        <FieldGrid cols={1}>
          <Field label="Site address">
            <textarea
              className="admin-textarea"
              rows={3}
              value={form.siteAddress || ""}
              placeholder="Kh. No. 385M, 386M, Bhovapur, Raj Nagar Extension, Ghaziabad, UP 201017"
              onChange={(e) => set("siteAddress", e.target.value)}
            />
          </Field>
          <Field label="Corporate office address">
            <textarea
              className="admin-textarea"
              rows={3}
              value={form.corporateAddress || ""}
              placeholder="G1, South Extension, Block G, South Extension II, New Delhi 110049"
              onChange={(e) => set("corporateAddress", e.target.value)}
            />
          </Field>
        </FieldGrid>
      </Card>

      <Card title="Logos & images" description="Paths relative to the public site (e.g. /assets/…).">
        <FieldGrid>
          <Field label="Logo (light backgrounds)">
            <input
              className="admin-input"
              value={form.logoLight || ""}
              placeholder="/assets/logo-light.svg"
              onChange={(e) => set("logoLight", e.target.value)}
            />
          </Field>
          <Field label="Logo (dark backgrounds)">
            <input
              className="admin-input"
              value={form.logoDark || ""}
              placeholder="/assets/logo-dark.svg"
              onChange={(e) => set("logoDark", e.target.value)}
            />
          </Field>
          <Field label="Open Graph image">
            <input
              className="admin-input"
              value={form.ogImage || ""}
              placeholder="/assets/og-image.jpg"
              onChange={(e) => set("ogImage", e.target.value)}
            />
          </Field>
        </FieldGrid>
      </Card>

      <Card title="Hero section" description="First screen headline and video on the homepage.">
        <FieldGrid>
          <Field label="Kicker">
            <input
              className="admin-input"
              value={form.hero?.kicker || ""}
              placeholder="Madhavam"
              onChange={(e) => setHero("kicker", e.target.value)}
            />
          </Field>
          <Field label="Title (lead)">
            <input
              className="admin-input"
              value={form.hero?.titleLead || ""}
              placeholder="Land is the"
              onChange={(e) => setHero("titleLead", e.target.value)}
            />
          </Field>
          <Field label="Title (accent)">
            <input
              className="admin-input"
              value={form.hero?.titleAccent || ""}
              placeholder="New Gold"
              onChange={(e) => setHero("titleAccent", e.target.value)}
            />
          </Field>
          <Field label="Supporting line">
            <input
              className="admin-input"
              value={form.hero?.line || ""}
              placeholder="Approved gated residential plots amidst nature"
              onChange={(e) => setHero("line", e.target.value)}
            />
          </Field>
          <Field label="Primary CTA label">
            <input
              className="admin-input"
              value={form.hero?.ctaPrimary || ""}
              placeholder="Enquire Now"
              onChange={(e) => setHero("ctaPrimary", e.target.value)}
            />
          </Field>
          <Field label="Secondary CTA label">
            <input
              className="admin-input"
              value={form.hero?.ctaSecondary || ""}
              placeholder="Book a Site Visit"
              onChange={(e) => setHero("ctaSecondary", e.target.value)}
            />
          </Field>
          <Field label="Poster image">
            <input
              className="admin-input"
              value={form.hero?.poster || ""}
              placeholder="/assets/hero-poster.webp"
              onChange={(e) => setHero("poster", e.target.value)}
            />
          </Field>
          <Field label="Video (WebM)">
            <input
              className="admin-input"
              value={form.hero?.videoWebm || ""}
              placeholder="/assets/hero.webm"
              onChange={(e) => setHero("videoWebm", e.target.value)}
            />
          </Field>
          <Field label="Video (MP4)">
            <input
              className="admin-input"
              value={form.hero?.videoMp4 || ""}
              placeholder="/assets/hero.mp4"
              onChange={(e) => setHero("videoMp4", e.target.value)}
            />
          </Field>
        </FieldGrid>
      </Card>

      <Card title="SEO" description="Homepage title and meta description for search engines.">
        <FieldGrid cols={1}>
          <Field label="Home page title">
            <input
              className="admin-input"
              value={form.seo?.homeTitle || ""}
              placeholder="Madhavam | Approved Gated Plots in Raj Nagar Extension"
              onChange={(e) => setSeo("homeTitle", e.target.value)}
            />
          </Field>
          <Field label="Home page description">
            <textarea
              className="admin-textarea"
              rows={3}
              value={form.seo?.homeDescription || ""}
              placeholder="Madhavam by Earthwaves Developers — approved gated residential plots…"
              onChange={(e) => setSeo("homeDescription", e.target.value)}
            />
          </Field>
        </FieldGrid>
      </Card>

      <Card
        title="Navigation"
        description="Header menu items. Use paths like /#plots or /contact."
        actions={
          <button
            type="button"
            className="admin-btn admin-btn-outline"
            onClick={() =>
              setNav([...(form.nav || []), { href: "/#", label: "New item", mobileOnly: false }])
            }
          >
            Add item
          </button>
        }
      >
        <div className="admin-repeat-list">
          {(form.nav || []).map((item, index) => (
            <div key={index} className="admin-repeat-item">
              <FieldGrid cols={3}>
                <Field label="Label">
                  <input
                    className="admin-input"
                    value={item.label}
                    placeholder="Plots"
                    onChange={(e) => {
                      const nav = [...(form.nav || [])];
                      nav[index] = { ...nav[index], label: e.target.value };
                      setNav(nav);
                    }}
                  />
                </Field>
                <Field label="Link">
                  <input
                    className="admin-input"
                    value={item.href}
                    placeholder="/#plots"
                    onChange={(e) => {
                      const nav = [...(form.nav || [])];
                      nav[index] = { ...nav[index], href: e.target.value };
                      setNav(nav);
                    }}
                  />
                </Field>
                <Field label="Mobile only">
                  <select
                    className="admin-select"
                    value={item.mobileOnly ? "yes" : "no"}
                    onChange={(e) => {
                      const nav = [...(form.nav || [])];
                      nav[index] = {
                        ...nav[index],
                        mobileOnly: e.target.value === "yes",
                      };
                      setNav(nav);
                    }}
                  >
                    <option value="no">No — show everywhere</option>
                    <option value="yes">Yes — mobile menu only</option>
                  </select>
                </Field>
              </FieldGrid>
              <button
                type="button"
                className="admin-btn admin-btn-danger-ghost"
                onClick={() =>
                  setNav((form.nav || []).filter((_, i) => i !== index))
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>

      <SaveBar onSave={() => void save()} saving={saving} status={status} error={error} />
    </div>
  );
}
