import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth/jwt";
import { getDocumentsPayload } from "@/lib/content/getters";
import { JsonEditor } from "@/components/admin/JsonEditor";

export const dynamic = "force-dynamic";

export default async function AdminDocumentsPage() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) redirect("/admin/login");

  const documents = await getDocumentsPayload();
  return (
    <JsonEditor
      title="Documents"
      endpoint="/api/admin/documents"
      initial={documents}
      wrapKey="documents"
    />
  );
}
