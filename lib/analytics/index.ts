"use client";
/**
 * One place for analytics events. Every event goes to:
 *  - Vercel Analytics (cookieless, always on)
 *  - GA4 via gtag (Consent Mode v2: analytics only after consent)
 *  - Meta Pixel and TikTok Pixel (loaded only after marketing consent)
 * Events are also pushed to window.gleaEvents so QA can read them. Add ?debug_analytics=1 to log them.
 */
import { track as vercelTrack } from "@vercel/analytics";

export type EventName = "view_item" | "add_to_cart" | "begin_checkout" | "view_cart" | "sign_up" | "generate_lead" | "search";
export type Item = { item_id: string; item_name: string; item_variant?: string; price: number; quantity: number };
export type EventParams = { currency?: string; value?: number; items?: Item[]; [k: string]: unknown };

type W = Window & {
  gtag?: (...a: unknown[]) => void;
  fbq?: (...a: unknown[]) => void;
  ttq?: { track: (e: string, p?: unknown) => void };
  gleaEvents?: { name: string; params: EventParams; at: number }[];
};

const metaMap: Partial<Record<EventName, string>> = {
  view_item: "ViewContent", add_to_cart: "AddToCart", begin_checkout: "InitiateCheckout", sign_up: "Lead", generate_lead: "Contact", search: "Search",
};
const tiktokMap: Partial<Record<EventName, string>> = {
  view_item: "ViewContent", add_to_cart: "AddToCart", begin_checkout: "InitiateCheckout", sign_up: "CompleteRegistration", generate_lead: "Contact", search: "Search",
};

export function track(name: EventName, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  const w = window as W;
  const utm = getUtm();
  const p = { currency: "USD", ...params };
  (w.gleaEvents ||= []).push({ name, params: p, at: Date.now() });
  if (new URLSearchParams(location.search).has("debug_analytics")) console.info("[glea analytics]", name, p);

  try {
    vercelTrack(name, { value: p.value ?? 0, items: p.items?.length ?? 0, ...(utm.utm_source ? { utm_source: utm.utm_source } : {}) });
  } catch {}
  w.gtag?.("event", name, p);
  const consent = readConsent();
  if (consent?.marketing) {
    const contents = p.items?.map((i) => ({ id: i.item_id, quantity: i.quantity, item_price: i.price }));
    if (metaMap[name]) w.fbq?.("track", metaMap[name], { value: p.value, currency: p.currency, contents, content_type: "product" });
    if (tiktokMap[name])
      w.ttq?.track(tiktokMap[name]!, { value: p.value, currency: p.currency, contents: p.items?.map((i) => ({ content_id: i.item_id, quantity: i.quantity, price: i.price })) });
  }
}

/* Consent */
export type Consent = { analytics: boolean; marketing: boolean; at: number };
const CONSENT_KEY = "glea_consent_v1";
export function readConsent(): Consent | null {
  try {
    return JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
  } catch {
    return null;
  }
}
export function saveConsent(c: Omit<Consent, "at">) {
  const v = { ...c, at: Date.now() };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(v));
  window.dispatchEvent(new CustomEvent("glea:consent", { detail: v }));
  return v;
}

/* UTM capture: first touch and last touch, kept 30 days. Sent to Shopify as cart attributes. */
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "ttclid"] as const;
const UTM_STORE = "glea_utm_v1";
export function captureUtm() {
  if (typeof window === "undefined") return;
  const sp = new URLSearchParams(location.search);
  const found: Record<string, string> = {};
  UTM_KEYS.forEach((k) => {
    const v = sp.get(k);
    if (v) found[k] = v.slice(0, 200);
  });
  if (!Object.keys(found).length) return;
  const prev = getUtmRecord();
  const rec = { first: prev?.first ?? { ...found, landing: location.pathname }, last: { ...found, landing: location.pathname }, at: Date.now() };
  localStorage.setItem(UTM_STORE, JSON.stringify(rec));
}
function getUtmRecord(): { first: Record<string, string>; last: Record<string, string>; at: number } | null {
  try {
    const r = JSON.parse(localStorage.getItem(UTM_STORE) || "null");
    if (r && Date.now() - r.at > 30 * 864e5) return null;
    return r;
  } catch {
    return null;
  }
}
export function getUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  return getUtmRecord()?.last ?? {};
}
export function utmAttributes(): { key: string; value: string }[] {
  const r = getUtmRecord();
  if (!r) return [];
  const out: { key: string; value: string }[] = [];
  Object.entries(r.last).forEach(([k, v]) => out.push({ key: `_${k}`, value: v }));
  Object.entries(r.first).forEach(([k, v]) => out.push({ key: `_first_${k}`, value: v }));
  return out;
}
