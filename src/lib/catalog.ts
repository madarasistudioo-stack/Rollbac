import { prisma } from "@/lib/prisma";
import { products as baseProducts, type Product } from "@/lib/products";

export type LiveProduct = Product & { stock: number | null; hidden: boolean };

// The code catalogue with admin overrides (price, stock, hidden) applied.
// If the database is unreachable the shop still works from the code catalogue.
export async function getAllProductsWithSettings(): Promise<LiveProduct[]> {
  let settings: Awaited<ReturnType<typeof prisma.productSetting.findMany>> = [];
  try {
    settings = await prisma.productSetting.findMany();
  } catch (err) {
    console.error("Product settings unavailable, using catalogue defaults:", err);
  }
  const bySlug = new Map(settings.map((s) => [s.slug, s]));
  return baseProducts.map((p) => {
    const s = bySlug.get(p.slug);
    return {
      ...p,
      price: s?.price ?? p.price,
      compareAt: s ? (s.compareAt ?? undefined) : p.compareAt,
      stock: s?.stock ?? null,
      hidden: s?.hidden ?? false,
    };
  });
}

export async function getLiveProducts(): Promise<LiveProduct[]> {
  return (await getAllProductsWithSettings()).filter((p) => !p.hidden);
}

export async function getLiveProduct(slug: string): Promise<LiveProduct | undefined> {
  return (await getLiveProducts()).find((p) => p.slug === slug);
}
