"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "../ui/Icon";
import { faqs, known } from "@/lib/content";
import { site } from "@/lib/site";

/**
 * Free, in-site automated assistant. It only answers from the published FAQ (no AI model, no third party,
 * no data leaves the browser). Anything it cannot match is handed to a person by email.
 */
type Msg = { from: "bot" | "me"; text: string; mail?: boolean };
const KNOWN = known(faqs);
const STOP = new Set("a an the is it i my do does can you your to of for and or in on what how with me we are there be will".split(" "));
const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9$ ]/g, " ").split(/\s+/).filter((w) => w && !STOP.has(w));
const SYN: Record<string, string[]> = {
  shipping: ["ship", "deliver", "delivery", "shipping", "arrive", "postage"],
  return: ["return", "refund", "exchange", "send back"],
  order: ["order", "track", "tracking", "where", "status", "package"],
  color: ["color", "colour", "colors", "pink", "black", "amber", "purple", "blue", "white"],
  battery: ["battery", "charge", "charging", "usb", "cable", "hours", "last"],
  bright: ["bright", "brightness", "lumens", "dim"],
  partner: ["partner", "wife", "husband", "sleep", "sleeping", "wake"],
  book: ["book", "hardcover", "paperback", "kindle", "fit", "clip"],
  bundle: ["two", "2", "bundle", "deal", "discount", "save", "code", "coupon"],
  box: ["box", "included", "comes", "bookmark"],
  contact: ["contact", "email", "human", "person", "help", "talk"],
};
const expand = (ws: string[]) => {
  const out = new Set(ws);
  for (const [k, list] of Object.entries(SYN)) if (ws.some((w) => list.some((l) => w.startsWith(l)))) out.add(k);
  return out;
};
const IDX = KNOWN.map((f) => ({ f, w: expand(words(f.q + " " + f.a)) }));

function answer(q: string): Msg {
  const w = expand(words(q));
  const hasTopic = (t: string) => w.has(t);
  if (hasTopic("battery") || /lumen/.test(q.toLowerCase()) || /how long.*(ship|deliver)|when.*arrive/.test(q.toLowerCase()))
    return { from: "bot", text: `I do not have that detail confirmed yet. Please email ${site.email} and a person will answer.`, mail: true };
  let best = { s: 0, f: null as (typeof KNOWN)[number] | null };
  for (const { f, w: fw } of IDX) {
    let s = 0;
    w.forEach((x) => fw.has(x) && (s += SYN[x] ? 2 : 1));
    if (s > best.s) best = { s, f };
  }
  if (best.f && best.s >= 2) return { from: "bot", text: best.f.a };
  return { from: "bot", text: `I am not sure about that one. A person can help at ${site.email}.`, mail: true };
}

const QUICK = ["Shipping", "Returns", "Colors", "Where is my order?"];

export function Chat() {
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState<Msg[]>([{ from: "bot", text: "Hi. I am Glea's automated assistant. I answer from our FAQ. For anything else, I will point you to a person." }]);
  const [val, setVal] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { logRef.current?.scrollTo({ top: 1e6 }); }, [log]);
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open]);
  const ask = (q: string) => {
    if (!q.trim()) return;
    setLog((l) => [...l, { from: "me", text: q }, answer(q)]);
    setVal("");
  };
  const lastQ = [...log].reverse().find((m) => m.from === "me")?.text ?? "";
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent("Question from getglea.com")}&body=${encodeURIComponent(lastQ ? `My question: ${lastQ}\n\n` : "")}`;

  return (
    <>
      {!open ? (
        <button className="chat-fab" aria-label="Open automated help" onClick={() => setOpen(true)}><Icon name="chat" /></button>
      ) : (
        <section className="chat" role="dialog" aria-label="Automated assistant">
          <div className="chat__head">
            <Icon name="bot" />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600 }}>Glea help</p>
              <p className="small" style={{ opacity: 0.85 }}>Automated assistant · not a person</p>
            </div>
            <button className="icon-btn" aria-label="Close help" onClick={() => setOpen(false)}><Icon name="close" /></button>
          </div>
          <div className="chat__log" ref={logRef} aria-live="polite">
            {log.map((m, i) => (
              <div key={i} className={`msg msg--${m.from}`}>
                {m.text}
                {m.mail ? <> <a href={mailto}>Email a person</a></> : null}
              </div>
            ))}
          </div>
          <div className="chat__quick">
            {QUICK.map((q) => <button key={q} onClick={() => ask(q)}>{q}</button>)}
            <a className="chat__quick-mail small link" href={mailto} style={{ alignSelf: "center", marginLeft: "auto" }}>Email a person</a>
          </div>
          <form className="chat__form" onSubmit={(e) => { e.preventDefault(); ask(val); }}>
            <label htmlFor="chat-q" className="sr-only">Your question</label>
            <input id="chat-q" ref={inputRef} className="input" value={val} onChange={(e) => setVal(e.target.value)} placeholder="Ask about shipping, returns, colors" autoComplete="off" />
            <button className="btn btn--primary" aria-label="Send"><Icon name="arrow" size={18} /></button>
          </form>
        </section>
      )}
    </>
  );
}
