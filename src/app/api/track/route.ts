import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED = new Set(["pageview", "add_to_cart"]);

// Receives lightweight analytics beacons from the storefront (see Tracker.tsx).
export async function POST(req: Request) {
  try {
    const body = JSON.parse(await req.text());
    if (!ALLOWED.has(body.type)) return new NextResponse(null, { status: 204 });
    if (/bot|crawl|spider|preview/i.test(req.headers.get("user-agent") ?? "")) return new NextResponse(null, { status: 204 });

    const session = await getServerSession(authOptions);
    await prisma.event.create({
      data: {
        type: body.type,
        path: typeof body.path === "string" ? body.path.slice(0, 300) : null,
        detail: typeof body.detail === "string" ? body.detail.slice(0, 200) : null,
        userId: (session?.user as { id?: string } | undefined)?.id ?? null,
      },
    });
  } catch {
    // Analytics must never break the site.
  }
  return new NextResponse(null, { status: 204 });
}
