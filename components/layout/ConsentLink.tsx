"use client";
export function ConsentLink() {
  return (
    <button type="button" className="link" style={{ fontWeight: 400, textDecoration: "none" }} onClick={() => window.dispatchEvent(new Event("glea:open-consent"))}>
      Cookie settings
    </button>
  );
}
