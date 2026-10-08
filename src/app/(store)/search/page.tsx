import Link from "next/link";
import { CATEGORIES } from "@/lib/products";
import { getLiveProducts } from "@/lib/catalog";
import { ProductListing } from "@/components/ProductListing";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { param, searchProducts, type SearchParams } from "@/lib/listing";

export const metadata = { title: "Search — Rollbac" };

const SUGGESTIONS = ["Wedding", "Goa", "Baby", "Mugs", "Frames", "Chennai", "Anniversary", "Friends"];

export default async function SearchPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const query = (param(searchParams, "q") ?? "").trim();
  const results = searchProducts(await getLiveProducts(), query);

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

      <form action="/search" className="mt-5 flex max-w-xl gap-2">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Try “wedding photobook” or “Goa”"
          className="w-full rounded-md border border-mist bg-cloud px-4 py-3 text-pine placeholder:text-pine/35 focus:border-olive"
        />
        <button type="submit" className="shrink-0 rounded-md bg-olive px-5 text-sm font-medium text-ivory hover:opacity-90">
          Search
        </button>
      </form>

      {query ? (
        <h1 className="mt-8 font-display text-2xl text-pine">
          {results.length > 0 ? `Results for “${query}”` : `Nothing found for “${query}”`}
        </h1>
      ) : (
        <h1 className="mt-8 font-display text-2xl text-pine">What are you looking for?</h1>
      )}

      {results.length > 0 ? (
        <div className="mt-6">
          <ProductListing products={results} basePath="/search" keep={["q"]} />
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-sm text-pine/60">Popular searches:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <Link
                key={s}
                href={`/search?q=${encodeURIComponent(s)}`}
                className="rounded-full border border-mist bg-cloud/60 px-3 py-1 text-sm text-pine/75 hover:border-olive"
              >
                {s}
              </Link>
            ))}
          </div>
          <p className="mt-8 text-sm text-pine/60">Or browse a category:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/shop/${c.slug}`} className="text-sm text-olive hover:underline">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
