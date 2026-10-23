"use client";

export async function adminFetch(path: string, init?: RequestInit) {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    credentials: "include",
  });
  if (res.status === 401 && typeof window !== "undefined") {
    window.location.href = "/admin/login";
  }
  return res;
}
