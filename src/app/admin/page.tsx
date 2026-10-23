import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth/jwt";
import { connectDb } from "@/lib/db";
import { Enquiry, Faq, GalleryItem, Plot } from "@/models";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  const admin = token ? await verifyAdminToken(token) : null;
  if (!admin) redirect("/admin/login");

  await connectDb();
  const [plotCount, available, faqCount, galleryCount, enquiryCount, newEnquiries] =
    await Promise.all([
      Plot.countDocuments(),
      Plot.countDocuments({ status: "Available" }),
      Faq.countDocuments(),
      GalleryItem.countDocuments(),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: "new" }),
    ]);

  return (
    <div className="admin-stack">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-muted">Signed in as {admin.email}</p>
        </div>
      </header>

      <div className="admin-stat-grid">
        <Stat label="Plots" value={plotCount} href="/admin/plots" hint={`${available} available`} />
        <Stat label="New enquiries" value={newEnquiries} href="/admin/enquiries" hint={`${enquiryCount} total`} />
        <Stat label="FAQs" value={faqCount} href="/admin/faqs" />
        <Stat label="Gallery slides" value={galleryCount} href="/admin/gallery" />
      </div>

      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <h2 className="admin-card-title">Quick links</h2>
            <p className="admin-card-desc">Jump to the areas your team updates most often.</p>
          </div>
        </div>
        <div className="admin-card-body">
          <div className="admin-quick-grid">
            <Link href="/admin/plots" className="admin-quick-link">
              <strong>Plots & pricing</strong>
              <span>Rates, sizes, availability</span>
            </Link>
            <Link href="/admin/settings" className="admin-quick-link">
              <strong>Site settings</strong>
              <span>Contacts, hero, SEO</span>
            </Link>
            <Link href="/admin/enquiries" className="admin-quick-link">
              <strong>Enquiries</strong>
              <span>Follow up on leads</span>
            </Link>
            <Link href="/admin/faqs" className="admin-quick-link">
              <strong>FAQs</strong>
              <span>Buyer questions</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
  hint,
}: {
  label: string;
  value: number;
  href: string;
  hint?: string;
}) {
  return (
    <Link href={href} className="admin-stat-card">
      <div className="admin-stat-label">{label}</div>
      <div className="admin-stat-value">{value}</div>
      {hint ? <div className="admin-stat-hint">{hint}</div> : null}
    </Link>
  );
}
