import { getPublicPlotsPayload } from "@/lib/content/getters";
import { jsonError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    const plots = await getPublicPlotsPayload();
    return jsonOk(plots);
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : "Failed to load plots",
      500,
    );
  }
}
