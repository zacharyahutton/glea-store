"use client";
import { useState } from "react";
import { FaqList } from "../ui/Faq";
import type { QA } from "@/lib/content";

export function FaqTabs({ topics, faqs }: { topics: { id: string; label: string }[]; faqs: QA[] }) {
  const [t, setT] = useState(topics[0].id);
  return (
    <>
      <div className="tabs" role="tablist" aria-label="FAQ topics">
        {topics.map((x) => (
          <button key={x.id} id={`tab-${x.id}`} role="tab" className="tab" aria-selected={t === x.id} aria-controls={`panel-${x.id}`} onClick={() => setT(x.id)}>{x.label}</button>
        ))}
      </div>
      {topics.map((x) => (
        <div key={x.id} id={`panel-${x.id}`} role="tabpanel" aria-labelledby={`tab-${x.id}`} hidden={t !== x.id}>
          <FaqList items={faqs.filter((f) => f.topic === x.id)} />
        </div>
      ))}
    </>
  );
}
