"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import {
  FILTERS,
  SORTS,
  activeFilters,
  applyFilters,
  hrefWith,
  optionsWithCounts,
  param,
  sortProducts,
  type FilterKey,
  type SearchParams,
} from "@/lib/listing";
import { cn } from "@/lib/utils";

type ListingProps = {
  products: Product[];
  basePath: string;
  locked?: FilterKey[]; // filters implied by the page itself (e.g. the category on /shop/frames)
  emptyMessage?: string;
  keep?: string[]; // params that "Clear all" must preserve, e.g. the search query
};

const PAGE_SIZE = 24;

/**
 * The shared shop grid: theme chips, a filter panel, sort, a result count and
 * the product cards. Filters live in the URL (shareable links) but are applied
 * in the browser, so shop pages stay pre-built and cached — no server work per
 * visit. The unfiltered grid is what's served first.
 */
export function ProductListing(props: ListingProps) {
  return (
    <Suspense fallback={<ListingView {...props} searchParams={{}} />}>
      <ListingFromUrl {...props} />
    </Suspense>
  );
}

function ListingFromUrl(props: ListingProps) {
  const params = useSearchParams();
  return <ListingView {...props} searchParams={Object.fromEntries(params.entries())} />;
}

function ListingView({
  products,
  basePath,
  searchParams,
  locked = [],
  emptyMessage = "Nothing matches those filters yet.",
  keep = [],
}: ListingProps & { searchParams: SearchParams }) {
  const [limit, setLimit] = useState(PAGE_SIZE);
  const active = activeFilters(searchParams, locked);
  const sort = param(searchParams, "sort") ?? "featured";
  const shown = sortProducts(applyFilters(products, active), sort);

  const themeActive = active.find((a) => a.key === "theme");
  const themeOptions = locked.includes("theme") ? [] : optionsWithCounts(products, "theme");
  const panelFilters = FILTERS.filter((f) => f.key !== "theme" && !locked.includes(f.key))
    .map((f) => ({ ...f, available: optionsWithCounts(products, f.key) }))
    .filter((f) => f.available.length > 1);
  const clearHref = hrefWith(basePath, Object.fromEntries(keep.map((k) => [k, param(searchParams, k)])), {});
  const panelActiveCount = active.filter((a) => a.key !== "theme").length;

  return (
    <div>
      {themeOptions.length > 1 && (
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          <Chip href={hrefWith(basePath, searchParams, { theme: undefined })} active={!themeActive}>
            All designs
          </Chip>
          {themeOptions.map((o) => (
            <Chip
              key={o.slug}
              href={hrefWith(basePath, searchParams, { theme: themeActive?.slug === o.slug ? undefined : o.slug })}
              active={themeActive?.slug === o.slug}
            >
              {o.label}
            </Chip>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-y border-mist py-3 text-sm">
        {panelFilters.length > 0 && (
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md border border-mist bg-cloud px-3 py-1.5 text-pine hover:border-olive [&::-webkit-details-marker]:hidden">
              <FilterIcon />
              All filters
              {panelActiveCount > 0 && (
                <span className="rounded-full bg-olive px-1.5 text-[10px] font-medium text-ivory">{panelActiveCount}</span>
              )}
            </summary>
            <div className="absolute left-0 z-30 mt-2 max-h-[70vh] w-[min(92vw,640px)] overflow-y-auto rounded-xl border border-mist bg-cloud p-5 shadow-xl">
              <div className="grid gap-6 sm:grid-cols-2">
                {panelFilters.map((f) => {
                  const current = param(searchParams, f.key);
                  return (
                    <div key={f.key}>
                      <h3 className="font-display text-sm text-pine">{f.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {f.available.map((o) => (
                          <Link
                            key={o.slug}
                            rel="nofollow" href={hrefWith(basePath, searchParams, { [f.key]: current === o.slug ? undefined : o.slug })}
                            className={cn(
                              "rounded-full border px-2.5 py-1 text-xs transition-colors",
                              current === o.slug
                                ? "border-olive bg-olive text-ivory"
                                : "border-mist text-pine/70 hover:border-olive hover:text-pine"
                            )}
                          >
                            {o.label} <span className="opacity-50">{o.count}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </details>
        )}

        <details className="relative">
          <summary className="flex cursor-pointer list-none items-center gap-1 text-pine/70 hover:text-pine [&::-webkit-details-marker]:hidden">
            Sort by: <span className="text-pine">{SORTS.find((s) => s.id === sort)?.label ?? "Featured"}</span>
            <Chevron />
          </summary>
          <div className="absolute left-0 z-30 mt-2 w-52 rounded-xl border border-mist bg-cloud p-1.5 shadow-xl">
            {SORTS.map((s) => (
              <Link
                key={s.id}
                rel="nofollow" href={hrefWith(basePath, searchParams, { sort: s.id === "featured" ? undefined : s.id })}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm",
                  s.id === sort ? "bg-olive/10 text-pine" : "text-pine/70 hover:bg-ivory hover:text-pine"
                )}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </details>

        <p className="ml-auto text-pine/50">
          Showing {shown.length} of {products.length} {products.length === 1 ? "design" : "designs"}
        </p>
      </div>

      {active.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {active.map((a) => (
            <Link
              key={a.key}
              rel="nofollow" href={hrefWith(basePath, searchParams, { [a.key]: undefined })}
              className="flex items-center gap-1.5 rounded-full bg-olive/10 px-3 py-1 text-pine hover:bg-olive/20"
            >
              <span className="text-pine/50">{a.title}:</span> {a.label} <span aria-hidden>✕</span>
              <span className="sr-only">Remove filter</span>
            </Link>
          ))}
          <Link rel="nofollow" href={clearHref} className="text-pine/50 underline-offset-2 hover:text-olive hover:underline">
            Clear all
          </Link>
        </div>
      )}

      {shown.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {shown.slice(0, limit).map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      ) : null}
      {shown.length > limit && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setLimit((l) => l + PAGE_SIZE)}
            className="rounded-full border border-mist px-6 py-2.5 text-sm text-pine hover:border-olive"
          >
            Show more ({shown.length - limit} left)
          </button>
        </div>
      )}
      {shown.length === 0 && (
        <div className="mt-10 rounded-xl border border-mist bg-cloud p-10 text-center">
          <p className="text-pine/70">{emptyMessage}</p>
          <Link rel="nofollow" href={clearHref} className="mt-3 inline-block text-sm text-olive hover:underline">
            Clear filters
          </Link>
        </div>
      )}
    </div>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      rel="nofollow"
      scroll={false}
      className={cn(
        "shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors",
        active ? "border-olive bg-olive text-ivory" : "border-mist bg-cloud/60 text-pine/75 hover:border-olive hover:text-pine"
      )}
    >
      {children}
    </Link>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M3 5h14M6 10h8M8.5 15h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
