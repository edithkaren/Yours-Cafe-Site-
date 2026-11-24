"use client";

import { useState } from "react";

export type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message?: string; data?: Record<string, unknown> }
  | { status: "error"; message?: string; errors?: Record<string, string> };

export function useSubmit() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function submit(url: string, payload: unknown) {
    setState({ status: "submitting" });
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setState({ status: "success", data: json });
        return true;
      }
      setState({ status: "error", message: json.message, errors: json.errors });
      return false;
    } catch {
      setState({ status: "error", message: "Network problem. Check your connection and try again." });
      return false;
    }
  }

  const reset = () => setState({ status: "idle" });
  return { state, submit, reset };
}
