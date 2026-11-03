"use client";
import { useState } from "react";
import { subscribe } from "@/lib/subscribe";

export function FooterSignup() {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  return (
    <form
      className="footer__sign"
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setState("busy");
        const r = await subscribe(String(f.get("email") || ""), "footer");
        setState(r.ok ? "done" : "error");
        setMsg(r.message);
      }}
    >
      <label htmlFor="footer-email" className="sr-only">Email address</label>
      <input id="footer-email" name="email" type="email" required autoComplete="email" placeholder="Your email" className="input" />
      <button className="btn btn--primary" disabled={state === "busy"}>Sign up</button>
      <p className="small muted" style={{ flexBasis: "100%" }}>
        By signing up you agree to get Glea emails. Unsubscribe anytime. See our <a href="/policies/privacy-policy">privacy policy</a>.
      </p>
      {msg ? <p className="small" role="status" style={{ flexBasis: "100%" }}>{msg}</p> : null}
    </form>
  );
}
