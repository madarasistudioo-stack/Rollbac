import { getLiveProducts } from "@/lib/catalog";
import { ProductListing } from "@/components/ProductListing";
import { CategoryStrip } from "@/components/CategoryStrip";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = { title: "Shop all designs — Rollbac" };

export default async function ShopPage() {
  const products = await getLiveProducts();

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <h1 className="mt-4 font-display text-4xl text-pine">Shop all designs</h1>
      <p className="mt-2 max-w-xl text-pine/60">
        Photobooks, journals, frames, mugs and more — every one personalised by you, every one with a little Madras in it.
      </p>

      <div className="mt-8">
        <CategoryStrip size="sm" />
      </div>

      <div className="mt-8">
        <ProductListing products={products} basePath="/shop" />
      </div>
    </div>
  );
}
