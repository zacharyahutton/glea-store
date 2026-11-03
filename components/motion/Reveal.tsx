"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Fade-and-rise for [data-rv] elements as they scroll into view. Off for prefers-reduced-motion. Content stays visible without JS. */
export function Reveal() {
  const path = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-rv]:not(.in)"));
    els.forEach((el) => { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in"); });
    document.documentElement.classList.add("rv");
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => !el.classList.contains("in") && io.observe(el));
    return () => io.disconnect();
  }, [path]);
  return null;
}
