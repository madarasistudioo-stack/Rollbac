export const COLLECTIONS = ["Birthday", "Anniversary", "Us", "Our Story", "Goa", "First Trip"] as const;
export type Collection = (typeof COLLECTIONS)[number];

export const RECIPIENTS = ["Partner", "Wife", "Husband", "Friend", "Parent", "Child", "Colleague"] as const;
export type Recipient = (typeof RECIPIENTS)[number];

export const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Engagement",
  "Valentine's Day",
  "Mother's Day",
  "Father's Day",
  "Friendship",
  "Graduation",
  "Baby & Newborn",
  "Baby Shower",
  "Housewarming",
  "Farewell",
  "Retirement",
  "Festivals",
  "Christmas",
  "New Year",
  "Thank You",
  "Just Because",
  "Corporate & Work",
] as const;
export type Occasion = (typeof OCCASIONS)[number];

export const PLACES = [
  "India",
  "South India",
  "North India",
  "Chennai",
  "Bengaluru",
  "Mumbai",
  "Delhi",
  "Kerala",
  "Goa",
  "Rajasthan",
  "Mountains",
  "Beaches",
  "Cities",
  "Road Trips",
  "International Trips",
  "Europe",
  "Asia",
  "Honeymoon Destinations",
  "Our Favourite Places",
  "Home",
] as const;
export type Place = (typeof PLACES)[number];

export const MEMORIES = [
  "Us",
  "Family",
  "Friends",
  "Childhood",
  "School Days",
  "College Days",
  "First Love",
  "Our Story",
  "First Date",
  "First Trip",
  "Adventures",
  "Everyday Moments",
  "Little Things",
  "Milestones",
  "Baby's First Year",
  "Generations",
  "Pet Memories",
  "Celebrations",
  "Forever & Always",
  "Best of Us",
] as const;
export type Memory = (typeof MEMORIES)[number];

export const MEMORY_TYPES = MEMORIES;
export type MemoryType = Memory;

// Broad browsing themes shown as quick-filter chips at the top of every
// category page — the first thing a shopper narrows by.
export const THEMES = [
  "Chennai Classics",
  "Couples & Wedding",
  "Family & Generations",
  "Baby & Early Years",
  "Travel & Holidays",
  "Festivals & Traditions",
  "Friends & College",
  "Everyday Rituals",
] as const;
export type Theme = (typeof THEMES)[number];

export type PriceRange ={ id: string; label: string; min: number; max: number };

export const PRICE_RANGES: PriceRange[] = [
  { id: "under-500", label: "Under ₹500", min: 0, max: 499 },
  { id: "500-1000", label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { id: "1000-2000", label: "₹1,000 – ₹2,000", min: 1001, max: 2000 },
  { id: "2000-plus", label: "₹2,000+", min: 2001, max: Number.POSITIVE_INFINITY },
];

export const PERSONALISATION_OPTIONS = ["Name", "Photo", "Message", "Date", "Location"] as const;
export type PersonalisationOption = (typeof PERSONALISATION_OPTIONS)[number];

export const STYLES = ["Romantic", "Minimal", "Premium", "Emotional", "Fun", "Artistic"] as const;
export type Style = (typeof STYLES)[number];

export function getPriceRange(price: number): PriceRange | undefined {
  return PRICE_RANGES.find((r) => price >= r.min && price <= r.max);
}

export type SizeOption = { id: string; label: string; dimensions: string; priceDelta: number };

export const SIZES: SizeOption[] = [
  { id: "small", label: "Small", dimensions: '6" × 6"', priceDelta: -300 },
  { id: "medium", label: "Medium", dimensions: '8" × 5"', priceDelta: 0 },
  { id: "large", label: "Large", dimensions: '11" × 6"', priceDelta: 400 },
];

export type PageCountOption = { id: string; label: string; pages: number; priceDelta: number };

export const PAGE_COUNTS: PageCountOption[] = [
  { id: "30", label: "30 pages", pages: 30, priceDelta: 0 },
  { id: "60", label: "60 pages", pages: 60, priceDelta: 500 },
  { id: "90", label: "90 pages", pages: 90, priceDelta: 1000 },
];
