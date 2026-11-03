"use client";
import { useEffect, useState } from "react";
import { readConsent, saveConsent } from "@/lib/analytics";

/** Browser-level opt out of marketing cookies and ad pixels (Meta, TikTok). Honors Global Privacy Control. */
export function OptOut() {
  const [state, setState] = useState<"unknown" | "in" | "out">("unknown");
  const [gpc, setGpc] = useState(false);
  useEffect(() => {
    const g = !!(navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;
    setGpc(g);
    setState(g || readConsent()?.marketing === false ? "out" : readConsent()?.marketing ? "in" : "unknown");
  }, []);
  return (
    <div className="card" style={{ marginTop: 28 }}>
      <h2 className="h3" style={{ marginTop: 0 }}>Opt out on this browser</h2>
      {gpc ? <p>Your browser sends a Global Privacy Control signal, so marketing cookies and ad pixels stay off on this site.</p> : null}
      <p className="muted" style={{ margin: "8px 0 16px" }}>
        {state === "out" ? "This browser is opted out of marketing cookies and ad pixels." : "This turns off marketing cookies and ad pixels on this browser. Analytics that keep the site working stay on unless you change them in Cookie settings."}
      </p>
      <button className="btn btn--primary" disabled={state === "out"} onClick={() => { saveConsent({ analytics: readConsent()?.analytics ?? false, marketing: false }); setState("out"); }}>
        {state === "out" ? "Opted out" : "Opt out"}
      </button>
      <p className="small muted" style={{ marginTop: 14 }}>To opt out data linked to your email or an order, write to <a className="link" href="mailto:hello@getglea.com?subject=Privacy%20opt%20out">hello@getglea.com</a>.</p>
    </div>
  );
}
