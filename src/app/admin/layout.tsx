import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata = { title: "Admin — Rollbac", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="min-h-screen bg-ivory lg:grid lg:grid-cols-[220px_1fr]">
      <aside className="border-b border-mist bg-pine text-ivory lg:min-h-screen lg:border-b-0">
        <div className="flex items-center justify-between px-5 py-4 lg:block">
          <Link href="/admin" className="font-display text-lg">
            Rollbac <span className="text-marigold">Admin</span>
          </Link>
          <p className="hidden truncate text-xs text-ivory/50 lg:mt-1 lg:block">{session.user?.email}</p>
        </div>
        <AdminNav />
        <div className="hidden px-5 pb-6 pt-8 text-xs lg:block">
          <Link href="/" className="text-ivory/60 hover:text-ivory">
            ← View the shop
          </Link>
        </div>
      </aside>
      <main className="min-w-0 p-5 sm:p-8">{children}</main>
    </div>
  );
}
