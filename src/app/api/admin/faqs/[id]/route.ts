import { NextRequest } from "next/server";
import { z } from "zod";
import { revalidatePublic } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { connectDb } from "@/lib/db";
import { Faq } from "@/models";
import { jsonError, jsonOk, parseJson } from "@/lib/api";
import { sanitizeRichHtml } from "@/lib/security/sanitizeHtml";

type Ctx = { params: Promise<{ id: string }> };

const FaqPatchSchema = z
  .object({
    question: z.string().trim().min(1).max(500).optional(),
    answerHtml: z.string().min(1).max(20000).optional(),
    order: z.number().int().optional(),
    featured: z.boolean().optional(),
  })
  .strict();

export async function PATCH(request: NextRequest, context: Ctx) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  const { id } = await context.params;
  const body = await parseJson<unknown>(request);
  const parsed = FaqPatchSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid JSON", 400);

  const rest: Record<string, unknown> = { ...parsed.data };
  if (typeof rest.answerHtml === "string") {
    rest.answerHtml = sanitizeRichHtml(rest.answerHtml);
  }

  await connectDb();
  const updated = await Faq.findByIdAndUpdate(id, { $set: rest }, {
    returnDocument: "after",
  }).lean();
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
