"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-md border border-mist px-5 py-2.5 text-sm text-rust transition-colors hover:border-rust"
    >
      Sign out
    </button>
  );
}
