import { getFaqsPayload } from "@/lib/content/getters";
import { jsonError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    const faqs = await getFaqsPayload();
    return jsonOk({ faqs });
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : "Failed to load faqs",
      500,
    );
  }
}
