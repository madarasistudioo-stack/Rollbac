import Link from "next/link";

export function Panel({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-mist bg-cloud">
      <div className="flex items-center justify-between border-b border-mist px-5 py-3">
        <h2 className="font-display text-pine">{title}</h2>
        {href && <Link href={href} className="text-xs text-olive hover:underline">See all</Link>}
      </div>
      <div className="divide-y divide-mist">{children}</div>
    </section>
  );
}

export function Row({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-2.5 text-sm">
      <span className="min-w-0 truncate text-pine/80">{left}</span>
      <span className="shrink-0 text-xs text-pine/50">{right}</span>
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="px-5 py-6 text-center text-sm text-pine/45">{children}</p>;
}
