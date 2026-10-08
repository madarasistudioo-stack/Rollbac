"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { craftReply } from "@/lib/assistantReplies";
import { RECIPIENTS, OCCASIONS, BUDGETS, FAQS, findGifts, describeGift } from "@/lib/giftFinder";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  href?: string;
  linkLabel?: string;
};

type ProductContext = { name: string; kind: string } | undefined;

type Step = "menu" | "recipient" | "occasion" | "budget" | "results" | "faq";

const INTRO =
  "Hi! I can help you find a gift, or answer questions about ordering and delivery. What would you like to do?";

export function AIAssistantWidget({
  variant = "floating",
  productContext,
}: {
  variant?: "floating" | "inline";
  productContext?: ProductContext;
}) {
  const [open, setOpen] = useState(variant === "inline");
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: INTRO }]);
  const [step, setStep] = useState<Step>("menu");
  const [recipient, setRecipient] = useState<string | null>(null);
  const [occasion, setOccasion] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  function advance(userLabel: string, nextStep: Step, buildReply: () => ChatMessage[]) {
    setMessages((prev) => [...prev, { role: "user", content: userLabel }]);
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, ...buildReply()]);
      setLoading(false);
      setStep(nextStep);
    }, 400);
  }

  function chooseMenu(choice: "gift" | "faq") {
    if (choice === "gift") {
      advance("Help me find a gift", "recipient", () => [{ role: "assistant", content: "Who's it for?" }]);
    } else {
      advance("Ordering & delivery questions", "faq", () => [
        { role: "assistant", content: "What would you like to know?" },
      ]);
    }
  }

  function chooseRecipient(id: string, label: string) {
    setRecipient(id);
    advance(label, "occasion", () => [{ role: "assistant", content: "What's the occasion?" }]);
  }

  function chooseOccasion(id: string, label: string) {
    setOccasion(id);
    advance(label, "budget", () => [{ role: "assistant", content: "And what's your budget?" }]);
  }

  function chooseBudget(id: string, label: string) {
    advance(label, "results", () => {
      const matches = recipient && occasion ? findGifts(recipient, occasion, id) : [];
      if (matches.length === 0) {
        return [
          {
            role: "assistant" as const,
            content: "Take a look at the full shop — nothing quite matched that combination.",
          },
        ];
      }
      return matches.map((p) => ({
        role: "assistant" as const,
        content: describeGift(p),
        href: `/product/${p.slug}`,
        linkLabel: `View ${p.name}`,
      }));
    });
  }

  function chooseFaq(id: string) {
    const faq = FAQS.find((f) => f.id === id);
    if (!faq) return;
    advance(faq.question, "faq", () => [{ role: "assistant", content: faq.answer }]);
  }

  function backToMenu() {
    setMessages((prev) => [...prev, { role: "assistant", content: "What else can I help with?" }]);
    setStep("menu");
  }

  function sendFreeText(text: string) {
    if (!text.trim() || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: craftReply(text, productContext) }]);
      setLoading(false);
      setStep("menu");
    }, 400);
  }

  const panel = (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-mist bg-cloud shadow-xl",
        variant === "floating" ? "h-[28rem] w-[22rem]" : "h-[26rem] w-full"
      )}
    >
      <div className="flex items-center justify-between border-b border-mist px-4 py-3">
        <div>
          <p className="font-display text-sm text-pine">Ask Rollbac!</p>
          <p className="text-xs text-pine/50">Personalisation ideas, on the spot</p>
        </div>
        {variant === "floating" && (
          <button
            onClick={() => setOpen(false)}
            aria-label="Close assistant"
            className="text-pine/50 hover:text-pine"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed",
              m.role === "assistant" ? "bg-ivory text-pine/90" : "ml-auto bg-olive text-ivory"
            )}
          >
            <p>{m.content}</p>
            {m.href && (
              <Link href={m.href} className="mt-1 inline-block text-xs font-medium text-olive underline">
                {m.linkLabel ?? "View product"}
              </Link>
            )}
          </div>
        ))}

        {loading && (
          <div className="max-w-[85%] rounded-lg bg-ivory px-3 py-2 text-sm text-pine/50">Thinking…</div>
        )}

        {!loading && step === "menu" && (
          <OptionRow>
            <OptionButton label="🎁 Help me find a gift" onClick={() => chooseMenu("gift")} />
            <OptionButton label="📦 Ordering & delivery questions" onClick={() => chooseMenu("faq")} />
          </OptionRow>
        )}

        {!loading && step === "recipient" && (
          <OptionRow>
            {RECIPIENTS.map((r) => (
              <OptionButton key={r.id} label={r.label} onClick={() => chooseRecipient(r.id, r.label)} />
            ))}
          </OptionRow>
        )}

        {!loading && step === "occasion" && (
          <OptionRow>
            {OCCASIONS.map((o) => (
              <OptionButton key={o.id} label={o.label} onClick={() => chooseOccasion(o.id, o.label)} />
            ))}
          </OptionRow>
        )}

        {!loading && step === "budget" && (
          <OptionRow>
            {BUDGETS.map((b) => (
              <OptionButton key={b.id} label={b.label} onClick={() => chooseBudget(b.id, b.label)} />
            ))}
          </OptionRow>
        )}

        {!loading && step === "results" && (
          <OptionRow>
            <OptionButton label="🔁 Find another gift" onClick={() => chooseMenu("gift")} />
            <OptionButton label="⬅ Back to main menu" onClick={backToMenu} />
          </OptionRow>
        )}

        {!loading && step === "faq" && (
          <OptionRow>
            {FAQS.map((f) => (
              <OptionButton key={f.id} label={f.question} onClick={() => chooseFaq(f.id)} />
            ))}
            <OptionButton label="⬅ Back to main menu" onClick={backToMenu} />
          </OptionRow>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendFreeText(input);
        }}
        className="flex items-center gap-2 border-t border-mist p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Or just type your own question…"
          className="w-full rounded-md border border-mist bg-ivory px-3 py-2 text-sm text-pine placeholder:text-pine/35 focus:border-olive"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-md bg-olive px-3 py-2 text-sm font-medium text-ivory transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );

  if (variant === "inline") return panel;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        panel
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-olive px-4 py-3 text-sm font-medium text-ivory shadow-lg transition-transform hover:scale-[1.03]"
        >
          <SparkIcon className="h-4 w-4" />
          Ask Rollbac!
        </button>
      )}
    </div>
  );
}

function OptionRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2 pt-1">{children}</div>;
}

function OptionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-mist px-3 py-2 text-left text-xs text-pine/70 hover:border-olive hover:text-pine"
    >
      {label}
    </button>
  );
}

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l1.8 5.6L19 9.4l-5.2 1.8L12 17l-1.8-5.8L5 9.4l5.2-1.8L12 2z" />
    </svg>
  );
}
