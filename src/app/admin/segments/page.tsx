import Link from "next/link";
import { SEGMENTS, segmentRows } from "@/lib/segments";
import { cn } from "@/lib/utils";

export default async function SegmentsPage(props: { searchParams: Promise<{ s?: string }> }) {
  const searchParams = await props.searchParams;
  const current = SEGMENTS.find((s) => s.id === searchParams.s) ?? SEGMENTS[0];
  const rows = await segmentRows(current.id);
  return (
    <div>
      <h1 className="font-display text-3xl text-pine">Segments</h1>
      <p className="mt-1 text-sm text-pine/55">Ready-made customer lists. Export to CSV for WhatsApp broadcasts or email campaigns.</p>
      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        {SEGMENTS.map((s) => (
          <Link key={s.id} href={`/admin/segments?s=${s.id}`} className={cn("rounded-full border px-3 py-1", s.id === current.id ? "border-olive bg-olive text-ivory" : "border-mist hover:border-olive")}>{s.title}</Link>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-pine/70"><span className="font-display text-pine">{current.title}</span> — {current.about} · {rows.length} people</p>
        <a href={`/admin/export?segment=${current.id}`} className="rounded-md border border-mist px-3 py-1.5 text-sm hover:border-olive">Export CSV</a>
      </div>
      <div className="mt-4 overflow-x-auto rounded-xl border border-mist bg-cloud">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-mist text-left text-xs uppercase tracking-wider text-pine/50"><tr><th className="px-4 py-3">Name</th><th>Email</th><th>Phone</th><th className="px-4">Detail</th></tr></thead>
          <tbody className="divide-y divide-mist">
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="px-4 py-2.5">{r.userId ? <Link href={`/admin/users/${r.userId}`} className="text-pine hover:text-olive">{r.name || "—"}</Link> : r.name || "—"}</td>
                <td className="text-pine/70">{r.email}</td>
                <td className="text-pine/70">{r.phone}</td>
                <td className="px-4 text-xs text-pine/60">{r.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-10 text-center text-sm text-pine/45">Nobody in this segment yet.</p>}
      </div>
    </div>
  );
}
