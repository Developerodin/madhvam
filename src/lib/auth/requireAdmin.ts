import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import {
  ADMIN_COOKIE,
  verifyAdminToken,
  type AdminTokenPayload,
} from "@/lib/auth/jwt";

function tokenFromRequest(request?: NextRequest): string | null {
  if (request) {
    const header = request.headers.get("authorization");
    if (header?.startsWith("Bearer ")) {
      return header.slice(7).trim() || null;
    }
    const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
    if (cookie) return cookie;
  }
  return null;
}

export async function requireAdmin(
  request?: NextRequest,
): Promise<AdminTokenPayload | null> {
  let token = tokenFromRequest(request);
  if (!token) {
    try {
      const jar = await cookies();
      token = jar.get(ADMIN_COOKIE)?.value ?? null;
    } catch {
      token = null;
    }
  }
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function requireAdminOrThrow(
  request?: NextRequest,
): Promise<AdminTokenPayload> {
  const admin = await requireAdmin(request);
  if (!admin) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return admin;
}
