import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import "@/styles/admin.css";

export const metadata: Metadata = {
  title: "Madhavam Admin",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      nosnippet: true,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
