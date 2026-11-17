import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { connectDb } from "@/lib/db";
import { BrochureResponse } from "@/models";
import { jsonError, jsonOk, parseJson } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

const StatusSchema = z.object({
  status: z.enum(["new", "contacted", "closed"]),
});

export async function PATCH(request: NextRequest, context: Ctx) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  const { id } = await context.params;
  const body = await parseJson<unknown>(request);
  const parsed = StatusSchema.safeParse(body);
  if (!parsed.success) return jsonError("Invalid status", 400);

  await connectDb();
  const updated = await BrochureResponse.findByIdAndUpdate(
    id,
    { status: parsed.data.status },
    { new: true },
  ).lean();
  if (!updated) return jsonError("Form response not found", 404);
  return jsonOk({
    response: {
      id: String(updated._id),
      status: updated.status,
    },
  });
}
