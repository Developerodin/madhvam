import { revalidatePath } from "next/cache";

/** Safe for API route unit tests outside the Next request store. */
export function revalidatePublic() {
  try {
    revalidatePath("/");
    revalidatePath("/contact");
  } catch {
    // no-op outside Next.js request context (e.g. Vitest)
  }
}
