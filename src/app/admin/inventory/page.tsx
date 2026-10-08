import Link from "next/link";
import { CATEGORIES } from "@/lib/products";
import { getAllProductsWithSettings } from "@/lib/catalog";
import { saveProductSetting, resetProductSetting } from "../actions";
import { cn } from "@/lib/utils";
import { PublishButton } from "@/components/admin/PublishButton";

export default async function InventoryPage(props: { searchParams: Promise<{ category?: string }> }) {
  const searchParams = await props.searchParams;
  const all = await getAllProductsWithSettings();
  const list = searchParams.category ? all.filter((p) => p.categorySlug === searchParams.category) : all;
  const input = "w-20 rounded border border-mist bg-ivory px-2 py-1 text-sm text-pine focus:border-olive";

  return (
    <div>
      <h1 className="font-display text-3xl text-pine">Inventory</h1>
      <p className="mt-1 text-sm text-pine/55">
        Prices in rupees. Leave stock empty for made-to-order; 0 shows “Sold out”. Untick Visible to hide a product from the shop.
        Checkout always uses what you save here; press <b>Publish to website</b> to refresh the shop pages too.
      </p>
      <div className="mt-4">
        <PublishButton />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Tab href="/admin/inventory" active={!searchParams.category}>All ({all.length})</Tab>
        {CATEGORIES.map((c) => (
          <Tab key={c.slug} href={`/admin/inventory?category=${c.slug}`} active={searchParams.category === c.slug}>
            {c.name} ({all.filter((p) => p.categorySlug === c.slug).length})
          </Tab>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-mist bg-cloud">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-mist text-left text-xs uppercase tracking-wider text-pine/50">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-2">Price ₹</th>
              <th className="px-2">Was ₹</th>
              <th className="px-2">Stock</th>
              <th className="px-2">Visible</th>
              <th className="px-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-mist">
            {list.map((p) => (
              <tr key={p.slug} className={cn(p.hidden && "bg-mist/30 text-pine/50")}>
                <td className="px-4 py-2.5">
                  <Link href={`/product/${p.slug}`} target="_blank" className="text-pine hover:text-olive">{p.name}</Link>
                  <p className="text-xs text-pine/45">{p.kind} · {p.category}</p>
                </td>
                <td colSpan={5} className="px-2">
                  <form action={saveProductSetting} className="flex items-center gap-4">
                    <input type="hidden" name="slug" value={p.slug} />
                    <input name="price" type="number" min={0} defaultValue={p.price} className={input} aria-label="Price" />
                    <input name="compareAt" type="number" min={0} defaultValue={p.compareAt ?? ""} className={input} aria-label="Was price" />
                    <input name="stock" type="number" min={0} defaultValue={p.stock ?? ""} placeholder="∞" className={input} aria-label="Stock" />
                    <input name="visible" type="checkbox" defaultChecked={!p.hidden} className="h-4 w-4 accent-olive" aria-label="Visible" />
                    <button className="ml-auto rounded-md bg-olive px-3 py-1.5 text-xs font-medium text-ivory hover:opacity-90">Save</button>
                    <button formAction={resetProductSetting} className="text-xs text-pine/45 hover:text-rust" title="Back to catalogue defaults">
                      Reset
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Tab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn("rounded-full border px-3 py-1 text-xs", active ? "border-olive bg-olive text-ivory" : "border-mist text-pine/70 hover:border-olive")}
    >
      {children}
    </Link>
  );
}
