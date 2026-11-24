import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Staff sign in", robots: { index: false, follow: false } };

export default function AdminLoginPage({ searchParams }: { searchParams: { reason?: string } }) {
  return (
    <div className="container-x grid min-h-[70vh] place-items-center py-16">
      <div className="w-full max-w-sm rounded-3xl border border-espresso/10 bg-white p-8 shadow-card">
        <h1 className="font-display text-3xl font-medium">Staff sign in</h1>
        <p className="mt-2 text-sm text-muted">For café staff only.</p>
        {searchParams.reason === "unconfigured" && (
          <p className="mt-4 rounded-xl bg-beige px-4 py-3 text-sm">Connect Supabase in your environment settings to use the dashboard.</p>
        )}
        {searchParams.reason === "forbidden" && (
          <p className="mt-4 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta-deep">This account doesn't have dashboard access.</p>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
