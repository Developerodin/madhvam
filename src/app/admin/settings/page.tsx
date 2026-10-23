import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth/jwt";
import { getSiteSettings } from "@/lib/content/getters";
import { SettingsAdmin } from "@/components/admin/SettingsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) redirect("/admin/login");

  const site = await getSiteSettings();
  return <SettingsAdmin initial={site} />;
}
