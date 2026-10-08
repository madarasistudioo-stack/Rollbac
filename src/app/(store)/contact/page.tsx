import { ContactForm } from "@/components/ContactForm";
import { FAQS } from "@/lib/giftFinder";

export const metadata = { title: "Contact us — Rollbac" };

export default function ContactPage() {
  return (
    <div className="container-page grid gap-12 py-12 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <h1 className="font-display text-4xl text-pine">Get in touch</h1>
        <p className="mt-2 text-pine/60">A question about an order, a custom idea, or a bulk gift? Write to us.</p>
        <div className="mt-8"><ContactForm /></div>
      </div>
      <div className="space-y-2">
        <h2 className="font-display text-xl text-pine">Quick answers</h2>
        {FAQS.map((f) => (
          <details key={f.id} className="rounded-lg border border-mist bg-cloud/60 px-4 py-3">
            <summary className="cursor-pointer text-sm text-pine">{f.question}</summary>
            <p className="mt-2 text-sm text-pine/65">{f.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
