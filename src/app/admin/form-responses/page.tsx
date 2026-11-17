import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth/jwt";
import { connectDb } from "@/lib/db";
import { BrochureResponse } from "@/models";
import { FormResponsesAdmin } from "@/components/admin/FormResponsesAdmin";

export const dynamic = "force-dynamic";

export default async function AdminFormResponsesPage() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) redirect("/admin/login");

  await connectDb();
  const responses = await BrochureResponse.find({})
    .sort({ createdAt: -1 })
    .lean();

  return (
    <FormResponsesAdmin
      initial={responses.map((e) => ({
        id: String(e._id),
        name: e.name,
        phone: e.phone,
        email: e.email,
        dateOfBirth: e.dateOfBirth,
        message: e.message,
        status: e.status,
        createdAt: e.createdAt
          ? new Date(e.createdAt as Date).toISOString()
          : undefined,
      }))}
    />
  );
}
