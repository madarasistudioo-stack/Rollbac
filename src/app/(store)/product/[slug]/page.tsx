import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory, getProductBySlug, products } from "@/lib/products";
import { getLiveProduct, getLiveProducts } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { ProductConfigurator } from "@/components/ProductConfigurator";
import { FAQS } from "@/lib/giftFinder";
import { Reveal } from "@/components/Reveal";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const product = getProductBySlug(params.slug);
  return product ? { title: `${product.name} ${product.kind} — Rollbac`, description: product.blurb } : {};
}


export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const product = await getLiveProduct(params.slug);
  if (!product) notFound();
  const live = await getLiveProducts();
  const category = getCategory(product.categorySlug)!;

  const set = live.filter((p) => p.designId === product.designId && p.slug !== product.slug);
  const similar = live
    .filter((p) => p.categorySlug === product.categorySlug && p.designId !== product.designId)
    .filter((p) => p.themes.some((t) => product.themes.includes(t)))
    .slice(0, 4);
  const delivery = FAQS.filter((f) => ["timing", "shipping", "cancel"].includes(f.id));

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: category.name, href: `/shop/${category.slug}` },
          { label: product.name },
        ]}
      />

      <div className="mt-6">
        <ProductConfigurator product={product} />
      </div>

      <Reveal>
<section className="mt-16 grid gap-8 border-t border-mist pt-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-xl text-pine">About this design</h2>
          <p className="mt-3 text-pine/70">{product.description}</p>
          <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            <dt className="text-pine/50">Good for</dt>
            <dd className="text-pine/80">{product.taxonomyOccasions.join(", ")}</dd>
            <dt className="text-pine/50">Personalise with</dt>
            <dd className="text-pine/80">{product.personalisation.join(", ")}</dd>
            <dt className="text-pine/50">Sizes</dt>
            <dd className="text-pine/80">{category.options.sizes.map((s) => `${s.label} (${s.dimensions})`).join(" · ")}</dd>
          </dl>
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-xl text-pine">Delivery & orders</h2>
          {delivery.map((f) => (
            <details key={f.id} className="group rounded-lg border border-mist bg-cloud/60 px-4 py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm text-pine [&::-webkit-details-marker]:hidden">
                {f.question}
                <span className="text-pine/40 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm text-pine/65">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>
</Reveal>

      {set.length > 0 && (
        <Reveal>
<section className="mt-16">
          <h2 className="font-display text-2xl text-pine">Complete the {product.name} set</h2>
          <p className="mt-1 text-sm text-pine/55">The same design, on other things worth giving.</p>
          <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {set.slice(0, 4).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
</Reveal>
      )}

      {similar.length > 0 && (
        <Reveal>
<section className="mt-16">
          <h2 className="font-display text-2xl text-pine">More {category.name.toLowerCase()} you might like</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {similar.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
</Reveal>
      )}
    </div>
  );
}
