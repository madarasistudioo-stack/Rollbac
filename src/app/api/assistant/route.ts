import { NextResponse } from "next/server";
import { products } from "@/lib/products";

// Keep this in sync with whatever Claude model you want to power the
// assistant with — see https://docs.claude.com for the current lineup.
// Haiku keeps a shopping-assistant chat fast and inexpensive; swap in
// "claude-sonnet-5" if you want noticeably more nuanced suggestions.
const MODEL = "claude-haiku-4-5-20251001";

const CATALOG_SUMMARY = products
  .map(
    (p) =>
      `- ${p.name} (${p.kind}, ${p.category}) — ₹${p.price}. ${p.blurb} Cover colors: ${p.colors
        .map((c) => c.name)
        .join(", ")}.`
  )
  .join("\n");

const SYSTEM_PROMPT = `You are the Rollbac ordering assistant, embedded on a shop that sells \
personalised, Madras/Chennai-themed photobooks, journals, planners and notebooks.

Your job is to help a shopper decide, in this order: (1) which product fits their occasion, \
(2) which cover colour or finish suits it, and (3) a short, specific personalisation idea \
(a caption, a dedication line, or a page theme) grounded in Chennai life — Marina Beach, \
Mylapore, filter kaapi, kutcheri season, kolams — without leaning on tired cliches.

Only recommend products from this catalog:
${CATALOG_SUMMARY}

Keep replies short — two or three sentences, plus a specific recommendation. Ask at most one \
clarifying question if the request is too open-ended to answer well (e.g. no occasion or \
recipient mentioned). Never invent products, prices, or shipping details that aren't given to you.`;

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The assistant isn't configured yet. Add ANTHROPIC_API_KEY in your environment." },
      { status: 503 }
    );
  }

  const { messages, productContext } = await req.json();
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages is required." }, { status: 400 });
  }

  const contextNote = productContext
    ? `\n\nThe shopper is currently looking at: ${productContext.name} (${productContext.kind}).`
    : "";

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        system: SYSTEM_PROMPT + contextNote,
        messages: messages.map((m: { role: "user" | "assistant"; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Anthropic API error:", detail);
      return NextResponse.json({ error: "The assistant is unavailable right now." }, { status: 502 });
    }

    const data = await res.json();
    const text = data.content
      ?.filter((block: { type: string }) => block.type === "text")
      .map((block: { text: string }) => block.text)
      .join("\n") ?? "";

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "The assistant is unavailable right now." }, { status: 502 });
  }
}
