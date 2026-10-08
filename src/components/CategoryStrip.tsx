import Link from "next/link";
import { CATEGORIES, productsInCategory, type CategorySlug } from "@/lib/products";
import { ProductArt } from "@/components/ProductArt";
import { Tilt } from "@/components/Tilt";
import { cn } from "@/lib/utils";

/** A scrollable row of every category, each drawn with its own best-known design. */
export function CategoryStrip({ current, size = "md" }: { current?: CategorySlug; size?: "sm" | "md" }) {
  return (
    <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
      {CATEGORIES.map((c) => {
        const cover = productsInCategory(c.slug).find((p) => p.bestseller) ?? productsInCategory(c.slug)[0];
        const active = c.slug === current;
        return (
          <Link
            key={c.slug}
            href={`/shop/${c.slug}`}
            aria-current={active ? "page" : undefined}
            className={cn("group shrink-0 text-center", size === "sm" ? "w-24 sm:w-28" : "w-32 sm:w-36")}
          >
            <Tilt max={14}>
            <ProductArt
              kind={c.art}
              icon={cover.icon}
              color={cover.colors[0].hex}
              palette={cover.palette.map((p) => p.hex)}
              title={cover.name}
              className={cn(
                "transition-transform duration-200 group-hover:-translate-y-0.5",
                active && "ring-2 ring-olive ring-offset-2 ring-offset-ivory"
              )}
            />
            </Tilt>
            <span className={cn("mt-2 block text-sm", active ? "font-medium text-olive" : "text-pine group-hover:text-olive")}>
              {c.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
