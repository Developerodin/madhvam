import { NextRequest } from "next/server";
import { revalidatePublic } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { connectDb } from "@/lib/db";
import { Plot } from "@/models";
import { jsonError, jsonOk, parseJson } from "@/lib/api";

type Ctx = { params: Promise<{ number: string }> };

export async function PATCH(request: NextRequest, context: Ctx) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  const { number: raw } = await context.params;
  const number = Number.isNaN(Number(raw)) ? raw : Number(raw);
  const body = await parseJson<Record<string, unknown>>(request);
  if (!body) return jsonError("Invalid JSON", 400);

  await connectDb();
  const { _id, __v, number: _n, createdAt, updatedAt, ...rest } = body;
  const updated = await Plot.findOneAndUpdate(
    { number },
    { $set: rest },
    { new: true },
  ).lean();

  if (!updated) return jsonError("Plot not found", 404);
  revalidatePublic();
  return jsonOk({ plot: updated });
}
