import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth/jwt";
import { connectDb } from "@/lib/db";
import { Enquiry } from "@/models";
import { EnquiriesAdmin } from "@/components/admin/EnquiriesAdmin";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) redirect("/admin/login");

  await connectDb();
  const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }).lean();

  return (
    <EnquiriesAdmin
      initial={enquiries.map((e) => ({
        id: String(e._id),
        name: e.name,
        phone: e.phone,
        email: e.email,
        message: e.message,
        status: e.status,
        createdAt: e.createdAt
          ? new Date(e.createdAt as Date).toISOString()
          : undefined,
      }))}
    />
  );
}
