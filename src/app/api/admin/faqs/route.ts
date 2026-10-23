import { NextRequest } from "next/server";
import { revalidatePublic } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { connectDb } from "@/lib/db";
import { Faq } from "@/models";
import { getFaqsPayload } from "@/lib/content/getters";
import { jsonError, jsonOk, parseJson } from "@/lib/api";

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  return jsonOk({ faqs: await getFaqsPayload() });
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  const body = await parseJson<{ faqs?: Record<string, unknown>[] }>(request);
  if (!body?.faqs || !Array.isArray(body.faqs)) {
    return jsonError("faqs array required", 400);
  }

  await connectDb();
  await Faq.deleteMany({});
  await Faq.insertMany(
    body.faqs.map((f, index) => ({
      question: f.question,
      answerHtml: f.answerHtml,
      order: f.order ?? index + 1,
      featured: Boolean(f.featured),
    })),
  );

  revalidatePublic();
  return jsonOk({ faqs: await getFaqsPayload() });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  const body = await parseJson<{
    question: string;
    answerHtml: string;
    order?: number;
    featured?: boolean;
  }>(request);
  if (!body?.question || !body?.answerHtml) {
    return jsonError("question and answerHtml required", 400);
  }
  await connectDb();
  const faq = await Faq.create({
    question: body.question,
    answerHtml: body.answerHtml,
    order: body.order ?? 999,
    featured: body.featured ?? false,
  });
  revalidatePublic();
  return jsonOk({ faq }, { status: 201 });
}
