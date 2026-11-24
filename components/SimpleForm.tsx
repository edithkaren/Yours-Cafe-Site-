"use client";

import { useState, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { useSubmit } from "@/components/useSubmit";
import { FormField } from "@/components/FormField";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "tel" | "email" | "number" | "date" | "textarea" | "select";
  required?: boolean;
  options?: { v: string; l: string }[];
  min?: number;
  max?: number;
  hint?: string;
  defaultValue?: string | number;
};

export function SimpleForm({
  endpoint,
  fields,
  submitLabel,
  successTitle,
  successBody,
}: {
  endpoint: string;
  fields: FieldDef[];
  submitLabel: string;
  successTitle: string;
  successBody: ReactNode;
}) {
  const { state, submit } = useSubmit();
  const [done, setDone] = useState(false);
  const errors = state.status === "error" ? state.errors ?? {} : {};

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {};
    for (const field of fields) payload[field.name] = f.get(field.name) ?? "";
    payload.website = f.get("website") ?? "";
    if (await submit(endpoint, payload)) {
      setDone(true);
      e.currentTarget.reset();
    }
  }

  if (done) {
    return (
      <div role="status" className="rounded-3xl border border-olive/30 bg-white p-8 text-center shadow-card">
        <CheckCircle2 className="mx-auto h-12 w-12 text-olive" aria-hidden />
        <h2 className="mt-4 font-display text-3xl font-medium">{successTitle}</h2>
        <div className="mx-auto mt-3 max-w-md text-muted">{successBody}</div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 rounded-3xl border border-espresso/10 bg-white p-6 shadow-card sm:p-8 md:grid-cols-2">
      <div className="sr-only" aria-hidden>
        <label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {state.status === "error" && state.message && (
        <p role="alert" className="md:col-span-2 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta-deep">{state.message}</p>
      )}
      {fields.map((f) => {
        const id = `f-${f.name}`;
        const full = f.type === "textarea";
        const cls = full ? "md:col-span-2" : "";
        return (
          <FormField key={f.name} id={id} label={f.label + (f.required ? "" : " (optional)")} error={errors[f.name]} hint={f.hint} className={cls}>
            {f.type === "textarea" ? (
              <textarea id={id} name={f.name} rows={4} maxLength={1000} required={f.required} className="field" aria-invalid={!!errors[f.name]} />
            ) : f.type === "select" ? (
              <select id={id} name={f.name} required={f.required} defaultValue={f.defaultValue} className="field" aria-invalid={!!errors[f.name]}>
                {f.options?.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            ) : (
              <input
                id={id}
                name={f.name}
                type={f.type ?? "text"}
                required={f.required}
                min={f.min}
                max={f.max}
                defaultValue={f.defaultValue}
                className="field"
                aria-invalid={!!errors[f.name]}
              />
            )}
          </FormField>
        );
      })}
      <div className="md:col-span-2 flex justify-end border-t border-espresso/10 pt-5">
        <button type="submit" disabled={state.status === "submitting"} className="btn-primary disabled:opacity-60">
          {state.status === "submitting" ? "Sending…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
