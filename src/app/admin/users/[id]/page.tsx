import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatRupees } from "@/lib/utils";
import { StatCard } from "@/components/admin/AdminNav";
import { Panel, Row, Empty } from "@/components/admin/Panel";
import { addNote, deleteNote, setTags, setUserBlocked } from "../../actions";

const PAID = ["paid", "printing", "shipped", "delivered"];

export default async function Customer360(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      accounts: { select: { provider: true } },
      orders: { orderBy: { createdAt: "desc" } },
      notes: { orderBy: { createdAt: "desc" } },
      tickets: { orderBy: { updatedAt: "desc" }, take: 10 },
    },
  });
  if (!user) notFound();
  const events = await prisma.event.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 40 });
  const spent = user.orders.filter((o) => PAID.includes(o.status)).reduce((s, o) => s + o.totalPaise, 0) / 100;
  const phone = user.phone ?? user.orders.find((o) => o.phone)?.phone;
  const wa = phone ? `https://wa.me/${phone.replace(/\D/g, "").replace(/^(\d{10})$/, "91$1")}` : null;

  return (
    <div>
      <Link href="/admin/users" className="text-sm text-pine/50 hover:text-olive">← Customers</Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-pine">{user.name ?? user.email ?? user.phone}</h1>
          <p className="text-sm text-pine/55">
            {[user.email, phone].filter(Boolean).join(" · ")} · joined {user.createdAt.toLocaleDateString("en-IN")} ·{" "}
            {user.accounts.map((a) => a.provider).join(", ") || "no sign-in yet"}
            {user.blocked && <span className="ml-2 text-rust">Blocked</span>}
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          {user.email && <a href={`mailto:${user.email}`} className="rounded-md border border-mist px-3 py-1.5 hover:border-olive">Email</a>}
          {wa && <a href={wa} target="_blank" rel="noreferrer" className="rounded-md border border-mist px-3 py-1.5 hover:border-olive">WhatsApp</a>}
          <form action={setUserBlocked}>
            <input type="hidden" name="id" value={user.id} />
            <input type="hidden" name="blocked" value={String(!user.blocked)} />
            <button className="rounded-md border border-mist px-3 py-1.5 text-rust hover:border-rust">{user.blocked ? "Unblock" : "Block"}</button>
          </form>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Lifetime spend" value={formatRupees(spent)} />
        <StatCard label="Orders" value={user.orders.length} />
        <StatCard label="Avg order" value={user.orders.length ? formatRupees(Math.round(spent / Math.max(1, user.orders.filter((o) => PAID.includes(o.status)).length))) : "—"} />
        <StatCard label="Last seen" value={events[0] ? events[0].createdAt.toLocaleDateString("en-IN") : "—"} />
      </div>

      <form action={setTags} className="mt-6 flex flex-wrap items-center gap-2">
        <input type="hidden" name="userId" value={user.id} />
        <span className="text-sm text-pine/60">Tags</span>
        <input name="tags" defaultValue={user.tags.join(", ")} placeholder="VIP, Wedding client, Corporate" className="w-80 rounded-md border border-mist bg-cloud px-3 py-1.5 text-sm" />
        <button className="rounded-md bg-olive px-3 py-1.5 text-xs text-ivory">Save tags</button>
      </form>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Orders">
          {user.orders.length === 0 && <Empty>No orders yet.</Empty>}
          {user.orders.map((o) => <Row key={o.id} left={`#${o.id.slice(-8)} · ${o.createdAt.toLocaleDateString("en-IN")}`} right={`${formatRupees(o.totalPaise / 100)} · ${o.status}`} />)}
        </Panel>
        <Panel title="Notes">
          <form action={addNote} className="flex gap-2 p-4">
            <input type="hidden" name="userId" value={user.id} />
            <input name="body" required placeholder="e.g. Prefers WhatsApp, anniversary in March" className="w-full rounded-md border border-mist bg-ivory px-3 py-1.5 text-sm" />
            <button className="rounded-md bg-olive px-3 text-xs text-ivory">Add</button>
          </form>
          {user.notes.map((n) => (
            <div key={n.id} className="flex items-start justify-between gap-3 px-5 py-2.5 text-sm">
              <span className="text-pine/80">{n.body}<span className="block text-xs text-pine/40">{n.createdAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span></span>
              <form action={deleteNote}><input type="hidden" name="id" value={n.id} /><button className="text-xs text-pine/40 hover:text-rust">✕</button></form>
            </div>
          ))}
        </Panel>
        <Panel title="Messages" href="/admin/inbox">
          {user.tickets.length === 0 && <Empty>No messages.</Empty>}
          {user.tickets.map((t) => <Row key={t.id} left={<Link href={`/admin/inbox/${t.id}`} className="hover:text-olive">{t.subject}</Link>} right={t.status} />)}
        </Panel>
        <Panel title="Activity timeline">
          {events.length === 0 && <Empty>No activity recorded while signed in.</Empty>}
          {events.map((e) => (
            <Row
              key={e.id}
              left={e.type === "pageview" ? `Viewed ${e.path}` : e.type === "add_to_cart" ? `Added ${e.detail} to bag` : `Signed in (${e.detail})`}
              right={e.createdAt.toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
            />
          ))}
        </Panel>
      </div>
    </div>
  );
}
