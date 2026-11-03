"use client";
import { useEffect } from "react";
import { track } from "@/lib/analytics";
export function SearchTracker({ q }: { q: string }) {
  useEffect(() => { track("search", { search_term: q }); }, [q]);
  return null;
}
