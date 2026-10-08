import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export default async function InboxPage(props: { searchParams: Promise<{ status?: string }> }) {
  const searchParams = await props.searchParams;
  const status = searchParams.status ?? "open";
  const tickets = await prisma.supportTicket.findMany({
    where: status === "all" ? undefined : { status },
    orderBy: { updatedAt: "desc" },
    take: 200,
    include: { _count: { select: { messages: true } } },
  });
  return (
    <div>
      <h1 className="font-display text-3xl text-pine">Support inbox</h1>
      <div className="mt-5 flex gap-2 text-xs">
        {["open", "replied", "closed", "all"].map((s) => (
          <Link key={s} href={`/admin/inbox?status=${s}`} className={cn("rounded-full border px-3 py-1 capitalize", status === s ? "border-olive bg-olive text-ivory" : "border-mist")}>{s}</Link>
        ))}
      </div>
      <div className="mt-5 divide-y divide-mist rounded-xl border border-mist bg-cloud">
        {tickets.length === 0 && <p className="p-10 text-center text-sm text-pine/45">Nothing here.</p>}
        {tickets.map((t) => (
          <Link key={t.id} href={`/admin/inbox/${t.id}`} className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-ivory">
            <span className="min-w-0">
              <span className="block truncate text-pine">{t.subject}</span>
              <span className="block truncate text-xs text-pine/50">{t.name} · {t.email}{t.orderRef ? ` · order ${t.orderRef}` : ""}</span>
            </span>
            <span className="shrink-0 text-right text-xs text-pine/50">
              <span className="block capitalize">{t.status}</span>
              {t.updatedAt.toLocaleDateString("en-IN")} · {t._count.messages} msg
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
