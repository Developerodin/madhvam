"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type LogoutButtonProps = {
  variant?: "sidebar" | "outline";
};

export function LogoutButton({ variant = "outline" }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className={variant === "sidebar" ? "admin-btn admin-btn-ghost" : "admin-btn admin-btn-outline"}
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
