import { prisma } from "@/lib/prisma";
import { Panel, Row, Empty } from "@/components/admin/Panel";

export default async function AnalyticsPage() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const where = { createdAt: { gte: since } };
  const [daily, pages, searches, carts, signins] = await Promise.all([
    prisma.$queryRaw<{ day: Date; views: number }[]>`
      SELECT date_trunc('day', "createdAt") AS day, count(*)::int AS views
      FROM "Event" WHERE type = 'pageview' AND "createdAt" >= ${since}
      GROUP BY 1 ORDER BY 1`,
    prisma.event.groupBy({ by: ["path"], where: { ...where, type: "pageview", NOT: { path: { startsWith: "/search" } } }, _count: { _all: true }, orderBy: { _count: { path: "desc" } }, take: 12 }),
    prisma.event.groupBy({ by: ["path"], where: { ...where, type: "pageview", path: { startsWith: "/search?q=" } }, _count: { _all: true }, orderBy: { _count: { path: "desc" } }, take: 10 }),
    prisma.event.groupBy({ by: ["detail"], where: { ...where, type: "add_to_cart" }, _count: { _all: true }, orderBy: { _count: { detail: "desc" } }, take: 10 }),
    prisma.event.groupBy({ by: ["detail"], where: { ...where, type: "signin" }, _count: { _all: true } }),
  ]);
  const max = Math.max(1, ...daily.map((d) => d.views));

  return (
    <div>
      <h1 className="font-display text-3xl text-pine">Analytics</h1>
      <p className="mt-1 text-sm text-pine/55">Last 30 days, recorded by the site itself (bots and admin pages excluded).</p>

      <section className="mt-6 rounded-xl border border-mist bg-cloud p-5">
        <h2 className="font-display text-pine">Page views per day</h2>
        {daily.length === 0 ? (
          <Empty>No visits recorded yet.</Empty>
        ) : (
          <div className="mt-4 flex h-40 items-end gap-1">
            {daily.map((d) => (
              <div key={String(d.day)} className="group relative flex-1" title={`${new Date(d.day).toLocaleDateString("en-IN")}: ${d.views}`}>
                <div className="rounded-t bg-olive/80 group-hover:bg-olive" style={{ height: `${(d.views / max) * 150}px` }} />
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Top pages">
          {pages.length === 0 && <Empty>No data yet.</Empty>}
          {pages.map((p) => <Row key={p.path} left={p.path} right={p._count._all} />)}
        </Panel>
        <Panel title="Top searches">
          {searches.length === 0 && <Empty>No searches yet.</Empty>}
          {searches.map((s) => (
            <Row key={s.path} left={decodeURIComponent((s.path ?? "").replace("/search?q=", "").split("&")[0].replace(/\+/g, " "))} right={s._count._all} />
          ))}
        </Panel>
        <Panel title="Most added to bag">
          {carts.length === 0 && <Empty>Nothing added yet.</Empty>}
          {carts.map((c) => <Row key={c.detail} left={c.detail} right={c._count._all} />)}
        </Panel>
        <Panel title="Sign-ins by method">
          {signins.length === 0 && <Empty>No sign-ins yet.</Empty>}
          {signins.map((s) => <Row key={s.detail} left={s.detail} right={s._count._all} />)}
        </Panel>
      </div>
    </div>
  );
}
