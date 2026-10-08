import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// For account pages: returns the signed-in user's id, or sends them to sign in.
export async function requireUser(returnTo: string) {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!session || !id) redirect(`/auth/signin?callbackUrl=${encodeURIComponent(returnTo)}`);
  // A user blocked after signing in loses access on their next page load.
  const user = await prisma.user.findUnique({ where: { id }, select: { blocked: true } });
  if (!user || user.blocked) redirect("/api/auth/signout");
  return { id, session };
}
