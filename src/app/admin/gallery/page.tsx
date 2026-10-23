import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth/jwt";
import { getGalleryPayload } from "@/lib/content/getters";
import { GalleryAdmin } from "@/components/admin/GalleryAdmin";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) redirect("/admin/login");

  const gallery = await getGalleryPayload();
  return <GalleryAdmin initial={gallery} />;
}
