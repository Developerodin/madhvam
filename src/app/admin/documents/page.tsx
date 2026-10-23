import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth/jwt";
import { getDocumentsPayload } from "@/lib/content/getters";
import { DocumentsAdmin } from "@/components/admin/DocumentsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminDocumentsPage() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) redirect("/admin/login");

  const documents = await getDocumentsPayload();
  return (
    <DocumentsAdmin
      initial={documents as {
        id?: string;
        key: string;
        tabLabel: string;
        name: string;
        order: number;
        meta: { label: string; value: string; href?: string }[];
        noteHtml?: string;
        actionLabel?: string;
        actionHref?: string;
        actionPending?: boolean;
      }[]}
    />
  );
}
