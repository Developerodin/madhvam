import { z } from "zod";
import { connectDb } from "@/lib/db";
import { Admin } from "@/models";
import { verifyPassword } from "@/lib/auth/password";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  signAdminToken,
} from "@/lib/auth/jwt";
import { jsonError, jsonOk, parseJson } from "@/lib/api";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await parseJson<unknown>(request);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Email and password are required", 400);
  }

  await connectDb();
  const admin = await Admin.findOne({
    email: parsed.data.email.toLowerCase(),
  });
  if (!admin) {
    return jsonError("Invalid credentials", 401);
  }

  const ok = await verifyPassword(parsed.data.password, admin.passwordHash);
  if (!ok) {
    return jsonError("Invalid credentials", 401);
  }

  const token = await signAdminToken({
    sub: String(admin._id),
    email: admin.email,
  });

  const response = jsonOk({
    token,
    admin: { id: String(admin._id), email: admin.email },
  });
  response.cookies.set(ADMIN_COOKIE, token, adminCookieOptions());
  return response;
}
