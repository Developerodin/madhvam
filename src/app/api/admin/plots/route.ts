import { NextRequest } from "next/server";
import { revalidatePublic } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { connectDb } from "@/lib/db";
import { Plot, PlotsConfig } from "@/models";
import { getPlotsPayload } from "@/lib/content/getters";
import { jsonError, jsonOk, parseJson } from "@/lib/api";

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
    const { _id, __v, key, createdAt, updatedAt, plots, ...config } =
      body.config;
    await PlotsConfig.findOneAndUpdate(
      { key: "default" },
      { $set: { ...config, key: "default" } },
      { upsert: true },
    );
  }

  if (Array.isArray(body.plots)) {
    for (const plot of body.plots) {
      if (plot.number == null) continue;
      const { _id, __v, createdAt, updatedAt, ...rest } = plot;
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
