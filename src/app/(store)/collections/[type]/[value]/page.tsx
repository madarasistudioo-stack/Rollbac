import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { OCCASIONS, PLACES, MEMORIES } from "@/lib/taxonomy";
import { slugify } from "@/lib/utils";
import type { Product } from "@/lib/products";
import { getLiveProducts } from "@/lib/catalog";
import { ProductListing } from "@/components/ProductListing";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { KolamDivider } from "@/components/KolamDivider";
import type { FilterKey } from "@/lib/listing";

type CollectionType = "occasion" | "place" | "memory";

const LISTS: Record<CollectionType, readonly string[]> = { occasion: OCCASIONS, place: PLACES, memory: MEMORIES };
const TITLES: Record<CollectionType, string> = { occasion: "Shop by occasion", place: "Shop by place", memory: "Shop by memory" };
const MATCH: Record<CollectionType, (p: Product, label: string) => boolean> = {
  occasion: (p, l) => p.taxonomyOccasions.includes(l as never),
  place: (p, l) => p.places.includes(l as never),
  memory: (p, l) => p.memoryTypes.includes(l as never),
};
const INTRO: Record<CollectionType, (label: string) => string> = {
  occasion: (l) => `Photobooks, frames, mugs and more, made for ${l.toLowerCase()} — pick a design and make it yours.`,
  place: (l) => `Designs for the photos you brought back from ${l} — books to relive it, frames to keep it in view.`,
  memory: (l) => `For ${l.toLowerCase()} — the photos and stories you'd like to keep somewhere better than a phone.`,
};

function resolve(params: { type: string; value: string }) {
  const type = params.type as CollectionType;
  const list = LISTS[type];
  if (!list) return null;
  const label = list.find((item) => slugify(item) === params.value);
  return label ? { type, label, list } : null;
}

export async function generateMetadata(props: { params: Promise<{ type: string; value: string }> }): Promise<Metadata> {
  const params = await props.params;
  const found = resolve(params);
  return found ? { title: `${found.label} — Rollbac`, description: INTRO[found.type](found.label) } : {};
}


export function generateStaticParams() {
  return (Object.keys(LISTS) as CollectionType[]).flatMap((type) => LISTS[type].map((v) => ({ type, value: slugify(v) })));
}

export default async function CollectionPage(props: { params: Promise<{ type: string; value: string }> }) {
  const params = await props.params;
  const found = resolve(params);
  if (!found) notFound();
  const { type, label, list } = found;

  const products = await getLiveProducts();
  const matches = products.filter((p) => MATCH[type](p, label));
  // Sibling collections of the same type that actually have products.
  const siblings = list.filter((item) => item !== label && products.some((p) => MATCH[type](p, item)));

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: TITLES[type], href: "/shop" }, { label }]} />

      <section className="mt-5 rounded-2xl border border-mist bg-cloud/70 p-6 text-center sm:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-olive">{TITLES[type]}</p>
        <h1 className="mt-2 font-display text-4xl italic text-pine sm:text-5xl">{label}</h1>
        <p className="mx-auto mt-3 max-w-lg text-pine/65">{INTRO[type](label)}</p>
        <KolamDivider className="mx-auto mt-6 max-w-xs" />
      </section>

      {siblings.length > 0 && (
        <div className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {siblings.map((s) => (
            <Link
              key={s}
              href={`/collections/${type}/${slugify(s)}`}
              className="shrink-0 rounded-full border border-mist bg-cloud/60 px-3 py-1 text-xs text-pine/70 hover:border-olive hover:text-pine"
            >
              {s}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8">
        {matches.length > 0 ? (
          <ProductListing
            products={matches}
            basePath={`/collections/${type}/${params.value}`}
            locked={[type as FilterKey]}
          />
        ) : (
          <div className="rounded-xl border border-mist bg-cloud p-10 text-center">
            <p className="text-pine/70">We're still designing for {label}. Here's everything else in the meantime.</p>
            <Link href="/shop" className="mt-3 inline-block text-sm text-olive hover:underline">
              Browse the full shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
