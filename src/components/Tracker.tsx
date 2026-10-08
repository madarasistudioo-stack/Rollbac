"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function track(type: "pageview" | "add_to_cart", path: string, detail?: string) {
  if (path.startsWith("/admin")) return;
  const body = JSON.stringify({ type, path, detail });
  if (navigator.sendBeacon) navigator.sendBeacon("/api/track", body);
  else fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => undefined);
}

// Records one page view per navigation (search queries included in the path).
export function Tracker() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  useEffect(() => {
    track("pageview", search ? `${pathname}?${search}` : pathname);
  }, [pathname, search]);
  return null;
}
