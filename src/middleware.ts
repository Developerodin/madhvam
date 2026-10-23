import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_COOKIE } from "@/lib/auth/constants";

function withAdminNoIndex(response: NextResponse): NextResponse {
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

async function hasValidAdminToken(request: NextRequest): Promise<boolean> {
  const bearer = request.headers.get("authorization");
  const fromHeader =
    bearer?.startsWith("Bearer ") ? bearer.slice(7).trim() : "";
  const token =
    fromHeader || request.cookies.get(ADMIN_COOKIE)?.value || "";
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/admin")) {
    const ok = await hasValidAdminToken(request);
    if (!ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/login")) {
    return withAdminNoIndex(NextResponse.next());
  }

  if (pathname.startsWith("/admin")) {
    const ok = await hasValidAdminToken(request);
    if (!ok) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return withAdminNoIndex(NextResponse.redirect(url));
    }
    return withAdminNoIndex(NextResponse.next());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
