import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { storefront } from "@/lib/shopify/client";
import { isLive } from "@/lib/shopify/config";
import { CUSTOMER_CREATE } from "@/lib/shopify/queries";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Saves an email to Shopify customers with email marketing consent (Storefront customerCreate, acceptsMarketing: true).
 * The random password is never shown or stored here; the person can reset it from Shopify if accounts are ever turned on.
 */
export async function POST(req: Request) {
  let email = "";
  try {
    email = String(((await req.json()) as { email?: string }).email || "").trim().toLowerCase();
  } catch {}
  if (!EMAIL.test(email) || email.length > 254) return NextResponse.json({ ok: false, message: "Please enter a valid email address." }, { status: 400 });

  if (!isLive) {
    return NextResponse.json({ ok: false, message: "Sign-up is not connected in this preview yet. Please check back soon." }, { status: 503 });
  }
  try {
    type R = { customerCreate: { customer: { id: string } | null; customerUserErrors: { code: string; message: string }[] } };
    const d = await storefront<R>(CUSTOMER_CREATE, { input: { email, password: randomBytes(24).toString("base64url"), acceptsMarketing: true } }, { cache: "no-store" });
    const err = d.customerCreate.customerUserErrors[0];
    if (!err) return NextResponse.json({ ok: true, message: "Thanks. You are on the list." });
    if (err.code === "TAKEN" || err.code === "CUSTOMER_DISABLED")
      return NextResponse.json({ ok: true, message: "This email is already with us. To change your email preferences, write to hello@getglea.com." });
    return NextResponse.json({ ok: false, message: "We could not sign you up right now. Please try again later." }, { status: 422 });
  } catch {
    return NextResponse.json({ ok: false, message: "We could not sign you up right now. Please try again later." }, { status: 502 });
  }
}
