"use client";

import { useState } from "react";
import { useAdminWrite, Notice } from "./useAdminWrite";

/**
 * Stores editable restaurant settings as key/value rows in site_settings.
 * Public pages still read from lib/config.ts; wire those reads to this table
 * once you're ready to edit everything without a code change.
 */
const keys: { key: string; label: string; hint?: string }[] = [
  { key: "restaurant_name", label: "Restaurant name" },
  { key: "phone", label: "Phone" },
  { key: "whatsapp", label: "WhatsApp number", hint: "Digits only with country code, e.g. 919876543210" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
  { key: "maps_link", label: "Google Maps link" },
  { key: "swiggy_link", label: "Swiggy link" },
  { key: "zomato_link", label: "Zomato link" },
  { key: "google_review_link", label: "Google review link" },
  { key: "instagram", label: "Instagram URL" },
  { key: "facebook", label: "Facebook URL" },
  { key: "hours", label: "Opening hours (free text)", hint: "e.g. Mon–Thu 11 AM–11 PM · Fri–Sun 11 AM–12 AM" },
];

export function SettingsManager({ rows }: { rows: { key: string; value: unknown }[] }) {
  const { write, pending, message } = useAdminWrite();
  const initial = Object.fromEntries(rows.map((r) => [r.key, typeof r.value === "string" ? r.value : JSON.stringify(r.value).replace(/^"|"$/g, "")]));
  const [values, setValues] = useState<Record<string, string>>(initial);

  async function saveAll(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    for (const k of keys) {
      const current = initial[k.key] ?? "";
      if (values[k.key] !== current) {
        await write({ table: "site_settings", action: "upsert", values: { key: k.key, value: values[k.key] } }, "Settings saved");
      }
    }
  }

  return (
    <form onSubmit={saveAll} className="grid gap-5 rounded-3xl border border-espresso/10 bg-white p-6 sm:grid-cols-2 sm:p-8">
      <Notice message={message} />
      {keys.map((k) => (
        <div key={k.key} className={k.key === "hours" || k.key === "address" ? "sm:col-span-2" : ""}>
          <label className="label" htmlFor={`s-${k.key}`}>{k.label}</label>
          <input id={`s-${k.key}`} className="field" value={values[k.key] ?? ""} onChange={(e) => setValues({ ...values, [k.key]: e.target.value })} />
          {k.hint && <p className="mt-1.5 text-xs text-muted">{k.hint}</p>}
        </div>
      ))}
      <div className="sm:col-span-2 flex justify-end border-t border-espresso/10 pt-5">
        <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">Save settings</button>
      </div>
    </form>
  );
}
