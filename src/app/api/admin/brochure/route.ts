import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { connectDb } from "@/lib/db";
import { BrochureResponse } from "@/models";
import { jsonError, jsonOk } from "@/lib/api";

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  await connectDb();
  const responses = await BrochureResponse.find({})
    .sort({ createdAt: -1 })
    .lean();
  return jsonOk({
    responses: responses.map((e) => ({
      id: String(e._id),
      name: e.name,
      phone: e.phone,
      email: e.email,
      dateOfBirth: e.dateOfBirth,
      message: e.message,
      status: e.status,
      createdAt: e.createdAt,
    })),
  });
}
