"use client";
import { useState } from "react";
import { site } from "@/lib/site";
import { track } from "@/lib/analytics";

/**
 * Contact form without a paid email service: it composes an email to hello@getglea.com in the visitor's own
 * email app, and says so. Nothing is stored on this site.
 */
export function MailForm({ topic, order = "optional", msgLabel = "Message" }: { topic: string; order?: "optional" | "required" | "none"; msgLabel?: string }) {
  const [sent, setSent] = useState(false);
  return (
    <form
      className="grid"
      style={{ gap: 14 }}
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const name = String(f.get("name") || "");
        const ord = String(f.get("order") || "");
        const body = [`Name: ${name}`, `Email: ${f.get("email")}`, ord ? `Order number: ${ord}` : "", "", String(f.get("message") || "")].filter((l, i) => l || i > 2).join("\n");
        const subject = `${topic}${ord ? ` ${ord}` : ""}${name ? ` from ${name}` : ""}`;
        track("generate_lead", { form: topic });
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setSent(true);
      }}
    >
      <div className="grid grid-2" style={{ gap: 14 }}>
        <label className="field"><span>Name</span><input className="input" name="name" autoComplete="name" required /></label>
        <label className="field"><span>Email</span><input className="input" name="email" type="email" autoComplete="email" required /></label>
      </div>
      {order !== "none" ? (
        <label className="field"><span>Order number{order === "optional" ? " (optional)" : ""}</span><input className="input" name="order" placeholder="#1001" required={order === "required"} /></label>
      ) : null}
      <label className="field"><span>{msgLabel}</span><textarea className="input" name="message" rows={5} required /></label>
      <button className="btn btn--primary" style={{ justifySelf: "start" }}>Open in my email app</button>
      <p className="small muted">This opens a new email to {site.email} in your email app with your details filled in. Nothing is stored on this site. You can also write to us directly at <a className="link" href={`mailto:${site.email}`}>{site.email}</a>.</p>
      {sent ? <p className="notice" role="status">If your email app did not open, write to {site.email}.</p> : null}
    </form>
  );
}
