import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { seedTestDb } from "./helpers/seedTestDb";
import { POST as createEnquiry } from "@/app/api/public/enquiries/route";
import { Enquiry } from "@/models";

describe("Enquiry API", () => {
  beforeEach(async () => {
    await seedTestDb();
  });

  it("rejects short phone numbers", async () => {
    const res = await createEnquiry(
      new NextRequest("http://localhost/api/public/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test Buyer",
          phone: "12345",
        }),
      }),
    );
    expect(res.status).toBe(400);
  });

  it("stores a valid enquiry", async () => {
    const res = await createEnquiry(
      new NextRequest("http://localhost/api/public/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test Buyer",
          phone: "+91 98765 43210",
          email: "buyer@example.com",
          message: "Site visit please",
        }),
      }),
    );
    expect(res.status).toBe(201);
    const count = await Enquiry.countDocuments({ name: "Test Buyer" });
    expect(count).toBe(1);
  });

  it("ignores honeypot-filled submissions without storing", async () => {
    const before = await Enquiry.countDocuments();
    const res = await createEnquiry(
      new NextRequest("http://localhost/api/public/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Bot Buyer",
          phone: "+91 98765 43210",
          company: "Spam Corp",
        }),
      }),
    );
    expect(res.status).toBe(201);
    const after = await Enquiry.countDocuments();
    expect(after).toBe(before);
  });
});
