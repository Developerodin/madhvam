import { z } from "zod";
import { connectDb } from "@/lib/db";
import { Enquiry } from "@/models";
import { jsonError, jsonOk, parseJson } from "@/lib/api";

const EnquirySchema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().min(1),
  email: z
    .union([z.string().email(), z.literal("")])
    .optional()
    .default(""),
  message: z.string().optional().default(""),
});

export async function POST(request: Request) {
  const body = await parseJson<unknown>(request);
  const parsed = EnquirySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Invalid enquiry payload", 400);
  }

  const digits = parsed.data.phone.replace(/\D/g, "");
  if (digits.length < 10) {
    return jsonError("Enter a phone number with at least 10 digits", 400);
  }

  try {
    await connectDb();
    const enquiry = await Enquiry.create({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || "",
      message: parsed.data.message || "",
      status: "new",
    });

    return jsonOk(
      {
        id: String(enquiry._id),
        ok: true,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[enquiries] save failed", err);
    const message =
      err instanceof Error && /ECONNREFUSED|ServerSelection|MONGODB_URI/i.test(err.message)
        ? "Database unavailable. Start Mongo with `npm run mongo:local` (or Docker), then `npm run seed`."
        : "Could not save enquiry. Please try again.";
    return jsonError(message, 503);
  }
}
