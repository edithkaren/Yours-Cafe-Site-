import { NextResponse } from "next/server";
import { feedbackSchema } from "@/lib/booking";
import { fieldErrors, badRequest, serverError, isBot } from "@/lib/api";
import { getServiceClient } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return badRequest({ form: "Invalid request" });
  if (isBot(body.website)) return NextResponse.json({ ok: true });
  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) return badRequest(fieldErrors(parsed.error));
  const v = parsed.data;
  const sb = getServiceClient();
  if (sb) {
    const { error } = await sb.from("feedback").insert({
      name: v.name || null, visit_date: v.visitDate || null,
      overall_rating: v.overall, food_rating: v.food ?? null,
      service_rating: v.service ?? null, ambience_rating: v.ambience ?? null,
      message: v.message, is_public: false,
    });
    if (error) return serverError();
  }
  return NextResponse.json({ ok: true });
}
