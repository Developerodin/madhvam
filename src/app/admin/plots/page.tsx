import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth/jwt";
import { getPlotsPayload } from "@/lib/content/getters";
import { PlotsAdmin } from "@/components/admin/PlotsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminPlotsPage() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) redirect("/admin/login");

  const data = await getPlotsPayload();
  return <PlotsAdmin initial={data} />;
}
