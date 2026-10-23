import { beforeEach, describe, expect, it } from "vitest";
import { seedTestDb } from "./helpers/seedTestDb";
import {
  getSiteSettings,
  getPlotsPayload,
} from "@/lib/content/getters";
import { CANONICAL } from "./fixtures/canonical";

describe("Canonical content after seed", () => {
  beforeEach(async () => {
    await seedTestDb();
  });

  it("site settings match brochure / AGENTS facts", async () => {
    const site = await getSiteSettings();
    expect(site.rera).toBe(CANONICAL.rera);
    expect(site.gstin).toBe(CANONICAL.gstin);
    expect(site.enquiryEmail).toBe(CANONICAL.enquiryEmail);
    expect(site.salesEmail).toBe(CANONICAL.salesEmail);
    expect(site.phone).toBe(CANONICAL.phone);
    expect(site.phoneTel).toBe(CANONICAL.phoneTel);
    for (const token of CANONICAL.khasraTokens) {
      expect(site.siteAddress).toContain(token);
    }
  });

  it("has 87 residential plots and seeded tentative rate only", async () => {
    const payload = await getPlotsPayload();
    const plots = payload.plots as { number: unknown; ratePerSqYd?: number }[];
    expect(plots.length).toBe(CANONICAL.residentialPlotCount);

    const pricing = payload.pricing as { ratePerSqYd: number; priceLabel: string };
    expect(pricing.ratePerSqYd).toBe(CANONICAL.tentativeRatePerSqYd);
    expect(pricing.priceLabel).toBe("Tentative");

    // No invented absolute price list: totals stay null unless seeded
    for (const plot of plots) {
      expect(plot.ratePerSqYd).toBe(CANONICAL.tentativeRatePerSqYd);
    }
  });
});
