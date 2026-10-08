"use client";


import { useState } from "react";
import { signIn } from "next-auth/react";
import { KolamIcon } from "@/components/Icons";

type PhoneStep = "enter-phone" | "enter-code";

export type EnabledProviders = { google: boolean; apple: boolean; email: boolean; phone: boolean };

export function SignInForm({ enabled, callbackUrl }: { enabled: EnabledProviders; callbackUrl: string }) {
  const oauth = enabled.google || enabled.apple;
  return (
    <div className="container-page flex justify-center py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <KolamIcon className="mx-auto h-9 w-9 text-olive" />
          <h1 className="mt-4 font-display text-2xl text-pine">Sign in to Rollbac</h1>
          <p className="mt-1 text-sm text-pine/55">Save your address, orders, and drafts.</p>
        </div>

        {oauth && (
          <div className="space-y-3">
            {enabled.google && <OAuthButton provider="google" label="Continue with Google" callbackUrl={callbackUrl} />}
            {enabled.apple && <OAuthButton provider="apple" label="Continue with Apple" callbackUrl={callbackUrl} />}
          </div>
        )}

        {oauth && enabled.email && <Divider />}
        {enabled.email && <EmailForm callbackUrl={callbackUrl} />}

        {(oauth || enabled.email) && enabled.phone && <Divider />}
        {enabled.phone && <PhoneForm callbackUrl={callbackUrl} />}

        {!oauth && !enabled.email && !enabled.phone && (
          <p className="rounded-md border border-mist bg-cloud p-4 text-center text-sm text-pine/65">
            Sign-in is being set up. You can still shop and check out as a guest.
          </p>
        )}
      </div>
    </div>
  );
}

function OAuthButton({ provider, label, callbackUrl }: { provider: string; label: string; callbackUrl: string }) {
  return (
    <button
      onClick={() => signIn(provider, { callbackUrl })}
      className="flex w-full items-center justify-center gap-2 rounded-md border border-mist bg-cloud px-4 py-3 text-sm font-medium text-pine transition-colors hover:border-olive"
    >
      {label}
    </button>
  );
}

function Divider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <span className="h-px flex-1 bg-mist" />
      <span className="text-xs text-pine/35">or</span>
      <span className="h-px flex-1 bg-mist" />
    </div>
  );
}

function EmailForm({ callbackUrl }: { callbackUrl: string }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await signIn("email", { email, redirect: false, callbackUrl });
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <p className="rounded-md border border-mist bg-cloud/40 p-3 text-center text-sm text-pine/70">
        Check {email} for a sign-in link.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-sm text-pine/60">
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="mt-1 w-full rounded-md border border-mist bg-cloud px-3 py-2 text-sm text-pine placeholder:text-pine/35 focus:border-olive"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-olive px-4 py-3 text-sm font-medium text-ivory transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Sending…" : "Send me a sign-in link"}
      </button>
    </form>
  );
}

function PhoneForm({ callbackUrl }: { callbackUrl: string }) {
  const [step, setStep] = useState<PhoneStep>("enter-phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/phone/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not send code.");
      setStep("enter-code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send code.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn("phone", { phone, code, redirect: false, callbackUrl });
    setLoading(false);
    if (result?.error) {
      setError("That code didn't match. Check it and try again.");
    } else {
      window.location.href = callbackUrl;
    }
  }

  if (step === "enter-code") {
    return (
      <form onSubmit={verifyCode} className="space-y-3">
        <label className="block text-sm text-pine/60">
          Enter the code sent to {phone}
          <input
            inputMode="numeric"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="6-digit code"
            className="mt-1 w-full rounded-md border border-mist bg-cloud px-3 py-2 text-sm text-pine placeholder:text-pine/35 focus:border-olive"
          />
        </label>
        {error && <p className="text-sm text-rust">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-olive px-4 py-3 text-sm font-medium text-ivory transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Verifying…" : "Verify and sign in"}
        </button>
        <button
          type="button"
          onClick={() => setStep("enter-phone")}
          className="w-full text-center text-xs text-pine/40 hover:text-pine"
        >
          Use a different number
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={sendCode} className="space-y-3">
      <label className="block text-sm text-pine/60">
        Phone number
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 98765 43210"
          className="mt-1 w-full rounded-md border border-mist bg-cloud px-3 py-2 text-sm text-pine placeholder:text-pine/35 focus:border-olive"
        />
      </label>
      {error && <p className="text-sm text-rust">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md border border-mist bg-cloud px-4 py-3 text-sm font-medium text-pine transition-colors hover:border-olive disabled:opacity-50"
      >
        {loading ? "Sending…" : "Continue with phone"}
      </button>
    </form>
  );
}
