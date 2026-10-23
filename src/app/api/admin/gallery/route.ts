import { NextRequest } from "next/server";
import { revalidatePublic } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { connectDb } from "@/lib/db";
import { GalleryItem, GalleryFilters } from "@/models";
import { getGalleryPayload } from "@/lib/content/getters";
import { jsonError, jsonOk, parseJson } from "@/lib/api";

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  return jsonOk(await getGalleryPayload());
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  const body = await parseJson<{
    slides?: Record<string, unknown>[];
    filters?: { id: string; label: string; icon: string }[];
  }>(request);
  if (!body) return jsonError("Invalid JSON", 400);

  await connectDb();
  if (Array.isArray(body.slides)) {
    await GalleryItem.deleteMany({});
    await GalleryItem.insertMany(
      body.slides.map((slide, index) => {
        const { _id, __v, createdAt, updatedAt, ...rest } = slide;
        return { ...rest, order: rest.order ?? index };
      }),
    );
  }
  if (Array.isArray(body.filters)) {
    await GalleryFilters.findOneAndUpdate(
      { key: "default" },
      { key: "default", filters: body.filters },
      { upsert: true },
    );
  }

  revalidatePublic();
  return jsonOk(await getGalleryPayload());
}
