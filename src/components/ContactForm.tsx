"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { contact } from "@/lib/publicActions";

const input = "mt-1 w-full rounded-md border border-mist bg-cloud px-3 py-2 text-sm text-pine focus:border-olive";

export function ContactForm() {
  const [state, action] = useActionState(contact, null);
  if (state?.ok) return <p className="rounded-xl border border-mist bg-cloud p-6 text-pine">{state.message}</p>;
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-pine/60">Name<input name="name" required className={input} /></label>
        <label className="block text-sm text-pine/60">Email<input name="email" type="email" required className={input} /></label>
        <label className="block text-sm text-pine/60">Phone (optional)<input name="phone" type="tel" className={input} /></label>
        <label className="block text-sm text-pine/60">Order number (optional)<input name="order" className={input} /></label>
      </div>
      <label className="block text-sm text-pine/60">
        Subject
        <select name="subject" className={input}>
          <option>Question about my order</option>
          <option>Custom or bulk order</option>
          <option>Personalisation help</option>
          <option>Something else</option>
        </select>
      </label>
      <label className="block text-sm text-pine/60">Message<textarea name="message" required rows={5} className={input} /></label>
      {state && !state.ok && <p className="text-sm text-rust">{state.message}</p>}
      <Submit />
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="rounded-md bg-olive px-6 py-3 text-sm font-medium text-ivory hover:opacity-90 disabled:opacity-50">
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}
