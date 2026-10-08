import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";

// After payment: the customer submits their UPI reference (verified by the
// admin), or Razorpay's signed response (verified here, marks the order paid).
export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const body = await req.json().catch(() => ({}));
  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order || order.status !== "created") return NextResponse.json({ error: "Order not found." }, { status: 404 });

  if (body.type === "upi") {
    const utr = String(body.utr ?? "").trim();
    if (!/^[A-Za-z0-9]{6,30}$/.test(utr)) return NextResponse.json({ error: "Enter the 12-digit UPI reference (UTR)." }, { status: 400 });
    await prisma.order.update({ where: { id: order.id }, data: { paymentRef: utr } });
    return NextResponse.json({ ok: true });
  }

  if (body.type === "razorpay") {
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ?? "")
      .update(`${order.razorpayOrderId}|${body.paymentId}`)
      .digest("hex");
    if (!order.razorpayOrderId || expected !== body.signature) return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 });
    await prisma.order.update({ where: { id: order.id }, data: { status: "paid", paymentRef: String(body.paymentId) } });
    if (order.email) await sendMail(order.email, `Payment received — order #${order.id.slice(-8)}`, `Hi ${order.customerName},\n\nWe've received your payment and will start printing soon.\n\nRollbac`);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown request." }, { status: 400 });
}
