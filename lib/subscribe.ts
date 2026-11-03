"use client";
import { track } from "./analytics";

/** Email signup with marketing consent. Posts to /api/subscribe, which creates a Shopify customer with acceptsMarketing. */
export async function subscribe(email: string, source: "popup" | "footer"): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source }) });
    const j = (await res.json()) as { ok: boolean; message: string };
    if (j.ok) track("sign_up", { method: source });
    return j;
  } catch {
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}
