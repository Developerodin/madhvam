import { NextRequest } from "next/server";
import { revalidatePublic } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { connectDb } from "@/lib/db";
import { SiteSettings } from "@/models";
import { getSiteSettings } from "@/lib/content/getters";
import { jsonError, jsonOk, parseJson } from "@/lib/api";

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  try {
    const site = await getSiteSettings();
    return jsonOk({ site });
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : "Failed", 500);
  }
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  const body = await parseJson<Record<string, unknown>>(request);
  if (!body) return jsonError("Invalid JSON", 400);

  await connectDb();
  const { _id, __v, key, createdAt, updatedAt, ...rest } = body;
  const updated = await SiteSettings.findOneAndUpdate(
    { key: "default" },
    { $set: { ...rest, key: "default" } },
    { upsert: true, new: true },
  ).lean();

  revalidatePublic();
  return jsonOk({ site: updated });
}
