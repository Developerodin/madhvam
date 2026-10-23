import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth/jwt";
import { getPageSectionsPayload } from "@/lib/content/getters";
import { SectionsAdmin } from "@/components/admin/SectionsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminSectionsPage() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) redirect("/admin/login");

  const sections = await getPageSectionsPayload();
  return <SectionsAdmin initial={sections} />;
}
