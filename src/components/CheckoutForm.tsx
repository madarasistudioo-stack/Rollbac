"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import QRCode from "qrcode";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/CartProvider";
import { cn, formatRupees } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type Methods = { upi: boolean; razorpay: boolean };
type UpiInfo = { id: string; name: string; amount: number };
type Stage = { kind: "form" } | { kind: "upi"; orderId: string; upi: UpiInfo } | { kind: "done"; orderId: string; paid: boolean };

export function CheckoutForm({ methods }: { methods: Methods }) {
  const { data: session } = useSession();
  const { items, subtotal, clear } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "Chennai", pincode: "" });
  const [method, setMethod] = useState<"upi" | "razorpay">(methods.upi ? "upi" : "razorpay");
  const [stage, setStage] = useState<Stage>({ kind: "form" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) setForm((f) => ({ ...f, name: f.name || session.user?.name || "", email: f.email || session.user?.email || "" }));
  }, [session]);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customer: form, method }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not place the order.");

      if (data.method === "upi") {
        clear();
        setStage({ kind: "upi", orderId: data.orderId, upi: data.upi });
        return;
      }
      new window.Razorpay({
        key: data.razorpay.keyId,
        amount: data.razorpay.amount,
        currency: "INR",
        order_id: data.razorpay.orderId,
        name: "Rollbac",
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#5C6B3E" },
        handler: async (r: { razorpay_payment_id: string; razorpay_signature: string }) => {
          const ok = await fetch(`/api/orders/${data.orderId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "razorpay", paymentId: r.razorpay_payment_id, signature: r.razorpay_signature }),
          });
          clear();
          setStage({ kind: "done", orderId: data.orderId, paid: ok.ok });
        },
      }).open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place the order.");
    } finally {
      setBusy(false);
    }
  }

  if (stage.kind === "upi") return <UpiPayment orderId={stage.orderId} upi={stage.upi} onDone={() => setStage({ kind: "done", orderId: stage.orderId, paid: false })} />;

  if (stage.kind === "done") {
    return (
      <div className="container-page max-w-lg py-24 text-center">
        <h1 className="font-display text-3xl text-pine">Thank you!</h1>
        <p className="mt-3 text-pine/65">
          Order <span className="text-pine">#{stage.orderId.slice(-8)}</span>{" "}
          {stage.paid ? "is paid and on its way to our printers." : "is placed. We'll confirm your payment and start on it shortly."}
        </p>
        <div className="mt-6 flex justify-center gap-4 text-sm">
          {session && <Link href="/account/orders" className="text-olive hover:underline">View my orders</Link>}
          <Link href="/shop" className="text-olive hover:underline">Keep browsing</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-2xl text-pine">Nothing to check out yet</h1>
        <Link href="/shop" className="mt-4 inline-block text-olive hover:underline">Browse the shop</Link>
      </div>
    );
  }

  const noMethod = !methods.upi && !methods.razorpay;
  return (
    <div className="container-page py-12">
      {methods.razorpay && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />}
      <h1 className="font-display text-3xl text-pine">Checkout</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={placeOrder} className="space-y-4">
          {!session && (
            <p className="rounded-md border border-mist bg-cloud/40 p-3 text-sm text-pine/60">
              <Link href="/auth/signin?callbackUrl=/checkout" className="text-olive hover:underline">Sign in</Link> to track this order later, or continue as a guest.
            </p>
          )}
          <Field label="Full name" value={form.name} onChange={update("name")} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" type="email" value={form.email} onChange={update("email")} />
            <Field label="Phone" type="tel" value={form.phone} onChange={update("phone")} />
          </div>
          <Field label="Delivery address" value={form.address} onChange={update("address")} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="City" value={form.city} onChange={update("city")} />
            <Field label="Pincode" value={form.pincode} onChange={update("pincode")} pattern="[0-9]{6}" />
          </div>

          {!noMethod && (
            <fieldset>
              <legend className="text-sm text-pine/60">Pay with</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {methods.upi && <Method active={method === "upi"} onClick={() => setMethod("upi")} title="UPI" note="GPay, PhonePe, Paytm, any UPI app" />}
                {methods.razorpay && <Method active={method === "razorpay"} onClick={() => setMethod("razorpay")} title="Card / Netbanking" note="Secured by Razorpay" />}
              </div>
            </fieldset>
          )}

          {error && <p className="text-sm text-rust">{error}</p>}
          <button
            type="submit"
            disabled={busy || noMethod}
            className="w-full rounded-md bg-olive px-5 py-3 text-sm font-medium text-ivory hover:opacity-90 disabled:opacity-50"
          >
            {noMethod ? "Payments are being set up" : busy ? "Placing order…" : `Place order · ${formatRupees(subtotal)}`}
          </button>
        </form>

        <div className="h-fit rounded-xl border border-mist bg-cloud/40 p-5">
          <h2 className="font-display text-lg text-pine">Order summary</h2>
          <div className="mt-4 space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between gap-3 text-sm">
                <span className="text-pine/70">
                  {item.name} × {item.quantity}
                  <span className="block text-xs text-pine/45">{[item.kind, item.size, item.pageCount].filter(Boolean).join(" · ")}</span>
                </span>
                <span className="text-pine">{formatRupees(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-mist pt-3 text-pine">
            <span>Total</span>
            <span>{formatRupees(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function UpiPayment({ orderId, upi, onDone }: { orderId: string; upi: UpiInfo; onDone: () => void }) {
  const link = `upi://pay?pa=${encodeURIComponent(upi.id)}&pn=${encodeURIComponent(upi.name)}&am=${upi.amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Order ${orderId.slice(-8)}`)}`;
  const [qr, setQr] = useState<string>("");
  const [utr, setUtr] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(link, { margin: 1, width: 260, color: { dark: "#3B4229", light: "#FFFFFF" } }).then(setQr);
  }, [link]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "upi", utr }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error ?? "Please check the reference.");
    onDone();
  }

  return (
    <div className="container-page max-w-md py-12 text-center">
      <h1 className="font-display text-2xl text-pine">Pay {formatRupees(upi.amount)} by UPI</h1>
      <p className="mt-2 text-sm text-pine/60">Order #{orderId.slice(-8)} is saved. Scan with any UPI app, or tap the button on your phone.</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {qr && <img src={qr} alt="UPI payment QR code" className="mx-auto mt-6 rounded-lg border border-mist" width={260} height={260} />}
      <p className="mt-2 text-xs text-pine/50">Paying to {upi.name} · {upi.id}</p>
      <a href={link} className="mt-4 inline-block rounded-md bg-olive px-5 py-3 text-sm font-medium text-ivory sm:hidden">Open UPI app</a>

      <form onSubmit={submit} className="mt-8 space-y-3 text-left">
        <label className="block text-sm text-pine/60">
          After paying, enter the UPI reference / UTR number from your app
          <input value={utr} onChange={(e) => setUtr(e.target.value)} required placeholder="e.g. 412345678901" className="mt-1 w-full rounded-md border border-mist bg-cloud px-3 py-2 text-sm" />
        </label>
        {error && <p className="text-sm text-rust">{error}</p>}
        <button className="w-full rounded-md bg-olive px-5 py-3 text-sm font-medium text-ivory">I've paid</button>
      </form>
    </div>
  );
}

function Method({ active, onClick, title, note }: { active: boolean; onClick: () => void; title: string; note: string }) {
  return (
    <button type="button" onClick={onClick} className={cn("rounded-md border p-3 text-left", active ? "border-olive bg-olive/10" : "border-mist hover:border-olive")}>
      <span className="block text-sm font-medium text-pine">{title}</span>
      <span className="block text-xs text-pine/50">{note}</span>
    </button>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm text-pine/60">
      {label}
      <input required {...props} className="mt-1 w-full rounded-md border border-mist bg-cloud px-3 py-2 text-sm text-pine focus:border-olive" />
    </label>
  );
}
