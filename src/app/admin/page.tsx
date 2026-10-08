import { prisma } from "@/lib/prisma";
import { formatRupees } from "@/lib/utils";
import { StatCard } from "@/components/admin/AdminNav";
import { Panel, Row, Empty } from "@/components/admin/Panel";

const DAY = 24 * 60 * 60 * 1000;

export default async function AdminOverview() {
  const weekAgo = new Date(Date.now() - 7 * DAY);
  const [openTickets, newLeads, awaiting] = await Promise.all([
    prisma.supportTicket.count({ where: { status: "open" } }),
    prisma.lead.count({ where: { status: "new" } }),
    prisma.order.count({ where: { status: "created" } }),
  ]);
  const [users, newUsers, orders, paid, views, carts, recentUsers, recentEvents] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalPaise: true }, where: { status: { in: ["paid", "printing", "shipped", "delivered"] } } }),
    prisma.event.count({ where: { type: "pageview", createdAt: { gte: weekAgo } } }),
    prisma.event.count({ where: { type: "add_to_cart", createdAt: { gte: weekAgo } } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.event.findMany({ where: { type: { not: "pageview" } }, orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl text-pine">Overview</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Todo href="/admin/orders" count={awaiting} label="orders awaiting payment check" />
        <Todo href="/admin/inbox" count={openTickets} label="open messages" />
        <Todo href="/admin/leads?status=new" count={newLeads} label="new leads" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Customers" value={users} note={`${newUsers} new this week`} />
        <StatCard label="Orders" value={orders} />
        <StatCard label="Revenue" value={formatRupees((paid._sum.totalPaise ?? 0) / 100)} note="Paid and later statuses" />
        <StatCard label="Page views" value={views} note="Last 7 days" />
        <StatCard label="Added to bag" value={carts} note="Last 7 days" />
        <StatCard label="Conversion" value={views ? `${((carts / views) * 100).toFixed(1)}%` : "—"} note="Add-to-bag per view" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Panel title="Newest customers" href="/admin/users">
          {recentUsers.length === 0 && <Empty>No customers yet.</Empty>}
          {recentUsers.map((u) => (
            <Row key={u.id} left={u.name ?? u.email ?? u.phone ?? "—"} right={u.createdAt.toLocaleDateString("en-IN")} />
          ))}
        </Panel>
        <Panel title="Recent activity" href="/admin/analytics">
          {recentEvents.length === 0 && <Empty>Nothing yet.</Empty>}
          {recentEvents.map((e) => (
            <Row
              key={e.id}
              left={e.type === "signin" ? `Sign-in with ${e.detail}` : `Added ${e.detail ?? e.path} to bag`}
              right={e.createdAt.toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
            />
          ))}
        </Panel>
      </div>
    </div>
  );
}

function Todo({ href, count, label }: { href: string; count: number; label: string }) {
  return (
    <a href={href} className={`rounded-xl border p-4 text-sm ${count > 0 ? "border-marigold bg-marigold/15 text-pine" : "border-mist bg-cloud text-pine/50"}`}>
      <span className="font-display text-2xl">{count}</span> {label}
    </a>
  );
}
