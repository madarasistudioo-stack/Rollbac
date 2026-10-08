import { products, type Product } from "@/lib/products";
import { formatRupees } from "@/lib/utils";

export type Option = { id: string; label: string };

export const RECIPIENTS: Option[] = [
  { id: "partner", label: "My partner" },
  { id: "parent", label: "A parent" },
  { id: "grandparent", label: "A grandparent" },
  { id: "friend", label: "A friend" },
  { id: "colleague", label: "A colleague" },
  { id: "myself", label: "Myself" },
  { id: "student", label: "A student / child" },
];

export const OCCASIONS: Option[] = [
  { id: "birthday", label: "Birthday" },
  { id: "anniversary", label: "Anniversary or wedding" },
  { id: "farewell", label: "Farewell or moving away" },
  { id: "newyear", label: "New year" },
  { id: "housewarming", label: "Housewarming / family" },
  { id: "graduation", label: "Graduation" },
  { id: "justbecause", label: "Just because" },
];

export type BudgetOption = Option & { min: number; max: number };

export const BUDGETS: BudgetOption[] = [
  { id: "low", label: "Under ₹800", min: 0, max: 799 },
  { id: "mid", label: "₹800 – ₹1,500", min: 800, max: 1500 },
  { id: "high", label: "₹1,500 – ₹2,500", min: 1501, max: 2500 },
];

export function findGifts(recipientId: string, occasionId: string, budgetId: string): Product[] {
  const budget = BUDGETS.find((b) => b.id === budgetId);
  const inBudget = budget
    ? products.filter((p) => p.price >= budget.min && p.price <= budget.max)
    : products;

  const pool = inBudget.length > 0 ? inBudget : products;

  const scored = pool.map((p) => {
    const recipientMatch = p.recipients.includes(recipientId) ? 1 : 0;
    const occasionMatch = p.occasions.includes(occasionId) ? 1 : 0;
    return { product: p, score: recipientMatch + occasionMatch };
  });

  const withMatches = scored.filter((s) => s.score > 0);
  const ranked = (withMatches.length > 0 ? withMatches : scored).sort(
    (a, b) => b.score - a.score || a.product.price - b.product.price
  );

  return ranked.slice(0, 3).map((s) => s.product);
}

export function describeGift(p: Product): string {
  const colors = p.colors.map((c) => c.name).join(", ");
  return `${p.name} — ${p.kind}, ${formatRupees(p.price)}. ${p.blurb} Cover options: ${colors}.`;
}

export type Faq = { id: string; question: string; answer: string };

export const FAQS: Faq[] = [
  {
    id: "timing",
    question: "How long will my order take?",
    answer:
      "Most personalised orders are printed and dispatched within 3–5 business days, then delivered in another 3–7 business days depending on your city.",
  },
  {
    id: "personalise",
    question: "What can I personalise?",
    answer:
      "Every product lets you choose a cover colour, and most let you add a short dedication or caption. Open any product page to see its exact options.",
  },
  {
    id: "cancel",
    question: "Can I cancel or change my order?",
    answer:
      "You can change or cancel an order any time before we start printing. Once production has begun, changes usually aren't possible since each piece is made specifically for you.",
  },
  {
    id: "shipping",
    question: "Do you ship outside Chennai?",
    answer: "Yes — we ship across India. Just add your delivery address at checkout.",
  },
  {
    id: "damaged",
    question: "What if my order arrives damaged?",
    answer: "Reach out to us with a photo of the damaged item and your order number, and we'll sort it out.",
  },
];
