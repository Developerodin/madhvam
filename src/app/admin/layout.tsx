import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Madhavam Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f3ee",
        color: "#1a1a1a",
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      <header
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          padding: "0.85rem 1.25rem",
          borderBottom: "1px solid #d9d0c3",
          background: "#0E4A32",
          color: "#fff",
        }}
      >
        <strong style={{ letterSpacing: "0.04em" }}>Madhavam Admin</strong>
        <nav style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", fontSize: "0.95rem" }}>
          <Link href="/admin" style={{ color: "#fff" }}>
            Dashboard
          </Link>
          <Link href="/admin/settings" style={{ color: "#fff" }}>
            Settings
          </Link>
          <Link href="/admin/plots" style={{ color: "#fff" }}>
            Plots
          </Link>
          <Link href="/admin/gallery" style={{ color: "#fff" }}>
            Gallery
          </Link>
          <Link href="/admin/faqs" style={{ color: "#fff" }}>
            FAQs
          </Link>
          <Link href="/admin/documents" style={{ color: "#fff" }}>
            Documents
          </Link>
          <Link href="/admin/sections" style={{ color: "#fff" }}>
            Sections
          </Link>
          <Link href="/admin/enquiries" style={{ color: "#fff" }}>
            Enquiries
          </Link>
          <Link href="/" style={{ color: "#c8e6d4" }}>
            View site
          </Link>
        </nav>
      </header>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem 1.25rem 3rem" }}>
        {children}
      </main>
    </div>
  );
}
