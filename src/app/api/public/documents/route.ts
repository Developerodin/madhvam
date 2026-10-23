import { getDocumentsPayload } from "@/lib/content/getters";
import { jsonError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    const documents = await getDocumentsPayload();
    return jsonOk({ documents });
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : "Failed to load documents",
      500,
    );
  }
}
