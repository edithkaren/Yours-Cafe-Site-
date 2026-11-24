"use client";

import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { FormField } from "@/components/FormField";
import { useSubmit } from "@/components/useSubmit";
import { siteConfig } from "@/lib/config";
import { timeSlotsFor } from "@/lib/booking";

const occasions = [
  { v: "casual", l: "Casual hangout" },
  { v: "friends", l: "Friends meetup" },
  { v: "family", l: "Family dinner" },
  { v: "date-night", l: "Date night" },
  { v: "birthday", l: "Birthday" },
  { v: "anniversary", l: "Anniversary" },
  { v: "celebration", l: "Small celebration" },
  { v: "other", l: "Other" },
];

const todayIso = () => new Date().toISOString().slice(0, 10);

export function ReservationForm() {
  const { state, submit, reset } = useSubmit();
  const [date, setDate] = useState(todayIso());
  const [time, setTime] = useState("");
  const [seating, setSeating] = useState(
    siteConfig.booking.seating.find((s) => s.available)?.id ?? "indoor"
  );
  const [confirmed, setConfirmed] = useState<{ name: string; date: string; time: string; guests: number } | null>(null);

  const slots = useMemo(() => timeSlotsFor(date), [date]);
  const errors = state.status === "error" ? state.errors ?? {} : {};

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const payload = {
      name: f.get("name"),
      phone: f.get("phone"),
      email: f.get("email") ?? "",
      date,
      time,
      guests: f.get("guests"),
      occasion: f.get("occasion"),
      seating,
      notes: f.get("notes") ?? "",
      website: f.get("website") ?? "",
    };
    const ok = await submit("/api/reservations", payload);
    if (ok) {
      setConfirmed({ name: String(payload.name), date, time, guests: Number(payload.guests) });
      e.currentTarget.reset();
      setTime("");
    }
  }

  if (confirmed) {
    return (
      <div role="status" className="rounded-3xl border border-olive/30 bg-white p-8 text-center shadow-card">
        <CheckCircle2 className="mx-auto h-12 w-12 text-olive" aria-hidden />
        <h2 className="mt-4 font-display text-3xl font-medium">Thanks, {confirmed.name}.</h2>
        <p className="mx-auto mt-3 max-w-md text-muted">
          We've received your request for <strong className="text-espresso">{confirmed.guests}</strong> on{" "}
          <strong className="text-espresso">{confirmed.date}</strong> at{" "}
          <strong className="text-espresso">{confirmed.time}</strong>. Your booking is <em>pending</em> until
          our team confirms it, usually within the hour. We'll reach out on your phone or email.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="btn-ghost">Call the café</a>
          <button type="button" className="btn-primary" onClick={() => { setConfirmed(null); reset(); }}>
            Make another booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 rounded-3xl border border-espresso/10 bg-white p-6 shadow-card sm:p-8 md:grid-cols-2">
      {/* honeypot */}
      <div className="sr-only" aria-hidden>
        <label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="md:col-span-2 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta-deep">
          {state.message}
        </p>
      )}

      <FormField id="name" label="Your name" error={errors.name} className="md:col-span-1">
        <input id="name" name="name" autoComplete="name" required className="field" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
      </FormField>

      <FormField id="phone" label="Phone number" error={errors.phone} hint="We'll only call about this booking.">
        <input id="phone" name="phone" type="tel" autoComplete="tel" required className="field" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} />
      </FormField>

      <FormField id="date" label="Date" error={errors.date}>
        <input
          id="date"
          type="date"
          min={todayIso()}
          value={date}
          onChange={(e) => { setDate(e.target.value); setTime(""); }}
          required
          className="field"
          aria-invalid={!!errors.date}
        />
      </FormField>

      <FormField id="time" label="Time slot" error={errors.time}>
        <select id="time" value={time} onChange={(e) => setTime(e.target.value)} required className="field" aria-invalid={!!errors.time}>
          <option value="" disabled>Choose a time</option>
          {slots.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </FormField>

      <FormField id="guests" label="Number of guests" error={errors.guests} hint={`Up to ${siteConfig.booking.maxGuests} online. For bigger groups, use Group Dining.`}>
        <input id="guests" name="guests" type="number" min={1} max={siteConfig.booking.maxGuests} defaultValue={2} required className="field" aria-invalid={!!errors.guests} />
      </FormField>

      <FormField id="occasion" label="Occasion" error={errors.occasion}>
        <select id="occasion" name="occasion" defaultValue="casual" className="field" aria-invalid={!!errors.occasion}>
          {occasions.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      </FormField>

      <FormField id="email" label="Email (optional)" error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" className="field" aria-invalid={!!errors.email} />
      </FormField>

      <fieldset className="md:col-span-1">
        <legend className="label">Seating preference</legend>
        <div className="flex flex-wrap gap-2">
          {siteConfig.booking.seating.filter((s) => s.available).map((s) => (
            <label key={s.id} className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${seating === s.id ? "border-espresso bg-espresso text-cream" : "border-espresso/15 hover:border-espresso/40"}`}>
              <input type="radio" name="seating-choice" value={s.id} checked={seating === s.id} onChange={() => setSeating(s.id)} className="sr-only" />
              {s.label}
            </label>
          ))}
        </div>
        {errors.seating && <p className="mt-1.5 text-xs font-medium text-terracotta-deep" role="alert">{errors.seating}</p>}
      </fieldset>

      <FormField id="notes" label="Special requests" error={errors.notes} hint="Cake, decorations, a quiet corner — staff will confirm what we can do." className="md:col-span-2">
        <textarea id="notes" name="notes" rows={3} maxLength={500} className="field" />
      </FormField>

      <div className="md:col-span-2 flex flex-col items-start justify-between gap-3 border-t border-espresso/10 pt-5 sm:flex-row sm:items-center">
        <p className="text-xs text-muted">Bookings are confirmed by our team. At least {siteConfig.booking.minNoticeHours} hours' notice.</p>
        <button type="submit" disabled={state.status === "submitting"} className="btn-primary disabled:opacity-60">
          {state.status === "submitting" ? "Sending…" : "Request booking"}
        </button>
      </div>
    </form>
  );
}
