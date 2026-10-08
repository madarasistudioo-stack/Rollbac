import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, getCategory } from "@/lib/products";
import { getLiveProducts } from "@/lib/catalog";
import { ProductListing } from "@/components/ProductListing";
import { CategoryStrip } from "@/components/CategoryStrip";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductArt } from "@/components/ProductArt";
import { KolamIcon } from "@/components/Icons";
import { formatRupees } from "@/lib/utils";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(props: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const params = await props.params;
  const category = getCategory(params.category);
  return category
    ? { title: `Personalised ${category.name} — Rollbac`, description: category.tagline }
    : {};
}


export default async function CategoryPage(props: { params: Promise<{ category: string }> }) {
  const params = await props.params;
  const category = getCategory(params.category);
  if (!category) notFound();

  const list = (await getLiveProducts()).filter((p) => p.categorySlug === category.slug);
  if (list.length === 0) notFound();
  const hero = list.find((p) => p.bestseller) ?? list[0];
  const lowest = Math.min(...list.map((p) => p.price));

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: category.name }]} />

      <section className="mt-5 grid items-center gap-8 overflow-hidden rounded-2xl border border-mist bg-cloud/70 p-6 sm:p-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-olive">{category.group}</p>
          <h1 className="mt-2 font-display text-4xl italic text-pine sm:text-5xl">{category.name}</h1>
          <p className="mt-3 max-w-md font-display text-lg text-pine/80">{category.tagline}</p>
          <p className="mt-3 max-w-md text-sm text-pine/60">{category.intro}</p>
          <ul className="mt-6 grid gap-2 text-sm text-pine/80 sm:grid-cols-3">
            {category.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2">
                <KolamIcon className="mt-0.5 h-4 w-4 shrink-0 text-marigold" />
                {h}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-pine/55">
            {list.length} designs · from <span className="text-pine">{formatRupees(lowest)}</span>
          </p>
        </div>
        <div className="mx-auto w-full max-w-[260px]">
          <ProductArt
            kind={category.art}
            icon={hero.icon}
            color={hero.colors[0].hex}
            palette={hero.palette.map((c) => c.hex)}
            title={hero.name}
            subtitle={hero.kind}
            className="shadow-[0_20px_40px_-20px_rgba(59,66,41,0.4)]"
          />
        </div>
      </section>

      <div className="mt-8">
        <CategoryStrip current={category.slug} size="sm" />
      </div>

      <div className="mt-8">
        <ProductListing
          products={list}
          basePath={`/shop/${category.slug}`}
          locked={["category"]}
        />
      </div>
    </div>
  );
}
