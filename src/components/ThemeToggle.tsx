"use client";

import { useEffect, useState } from "react";

type Theme = "ivory" | "dark";

// Switches the whole site between the ivory (default) and dark themes and
// remembers the choice on this device.
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("ivory");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "ivory");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "ivory" : "dark";
    setTheme(next);
    if (next === "dark") document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
    try {
      localStorage.setItem("rollbac-theme", next);
    } catch {
      // Private browsing: the switch still works for this visit.
    }
  }

  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to ivory theme" : "Switch to dark theme"}
      title={dark ? "Ivory theme" : "Dark theme"}
      className={`relative flex h-7 w-12 items-center rounded-full border border-mist bg-cloud transition-colors ${className}`}
    >
      <span
        className={`absolute flex h-5 w-5 items-center justify-center rounded-full bg-olive text-ivory transition-transform duration-300 ${
          dark ? "translate-x-[22px]" : "translate-x-[3px]"
        }`}
      >
        {dark ? (
          <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor" aria-hidden="true">
            <path d="M15.5 12.5A6.5 6.5 0 0 1 7.5 4.5a6.5 6.5 0 1 0 8 8Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="10" cy="10" r="3.2" />
            <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M4.3 15.7l1.4-1.4M14.3 5.7l1.4-1.4" strokeLinecap="round" />
          </svg>
        )}
      </span>
    </button>
  );
}
