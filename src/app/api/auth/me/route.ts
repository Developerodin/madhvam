import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { jsonError, jsonOk } from "@/lib/api";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return jsonError("Unauthorized", 401);
  }
  return jsonOk({ admin: { id: admin.sub, email: admin.email } });
}
