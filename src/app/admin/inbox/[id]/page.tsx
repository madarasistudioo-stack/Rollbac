import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { mailConfigured } from "@/lib/mailer";
import { replyTicket, setTicketStatus } from "../../actions";
import { cn } from "@/lib/utils";

export default async function TicketPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const t = await prisma.supportTicket.findUnique({ where: { id: params.id }, include: { messages: { orderBy: { createdAt: "asc" } } } });
  if (!t) notFound();
  const wa = t.phone ? `https://wa.me/${t.phone.replace(/\D/g, "").replace(/^(\d{10})$/, "91$1")}` : null;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/inbox" className="text-sm text-pine/50 hover:text-olive">← Inbox</Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-pine">{t.subject}</h1>
          <p className="text-sm text-pine/55">
            {t.userId ? <Link href={`/admin/users/${t.userId}`} className="text-olive hover:underline">{t.name}</Link> : t.name} · {t.email}
            {t.phone ? ` · ${t.phone}` : ""}{t.orderRef ? ` · order ${t.orderRef}` : ""}
          </p>
        </div>
        <form action={setTicketStatus} className="flex gap-2">
          <input type="hidden" name="id" value={t.id} />
          <select name="status" defaultValue={t.status} className="rounded border border-mist bg-cloud px-2 py-1 text-sm capitalize">
            {["open", "replied", "closed"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <button className="rounded-md border border-mist px-3 text-sm hover:border-olive">Set</button>
        </form>
      </div>

      <div className="mt-6 space-y-3">
        {t.messages.map((m) => (
          <div key={m.id} className={cn("max-w-[85%] rounded-xl p-4 text-sm", m.fromAdmin ? "ml-auto bg-olive text-ivory" : "border border-mist bg-cloud text-pine")}>
            <p className="whitespace-pre-wrap">{m.body}</p>
            <p className={cn("mt-2 text-[11px]", m.fromAdmin ? "text-ivory/60" : "text-pine/40")}>
              {m.fromAdmin ? "You" : t.name} · {m.createdAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>
        ))}
      </div>

      <form action={replyTicket} className="mt-6 space-y-2">
        <input type="hidden" name="id" value={t.id} />
        <textarea name="body" required rows={5} placeholder="Write a reply…" className="w-full rounded-xl border border-mist bg-cloud p-3 text-sm" />
        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-md bg-olive px-5 py-2 text-sm text-ivory">{mailConfigured() ? "Send reply by email" : "Save reply"}</button>
          {!mailConfigured() && <span className="text-xs text-pine/50">Email isn&apos;t set up yet — the reply is saved; send it via</span>}
          <a href={`mailto:${t.email}?subject=${encodeURIComponent(`Re: ${t.subject}`)}`} className="text-xs text-olive hover:underline">your email app</a>
          {wa && <a href={wa} target="_blank" rel="noreferrer" className="text-xs text-olive hover:underline">WhatsApp</a>}
        </div>
      </form>
    </div>
  );
}
