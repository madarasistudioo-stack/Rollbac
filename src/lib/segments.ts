import { prisma } from "@/lib/prisma";

export type SegmentRow = { name: string; email: string; phone: string; detail: string; userId?: string };

const DAY = 24 * 60 * 60 * 1000;
const PAID = ["paid", "printing", "shipped", "delivered"];

export const SEGMENTS = [
  { id: "vip", title: "VIP customers", about: "Spent ₹5,000 or more" },
  { id: "repeat", title: "Repeat buyers", about: "Two or more orders" },
  { id: "lapsed", title: "Lapsed customers", about: "Bought before, nothing in 90 days" },
  { id: "abandoned", title: "Abandoned bags", about: "Signed in, added to bag in the last 14 days, didn't order" },
  { id: "new-no-order", title: "New, no order yet", about: "Joined in the last 30 days" },
  { id: "unpaid", title: "Awaiting payment", about: "Orders placed but not yet marked paid" },
  { id: "subscribers", title: "Newsletter & leads", about: "Everyone who gave their email and didn't unsubscribe" },
] as const;

export type SegmentId = (typeof SEGMENTS)[number]["id"];

export async function segmentRows(id: string): Promise<SegmentRow[]> {
  const now = Date.now();
  if (id === "subscribers") {
    const leads = await prisma.lead.findMany({ where: { status: { not: "unsubscribed" } }, orderBy: { createdAt: "desc" } });
    return leads.map((l) => ({ name: l.name ?? "", email: l.email, phone: l.phone ?? "", detail: `${l.source} · ${l.status}` }));
  }
  if (id === "unpaid") {
    const orders = await prisma.order.findMany({ where: { status: "created" }, orderBy: { createdAt: "desc" } });
    return orders.map((o) => ({
      name: o.customerName ?? "", email: o.email ?? "", phone: o.phone ?? "", userId: o.userId ?? undefined,
      detail: `#${o.id.slice(-8)} · ₹${o.totalPaise / 100}${o.paymentRef ? ` · UTR ${o.paymentRef}` : " · no UTR yet"}`,
    }));
  }

  const users = await prisma.user.findMany({
    where: { blocked: false },
    include: { orders: { select: { totalPaise: true, status: true, createdAt: true } } },
  });
  const row = (u: (typeof users)[number], detail: string): SegmentRow => ({ name: u.name ?? "", email: u.email ?? "", phone: u.phone ?? "", detail, userId: u.id });
  const spent = (u: (typeof users)[number]) => u.orders.filter((o) => PAID.includes(o.status)).reduce((s, o) => s + o.totalPaise, 0) / 100;
  const lastOrder = (u: (typeof users)[number]) => Math.max(0, ...u.orders.map((o) => o.createdAt.getTime()));

  switch (id) {
    case "vip":
      return users.filter((u) => spent(u) >= 5000).map((u) => row(u, `₹${spent(u)} spent`));
    case "repeat":
      return users.filter((u) => u.orders.length >= 2).map((u) => row(u, `${u.orders.length} orders`));
    case "lapsed":
      return users.filter((u) => u.orders.length > 0 && now - lastOrder(u) > 90 * DAY).map((u) => row(u, `last order ${new Date(lastOrder(u)).toLocaleDateString("en-IN")}`));
    case "new-no-order":
      return users.filter((u) => u.orders.length === 0 && now - u.createdAt.getTime() < 30 * DAY).map((u) => row(u, `joined ${u.createdAt.toLocaleDateString("en-IN")}`));
    case "abandoned": {
      const events = await prisma.event.findMany({ where: { type: "add_to_cart", userId: { not: null }, createdAt: { gte: new Date(now - 14 * DAY) } } });
      const byUser = new Map<string, { at: number; items: Set<string> }>();
      for (const e of events) {
        const cur = byUser.get(e.userId!) ?? { at: 0, items: new Set<string>() };
        cur.at = Math.max(cur.at, e.createdAt.getTime());
        if (e.detail) cur.items.add(e.detail);
        byUser.set(e.userId!, cur);
      }
      return users
        .filter((u) => byUser.has(u.id) && lastOrder(u) < byUser.get(u.id)!.at)
        .map((u) => row(u, Array.from(byUser.get(u.id)!.items).join(", ")));
    }
    default:
      return [];
  }
}

export function toCsv(rows: SegmentRow[]): string {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return ["Name,Email,Phone,Detail", ...rows.map((r) => [r.name, r.email, r.phone, r.detail].map(esc).join(","))].join("\n");
}
