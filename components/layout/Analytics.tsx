"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { captureUtm, readConsent, saveConsent, type Consent } from "@/lib/analytics";

const GA = process.env.NEXT_PUBLIC_GA4_ID;
const META = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TIKTOK = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

/**
 * Analytics + consent. Vercel Analytics is cookieless and always on.
 * GA4 loads with Consent Mode v2 defaults set to denied, then updates on choice.
 * Meta Pixel and TikTok Pixel only load after the visitor allows marketing cookies.
 */
export function Analytics() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [show, setShow] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    captureUtm();
    const c = readConsent();
    setConsent(c);
    setShow(!c);
    setReady(true);
    const open = () => setShow(true);
    const upd = (e: Event) => setConsent((e as CustomEvent<Consent>).detail);
    window.addEventListener("glea:open-consent", open);
    window.addEventListener("glea:consent", upd);
    return () => { window.removeEventListener("glea:open-consent", open); window.removeEventListener("glea:consent", upd); };
  }, []);

  useEffect(() => {
    const w = window as unknown as { gtag?: (...a: unknown[]) => void };
    if (!consent || !w.gtag) return;
    w.gtag("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied",
      ad_storage: consent.marketing ? "granted" : "denied",
      ad_user_data: consent.marketing ? "granted" : "denied",
      ad_personalization: consent.marketing ? "granted" : "denied",
    });
  }, [consent]);

  const choose = (analytics: boolean, marketing: boolean) => {
    setConsent(saveConsent({ analytics, marketing }));
    setShow(false);
  };

  return (
    <>
      <VercelAnalytics />
      {GA ? (
        <>
          <Script id="ga-consent" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});gtag('js',new Date());gtag('config','${GA}',{debug_mode:location.search.indexOf('debug_analytics')>-1});`}</Script>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
        </>
      ) : null}
      {ready && consent?.marketing && META ? (
        <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META}');fbq('track','PageView');`}</Script>
      ) : null}
      {ready && consent?.marketing && TIKTOK ? (
        <Script id="tiktok-pixel" strategy="afterInteractive">{`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var s=d.createElement("script");s.type="text/javascript";s.async=!0;s.src=r+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(s,a)};ttq.load('${TIKTOK}');ttq.page()}(window,document,'ttq');`}</Script>
      ) : null}
      {show ? (
        <section className="consent" role="region" aria-label="Cookie choices">
          <p><strong>Cookies on Glea</strong></p>
          <p className="muted">We use cookies to understand how the site is used and, if you allow it, to measure our ads. Necessary cookies keep your cart working. See our <a href="/policies/privacy-policy">privacy policy</a>.</p>
          <div className="consent__row">
            <button className="btn btn--primary" onClick={() => choose(true, true)}>Accept all</button>
            <button className="btn btn--ghost" onClick={() => choose(true, false)}>Analytics only</button>
            <button className="btn btn--ghost" onClick={() => choose(false, false)}>Necessary only</button>
          </div>
        </section>
      ) : null}
    </>
  );
}
