import Link from "next/link";
import { getCategory, type Product } from "@/lib/products";
import { formatRupees } from "@/lib/utils";
import { ProductArt } from "@/components/ProductArt";
import { Tilt } from "@/components/Tilt";

export function ProductCard({ product }: { product: Product }) {
  const category = getCategory(product.categorySlug)!;
  const saving = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <Tilt className="relative">
        <ProductArt
          kind={category.art}
          icon={product.icon}
          color={product.colors[0].hex}
          palette={product.palette.map((c) => c.hex)}
          title={product.name}
          subtitle={product.kind}
          className="transition-shadow duration-200 group-hover:shadow-[0_10px_30px_-12px_rgba(59,66,41,0.35)]"
        />
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1">
          {product.bestseller && <Badge className="bg-pine text-ivory">Bestseller</Badge>}
          {product.isNew && <Badge className="bg-marigold text-pine">New</Badge>}
          {(product as { stock?: number | null }).stock === 0 && <Badge className="bg-rust text-ivory">Sold out</Badge>}
        </div>
      </Tilt>

      <div className="mt-3 text-center">
        <h3 className="font-display text-base leading-snug text-pine group-hover:text-olive">{product.name}</h3>
        <p className="text-xs text-pine/50">{product.kind}</p>
        <div className="mt-1.5 flex items-center justify-center gap-2 text-sm">
          <span className="text-pine">{formatRupees(product.price)}</span>
          {product.compareAt && (
            <>
              <span className="text-xs text-pine/40 line-through">{formatRupees(product.compareAt)}</span>
              <span className="rounded bg-marigold/25 px-1.5 py-0.5 text-[10px] font-medium text-pine">Save {saving}%</span>
            </>
          )}
        </div>
        <div className="mt-2 flex justify-center gap-1.5">
          {product.colors.map((c) => (
            <span
              key={c.hex}
              title={c.name}
              className="h-3.5 w-3.5 rounded-full border border-mist"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className: string }) {
  return <span className={`rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${className}`}>{children}</span>;
}
