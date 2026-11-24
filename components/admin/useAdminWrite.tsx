"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export type WriteArgs = {
  table: string;
  action: "insert" | "update" | "delete" | "upsert";
  id?: string;
  values?: Record<string, unknown>;
};

export function useAdminWrite() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function write(args: WriteArgs, success = "Saved") {
    setMessage(null);
    const res = await fetch("/api/admin/mutate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.ok) {
      setMessage({ type: "err", text: json.message ?? "Something went wrong." });
      return false;
    }
    setMessage({ type: "ok", text: success });
    start(() => router.refresh());
    return true;
  }

  return { write, pending, message, clearMessage: () => setMessage(null) };
}

export function Notice({ message }: { message: { type: "ok" | "err"; text: string } | null }) {
  if (!message) return null;
  return (
    <p role="status" className={`mb-4 rounded-xl px-4 py-3 text-sm ${message.type === "ok" ? "bg-olive/10 text-olive" : "bg-terracotta/10 text-terracotta-deep"}`}>
      {message.text}
    </p>
  );
}
