import { z } from "zod";
import { connectDb } from "@/lib/db";
import { BrochureResponse } from "@/models";
import { jsonError, jsonOk, parseJson } from "@/lib/api";
import { dateOfBirthError } from "@/lib/dateOfBirth";
import { clientIp, rateLimit } from "@/lib/security/rateLimit";

const BrochureSchema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().min(1),
  email: z
    .union([z.string().email(), z.literal("")])
    .optional()
    .default(""),
  dateOfBirth: z.string().trim().optional().default(""),
  message: z.string().optional().default(""),
  /** Honeypot — must stay empty */
  company: z.string().optional().default(""),
});

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limited = rateLimit(`brochure:${ip}`, 8, 15 * 60 * 1000);
  if (!limited.ok) {
    return jsonError("Too many submissions. Please try again later.", 429);
  }

  const body = await parseJson<unknown>(request);
  const parsed = BrochureSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Invalid brochure form payload", 400);
  }

  // Silent success for bots that fill honeypot
  if (parsed.data.company.trim()) {
    return jsonOk({ id: "ok", ok: true }, { status: 201 });
  }

  const digits = parsed.data.phone.replace(/\D/g, "");
  if (digits.length < 10) {
    return jsonError("Enter a phone number with at least 10 digits", 400);
  }

  const dobError = dateOfBirthError(parsed.data.dateOfBirth);
  if (dobError) {
    return jsonError(dobError, 400);
  }

  try {
    await connectDb();
    const response = await BrochureResponse.create({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || "",
      dateOfBirth: parsed.data.dateOfBirth || "",
      message: parsed.data.message || "",
      status: "new",
    });

    return jsonOk(
      {
        id: String(response._id),
        ok: true,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[brochure] save failed", err);
    const message =
      err instanceof Error &&
      /ECONNREFUSED|ServerSelection|MONGODB_URI/i.test(err.message)
        ? "Database unavailable. Start Mongo with `npm run mongo:local` (or Docker), then `npm run seed`."
        : "Could not save your details. Please try again.";
    return jsonError(message, 503);
  }
}
