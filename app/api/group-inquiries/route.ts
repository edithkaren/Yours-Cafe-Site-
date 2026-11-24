import { NextResponse } from "next/server";
import { groupInquirySchema } from "@/lib/booking";
import { fieldErrors, badRequest, serverError, isBot } from "@/lib/api";
import { getServiceClient } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return badRequest({ form: "Invalid request" });
  if (isBot(body.website)) return NextResponse.json({ ok: true });
  const parsed = groupInquirySchema.safeParse(body);
  if (!parsed.success) return badRequest(fieldErrors(parsed.error));
  const v = parsed.data;
  const sb = getServiceClient();
  if (sb) {
    const { error } = await sb.from("group_inquiries").insert({
      name: v.name, phone: v.phone, email: v.email || null,
      inquiry_date: v.inquiryDate || null, guests: v.guests,
      occasion: v.occasion, message: v.message ?? "",
    });
    if (error) return serverError();
  }
  return NextResponse.json({ ok: true });
}
