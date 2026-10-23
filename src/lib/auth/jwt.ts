import { SignJWT, jwtVerify } from "jose";
import {
  ADMIN_COOKIE,
  DEFAULT_JWT_EXPIRES_IN,
} from "@/lib/auth/constants";

export type AdminTokenPayload = {
  sub: string;
  email: string;
};

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

function expiresInSeconds(): number {
  const raw = process.env.JWT_EXPIRES_IN;
  if (!raw) return DEFAULT_JWT_EXPIRES_IN;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_JWT_EXPIRES_IN;
}

export async function signAdminToken(
  payload: AdminTokenPayload,
): Promise<string> {
  const exp = expiresInSeconds();
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${exp}s`)
    .sign(getSecret());
}

export async function verifyAdminToken(
  token: string,
): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const sub = typeof payload.sub === "string" ? payload.sub : null;
    const email =
      typeof payload.email === "string" ? payload.email : null;
    if (!sub || !email) return null;
    return { sub, email };
  } catch {
    return null;
  }
}

export function adminCookieOptions(maxAge = expiresInSeconds()) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export { ADMIN_COOKIE };
