import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { formatRupees } from "@/lib/utils";

export const metadata = { title: "My orders — Rollbac" };
export const dynamic = "force-dynamic";

type OrderLine = { name?: string; kind?: string; quantity?: number };

export default async function OrdersPage() {
  const { id } = await requireUser("/account/orders");
  const orders = await prisma.order.findMany({ where: { userId: id }, orderBy: { createdAt: "desc" } });

  return (
    <div className="container-page max-w-3xl py-12">
      <Link href="/account" className="text-sm text-pine/50 hover:text-olive">
        ← My account
      </Link>
      <h1 className="mt-2 font-display text-3xl text-pine">My orders</h1>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-xl border border-mist bg-cloud p-10 text-center">
          <p className="text-pine/70">No orders yet.</p>
          <Link href="/shop" className="mt-3 inline-block text-sm text-olive hover:underline">
            Find something worth personalising
          </Link>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-mist rounded-xl border border-mist bg-cloud">
          {orders.map((o) => {
            const lines = (Array.isArray(o.items) ? o.items : []) as OrderLine[];
            return (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="text-sm text-pine">
                    {lines.map((l) => `${l.name ?? "Item"}${l.quantity && l.quantity > 1 ? ` × ${l.quantity}` : ""}`).join(", ")}
                  </p>
                  <p className="text-xs text-pine/45">
                    {o.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · #{o.id.slice(-8)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-pine">{formatRupees(o.totalPaise / 100)}</p>
                  <p className="text-xs capitalize text-pine/50">{o.status}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
