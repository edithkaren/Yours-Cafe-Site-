"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/FormField";

export function LoginForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: f.get("email"), password: f.get("password") }),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok && json.ok) router.push("/admin");
    else setError(json.message ?? "Sign in failed.");
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
      {error && <p role="alert" className="rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta-deep">{error}</p>}
      <FormField id="email" label="Email">
        <input id="email" name="email" type="email" autoComplete="username" required className="field" />
      </FormField>
      <FormField id="password" label="Password">
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      </FormField>
      <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
