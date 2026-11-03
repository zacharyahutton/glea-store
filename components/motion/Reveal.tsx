"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Loftie-matched scroll reveal: fade + rise 20px, 0.5s ease-out (power2.out), once, when the element
 * crosses 88% of the viewport. Children of [data-rv-group] get an 80ms stagger.
 * Off for prefers-reduced-motion; content stays visible without JS.
 */
export function Reveal() {
  const path = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    document.querySelectorAll<HTMLElement>("[data-rv-group]").forEach((g) => {
      Array.from(g.children).forEach((c, i) => {
        const el = c as HTMLElement;
        if (!el.hasAttribute("data-rv")) el.setAttribute("data-rv", "");
        el.style.setProperty("--rv-d", `${Math.min(i, 8) * 80}ms`);
      });
    });
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-rv]:not(.in)"));
    els.forEach((el) => { if (el.getBoundingClientRect().top < window.innerHeight * 0.88) el.classList.add("in"); });
    document.documentElement.classList.add("rv");
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px" });
    els.forEach((el) => !el.classList.contains("in") && io.observe(el));
    return () => io.disconnect();
  }, [path]);
  return null;
}
