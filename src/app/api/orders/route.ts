import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLiveProducts } from "@/lib/catalog";
import { priceLines } from "@/lib/pricing";
import { sendMail } from "@/lib/mailer";
import { formatRupees } from "@/lib/utils";

const razorpayReady = () => Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

export async function POST(req: Request) {
  const { items, customer, method } = await req.json().catch(() => ({}));
  const c = customer ?? {};
  if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  if (![c.name, c.email, c.phone, c.address, c.city, c.pincode].every((v) => typeof v === "string" && v.trim())) {
    return NextResponse.json({ error: "Please fill in every delivery detail." }, { status: 400 });
  }
  const payWith = method === "razorpay" && razorpayReady() ? "razorpay" : "upi";
  if (payWith === "upi" && !process.env.UPI_ID) return NextResponse.json({ error: "Payments aren't set up yet." }, { status: 503 });

  const lines = priceLines(items, await getLiveProducts());
  if (typeof lines === "string") return NextResponse.json({ error: lines }, { status: 409 });
  const totalPaise = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0) * 100;

  const session = await getServerSession(authOptions);
  const order = await prisma.order.create({
    data: {
      userId: (session?.user as { id?: string } | undefined)?.id ?? null,
      items: lines.map(({ slug, name, kind, color, size, pageCount, photos, pages, captions, personalisation, quantity, unitPrice }) => ({
        slug, name, kind, color, size, pageCount, photos, pages, captions, personalisation, quantity, unitPrice,
      })),
      totalPaise,
      paymentMethod: payWith,
      customerName: c.name.trim(),
      email: c.email.trim().toLowerCase(),
      phone: c.phone.trim(),
      address: { line: c.address.trim(), city: c.city.trim(), pincode: c.pincode.trim() },
    },
  });

  if (payWith === "razorpay") {
    const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalPaise, currency: "INR", receipt: order.id }),
    });
    if (!res.ok) {
      console.error("Razorpay order failed:", await res.text());
      return NextResponse.json({ error: "Could not start card payment. Try UPI instead." }, { status: 502 });
    }
    const rp = await res.json();
    await prisma.order.update({ where: { id: order.id }, data: { razorpayOrderId: rp.id } });
    return NextResponse.json({ orderId: order.id, method: "razorpay", razorpay: { keyId: process.env.RAZORPAY_KEY_ID, orderId: rp.id, amount: totalPaise } });
  }

  await sendMail(
    order.email!,
    `Order #${order.id.slice(-8)} received — Rollbac`,
    `Hi ${order.customerName},\n\nThanks for your order of ${formatRupees(totalPaise / 100)}.\n\n` +
      lines.map((l) => `• ${l.quantity} × ${l.name} (${l.kind})`).join("\n") +
      `\n\nPay by UPI to ${process.env.UPI_ID} and we'll start on it as soon as the payment is confirmed.\n\nRollbac`
  );
  return NextResponse.json({
    orderId: order.id,
    method: "upi",
    upi: { id: process.env.UPI_ID, name: process.env.UPI_NAME ?? "Rollbac", amount: totalPaise / 100 },
  });
}
