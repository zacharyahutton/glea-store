import { Icon } from "./Icon";
import type { QA } from "@/lib/content";

/** Accordion FAQ with native details/summary: works without JS and is keyboard accessible. */
export function FaqList({ items, linkify = true }: { items: Pick<QA, "q" | "a">[]; linkify?: boolean }) {
  return (
    <div>
      {items.map((f, i) => (
        <details className="acc" key={f.q} open={i === 0 ? undefined : undefined}>
          <summary>
            <span>{f.q}</span>
            <Icon name="plus" size={20} className="plus" />
          </summary>
          <div className="acc__body">
            <p dangerouslySetInnerHTML={{ __html: linkify ? linkText(f.a) : escape(f.a) }} />
          </div>
        </details>
      ))}
    </div>
  );
}

const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
export function linkText(s: string) {
  return escape(s)
    .replace(/hello@getglea\.com/g, '<a href="mailto:hello@getglea.com">hello@getglea.com</a>')
    .replace(/order status page/g, "order status page");
}
