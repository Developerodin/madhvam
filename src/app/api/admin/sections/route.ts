import { NextRequest } from "next/server";
import { revalidatePublic } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { connectDb } from "@/lib/db";
import { PageSection } from "@/models";
import { getPageSectionsPayload } from "@/lib/content/getters";
import { jsonError, jsonOk, parseJson } from "@/lib/api";

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  return jsonOk({ sections: await getPageSectionsPayload() });
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  const body = await parseJson<{
    sections?: Record<string, { title?: string; content: Record<string, unknown> }>;
  }>(request);
  if (!body?.sections) return jsonError("sections required", 400);

  await connectDb();
  for (const [key, value] of Object.entries(body.sections)) {
    await PageSection.findOneAndUpdate(
      { key },
      { key, title: value.title, content: value.content },
      { upsert: true },
    );
  }

  revalidatePublic();
  return jsonOk({ sections: await getPageSectionsPayload() });
}
