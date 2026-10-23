import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth/jwt";
import { getPageSectionsPayload } from "@/lib/content/getters";
import { JsonEditor } from "@/components/admin/JsonEditor";

export const dynamic = "force-dynamic";

export default async function AdminSectionsPage() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) redirect("/admin/login");

  const sections = await getPageSectionsPayload();
  return (
    <JsonEditor
      title="Page sections"
      endpoint="/api/admin/sections"
      initial={sections}
      wrapKey="sections"
    />
  );
}
