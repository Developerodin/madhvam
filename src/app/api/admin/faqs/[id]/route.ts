import { NextRequest } from "next/server";
import { revalidatePublic } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { connectDb } from "@/lib/db";
import { Faq } from "@/models";
import { jsonError, jsonOk, parseJson } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: Ctx) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  const { id } = await context.params;
  const body = await parseJson<Record<string, unknown>>(request);
  if (!body) return jsonError("Invalid JSON", 400);

  await connectDb();
  const { _id, __v, createdAt, updatedAt, ...rest } = body;
  const updated = await Faq.findByIdAndUpdate(id, { $set: rest }, { new: true }).lean();
  if (!updated) return jsonError("FAQ not found", 404);
  revalidatePublic();
  return jsonOk({ faq: updated });
}

export async function DELETE(request: NextRequest, context: Ctx) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  const { id } = await context.params;
  await connectDb();
  const deleted = await Faq.findByIdAndDelete(id);
  if (!deleted) return jsonError("FAQ not found", 404);
  revalidatePublic();
  return jsonOk({ ok: true });
}
