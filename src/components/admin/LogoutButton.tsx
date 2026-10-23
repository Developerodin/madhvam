"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
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
      style={{
        background: "transparent",
        border: "1px solid #0E4A32",
        color: "#0E4A32",
        padding: "0.45rem 0.9rem",
        cursor: "pointer",
      }}
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
