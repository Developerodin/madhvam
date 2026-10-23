import { getGalleryPayload } from "@/lib/content/getters";
import { jsonError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    const gallery = await getGalleryPayload();
    return jsonOk(gallery);
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : "Failed to load gallery",
      500,
    );
  }
}
