import { NextResponse } from "next/server";
import { loyaltySchema } from "@/lib/booking";
import { fieldErrors, badRequest, serverError, isBot } from "@/lib/api";
import { getServiceClient } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return badRequest({ form: "Invalid request" });
  if (isBot(body.website)) return NextResponse.json({ ok: true });
  const parsed = loyaltySchema.safeParse(body);
  if (!parsed.success) return badRequest(fieldErrors(parsed.error));
  const sb = getServiceClient();
  if (sb) {
    const { error } = await sb.from("loyalty_signups").insert({ name: parsed.data.name, contact: parsed.data.contact });
    if (error) return serverError();
  }
  return NextResponse.json({ ok: true });
}
