import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Who may open /admin. Override with ADMIN_EMAILS="a@x.com,b@y.com" in Vercel.
export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "madarasistudioo@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email?: string | null) {
  return Boolean(email && ADMIN_EMAILS.includes(email.toLowerCase()));
}

// Every admin page and server action calls this — the middleware alone isn't trusted.
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) redirect("/auth/signin?callbackUrl=/admin");
  return session!;
}
