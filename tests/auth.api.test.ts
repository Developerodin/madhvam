import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { seedTestDb } from "./helpers/seedTestDb";
import { POST as login } from "@/app/api/auth/login/route";
import { GET as me } from "@/app/api/auth/me/route";
import { GET as adminFaqs } from "@/app/api/admin/faqs/route";
import { PATCH as patchFaq } from "@/app/api/admin/faqs/[id]/route";
import { GET as publicFaqs } from "@/app/api/public/faqs/route";
import { ADMIN_COOKIE } from "@/lib/auth/constants";
import { Faq } from "@/models";

function jsonRequest(url: string, body: unknown, token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return new NextRequest(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

function tokenFromLogin(res: Response): string {
  const setCookie = res.headers.get("set-cookie") || "";
  const match = setCookie.match(new RegExp(`${ADMIN_COOKIE}=([^;]+)`));
  if (!match?.[1]) {
    throw new Error("Expected admin_token cookie on login response");
  }
  return match[1];
}

describe("JWT auth API", () => {
  beforeEach(async () => {
    await seedTestDb();
  });

  it("rejects missing credentials", async () => {
    const res = await login(
      jsonRequest("http://localhost/api/auth/login", {}),
    );
    expect(res.status).toBe(400);
  });

  it("rejects wrong password", async () => {
    const res = await login(
      jsonRequest("http://localhost/api/auth/login", {
        email: process.env.ADMIN_EMAIL,
        password: "wrong-password",
      }),
    );
    expect(res.status).toBe(401);
  });

  it("logs in with httpOnly cookie; me works with Bearer from cookie", async () => {
    const res = await login(
      jsonRequest("http://localhost/api/auth/login", {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      }),
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.token).toBeUndefined();
    expect(data.admin.email).toBe(process.env.ADMIN_EMAIL?.toLowerCase());
    const token = tokenFromLogin(res);

    const meRes = await me(
      new NextRequest("http://localhost/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    expect(meRes.status).toBe(200);
  });

  it("blocks admin routes without token", async () => {
    const res = await adminFaqs(
      new NextRequest("http://localhost/api/admin/faqs"),
    );
    expect(res.status).toBe(401);
  });

  it("allows admin FAQ update and public GET reflects change", async () => {
    const loginRes = await login(
      jsonRequest("http://localhost/api/auth/login", {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      }),
    );
    const token = tokenFromLogin(loginRes);
    const faq = await Faq.findOne({ featured: true });
    expect(faq).toBeTruthy();

    const patchRes = await patchFaq(
      new NextRequest(`http://localhost/api/admin/faqs/${faq!._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: "Updated canonical question for test?",
        }),
      }),
      { params: Promise.resolve({ id: String(faq!._id) }) },
    );
    expect(patchRes.status).toBe(200);

    const publicRes = await publicFaqs();
    expect(publicRes.status).toBe(200);
    const publicData = await publicRes.json();
    expect(
      publicData.faqs.some(
        (f: { question: string }) =>
          f.question === "Updated canonical question for test?",
      ),
    ).toBe(true);
  });

  it("strips script tags from FAQ answerHtml", async () => {
    const loginRes = await login(
      jsonRequest("http://localhost/api/auth/login", {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      }),
    );
    const token = tokenFromLogin(loginRes);
    const faq = await Faq.findOne({});
    expect(faq).toBeTruthy();

    const patchRes = await patchFaq(
      new NextRequest(`http://localhost/api/admin/faqs/${faq!._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          answerHtml: '<p>Safe</p><script>alert(1)</script><a href="javascript:alert(1)">x</a>',
        }),
      }),
      { params: Promise.resolve({ id: String(faq!._id) }) },
    );
    expect(patchRes.status).toBe(200);
    const body = await patchRes.json();
    expect(String(body.faq.answerHtml)).toContain("<p>Safe</p>");
    expect(String(body.faq.answerHtml)).not.toContain("<script");
    expect(String(body.faq.answerHtml)).not.toMatch(/javascript:/i);
  });
});
