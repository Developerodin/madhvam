import { ADMIN_COOKIE, adminCookieOptions } from "@/lib/auth/jwt";
import { jsonOk } from "@/lib/api";

export async function POST() {
  const response = jsonOk({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", { ...adminCookieOptions(0), maxAge: 0 });
  return response;
}
