"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/components/CartProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CATEGORIES, CATEGORY_GROUPS, products } from "@/lib/products";
import { OCCASIONS, PLACES, MEMORIES } from "@/lib/taxonomy";
import { cn, slugify } from "@/lib/utils";

// Only link to collections that actually have products behind them.
const GIFT_COLUMNS = [
  { title: "By occasion", type: "occasion", items: OCCASIONS.filter((o) => products.some((p) => p.taxonomyOccasions.includes(o))) },
  { title: "By place", type: "place", items: PLACES.filter((o) => products.some((p) => p.places.includes(o))) },
  { title: "By memory", type: "memory", items: MEMORIES.filter((o) => products.some((p) => p.memoryTypes.includes(o))) },
].map((col) => ({ ...col, items: col.items.slice(0, 10) }));

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { count } = useCart();

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-mist bg-ivory/95 backdrop-blur">
      <div className="bg-pine text-ivory">
        <p className="container-page py-1.5 text-center text-[11px] tracking-wide sm:text-xs">
          Personalise every page <span className="mx-2 text-marigold">✦</span> Designed in Chennai
          <span className="mx-2 text-marigold">✦</span> Ships across India
        </p>
      </div>

      <div className="container-page flex h-16 items-center gap-3 sm:gap-5">
        <button className="text-pine lg:hidden" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>

        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src="/logo-badge.svg" alt="" width={36} height={36} className="hidden h-9 w-9 sm:block" />
          <span className="font-display text-xl tracking-tight text-pine">
            Roll<span className="text-olive">bac</span>
          </span>
        </Link>

        <form action="/search" className="mx-auto hidden w-full max-w-md md:block" role="search">
          <label className="relative block">
            <span className="sr-only">Search designs</span>
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pine/40" />
            <input
              type="search"
              name="q"
              placeholder="Search photobooks, frames, “Goa”…"
              className="w-full rounded-full border border-mist bg-cloud py-2 pl-9 pr-4 text-sm text-pine placeholder:text-pine/35 focus:border-olive"
            />
          </label>
        </form>

        <div className="ml-auto flex items-center gap-4 md:ml-0">
          <Link href="/search" className="text-pine hover:text-olive md:hidden" aria-label="Search">
            <SearchIcon className="h-5 w-5" />
          </Link>
          <ThemeToggle className="hidden sm:flex" />
          <AccountMenu />
          <Link href="/cart" className="relative text-pine transition-colors hover:text-olive" aria-label={`Bag, ${count} items`}>
            <BagIcon className="h-6 w-6" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-olive px-1 text-[10px] font-medium text-ivory">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <nav className="hidden border-t border-mist/70 lg:block" aria-label="Categories">
        <div className="container-page flex items-center gap-4 whitespace-nowrap text-[13px] text-pine/80 xl:gap-6 xl:text-sm">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}`}
              className={cn(
                "border-b-2 py-2.5 transition-colors hover:text-olive",
                pathname === `/shop/${c.slug}` ? "border-olive text-pine" : "border-transparent"
              )}
            >
              {c.name}
            </Link>
          ))}
          <div className="group relative">
            <button className="flex items-center gap-1 border-b-2 border-transparent py-2.5 hover:text-olive" aria-haspopup="true">
              Gift ideas <Chevron className="h-3.5 w-3.5 transition-transform group-focus-within:rotate-180 group-hover:rotate-180" />
            </button>
            <div className="invisible absolute right-0 top-full z-50 w-[680px] translate-y-1 rounded-xl border border-mist bg-cloud p-6 opacity-0 shadow-xl transition-all group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="grid grid-cols-3 gap-6">
                {GIFT_COLUMNS.map((col) => (
                  <div key={col.type}>
                    <p className="font-display text-sm text-pine">{col.title}</p>
                    <ul className="mt-2 space-y-1.5">
                      {col.items.map((item) => (
                        <li key={item}>
                          <Link href={`/collections/${col.type}/${slugify(item)}`} className="text-sm text-pine/65 hover:text-olive">
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Link href="/about" className="ml-auto py-2.5 transition-colors hover:text-olive">
            Our story
          </Link>
          <Link href="/contact" className="py-2.5 transition-colors hover:text-olive">
            Contact
          </Link>
        </div>
      </nav>

      {menuOpen && (
        <div className="max-h-[calc(100vh-7rem)] overflow-y-auto border-t border-mist bg-ivory lg:hidden">
          <div className="container-page py-4">
            <form action="/search" role="search" className="md:hidden">
              <input
                type="search"
                name="q"
                placeholder="Search designs"
                className="w-full rounded-full border border-mist bg-cloud px-4 py-2 text-sm text-pine placeholder:text-pine/35 focus:border-olive"
              />
            </form>
            {CATEGORY_GROUPS.map((group) => (
              <div key={group} className="mt-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-olive">{group}</p>
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {CATEGORIES.filter((c) => c.group === group).map((c) => (
                    <Link key={c.slug} href={`/shop/${c.slug}`} className="rounded px-2 py-2 text-sm text-pine/85 hover:bg-cloud">
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            {GIFT_COLUMNS.map((col) => (
              <details key={col.type} className="mt-3 border-t border-mist pt-3">
                <summary className="cursor-pointer text-sm text-pine">Gift ideas {col.title.toLowerCase()}</summary>
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {col.items.map((item) => (
                    <Link
                      key={item}
                      href={`/collections/${col.type}/${slugify(item)}`}
                      className="rounded px-2 py-1.5 text-sm text-pine/70 hover:bg-cloud"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </details>
            ))}
            <div className="mt-4 flex items-center justify-between border-t border-mist px-2 pt-3 text-sm text-pine/85 sm:hidden">
              Dark theme <ThemeToggle />
            </div>
            <div className="mt-4 border-t border-mist pt-3">
              <Link href="/about" className="block rounded px-2 py-2 text-sm text-pine/85 hover:bg-cloud">
                Our story
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function AccountMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (status !== "authenticated") {
    return (
      <Link
        href="/auth/signin"
        className={cn("flex items-center gap-1.5 text-sm text-pine/80 transition-colors hover:text-olive", status === "loading" && "opacity-0")}
      >
        <UserIcon className="h-5 w-5" />
        <span className="hidden whitespace-nowrap sm:inline">Sign in</span>
      </Link>
    );
  }

  const user = session.user;
  const label = user?.name ?? user?.email ?? "My account";
  const initial = label.trim().charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 text-sm text-pine/80 hover:text-olive"
      >
        {user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt="" className="h-7 w-7 rounded-full border border-mist object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-olive text-xs font-medium text-ivory">{initial}</span>
        )}
        <span className="hidden max-w-[8rem] truncate sm:inline">{label.split(" ")[0]}</span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-mist bg-cloud p-1.5 shadow-xl">
          <div className="border-b border-mist px-3 pb-2 pt-1.5">
            <p className="truncate text-sm text-pine">{user?.name ?? "Signed in"}</p>
            {user?.email && <p className="truncate text-xs text-pine/50">{user.email}</p>}
          </div>
          {(user as { isAdmin?: boolean } | undefined)?.isAdmin && <MenuLink href="/admin">Admin dashboard</MenuLink>}
          <MenuLink href="/account">My account</MenuLink>
          <MenuLink href="/account/orders">My orders</MenuLink>
          <MenuLink href="/cart">My bag</MenuLink>
          <button
            role="menuitem"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-1 block w-full rounded-md border-t border-mist px-3 py-2 text-left text-sm text-rust hover:bg-ivory"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link role="menuitem" href={href} className="block rounded-md px-3 py-2 text-sm text-pine/80 hover:bg-ivory hover:text-pine">
      {children}
    </Link>
  );
}

type IconProps = { className?: string };

function BagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 8h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.5h-7a1.5 1.5 0 0 1-1.5-1.5L6 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 20c1-3.5 4-5 7-5s6 1.5 7 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Chevron({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
