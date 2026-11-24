"use client";

import { useState } from "react";
import { useAdminWrite, Notice } from "./useAdminWrite";

type Field = {
  key: string;
  label: string;
  required?: boolean;
  multiline?: boolean;
  type?: "text" | "number" | "boolean";
};

type Props = {
  title: string;
  table: string;
  rows: any[];
  fields: Field[];
};

export function SimpleListManager({ title, table, rows, fields }: Props) {
  const { write, pending, message } = useAdminWrite();
  const [draft, setDraft] = useState<Record<string, any> | null>(null);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!draft) return;
    const values: Record<string, unknown> = {};
    for (const f of fields) {
      const v = draft[f.key];
      if (f.type === "number") values[f.key] = v === "" || v == null ? null : Number(v);
      else if (f.type === "boolean") values[f.key] = !!v;
      else values[f.key] = v ?? "";
    }
    const ok = draft.id
      ? await write({ table, action: "update", id: draft.id, values }, `${title} updated`)
      : await write({ table, action: "insert", values }, `${title} added`);
    if (ok) setDraft(null);
  }

  async function toggle(row: any, key: string) {
    await write({ table, action: "update", id: row.id, values: { [key]: !row[key] } }, "Updated");
  }

  async function remove(row: any) {
    if (!confirm(`Delete this ${title.toLowerCase().replace(/s$/, "")}?`)) return;
    await write({ table, action: "delete", id: row.id }, "Deleted");
  }

  const toggleKey = fields.find((f) => f.type === "boolean")?.key;
  const displayField = fields[0].key;

  return (
    <section aria-labelledby={`sec-${table}`}>
      <Notice message={message} />
      <div className="flex items-center justify-between gap-4">
        <h2 id={`sec-${table}`} className="font-display text-2xl font-medium">{title}</h2>
        <button type="button" className="btn-primary !px-4 !py-2" onClick={() => setDraft({})}>Add</button>
      </div>

      <ul className="mt-5 space-y-3">
        {rows.map((r) => (
          <li key={r.id} className="flex items-start justify-between gap-4 rounded-2xl border border-espresso/10 bg-white p-4">
            <div className="min-w-0">
              <p className="font-medium">{r[displayField]}</p>
              {fields[1] && !fields[1].type && r[fields[1].key] && (
                <p className="mt-1 line-clamp-2 text-sm text-muted">{r[fields[1].key]}</p>
              )}
              {toggleKey && <p className="mt-1 text-xs text-muted">{r[toggleKey] ? "Live on site" : "Hidden"}</p>}
            </div>
            <div className="flex shrink-0 gap-3 text-sm">
              {toggleKey && (
                <button type="button" disabled={pending} onClick={() => toggle(r, toggleKey)} className="font-semibold text-olive hover:underline">
                  {r[toggleKey] ? "Hide" : "Show"}
                </button>
              )}
              <button type="button" onClick={() => setDraft({ ...r })} className="font-semibold text-terracotta hover:underline">Edit</button>
              <button type="button" onClick={() => remove(r)} className="text-muted hover:text-terracotta-deep">Delete</button>
            </div>
          </li>
        ))}
        {rows.length === 0 && <li className="text-sm text-muted">Nothing here yet.</li>}
      </ul>

      {draft && (
        <div role="dialog" aria-modal="true" aria-label={`${draft.id ? "Edit" : "Add"} ${title}`} className="fixed inset-0 z-50 grid place-items-center bg-espresso/40 p-4">
          <form onSubmit={save} className="w-full max-w-md rounded-3xl bg-cream p-6 shadow-card sm:p-8">
            <h3 className="font-display text-2xl font-medium">{draft.id ? "Edit" : "Add"} {title.toLowerCase().replace(/s$/, "")}</h3>
            <div className="mt-6 space-y-4">
              {fields.map((f) => (
                <div key={f.key}>
                  {f.type === "boolean" ? (
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!draft[f.key]} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.checked })} /> {f.label}</label>
                  ) : (
                    <>
                      <label className="label" htmlFor={`${table}-${f.key}`}>{f.label}</label>
                      {f.multiline ? (
                        <textarea id={`${table}-${f.key}`} rows={3} required={f.required} className="field" value={draft[f.key] ?? ""} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} />
                      ) : (
                        <input id={`${table}-${f.key}`} type={f.type === "number" ? "number" : "text"} step={f.type === "number" ? "any" : undefined} required={f.required} className="field" value={draft[f.key] ?? ""} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button type="button" className="btn-ghost" onClick={() => setDraft(null)}>Cancel</button>
              <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">Save</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
