import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth/jwt";
import { getFaqsPayload } from "@/lib/content/getters";
import { FaqsAdmin } from "@/components/admin/FaqsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) redirect("/admin/login");

  const faqs = await getFaqsPayload();
  return <FaqsAdmin initial={faqs} />;
}
