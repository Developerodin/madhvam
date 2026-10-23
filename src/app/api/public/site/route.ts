import { getSiteSettings, getPageSectionsPayload } from "@/lib/content/getters";
import { jsonError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    const [site, sections] = await Promise.all([
      getSiteSettings(),
      getPageSectionsPayload(),
    ]);
    return jsonOk({ site, sections });
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : "Failed to load site",
      500,
    );
  }
}
