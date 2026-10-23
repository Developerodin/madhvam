import { z } from "zod";
import { connectDb } from "@/lib/db";
import { Enquiry } from "@/models";
import { jsonError, jsonOk, parseJson } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/security/rateLimit";

const EnquirySchema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().min(1),
  email: z
    .union([z.string().email(), z.literal("")])
    .optional()
    .default(""),
  message: z.string().optional().default(""),
  /** Honeypot — must stay empty */
  company: z.string().optional().default(""),
});

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limited = rateLimit(`enquiry:${ip}`, 8, 15 * 60 * 1000);
  if (!limited.ok) {
    return jsonError("Too many enquiries. Please try again later.", 429);
  }

  const body = await parseJson<unknown>(request);
  const parsed = EnquirySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Invalid enquiry payload", 400);
  }

  // Silent success for bots that fill honeypot
  if (parsed.data.company.trim()) {
    return jsonOk({ id: "ok", ok: true }, { status: 201 });
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
      err instanceof Error &&
      /ECONNREFUSED|ServerSelection|MONGODB_URI/i.test(err.message)
        ? "Database unavailable. Start Mongo with `npm run mongo:local` (or Docker), then `npm run seed`."
        : "Could not save enquiry. Please try again.";
    return jsonError(message, 503);
  }
}
