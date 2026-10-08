"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { subscribe } from "@/lib/publicActions";

export function NewsletterForm() {
  const [state, action] = useActionState(subscribe, null);
  if (state?.ok) return <p className="mt-3 text-sm text-olive">{state.message}</p>;
  return (
    <form action={action} className="mt-3">
      <div className="flex gap-2">
        <input type="email" name="email" required placeholder="you@email.com" className="w-full rounded-md border border-mist bg-ivory px-3 py-2 text-sm text-pine placeholder:text-pine/35 focus:border-olive" />
        <Submit />
      </div>
      {state && !state.ok && <p className="mt-1 text-xs text-rust">{state.message}</p>}
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="shrink-0 rounded-md bg-olive px-3 py-2 text-sm font-medium text-ivory hover:opacity-90 disabled:opacity-50">
      {pending ? "…" : "Join"}
    </button>
  );
}
