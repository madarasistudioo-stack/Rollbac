import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata = { title: "Checkout — Rollbac" };
export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <CheckoutForm
      methods={{
        upi: Boolean(process.env.UPI_ID),
        razorpay: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
      }}
    />
  );
}
