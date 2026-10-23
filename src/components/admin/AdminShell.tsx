"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { LogoutButton } from "@/components/admin/LogoutButton";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/plots", label: "Plots" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/documents", label: "Documents" },
  { href: "/admin/sections", label: "Sections" },
  { href: "/admin/enquiries", label: "Enquiries" },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";
  const [open, setOpen] = useState(false);
  const navId = useId();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(max-width: 899px)");
    if (!mq.matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    function onResize() {
      if (window.matchMedia("(min-width: 900px)").matches) setOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (isLogin) {
    return <div className="admin-root">{children}</div>;
  }

  return (
    <div className={`admin-root admin-shell${open ? " is-open" : ""}`}>
      <header className="admin-topbar">
        <button
          type="button"
          className="admin-burger"
          aria-expanded={open}
          aria-controls={navId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="admin-burger-bar" />
          <span className="admin-burger-bar" />
          <span className="admin-burger-bar" />
        </button>
        <span className="admin-topbar-title">Madhavam Admin</span>
      </header>

      <button
        type="button"
        className="admin-backdrop"
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
      />

      <aside id={navId} className="admin-sidebar" aria-label="Admin navigation">
        <div className="admin-sidebar-brand">Madhavam Admin</div>
        <nav className="admin-nav">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-link${
                isActive(pathname, item.href, "exact" in item && item.exact)
                  ? " is-active"
                  : ""
              }`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <LogoutButton variant="sidebar" />
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-main-inner">{children}</div>
      </main>
    </div>
  );
}
