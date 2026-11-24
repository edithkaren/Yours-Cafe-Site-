"use client";

import { useMemo, useState } from "react";
import { useAdminWrite, Notice } from "./useAdminWrite";

type Row = {
  id: string; name: string; phone: string; email: string | null; reservation_date: string;
  reservation_time: string; guests: number; occasion: string; seating: string; notes: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed";
};

const statuses: Row["status"][] = ["pending", "confirmed", "cancelled", "completed"];
const today = () => new Date().toISOString().slice(0, 10);

export function ReservationManager({ rows }: { rows: Row[] }) {
  const { write, pending, message } = useAdminWrite();
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("all");

  const visible = useMemo(
    () => rows.filter((r) => (!date || r.reservation_date === date) && (status === "all" || r.status === status)),
    [rows, date, status]
  );

  const counts = useMemo(() => {
    const t = today();
    const todays = rows.filter((r) => r.reservation_date === t);
    return {
      today: todays.length,
      guests: todays.reduce((s, r) => s + r.guests, 0),
      pending: rows.filter((r) => r.status === "pending").length,
    };
  }, [rows]);

  return (
    <div>
      <Notice message={message} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Bookings today" value={counts.today} />
        <Stat label="Guests today" value={counts.guests} />
        <Stat label="Awaiting confirmation" value={counts.pending} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input type="date" aria-label="Filter by date" value={date} onChange={(e) => setDate(e.target.value)} className="field !w-auto !py-2" />
        <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} className="field !w-auto !py-2">
          <option value="all">All statuses</option>
          {statuses.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        {date && <button type="button" className="text-sm font-semibold text-terracotta" onClick={() => setDate("")}>Clear date</button>}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-espresso/10 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-espresso/10 bg-beige/50">
            <tr>{["When", "Guest", "Party", "Occasion & seating", "Notes", "Status", ""].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.id} className="border-b border-espresso/5 align-top last:border-0">
                <td className="px-4 py-3 whitespace-nowrap">{r.reservation_date}<br /><span className="text-muted">{r.reservation_time.slice(0, 5)}</span></td>
                <td className="px-4 py-3">
                  <p className="font-medium">{r.name}</p>
                  <a href={`tel:${r.phone}`} className="text-muted hover:text-espresso">{r.phone}</a>
                  {r.email && <p className="text-muted">{r.email}</p>}
                </td>
                <td className="px-4 py-3">{r.guests}</td>
                <td className="px-4 py-3 capitalize">{r.occasion.replace("-", " ")}<br /><span className="text-muted">{r.seating}</span></td>
                <td className="max-w-[220px] px-4 py-3 text-muted">{r.notes || "—"}</td>
                <td className="px-4 py-3">
                  <select
                    aria-label={`Status for ${r.name}`}
                    value={r.status}
                    disabled={pending}
                    onChange={(e) => write({ table: "reservations", action: "update", id: r.id, values: { status: e.target.value } }, "Status updated")}
                    className="field !py-1.5 !text-sm capitalize"
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button type="button" className="text-muted hover:text-terracotta-deep" onClick={() => {
                    if (confirm(`Delete booking for ${r.name}?`)) write({ table: "reservations", action: "delete", id: r.id }, "Booking deleted");
                  }}>Delete</button>
                </td>
              </tr>
            ))}
            {visible.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-muted">No bookings match.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-espresso/10 bg-white p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-medium tabular-nums">{value}</p>
    </div>
  );
}
