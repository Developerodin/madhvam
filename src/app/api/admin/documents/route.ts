import { NextRequest } from "next/server";
import { z } from "zod";
import { revalidatePublic } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { connectDb } from "@/lib/db";
import { DocumentItem } from "@/models";
import { getDocumentsPayload } from "@/lib/content/getters";
import { jsonError, jsonOk, parseJson } from "@/lib/api";
import { sanitizeRichHtml } from "@/lib/security/sanitizeHtml";

const DocumentSchema = z
  .object({
    key: z.string().min(1).max(100),
    title: z.string().optional(),
    titleHtml: z.string().optional(),
    noteHtml: z.string().optional(),
    href: z.string().optional(),
    actionPending: z.boolean().optional(),
    order: z.number().int().optional(),
  })
  .passthrough();

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  return jsonOk({ documents: await getDocumentsPayload() });
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  const body = await parseJson<{ documents?: unknown }>(request);
  const parsed = z
    .object({ documents: z.array(DocumentSchema).max(50) })
    .safeParse(body);
  if (!parsed.success) {
    return jsonError("documents array required", 400);
  }

  await connectDb();
  const keys: string[] = [];
  for (const doc of parsed.data.documents) {
    keys.push(String(doc.key));
    const rest: Record<string, unknown> = { ...doc };
    delete rest._id;
    delete rest.__v;
    delete rest.id;
    delete rest.createdAt;
    delete rest.updatedAt;
    if (typeof rest.noteHtml === "string") {
      rest.noteHtml = sanitizeRichHtml(rest.noteHtml);
    }
    if (typeof rest.titleHtml === "string") {
      rest.titleHtml = sanitizeRichHtml(rest.titleHtml);
    }
    await DocumentItem.findOneAndUpdate(
      { key: doc.key },
      { $set: rest },
      { upsert: true },
    );
  }
  if (keys.length > 0) {
    await DocumentItem.deleteMany({ key: { $nin: keys } });
  } else {
    await DocumentItem.deleteMany({});
  }

  revalidatePublic();
  return jsonOk({ documents: await getDocumentsPayload() });
}
