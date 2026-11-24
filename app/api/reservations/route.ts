import { NextResponse } from "next/server";
import { reservationSchema, timeSlotsFor } from "@/lib/booking";
import { fieldErrors, badRequest, serverError, isBot } from "@/lib/api";
import { getServiceClient, supabaseConfigured } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return badRequest({ form: "Invalid request" });
  if (isBot(body.website)) return NextResponse.json({ ok: true, id: "accepted" });

  const parsed = reservationSchema.safeParse(body);
  if (!parsed.success) return badRequest(fieldErrors(parsed.error));
  const v = parsed.data;

  const sb = getServiceClient();
  if (sb) {
    // Capacity guard: block a slot once it has reached the configured limit
    const { data: countData } = await sb.rpc("count_bookings_at", { d: v.date, t: v.time });
    const limit = Number(process.env.RESERVATION_LIMIT_PER_SLOT ?? 8);
    if (typeof countData === "number" && countData >= limit) {
      return badRequest({ time: "That time is fully booked. Please pick another slot." });
    }
    const { data, error } = await sb
      .from("reservations")
      .insert({
        name: v.name,
        phone: v.phone,
        email: v.email || null,
        reservation_date: v.date,
        reservation_time: v.time,
        guests: v.guests,
        occasion: v.occasion,
        seating: v.seating,
        notes: v.notes || null,
        status: "pending",
      })
      .select("id")
      .single();
    if (error || !data) return serverError();
    return NextResponse.json({ ok: true, id: data.id });
  }

  if (!supabaseConfigured) console.info("[reservation:demo]", v);
  return NextResponse.json({ ok: true, id: `demo-${Date.now()}` });
}

export function GET(req: Request) {
  const date = new URL(req.url).searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
  return NextResponse.json({ slots: timeSlotsFor(date) });
}
