import type { MetadataRoute } from "next";
import { CATEGORIES, products } from "@/lib/products";
import { OCCASIONS, PLACES, MEMORIES } from "@/lib/taxonomy";
import { slugify } from "@/lib/utils";

const SITE = "https://www.rollbac.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const collections = [
    ...OCCASIONS.map((v) => `occasion/${slugify(v)}`),
    ...PLACES.map((v) => `place/${slugify(v)}`),
    ...MEMORIES.map((v) => `memory/${slugify(v)}`),
  ];
  return [
    { url: SITE, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/shop`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/about` },
    { url: `${SITE}/contact` },
    ...CATEGORIES.map((c) => ({ url: `${SITE}/shop/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${SITE}/product/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...collections.map((c) => ({ url: `${SITE}/collections/${c}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
