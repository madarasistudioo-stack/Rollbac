import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { setLeadStatus, deleteLead } from "../actions";
import { cn } from "@/lib/utils";

const STATUSES = ["new", "contacted", "converted", "unsubscribed"];

export default async function LeadsPage(props: { searchParams: Promise<{ status?: string }> }) {
  const searchParams = await props.searchParams;
  const status = STATUSES.includes(searchParams.status ?? "") ? searchParams.status : undefined;
  const [leads, counts] = await Promise.all([
    prisma.lead.findMany({ where: status ? { status } : undefined, orderBy: { createdAt: "desc" }, take: 300 }),
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const count = (s: string) => counts.find((c) => c.status === s)?._count._all ?? 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-pine">Leads & newsletter</h1>
        <a href="/admin/export?segment=subscribers" className="rounded-md border border-mist px-3 py-1.5 text-sm hover:border-olive">Export CSV</a>
      </div>
      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <Link href="/admin/leads" className={cn("rounded-full border px-3 py-1", !status ? "border-olive bg-olive text-ivory" : "border-mist")}>All</Link>
        {STATUSES.map((s) => (
          <Link key={s} href={`/admin/leads?status=${s}`} className={cn("rounded-full border px-3 py-1 capitalize", status === s ? "border-olive bg-olive text-ivory" : "border-mist")}>
            {s} ({count(s)})
          </Link>
        ))}
      </div>
      <div className="mt-5 overflow-x-auto rounded-xl border border-mist bg-cloud">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-mist text-left text-xs uppercase tracking-wider text-pine/50">
            <tr><th className="px-4 py-3">Contact</th><th>Source</th><th>Added</th><th className="px-4">Status & note</th><th /></tr>
          </thead>
          <tbody className="divide-y divide-mist">
            {leads.map((l) => (
              <tr key={l.id}>
                <td className="px-4 py-3"><p className="text-pine">{l.name ?? l.email}</p><p className="text-xs text-pine/50">{l.name ? l.email : ""}{l.phone ? ` · ${l.phone}` : ""}</p></td>
                <td className="capitalize text-pine/70">{l.source}</td>
                <td className="text-pine/70">{l.createdAt.toLocaleDateString("en-IN")}</td>
                <td className="px-4 py-2">
                  <form action={setLeadStatus} className="flex gap-2">
                    <input type="hidden" name="id" value={l.id} />
                    <select name="status" defaultValue={l.status} className="rounded border border-mist bg-ivory px-2 py-1 text-xs capitalize">
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <input name="note" defaultValue={l.note ?? ""} placeholder="Note" className="w-40 rounded border border-mist bg-ivory px-2 py-1 text-xs" />
                    <button className="rounded bg-olive px-2 text-xs text-ivory">Save</button>
                  </form>
                </td>
                <td className="pr-4"><form action={deleteLead}><input type="hidden" name="id" value={l.id} /><button className="text-xs text-pine/40 hover:text-rust">Delete</button></form></td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && <p className="p-10 text-center text-sm text-pine/45">No leads yet — they arrive from the footer newsletter and the Contact page.</p>}
      </div>
    </div>
  );
}
