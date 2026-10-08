import type { CartItem } from "@/components/CartProvider";
import { getCategory } from "@/lib/products";
import type { LiveProduct } from "@/lib/catalog";

export type PricedLine = CartItem & { unitPrice: number };

// Recomputes every bag line from the catalogue, so a tampered price in the
// browser can never change what the customer is charged.
export function priceLines(items: CartItem[], catalogue: LiveProduct[]): PricedLine[] | string {
  const lines: PricedLine[] = [];
  for (const item of items) {
    const product = catalogue.find((p) => p.slug === item.slug);
    if (!product) return `${item.name} is no longer available.`;
    if (product.stock === 0) return `${item.name} is sold out.`;
    const { options } = getCategory(product.categorySlug)!;
    const size = options.sizes.find((s) => `${s.label} (${s.dimensions})` === item.size) ?? options.sizes.find((s) => s.id === options.defaultSizeId)!;
    const pages = options.pages?.find((p) => p.label === item.pageCount);
    const quantity = Math.min(50, Math.max(1, Math.round(item.quantity)));
    lines.push({ ...item, quantity, unitPrice: product.price + size.priceDelta + (pages?.priceDelta ?? 0) });
  }
  return lines;
}
