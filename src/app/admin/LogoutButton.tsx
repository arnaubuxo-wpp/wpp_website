"use client";

import { useRouter } from "next/navigation";
import { WPP_T } from "@/lib/wpp/tokens";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        fontSize: 13,
        color: WPP_T.ink,
        background: "transparent",
        border: `1px solid ${WPP_T.hair}`,
        borderRadius: 999,
        padding: "6px 14px",
        cursor: "pointer",
      }}
    >
      Log out
    </button>
  );
}
