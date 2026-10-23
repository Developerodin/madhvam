import { NextRequest } from "next/server";
import { z } from "zod";
import { revalidatePublic } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { connectDb } from "@/lib/db";
import { Faq } from "@/models";
import { getFaqsPayload } from "@/lib/content/getters";
import { jsonError, jsonOk, parseJson } from "@/lib/api";
import { sanitizeRichHtml } from "@/lib/security/sanitizeHtml";

const FaqItemSchema = z.object({
  question: z.string().trim().min(1).max(500),
  answerHtml: z.string().min(1).max(20000),
  order: z.number().int().optional(),
  featured: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  return jsonOk({ faqs: await getFaqsPayload() });
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  const body = await parseJson<{ faqs?: unknown }>(request);
  const parsed = z
    .object({ faqs: z.array(FaqItemSchema).max(200) })
    .safeParse(body);
  if (!parsed.success) {
    return jsonError("faqs array required", 400);
  }

  await connectDb();
  await Faq.deleteMany({});
  await Faq.insertMany(
    parsed.data.faqs.map((f, index) => ({
      question: f.question,
      answerHtml: sanitizeRichHtml(f.answerHtml),
      order: f.order ?? index + 1,
      featured: Boolean(f.featured),
    })),
  );

  revalidatePublic();
  return jsonOk({ faqs: await getFaqsPayload() });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  const body = await parseJson<unknown>(request);
  const parsed = FaqItemSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("question and answerHtml required", 400);
  }
  await connectDb();
  const faq = await Faq.create({
    question: parsed.data.question,
    answerHtml: sanitizeRichHtml(parsed.data.answerHtml),
    order: parsed.data.order ?? 999,
    featured: parsed.data.featured ?? false,
  });
  revalidatePublic();
  return jsonOk({ faq }, { status: 201 });
}
