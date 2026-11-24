import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

/**
 * Single admin write endpoint. Every request re-checks the signed-in user is an admin
 * via RLS (is_admin()). Only whitelisted tables and actions are allowed.
 */
const TABLES = [
  "menu_items", "menu_categories", "offers", "specials", "events",
  "gallery_images", "reservations", "feedback", "group_inquiries", "loyalty_signups", "site_settings",
] as const;

const body = z.object({
  table: z.enum(TABLES),
  action: z.enum(["insert", "update", "delete", "upsert"]),
  id: z.string().uuid().optional(),
  values: z.record(z.any()).optional(),
});

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const token = cookies().get("sb-access-token")?.value;
  if (!url || !anon || !token) return NextResponse.json({ ok: false, message: "Not signed in." }, { status: 401 });

  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  const { table, action, id, values } = parsed.data;

  const sb = createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let res;
  if (action === "insert") res = await sb.from(table).insert(values ?? {}).select().single();
  if (action === "update") res = await sb.from(table).update(values ?? {}).eq("id", id!).select().single();
  if (action === "delete") res = await sb.from(table).delete().eq("id", id!);
  if (action === "upsert") {
    const onConflict = table === "site_settings" ? "key" : "id";
    res = await sb.from(table).upsert(values ?? {}, { onConflict }).select().single();
  }

  if (!res || res.error) return NextResponse.json({ ok: false, message: res?.error?.message ?? "Save failed." }, { status: 403 });
  return NextResponse.json({ ok: true, data: res.data ?? null });
}
