import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, getCategory, type Product } from "@/lib/products";
import { ProductArt } from "@/components/ProductArt";
import { HeroRing } from "@/components/HeroRing";

/**
 * The homepage hero: a giant serif wordmark over a full 3D ring of our own
 * illustrated products that turns on its own and spins as the page scrolls.
 */
export function Hero({ products }: { products: Product[] }) {
  const shelf = pickShelf(products);

  return (
    <section className="relative overflow-hidden pb-10 pt-12 sm:pt-16">
      <div className="container-page text-center">
        <Image src="/logo-badge.svg" alt="" width={64} height={64} className="mx-auto h-14 w-14 opacity-90 sm:h-16 sm:w-16" priority />
        <p className="mt-5 text-[11px] uppercase tracking-[0.35em] text-olive sm:text-xs">
          Photobooks · Journals · Frames · Gifts
        </p>
        <h1 className="mt-3 font-display text-[clamp(3.2rem,11vw,8.5rem)] font-light leading-[0.95] tracking-tight text-pine">
          Roll<span className="italic text-olive">bac</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md font-display text-lg text-pine/75 sm:text-xl">Your precious memories, bound in paper.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/shop/photobooks" className="rounded-full bg-olive px-6 py-3 text-sm font-medium text-ivory transition-opacity hover:opacity-90">
            Start your photobook
          </Link>
          <Link href="/shop" className="rounded-full border border-mist px-6 py-3 text-sm font-medium text-pine transition-colors hover:border-olive hover:text-olive">
            Browse all designs
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <HeroRing>
          {shelf.map((p) => {
            const category = getCategory(p.categorySlug)!;
            return (
              <Link key={p.slug} href={`/product/${p.slug}`} draggable={false} className="block transition-transform duration-300 hover:-translate-y-3">
                <ProductArt
                  kind={category.art}
                  icon={p.icon}
                  color={p.colors[0].hex}
                  palette={p.palette.map((c) => c.hex)}
                  title={p.name}
                  subtitle={p.kind}
                  className="shadow-[0_24px_40px_-18px_rgba(0,0,0,0.45)]"
                />
              </Link>
            );
          })}
        </HeroRing>
      </div>

      <div className="container-page mt-8 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/shop/${c.slug}`}
            className="rounded-full border border-mist bg-cloud/60 px-4 py-1.5 text-xs text-pine/75 transition-colors hover:border-olive hover:text-pine sm:text-sm"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

// A varied shelf: bestsellers and new designs first, no design twice in a row.
function pickShelf(products: Product[]): Product[] {
  const ranked = [...products].sort((a, b) => Number(b.bestseller) * 2 + Number(b.isNew) - (Number(a.bestseller) * 2 + Number(a.isNew)));
  const shelf: Product[] = [];
  const seenDesign = new Set<string>();
  for (const p of ranked) {
    if (seenDesign.has(p.designId)) continue;
    seenDesign.add(p.designId);
    shelf.push(p);
    if (shelf.length === 14) break;
  }
  return shelf;
}
