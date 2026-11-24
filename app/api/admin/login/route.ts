import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const schema = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return NextResponse.json({ ok: false, message: "Backend not configured." }, { status: 503 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Enter a valid email and password." }, { status: 400 });

  const sb = createClient(url, anon, { auth: { persistSession: false } });
  const { data, error } = await sb.auth.signInWithPassword(parsed.data);
  if (error || !data.session) return NextResponse.json({ ok: false, message: "Those details don't match." }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("sb-access-token", data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: data.session.expires_in,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("sb-access-token", "", { path: "/", maxAge: 0 });
  return res;
}
