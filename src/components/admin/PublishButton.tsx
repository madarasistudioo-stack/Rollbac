"use client";

import { useActionState } from "react";
import { publishSite } from "@/app/admin/actions";

export function PublishButton() {
  const [state, action, pending] = useActionState(async () => publishSite(), null);
  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      <button disabled={pending} className="rounded-md bg-olive px-4 py-2 text-sm font-medium text-ivory hover:opacity-90 disabled:opacity-50">
        {pending ? "Starting…" : "Publish to website"}
      </button>
      {state && <span className={state.ok ? "text-sm text-olive" : "text-sm text-rust"}>{state.message}</span>}
    </form>
  );
}
