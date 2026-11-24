import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function fieldErrors(err: ZodError) {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export function badRequest(errors: Record<string, string>) {
  return NextResponse.json({ ok: false, errors }, { status: 400 });
}

export function serverError() {
  return NextResponse.json(
    { ok: false, message: "We couldn't save that just now. Please try again or call us." },
    { status: 500 }
  );
}

/** Honeypot: silently accept bots without storing anything. */
export function isBot(website: unknown) {
  return typeof website === "string" && website.length > 0;
}
