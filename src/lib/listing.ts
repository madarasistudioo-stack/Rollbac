import type { Product } from "@/lib/products";
import { CATEGORIES } from "@/lib/products";
import {
  THEMES,
  OCCASIONS,
  PLACES,
  MEMORIES,
  PRICE_RANGES,
  PERSONALISATION_OPTIONS,
  STYLES,
} from "@/lib/taxonomy";
import { slugify } from "@/lib/utils";

export type SearchParams = Record<string, string | string[] | undefined>;

export function param(params: SearchParams, key: string): string | undefined {
  const v = params[key];
  return Array.isArray(v) ? v[0] : v;
}

// Every filter is a single-valued URL param holding a slug, so filtered pages
// are plain links: shareable, back-button friendly, and work without JS.
export type FilterKey = "category" | "theme" | "occasion" | "place" | "memory" | "budget" | "personalise" | "style";

type FilterDef = {
  key: FilterKey;
  title: string;
  options: readonly string[];
  matches: (p: Product, label: string) => boolean;
};

export const FILTERS: FilterDef[] = [
  { key: "category", title: "Product", options: CATEGORIES.map((c) => c.name), matches: (p, l) => p.category === l },
  { key: "theme", title: "Theme", options: THEMES, matches: (p, l) => p.themes.includes(l as never) },
  { key: "occasion", title: "Occasion", options: OCCASIONS, matches: (p, l) => p.taxonomyOccasions.includes(l as never) },
  { key: "place", title: "Place", options: PLACES, matches: (p, l) => p.places.includes(l as never) },
  { key: "memory", title: "Memory", options: MEMORIES, matches: (p, l) => p.memoryTypes.includes(l as never) },
  {
    key: "budget",
    title: "Budget",
    options: PRICE_RANGES.map((r) => r.label),
    matches: (p, l) => {
      const r = PRICE_RANGES.find((x) => x.label === l);
      return Boolean(r && p.price >= r.min && p.price <= r.max);
    },
  },
  {
    key: "personalise",
    title: "Personalise with",
    options: PERSONALISATION_OPTIONS,
    matches: (p, l) => p.personalisation.includes(l as never),
  },
  { key: "style", title: "Style", options: STYLES, matches: (p, l) => p.style.includes(l as never) },
];

export const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "new", label: "New arrivals" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
] as const;

export type SortId = (typeof SORTS)[number]["id"];

export function labelFor(key: FilterKey, slug: string | undefined): string | undefined {
  if (!slug) return undefined;
  return FILTERS.find((f) => f.key === key)?.options.find((o) => slugify(o) === slug);
}

export type ActiveFilter = { key: FilterKey; title: string; label: string; slug: string };

export function activeFilters(params: SearchParams, locked: FilterKey[] = []): ActiveFilter[] {
  const active: ActiveFilter[] = [];
  for (const f of FILTERS) {
    if (locked.includes(f.key)) continue;
    const slug = param(params, f.key);
    const label = labelFor(f.key, slug);
    if (slug && label) active.push({ key: f.key, title: f.title, label, slug });
  }
  return active;
}

export function applyFilters(list: Product[], filters: ActiveFilter[]): Product[] {
  return filters.reduce((acc, af) => {
    const def = FILTERS.find((f) => f.key === af.key)!;
    return acc.filter((p) => def.matches(p, af.label));
  }, list);
}

export function sortProducts(list: Product[], sort: string | undefined): Product[] {
  const copy = [...list];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "new":
      return copy.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    default:
      return copy.sort((a, b) => score(b) - score(a));
  }
}

function score(p: Product) {
  return (p.bestseller ? 2 : 0) + (p.isNew ? 1 : 0);
}

// Options worth showing for a filter: only those that match something in the
// current (unfiltered) list, with a count, so no filter ever leads to nothing.
export function optionsWithCounts(list: Product[], key: FilterKey) {
  const def = FILTERS.find((f) => f.key === key)!;
  return def.options
    .map((label) => ({ label, slug: slugify(label), count: list.filter((p) => def.matches(p, label)).length }))
    .filter((o) => o.count > 0);
}

export function hrefWith(basePath: string, params: SearchParams, changes: Record<string, string | undefined>) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    const value = Array.isArray(v) ? v[0] : v;
    if (value) qs.set(k, value);
  }
  for (const [k, v] of Object.entries(changes)) {
    if (v) qs.set(k, v);
    else qs.delete(k);
  }
  const s = qs.toString();
  return s ? `${basePath}?${s}` : basePath;
}

export function searchProducts(list: Product[], query: string): Product[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return list.filter((p) => {
    const haystack = [
      p.name,
      p.kind,
      p.category,
      p.blurb,
      ...p.themes,
      ...p.taxonomyOccasions,
      ...p.places,
      ...p.memoryTypes,
      ...p.taxonomyRecipients,
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}
