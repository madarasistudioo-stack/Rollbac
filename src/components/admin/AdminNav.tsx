"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Customers" },
  { href: "/admin/inbox", label: "Inbox" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/segments", label: "Segments" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/status", label: "Site status" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3">
      {LINKS.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "shrink-0 rounded-md px-3 py-2 text-sm",
              active ? "bg-ivory/15 text-ivory" : "text-ivory/65 hover:bg-ivory/10 hover:text-ivory"
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function StatCard({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <div className="rounded-xl border border-mist bg-cloud p-5">
      <p className="text-xs uppercase tracking-wider text-pine/50">{label}</p>
      <p className="mt-2 font-display text-3xl text-pine">{value}</p>
      {note && <p className="mt-1 text-xs text-pine/45">{note}</p>}
    </div>
  );
}
