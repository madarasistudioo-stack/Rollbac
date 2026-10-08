import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { SignOutButton } from "@/components/SignOutButton";

export const metadata = { title: "My account — Rollbac" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const { id } = await requireUser("/account");
  const user = await prisma.user.findUnique({
    where: { id },
    include: { accounts: { select: { provider: true } }, _count: { select: { orders: true } } },
  });

  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="font-display text-3xl text-pine">My account</h1>

      <section className="mt-8 flex items-center gap-5 rounded-xl border border-mist bg-cloud p-6">
        {user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt="" className="h-16 w-16 rounded-full border border-mist" referrerPolicy="no-referrer" />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-olive font-display text-2xl text-ivory">
            {(user?.name ?? user?.email ?? user?.phone ?? "?").charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <p className="font-display text-xl text-pine">{user?.name ?? "Welcome"}</p>
          {user?.email && <p className="truncate text-sm text-pine/60">{user.email}</p>}
          {user?.phone && <p className="text-sm text-pine/60">{user.phone}</p>}
          <p className="mt-1 text-xs text-pine/40">
            Signed in with {user?.accounts.map((a) => a.provider).join(", ") || (user?.phone ? "phone" : "email")}
          </p>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/account/orders" className="rounded-xl border border-mist bg-cloud p-5 hover:border-olive">
          <p className="font-display text-pine">My orders</p>
          <p className="mt-1 text-sm text-pine/55">{user?._count.orders ?? 0} so far</p>
        </Link>
        <Link href="/cart" className="rounded-xl border border-mist bg-cloud p-5 hover:border-olive">
          <p className="font-display text-pine">My bag</p>
          <p className="mt-1 text-sm text-pine/55">Pick up where you left off</p>
        </Link>
      </div>

      <div className="mt-10">
        <SignOutButton />
      </div>
    </div>
  );
}
