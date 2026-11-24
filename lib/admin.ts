import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Admin gate. Verifies the signed-in Supabase user is listed in public.admins.
 * Uses the user's own session (anon key + cookie access token) so RLS applies.
 */
export async function requireAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) redirect("/admin/login?reason=unconfigured");

  const token = cookies().get("sb-access-token")?.value;
  if (!token) redirect("/admin/login");

  const sb = createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData } = await sb.auth.getUser(token);
  if (!userData?.user) redirect("/admin/login");

  const { data: isAdmin } = await sb.rpc("is_admin");
  if (!isAdmin) redirect("/admin/login?reason=forbidden");

  return { sb, user: userData.user };
}
