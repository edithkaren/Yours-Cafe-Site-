import { z } from "zod";
import { siteConfig } from "@/lib/config";

const { booking } = siteConfig;

/** Returns "HH:MM" slots between open and close, stepping by slotMinutes. */
export function timeSlotsFor(dateIso: string): string[] {
  const d = new Date(dateIso + "T00:00:00");
  const day = d.getDay(); // 0 Sun … 6 Sat
  const isWeekend = day === 5 || day === 6 || day === 0; // Fri–Sun later close
  const openMin = 11 * 60;
  const closeMin = isWeekend ? 24 * 60 : 23 * 60; // last seating before close
  const lastSeating = closeMin - booking.durationMinutes;
  const out: string[] = [];
  for (let m = openMin; m <= lastSeating; m += booking.slotMinutes) {
    const h = String(Math.floor(m / 60) % 24).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    out.push(`${h}:${mm}`);
  }
  return out;
}

/** Earliest bookable moment = now + minNoticeHours. */
export function isTooSoon(dateIso: string, time: string, now = new Date()): boolean {
  const slot = new Date(`${dateIso}T${time}:00`);
  const minAllowed = new Date(now.getTime() + booking.minNoticeHours * 3600_000);
  return slot.getTime() < minAllowed.getTime();
}

const todayIso = () => new Date().toISOString().slice(0, 10);

export const reservationSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name").max(80),
    phone: z
      .string()
      .trim()
      .regex(/^[+\d][\d\s-]{6,19}$/, "Enter a valid phone number"),
    email: z
      .string()
      .trim()
      .email("Enter a valid email")
      .optional()
      .or(z.literal("")),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date"),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Choose a time"),
    guests: z.coerce.number().int().min(1).max(booking.maxGuests),
    occasion: z.enum([
      "casual", "birthday", "anniversary", "friends", "family", "date-night", "celebration", "other",
    ]),
    seating: z.string(),
    notes: z.string().trim().max(500).optional().or(z.literal("")),
    // honeypot — must stay empty
    website: z.string().max(0).optional(),
  })
  .superRefine((v, ctx) => {
    if (v.date < todayIso()) {
      ctx.addIssue({ code: "custom", path: ["date"], message: "Choose today or a future date" });
    }
    if (!timeSlotsFor(v.date).includes(v.time)) {
      ctx.addIssue({ code: "custom", path: ["time"], message: "That time isn't available" });
    }
    if (isTooSoon(v.date, v.time)) {
      ctx.addIssue({
        code: "custom",
        path: ["time"],
        message: `Please book at least ${booking.minNoticeHours} hours ahead`,
      });
    }
    if (!booking.seating.some((s) => s.id === v.seating && s.available)) {
      ctx.addIssue({ code: "custom", path: ["seating"], message: "Choose a seating option" });
    }
  });

export type ReservationInput = z.infer<typeof reservationSchema>;

export const groupInquirySchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{6,19}$/, "Enter a valid phone number"),
  email: z.string().trim().email().optional().or(z.literal("")),
  inquiryDate: z.string().optional().or(z.literal("")),
  guests: z.coerce.number().int().min(6, "Group dining starts at 6 guests").max(500),
  occasion: z.enum(["birthday", "friends", "celebration", "family", "office", "other"]),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  website: z.string().max(0).optional(),
});

export const feedbackSchema = z.object({
  name: z.string().trim().max(80).optional().or(z.literal("")),
  visitDate: z.string().optional().or(z.literal("")),
  overall: z.coerce.number().int().min(1).max(5),
  food: z.coerce.number().int().min(1).max(5).optional(),
  service: z.coerce.number().int().min(1).max(5).optional(),
  ambience: z.coerce.number().int().min(1).max(5).optional(),
  message: z.string().trim().min(5, "Tell us a little more").max(1000),
  website: z.string().max(0).optional(),
});

export const loyaltySchema = z.object({
  name: z.string().trim().min(2).max(80),
  contact: z.string().trim().min(5).max(120),
  website: z.string().max(0).optional(),
});
