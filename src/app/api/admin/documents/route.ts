import { NextRequest } from "next/server";
import { revalidatePublic } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { connectDb } from "@/lib/db";
import { DocumentItem } from "@/models";
import { getDocumentsPayload } from "@/lib/content/getters";
import { jsonError, jsonOk, parseJson } from "@/lib/api";

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  return jsonOk({ documents: await getDocumentsPayload() });
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  const body = await parseJson<{ documents?: Record<string, unknown>[] }>(
    request,
  );
  if (!body?.documents || !Array.isArray(body.documents)) {
    return jsonError("documents array required", 400);
  }

  await connectDb();
  for (const doc of body.documents) {
    if (!doc.key) continue;
    const { _id, __v, id, createdAt, updatedAt, ...rest } = doc;
    await DocumentItem.findOneAndUpdate(
      { key: doc.key },
      { $set: rest },
      { upsert: true },
    );
  }

  revalidatePublic();
  return jsonOk({ documents: await getDocumentsPayload() });
}
