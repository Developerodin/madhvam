import { NextRequest } from "next/server";
import { revalidatePublic } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { connectDb } from "@/lib/db";
import { Plot, PlotsConfig } from "@/models";
import { getPlotsPayload } from "@/lib/content/getters";
import { jsonError, jsonOk, parseJson } from "@/lib/api";

const PLOT_RATE_KEYS = ["ratePerSqYd", "amountMonth", "totalPrice"] as const;

function stripPlotRates(
  plot: Record<string, unknown>,
): Record<string, unknown> {
  const next = { ...plot };
  for (const key of PLOT_RATE_KEYS) {
    delete next[key];
  }
  return next;
}

function stripBandRates(
  bands: unknown,
  existingBands: unknown,
): unknown {
  if (!Array.isArray(bands)) return bands;
  const prior = Array.isArray(existingBands) ? existingBands : [];
  return bands.map((band, index) => {
    if (!band || typeof band !== "object") return band;
    const { tentativeRatePerSqYd: _t, ...bandRest } = band as Record<
      string,
      unknown
    >;
    const priorBand =
      prior.find(
        (b) =>
          b &&
          typeof b === "object" &&
          (b as Record<string, unknown>).bandKey != null &&
          (b as Record<string, unknown>).bandKey ===
            (band as Record<string, unknown>).bandKey,
      ) ?? prior[index];
    const priorRate =
      priorBand && typeof priorBand === "object"
        ? (priorBand as Record<string, unknown>).tentativeRatePerSqYd
        : undefined;
    return priorRate !== undefined
      ? { ...bandRest, tentativeRatePerSqYd: priorRate }
      : bandRest;
  });
}

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  try {
    return jsonOk(await getPlotsPayload());
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : "Failed", 500);
  }
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  const body = await parseJson<{
    config?: Record<string, unknown>;
    plots?: Record<string, unknown>[];
  }>(request);
  if (!body) return jsonError("Invalid JSON", 400);

  await connectDb();

  if (body.config) {
    const { _id, __v, key, createdAt, updatedAt, plots, pricing: _pricing, ...config } =
      body.config;

    const existing = await PlotsConfig.findOne({ key: "default" }).lean();
    if ("bands" in config) {
      config.bands = stripBandRates(
        config.bands,
        existing && typeof existing === "object"
          ? (existing as Record<string, unknown>).bands
          : undefined,
      );
    }

    await PlotsConfig.findOneAndUpdate(
      { key: "default" },
      { $set: { ...config, key: "default" } },
      { upsert: true },
    );
  }

  if (Array.isArray(body.plots)) {
    for (const plot of body.plots) {
      if (plot.number == null) continue;
      const { _id, __v, createdAt, updatedAt, ...rest } = stripPlotRates(plot);
      await Plot.findOneAndUpdate(
        { number: plot.number },
        { $set: rest },
        { upsert: true },
      );
    }
  }

  revalidatePublic();
  return jsonOk(await getPlotsPayload());
}
