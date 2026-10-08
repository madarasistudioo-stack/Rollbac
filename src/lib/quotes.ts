import type { Collection } from "@/lib/taxonomy";

const QUOTE_BANK: Partial<Record<Collection, string[]>> = {
  Birthday: ["Another year, same wonderful you.", "Here's to the ones who make birthdays feel like magic."],
  Anniversary: ["Still choosing you, every single year.", "To many more chapters, written together."],
  Us: ["Just the two of us, and everything in between.", "This is us — messy, happy, ours."],
  "Our Story": ["Every story needs a beginning. This one's ours."],
  Goa: ["Salt in the air, sand in our shoes, love in every frame."],
  "First Trip": ["The trip that started it all."],
};

const GENERIC_QUOTES = ["For the moments worth keeping.", "A little piece of us, bound in paper."];

export function getQuoteSuggestions(collection?: Collection): string[] {
  if (collection && QUOTE_BANK[collection]) return QUOTE_BANK[collection] as string[];
  return GENERIC_QUOTES;
}
