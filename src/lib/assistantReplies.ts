export type AssistantProductContext = { name: string; kind: string } | undefined;

type Rule = { pattern: RegExp; reply: string };

// Add or edit rules here any time — no API calls, no cost. Each pattern is
// checked in order against the shopper's message; the first match wins.
const RULES: Rule[] = [
  {
    pattern: /grandmother|grandma|paati|thatha|grandfather|birthday|anniversary/i,
    reply:
      'For a birthday or anniversary gift like that, the Mylapore Memories large photobook in Blush Terracotta is a lovely fit — roomy enough for decades of photos. A cover line to try: "For the person who taught this whole family how to celebrate."',
  },
  {
    pattern: /friend|moving|leaving|goodbye|farewell/i,
    reply:
      'Pondy Bazaar Postcards in Misty Grey works well as a goodbye gift — one photo, one line per page. A cover idea: "Wherever you land next, this city already misses you."',
  },
  {
    pattern: /coffee|kaapi|filter/i,
    reply:
      "Filter Kaapi Rituals, our undated daily planner, has a davara-and-tumbler footer on every page — a nice fit if mornings matter to them. Try it in Olive Grove.",
  },
  {
    pattern: /new year|resolution|habit|goal|journal/i,
    reply:
      'Kanjeevaram Threads, our gratitude journal, is built for exactly that — one small entry a day. Marigold suits a "start of the year" gift especially well.',
  },
  {
    pattern: /wedding|marriage|couple|engagement/i,
    reply:
      'Marina Mornings in Half White makes a lovely wedding-photo book — bright cover, plenty of room for a real love story. Opening line idea: "Every sunrise since has looked a little like this one."',
  },
  {
    pattern: /kid|child|baby|newborn|first birthday/i,
    reply:
      "Kolam Diaries, our mini photobook, is a sweet size for a child's first year or birthday — small enough for a gift bag, with a kolam-dot pattern debossed on the cover in Marigold.",
  },
  {
    pattern: /notebook|write|lined|dotted|sketch/i,
    reply:
      "If they just need somewhere to write, Kolam Grid (dot-grid) or Kacheri Notes (lined) both work well as everyday notebooks — Kolam Grid in Sage Leaf is our most popular combination.",
  },
];

const FALLBACK =
  "Tell me a bit more — who's it for, and what's the occasion? That'll help me point to the right book, cover colour, and a line to open with.";

export function craftReply(message: string, productContext?: AssistantProductContext): string {
  const rule = RULES.find((r) => r.pattern.test(message));
  const base = rule ? rule.reply : FALLBACK;

  if (rule && productContext) {
    return `${base} And since you're already looking at ${productContext.name}, that's worth considering too.`;
  }
  return base;
}
