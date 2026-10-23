import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth/jwt";
import { connectDb } from "@/lib/db";
import { Enquiry, Faq, Plot } from "@/models";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  const admin = token ? await verifyAdminToken(token) : null;
  if (!admin) redirect("/admin/login");

  await connectDb();
  const [plotCount, faqCount, enquiryCount, newEnquiries] = await Promise.all([
    Plot.countDocuments(),
    Faq.countDocuments(),
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: "new" }),
  ]);

  return (
    <div>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Dashboard</h1>
      <p style={{ color: "#555", marginBottom: "1.5rem" }}>
        Signed in as {admin.email}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
        }}
      >
        <Stat label="Plots" value={plotCount} href="/admin/plots" />
        <Stat label="FAQs" value={faqCount} href="/admin/faqs" />
        <Stat label="Enquiries" value={enquiryCount} href="/admin/enquiries" />
        <Stat label="New enquiries" value={newEnquiries} href="/admin/enquiries" />
      </div>
      <div style={{ marginTop: "2rem" }}>
        <LogoutButton />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: "1rem",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: 6,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div style={{ fontSize: "0.85rem", color: "#666" }}>{label}</div>
      <div style={{ fontSize: "1.75rem", fontWeight: 700 }}>{value}</div>
    </Link>
  );
}
