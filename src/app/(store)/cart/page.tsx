"use client";

import Link from "next/link";
import { useCart, lineKey } from "@/components/CartProvider";
import { formatRupees } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-2xl text-pine">Your bag is empty</h1>
        <p className="mt-2 text-pine/60">Find something worth personalising.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-md bg-olive px-5 py-3 text-sm font-medium text-ivory hover:opacity-90"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <h1 className="font-display text-3xl text-pine">Your bag</h1>

      <div className="mt-8 divide-y divide-mist">
        {items.map((item) => (
          <div key={lineKey(item)} className="flex flex-wrap items-center gap-4 py-5">
            <div className="flex-1">
              <p className="font-display text-pine">{item.name}</p>
              <p className="text-sm text-pine/50">
                {item.kind} · {item.color}
                {item.size ? ` · ${item.size}` : ""}
                {item.pageCount ? ` · ${item.pageCount}` : ""}
              </p>
              {item.photos && item.photos.length > 0 && (
                <p className="mt-1 text-xs text-pine/40">{item.photos.length} photo(s) attached</p>
              )}
              {item.personalisation && (
                <p className="mt-1 text-sm text-pine/40">"{item.personalisation}"</p>
              )}
            </div>

            <div className="flex items-center rounded-md border border-mist">
              <button
                onClick={() => updateQuantity(lineKey(item), item.quantity - 1)}
                className="px-3 py-1.5 text-pine/70 hover:text-pine"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center text-pine">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(lineKey(item), item.quantity + 1)}
                className="px-3 py-1.5 text-pine/70 hover:text-pine"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <p className="w-24 text-right text-pine">{formatRupees(item.price * item.quantity)}</p>

            <button
              onClick={() => removeItem(lineKey(item))}
              className="text-sm text-pine/40 hover:text-rust"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-4 border-t border-mist pt-6">
        <p className="text-lg text-pine">
          Subtotal: <span className="font-display">{formatRupees(subtotal)}</span>
        </p>
        <Link
          href="/checkout"
          className="rounded-md bg-olive px-6 py-3 text-sm font-medium text-ivory hover:opacity-90"
        >
          Go to checkout
        </Link>
      </div>
    </div>
  );
}
