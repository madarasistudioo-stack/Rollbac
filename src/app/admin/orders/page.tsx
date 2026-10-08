import { prisma } from "@/lib/prisma";
import { formatRupees } from "@/lib/utils";
import { setOrderStatus } from "../actions";

const STATUSES = ["created", "paid", "printing", "shipped", "delivered", "cancelled", "refunded", "failed"];
type Line = { name?: string; kind?: string; size?: string; quantity?: number; photos?: string[]; pages?: { page: number; slot: number; url: string }[]; personalisation?: string };

export default async function OrdersAdmin(props: { searchParams: Promise<{ status?: string }> }) {
  const searchParams = await props.searchParams;
  const orders = await prisma.order.findMany({
    where: searchParams.status ? { status: searchParams.status } : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: { select: { name: true, email: true, phone: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-pine">Orders</h1>
      <p className="mt-1 text-sm text-pine/55">UPI orders stay “created” until you check the UTR in your bank app and set them to “paid”.</p>

      <div className="mt-5 overflow-x-auto rounded-xl border border-mist bg-cloud">
        {orders.length === 0 ? (
          <p className="p-10 text-center text-sm text-pine/45">No orders yet.</p>
        ) : (
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-mist text-left text-xs uppercase tracking-wider text-pine/50">
              <tr><th className="px-4 py-3">Order</th><th>Customer</th><th>Items</th><th>Total</th><th className="px-4">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-mist">
              {orders.map((o) => (
                <tr key={o.id} className="align-top">
                  <td className="px-4 py-3">
                    <p className="text-pine">#{o.id.slice(-8)}</p>
                    <p className="text-xs text-pine/45">{o.createdAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                  </td>
                  <td className="py-3 text-xs text-pine/75">
                    <p className="text-sm text-pine">{o.customerName ?? o.user?.name ?? "Guest"}</p>
                    <p>{o.email ?? o.user?.email}{o.phone ? ` · ${o.phone}` : ""}</p>
                    {o.address && typeof o.address === "object" && !Array.isArray(o.address) && (
                      <p className="text-pine/50">{[(o.address as Record<string, string>).line, (o.address as Record<string, string>).city, (o.address as Record<string, string>).pincode].filter(Boolean).join(", ")}</p>
                    )}
                    {o.userId && <a href={`/admin/users/${o.userId}`} className="text-olive hover:underline">Customer profile</a>}
                  </td>
                  <td className="py-3 text-xs text-pine/70">
                    {((Array.isArray(o.items) ? o.items : []) as Line[]).map((l, i) => (
                      <div key={i} className="mb-1">
                        <p>{l.quantity ?? 1} × {l.name} {l.kind ? `(${l.kind}${l.size ? `, ${l.size}` : ""})` : ""}</p>
                        {(l.photos?.length ?? 0) > 0 && (
                          <p className="text-pine/45">
                            {l.photos!.length} photo(s){l.pages?.length ? ` on ${new Set(l.pages.map((p) => p.page)).size} page(s)` : ""} ·{" "}
                            {l.photos!.map((u, k) => (
                              <a key={k} href={u} target="_blank" rel="noreferrer" className="text-olive hover:underline">#{k + 1} </a>
                            ))}
                          </p>
                        )}
                        {l.personalisation && <p className="text-pine/45">“{l.personalisation}”</p>}
                      </div>
                    ))}
                  </td>
                  <td className="py-3 text-pine">{formatRupees(o.totalPaise / 100)}<p className="text-xs uppercase text-pine/45">{o.paymentMethod}{o.paymentRef ? ` · ${o.paymentRef}` : ""}</p></td>
                  <td className="px-4 py-3">
                    <form action={setOrderStatus} className="flex gap-2">
                      <input type="hidden" name="id" value={o.id} />
                      <select name="status" defaultValue={o.status} className="rounded border border-mist bg-ivory px-2 py-1 text-xs capitalize">
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button className="rounded-md bg-olive px-2.5 py-1 text-xs text-ivory">Update</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
