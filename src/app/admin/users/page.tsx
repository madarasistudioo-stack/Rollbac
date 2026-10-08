import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin";
import { addUser, deleteUser, setUserBlocked } from "../actions";

export default async function UsersAdmin(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const q = searchParams.q?.trim();
  const users = await prisma.user.findMany({
    where: q
      ? { OR: [{ email: { contains: q, mode: "insensitive" } }, { name: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }] }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { accounts: { select: { provider: true } }, _count: { select: { orders: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-pine">Customers</h1>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <form className="flex gap-2">
          <input name="q" defaultValue={q} placeholder="Search name, email, phone" className="w-64 rounded-md border border-mist bg-cloud px-3 py-2 text-sm" />
          <button className="rounded-md border border-mist px-3 text-sm text-pine hover:border-olive">Search</button>
        </form>
        <form action={addUser} className="flex flex-wrap gap-2">
          <input name="name" placeholder="Name (optional)" className="w-40 rounded-md border border-mist bg-cloud px-3 py-2 text-sm" />
          <input name="email" type="email" required placeholder="Email" className="w-56 rounded-md border border-mist bg-cloud px-3 py-2 text-sm" />
          <button className="rounded-md bg-olive px-3 text-sm text-ivory">Add user</button>
        </form>
      </div>
      <p className="mt-2 text-xs text-pine/45">Added users sign in with Google using that same email.</p>

      <div className="mt-5 overflow-x-auto rounded-xl border border-mist bg-cloud">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-mist text-left text-xs uppercase tracking-wider text-pine/50">
            <tr><th className="px-4 py-3">User</th><th>Signs in with</th><th>Joined</th><th>Orders</th><th>Status</th><th className="px-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-mist">
            {users.map((u) => {
              const owner = isAdminEmail(u.email);
              return (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <p className="text-pine"><Link href={`/admin/users/${u.id}`} className="hover:text-olive hover:underline">{u.name ?? u.email ?? u.phone}</Link> {owner && <span className="ml-1 rounded bg-marigold/30 px-1.5 text-[10px] uppercase">Admin</span>}</p>
                    <p className="text-xs text-pine/50">{u.email ?? u.phone}{u.tags.length > 0 && ` · ${u.tags.join(", ")}`}</p>
                  </td>
                  <td className="text-pine/70">{u.accounts.map((a) => a.provider).join(", ") || (u.phone ? "phone" : "not yet")}</td>
                  <td className="text-pine/70">{u.createdAt.toLocaleDateString("en-IN")}</td>
                  <td className="text-pine/70">{u._count.orders}</td>
                  <td>{u.blocked ? <span className="text-rust">Blocked</span> : <span className="text-sage">Active</span>}</td>
                  <td className="px-4 py-3">
                    {!owner && (
                      <div className="flex items-center gap-3">
                        <form action={setUserBlocked}>
                          <input type="hidden" name="id" value={u.id} />
                          <input type="hidden" name="blocked" value={String(!u.blocked)} />
                          <button className="text-xs text-pine underline-offset-2 hover:underline">{u.blocked ? "Unblock" : "Block"}</button>
                        </form>
                        <form action={deleteUser} className="flex items-center gap-1.5">
                          <input type="hidden" name="id" value={u.id} />
                          <label className="flex items-center gap-1 text-[11px] text-pine/50">
                            <input type="checkbox" name="confirm" required className="accent-rust" /> sure
                          </label>
                          <button className="text-xs text-rust hover:underline">Delete</button>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {users.length === 0 && <p className="p-10 text-center text-sm text-pine/45">No users found.</p>}
      </div>
    </div>
  );
}
