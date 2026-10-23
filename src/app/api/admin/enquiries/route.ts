import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { connectDb } from "@/lib/db";
import { Enquiry } from "@/models";
import { jsonError, jsonOk } from "@/lib/api";

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);
  await connectDb();
  const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }).lean();
  return jsonOk({
    enquiries: enquiries.map((e) => ({
      id: String(e._id),
      name: e.name,
      phone: e.phone,
      email: e.email,
      message: e.message,
      status: e.status,
      createdAt: e.createdAt,
    })),
  });
}
