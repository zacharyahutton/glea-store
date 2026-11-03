"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Chat and the email popup load as separate chunks, only after the page has loaded and the browser is idle,
// or on the first tap, key, scroll or pointer move, whichever comes first (T-051 LCP pass). Behavior is unchanged.
const Chat = dynamic(() => import("./Chat").then((m) => m.Chat), { ssr: false });
const Popup = dynamic(() => import("./Popup").then((m) => m.Popup), { ssr: false });

type PopupImage = { src: string; alt: string; w: number; h: number } | null;

export function DeferredExtras({ popupImage }: { popupImage: PopupImage }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let idle = 0;
    const go = () => { cleanup(); setOn(true); };
    const evs = ["pointerdown", "keydown", "touchstart", "scroll", "pointermove"] as const;
    const later = () => {
      const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
      idle = w.requestIdleCallback ? w.requestIdleCallback(go, { timeout: 4000 }) : window.setTimeout(go, 2000);
    };
    function cleanup() {
      evs.forEach((e) => window.removeEventListener(e, go));
      window.removeEventListener("load", later);
    }
    evs.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    if (document.readyState === "complete") later();
    else window.addEventListener("load", later, { once: true });
    return () => {
      cleanup();
      const w = window as Window & { cancelIdleCallback?: (id: number) => void };
      if (w.cancelIdleCallback) w.cancelIdleCallback(idle);
      window.clearTimeout(idle);
    };
  }, []);
  if (!on) return null;
  return (
    <>
      <Popup image={popupImage} />
      <Chat />
    </>
  );
}
