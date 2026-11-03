"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { subscribe } from "@/lib/subscribe";
import { Icon } from "../ui/Icon";

const KEY = "glea_popup_v1";
const OFFER_CODE = process.env.NEXT_PUBLIC_POPUP_OFFER_CODE;
const OFFER_TEXT = process.env.NEXT_PUBLIC_POPUP_OFFER_TEXT;

/**
 * Email popup with explicit marketing consent. Shows once (then waits 14 days), never on cart pages,
 * and only after the cookie choice is made so two dialogs never stack. A first-order offer shows only
 * when NEXT_PUBLIC_POPUP_OFFER_CODE and NEXT_PUBLIC_POPUP_OFFER_TEXT are set to a real Shopify discount.
 */
export function Popup({ image }: { image: { src: string; alt: string; w: number; h: number } | null }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const path = usePathname();
  const boxRef = useRef<HTMLDivElement>(null);
  const offer = OFFER_CODE && OFFER_TEXT ? OFFER_TEXT : null;

  useEffect(() => {
    if (path.startsWith("/cart") || new URLSearchParams(location.search).has("no_popup")) return;
    try {
      const last = Number(localStorage.getItem(KEY) || 0);
      if (Date.now() - last < 14 * 864e5) return;
    } catch { return; }
    let shown = false;
    const show = () => {
      if (shown || !localStorage.getItem("glea_consent_v1") || document.documentElement.classList.contains("lock")) return;
      shown = true;
      setOpen(true);
      localStorage.setItem(KEY, String(Date.now()));
      cleanup();
    };
    const t = setTimeout(show, 20000);
    const onScroll = () => window.scrollY > document.documentElement.scrollHeight * 0.5 && show();
    window.addEventListener("scroll", onScroll, { passive: true });
    const cleanup = () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
    return cleanup;
  }, [path]);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    boxRef.current?.querySelector<HTMLElement>("input")?.focus();
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", k);
    return () => { document.removeEventListener("keydown", k); prev?.focus?.(); };
  }, [open]);

  if (!open) return null;
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="popup-title">
      <div className="scrim is-open" onClick={() => setOpen(false)} aria-hidden="true" />
      <div className="modal__box" ref={boxRef}>
        <button className="icon-btn modal__close" aria-label="Close" onClick={() => setOpen(false)}><Icon name="close" /></button>
        <div className="modal__media">{image ? <Image src={image.src} alt={image.alt} width={image.w} height={image.h} sizes="340px" /> : null}</div>
        <div className="modal__body">
          <span className="kicker">The night readers</span>
          <h2 id="popup-title" className="h2">{offer ?? "Get new colors and reading notes first."}</h2>
          <p className="muted">Occasional emails from Glea. No spam, and you can unsubscribe anytime.</p>
          {state === "done" ? (
            <p role="status" className="notice">{msg}{offer && OFFER_CODE ? <> Your code: <strong>{OFFER_CODE}</strong></> : null}</p>
          ) : (
            <form
              className="grid"
              style={{ gap: 12 }}
              onSubmit={async (e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                setState("busy");
                const r = await subscribe(String(f.get("email") || ""), "popup");
                setState(r.ok ? "done" : "error");
                setMsg(r.message);
              }}
            >
              <label className="field">
                <span className="sr-only">Email address</span>
                <input className="input" name="email" type="email" required autoComplete="email" placeholder="Your email" />
              </label>
              <label className="check">
                <input type="checkbox" name="consent" required />
                <span>Yes, send me Glea emails. See our <a href="/policies/privacy-policy">privacy policy</a>.</span>
              </label>
              <button className="btn btn--primary btn--block" disabled={state === "busy"}>Sign up</button>
              {state === "error" ? <p className="small" role="alert">{msg}</p> : null}
              <button type="button" className="link small" onClick={() => setOpen(false)}>No thanks</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
