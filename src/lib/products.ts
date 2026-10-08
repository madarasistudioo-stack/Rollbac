import type {
  Collection,
  Recipient,
  Occasion,
  Place,
  MemoryType,
  PersonalisationOption,
  Style,
  Theme,
} from "@/lib/taxonomy";
import type { IconName } from "@/components/Icons";

export type ColorOption = { name: string; hex: string };

export const BRAND_COLORS: ColorOption[] = [
  { name: "Olive Grove", hex: "#5C6B3E" },
  { name: "Marigold", hex: "#E2A93D" },
  { name: "Blush Terracotta", hex: "#D98B72" },
  { name: "Sage Leaf", hex: "#8FA876" },
  { name: "Half White", hex: "#F8F5EC" },
  { name: "Misty Grey", hex: "#DBD7C9" },
];

const EXTRA_COLORS = {
  kumkum: { name: "Kumkum Red", hex: "#A6553D" },
  peacock: { name: "Peacock Blue", hex: "#2F6F73" },
  indigo: { name: "Madras Indigo", hex: "#3E4C7A" },
  turmeric: { name: "Manjal Yellow", hex: "#E8C35A" },
  lotus: { name: "Lotus Pink", hex: "#E7A9A0" },
  pine: { name: "Deep Pine", hex: "#3B4229" },
} satisfies Record<string, ColorOption>;

const [OLIVE, MARIGOLD, TERRACOTTA, SAGE, HALF_WHITE, MISTY] = BRAND_COLORS;
const { kumkum: KUMKUM, peacock: PEACOCK, indigo: INDIGO, turmeric: TURMERIC, lotus: LOTUS, pine: PINE } = EXTRA_COLORS;

// ---------------------------------------------------------------------------
// Categories — what a thing *is* (a photobook, a frame, a mug). Each carries
// the options its product page offers, so a mug doesn't ask for page counts.
// ---------------------------------------------------------------------------

export type CategorySlug =
  | "photobooks"
  | "journals"
  | "planners"
  | "notebooks"
  | "calendars"
  | "frames"
  | "photo-prints"
  | "mugs"
  | "keepsakes";

export type ArtKind = "book" | "journal" | "planner" | "notebook" | "calendar" | "frame" | "prints" | "mug" | "magnets";

export type CategoryGroup = "Books & Paper" | "Photo Gifts";

export type OptionChoice = {
  id: string;
  label: string;
  dimensions: string;
  priceDelta: number;
  photoSlots?: number;
};

export type CategoryOptions = {
  sizeLabel: string;
  sizes: OptionChoice[];
  defaultSizeId: string;
  pages?: OptionChoice[];
  colorLabel: string;
  // Categories whose colour choice is a material (frame wood, mug handle) rather than the design's palette.
  colorOverride?: ColorOption[];
  photoSlots: number;
  photoLabel: string;
  textLabel: string;
  textPlaceholder: string;
  textMax: number;
};

export type Category = {
  slug: CategorySlug;
  name: string;
  singular: string;
  group: CategoryGroup;
  art: ArtKind;
  tagline: string;
  intro: string;
  highlights: string[];
  kind: string;
  price: number;
  compareAt?: number;
  options: CategoryOptions;
};

const BOOK_SIZES: OptionChoice[] = [
  { id: "small", label: "Small", dimensions: '6" × 6"', priceDelta: -300, photoSlots: 4 },
  { id: "medium", label: "Medium", dimensions: '8" × 5"', priceDelta: 0, photoSlots: 8 },
  { id: "large", label: "Large", dimensions: '11" × 6"', priceDelta: 400, photoSlots: 12 },
];

const PAPER_SIZES: OptionChoice[] = [
  { id: "a6", label: "Pocket", dimensions: "A6", priceDelta: -150 },
  { id: "a5", label: "Classic", dimensions: "A5", priceDelta: 0 },
  { id: "b5", label: "Desk", dimensions: "B5", priceDelta: 200 },
];

export const CATEGORIES: Category[] = [
  {
    slug: "photobooks",
    name: "Photobooks",
    singular: "Photobook",
    group: "Books & Paper",
    art: "book",
    tagline: "Every trip, wedding and ordinary Sunday — bound to be kept.",
    intro: "Hardbound photobooks you lay out yourself. Choose a design, drop in your photos, and add a dedication for the first page.",
    highlights: ["Layflat pages", "Pick size & page count", "Dedication on the first page"],
    kind: "Photobook",
    price: 1799,
    compareAt: 2099,
    options: {
      sizeLabel: "Size",
      sizes: BOOK_SIZES,
      defaultSizeId: "medium",
      pages: [
        { id: "30", label: "30 pages", dimensions: "", priceDelta: 0 },
        { id: "60", label: "60 pages", dimensions: "", priceDelta: 500 },
        { id: "90", label: "90 pages", dimensions: "", priceDelta: 1000 },
      ],
      colorLabel: "Cover",
      photoSlots: 8,
      photoLabel: "Fill in your photos",
      textLabel: "Cover dedication (optional)",
      textPlaceholder: "For Paati, with love",
      textMax: 60,
    },
  },
  {
    slug: "journals",
    name: "Journals",
    singular: "Journal",
    group: "Books & Paper",
    art: "journal",
    tagline: "Guided pages for gratitude, wellness and the thoughts in between.",
    intro: "Prompted journals with your name on the cover. Write a line a day or a page a week — they wait for you.",
    highlights: ["Guided prompts", "Your name on the cover", "Ribbon marker & elastic"],
    kind: "Guided Journal",
    price: 899,
    compareAt: 999,
    options: {
      sizeLabel: "Size",
      sizes: PAPER_SIZES,
      defaultSizeId: "a5",
      colorLabel: "Cover",
      photoSlots: 1,
      photoLabel: "Cover photo (optional)",
      textLabel: "Name on cover",
      textPlaceholder: "Meera's Journal",
      textMax: 32,
    },
  },
  {
    slug: "planners",
    name: "Planners",
    singular: "Planner",
    group: "Books & Paper",
    art: "planner",
    tagline: "Undated planners — start whenever, the first page is always today.",
    intro: "Daily and weekly planners with a small motif on every page. Undated, so no month is ever wasted.",
    highlights: ["Undated — start any day", "Monthly & weekly spreads", "Name on cover"],
    kind: "Undated Planner",
    price: 999,
    compareAt: 1199,
    options: {
      sizeLabel: "Size",
      sizes: PAPER_SIZES,
      defaultSizeId: "a5",
      colorLabel: "Cover",
      photoSlots: 1,
      photoLabel: "Cover photo (optional)",
      textLabel: "Name on cover",
      textPlaceholder: "Arun's 2027",
      textMax: 32,
    },
  },
  {
    slug: "notebooks",
    name: "Notebooks",
    singular: "Notebook",
    group: "Books & Paper",
    art: "notebook",
    tagline: "Dotted, lined or plain — pages that already feel like yours.",
    intro: "Everyday notebooks on thick, fountain-pen-friendly paper, with a title panel you fill in yourself.",
    highlights: ["Dotted, lined or plain", "Thick, pen-friendly paper", "Custom title panel"],
    kind: "Notebook",
    price: 699,
    compareAt: 799,
    options: {
      sizeLabel: "Size",
      sizes: PAPER_SIZES,
      defaultSizeId: "a5",
      colorLabel: "Cover",
      photoSlots: 0,
      photoLabel: "",
      textLabel: "Title on cover",
      textPlaceholder: "Raga Notes",
      textMax: 28,
    },
  },
  {
    slug: "calendars",
    name: "Calendars",
    singular: "Calendar",
    group: "Books & Paper",
    art: "calendar",
    tagline: "Twelve of your photos, one for every month of the year.",
    intro: "Desk and wall calendars built from your own photos, with festival dates marked the Madras way.",
    highlights: ["12 months, 12 photos", "Festival dates marked", "Desk or wall"],
    kind: "Photo Calendar",
    price: 799,
    compareAt: 899,
    options: {
      sizeLabel: "Style",
      sizes: [
        { id: "desk", label: "Desk", dimensions: '8" × 6" tent', priceDelta: 0 },
        { id: "wall", label: "Wall", dimensions: '12" × 12"', priceDelta: 300 },
      ],
      defaultSizeId: "desk",
      colorLabel: "Accent",
      photoSlots: 12,
      photoLabel: "One photo for each month",
      textLabel: "Calendar title",
      textPlaceholder: "The Iyer Family · 2027",
      textMax: 36,
    },
  },
  {
    slug: "frames",
    name: "Photo Frames",
    singular: "Frame",
    group: "Photo Gifts",
    art: "frame",
    tagline: "One photo, framed the way it deserves — for the wall or the desk.",
    intro: "Your photo printed and framed with an illustrated border from the design you pick. Choose the size and the wood.",
    highlights: ["Illustrated border", "Wall or desk sizes", "Teak, ebony or ivory finish"],
    kind: "Photo Frame",
    price: 699,
    compareAt: 849,
    options: {
      sizeLabel: "Frame size",
      sizes: [
        { id: "6x8", label: "Desk", dimensions: '6" × 8"', priceDelta: -200 },
        { id: "8x10", label: "Classic", dimensions: '8" × 10"', priceDelta: 0 },
        { id: "12x15", label: "Large", dimensions: '12" × 15"', priceDelta: 500 },
        { id: "16x20", label: "Statement", dimensions: '16" × 20"', priceDelta: 1100 },
      ],
      defaultSizeId: "8x10",
      colorLabel: "Frame finish",
      colorOverride: [
        { name: "Teak", hex: "#8A5A34" },
        { name: "Ebony", hex: "#2E2B26" },
        { name: "Ivory", hex: "#EFE9DA" },
      ],
      photoSlots: 1,
      photoLabel: "Your photo",
      textLabel: "Caption (optional)",
      textPlaceholder: "Marina, June 2019",
      textMax: 40,
    },
  },
  {
    slug: "photo-prints",
    name: "Photo Prints",
    singular: "Print Pack",
    group: "Photo Gifts",
    art: "prints",
    tagline: "Retro-bordered prints to pin, gift, or tuck into letters.",
    intro: "Packs of instant-style prints with a patterned border from your chosen design. Upload, crop, and we do the rest.",
    highlights: ["Instant-style borders", "Packs of 12, 24 or 36", "Matte finish"],
    kind: "Print Pack",
    price: 349,
    compareAt: 449,
    options: {
      sizeLabel: "Pack",
      sizes: [
        { id: "12", label: "12 prints", dimensions: '3.5" × 4.2"', priceDelta: 0, photoSlots: 12 },
        { id: "24", label: "24 prints", dimensions: '3.5" × 4.2"', priceDelta: 250, photoSlots: 24 },
        { id: "36", label: "36 prints", dimensions: '3.5" × 4.2"', priceDelta: 450, photoSlots: 36 },
      ],
      defaultSizeId: "12",
      colorLabel: "Border",
      photoSlots: 12,
      photoLabel: "Your prints",
      textLabel: "Caption on the sleeve (optional)",
      textPlaceholder: "Summer '24",
      textMax: 30,
    },
  },
  {
    slug: "mugs",
    name: "Mugs",
    singular: "Mug",
    group: "Photo Gifts",
    art: "mug",
    tagline: "For the filter kaapi, the chai, and the person who makes it.",
    intro: "Ceramic mugs wrapped in your chosen design, with room for a photo and a name.",
    highlights: ["Photo + name", "Dishwasher-safe print", "Two sizes"],
    kind: "Ceramic Mug",
    price: 449,
    compareAt: 549,
    options: {
      sizeLabel: "Size",
      sizes: [
        { id: "330", label: "Regular", dimensions: "330 ml", priceDelta: 0 },
        { id: "450", label: "Large", dimensions: "450 ml", priceDelta: 100 },
      ],
      defaultSizeId: "330",
      colorLabel: "Handle & inside",
      colorOverride: [
        { name: "Half White", hex: "#F8F5EC" },
        { name: "Olive Grove", hex: "#5C6B3E" },
        { name: "Marigold", hex: "#E2A93D" },
        { name: "Kumkum Red", hex: "#A6553D" },
      ],
      photoSlots: 2,
      photoLabel: "Photos for the wrap",
      textLabel: "Name or message",
      textPlaceholder: "World's best Appa",
      textMax: 24,
    },
  },
  {
    slug: "keepsakes",
    name: "Keepsakes",
    singular: "Magnet Set",
    group: "Photo Gifts",
    art: "magnets",
    tagline: "Small photo magnets for the fridge door that holds the family together.",
    intro: "Square photo magnets with a thin illustrated border. Order a set, mix your photos, stick them everywhere.",
    highlights: ["Sets of 4, 6 or 9", "Strong magnetic back", "Mix any photos"],
    kind: "Photo Magnet Set",
    price: 399,
    compareAt: 499,
    options: {
      sizeLabel: "Set",
      sizes: [
        { id: "4", label: "Set of 4", dimensions: '2.5" squares', priceDelta: 0, photoSlots: 4 },
        { id: "6", label: "Set of 6", dimensions: '2.5" squares', priceDelta: 150, photoSlots: 6 },
        { id: "9", label: "Set of 9", dimensions: '2.5" squares', priceDelta: 300, photoSlots: 9 },
      ],
      defaultSizeId: "4",
      colorLabel: "Border",
      photoSlots: 4,
      photoLabel: "Your magnets",
      textLabel: "Tiny caption (optional)",
      textPlaceholder: "Home",
      textMax: 16,
    },
  },
];

export const CATEGORY_GROUPS: CategoryGroup[] = ["Books & Paper", "Photo Gifts"];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryByName(name: string): Category | undefined {
  return CATEGORIES.find((c) => c.name.toLowerCase() === name.toLowerCase());
}

// ---------------------------------------------------------------------------
// Designs — the story a thing tells (Marina Mornings, Malli Poo). One design
// is offered across several categories, so a customer can match a photobook
// with a frame and a mug from the same collection.
// ---------------------------------------------------------------------------

type Offering = {
  slug?: string; // keeps the URL of products that existed before designs did
  kind?: string;
  price?: number;
  compareAt?: number | null;
  blurb?: string;
  description?: string;
};

type Design = {
  id: string;
  name: string;
  motif: IconName;
  palette: ColorOption[];
  blurb: string;
  story: string;
  primaryCollection?: Collection;
  themes: Theme[];
  occasions: Occasion[];
  places: Place[];
  memories: MemoryType[];
  recipients: Recipient[];
  style: Style[];
  personalisation: PersonalisationOption[];
  legacyOccasions: string[];
  legacyRecipients: string[];
  bestseller?: boolean;
  isNew?: boolean;
  offerings: Partial<Record<CategorySlug, Offering>>;
};

const DESIGNS: Design[] = [
  {
    id: "marina-mornings",
    name: "Marina Mornings",
    motif: "lighthouse",
    palette: [OLIVE, MARIGOLD, HALF_WHITE],
    blurb: "For the walks that started before the city woke up.",
    story: "Built around the hour when Marina still belongs to walkers, fishermen and the first light.",
    themes: ["Chennai Classics", "Everyday Rituals"],
    occasions: ["Birthday", "Anniversary", "Just Because"],
    places: ["Chennai", "Beaches", "Home"],
    memories: ["Everyday Moments", "Us", "Little Things"],
    recipients: ["Partner", "Parent", "Friend"],
    style: ["Minimal", "Emotional"],
    personalisation: ["Photo", "Message", "Date"],
    legacyOccasions: ["birthday", "anniversary", "justbecause"],
    legacyRecipients: ["partner", "parent", "friend", "myself"],
    bestseller: true,
    offerings: {
      photobooks: {
        slug: "marina-mornings",
        kind: "Medium Photobook",
        price: 1799,
        compareAt: 2099,
        description:
          "A 60-page layflat photobook sized for a shelf, not a drawer. Lay out your own frames against a Marina-dawn palette, add captions in your own hand-picked font, and pick a cover finish in olive or marigold.",
      },
      frames: {},
      mugs: {},
      calendars: {},
    },
  },
  {
    id: "mylapore-memories",
    name: "Mylapore Memories",
    motif: "bell",
    palette: [TERRACOTTA, OLIVE, MISTY],
    blurb: "A big book for a neighbourhood that never does anything small.",
    story: "From the temple tank at dawn to the last kutcheri of the season — room for the whole family story.",
    primaryCollection: "Our Story",
    themes: ["Chennai Classics", "Family & Generations"],
    occasions: ["Anniversary", "Birthday", "Housewarming"],
    places: ["Chennai", "South India", "Home"],
    memories: ["Family", "Generations", "Celebrations"],
    recipients: ["Parent", "Partner"],
    style: ["Premium", "Emotional"],
    personalisation: ["Photo", "Name", "Message"],
    legacyOccasions: ["anniversary", "birthday", "housewarming"],
    legacyRecipients: ["parent", "grandparent"],
    bestseller: true,
    offerings: {
      photobooks: {
        slug: "mylapore-memories",
        kind: "Large Photobook",
        price: 2299,
        compareAt: 2599,
        description:
          "100 pages, thick matte stock, and room for the whole story — from the temple tank at dawn to the last kutcheri of the season. Built for families who keep adding chapters.",
      },
      frames: {},
      calendars: {},
    },
  },
  {
    id: "kolam-diaries",
    name: "Kolam Diaries",
    motif: "kolam",
    palette: [MARIGOLD, HALF_WHITE, SAGE],
    blurb: "Small enough to slip into a festival gift bag.",
    story: "A kolam-dot pattern runs around every page — the threshold drawing that welcomes people in.",
    primaryCollection: "Birthday",
    themes: ["Festivals & Traditions", "Chennai Classics"],
    occasions: ["Birthday", "Festivals", "Just Because"],
    places: ["Chennai", "South India"],
    memories: ["Celebrations", "Little Things"],
    recipients: ["Friend", "Partner", "Child"],
    style: ["Artistic", "Fun"],
    personalisation: ["Photo", "Message"],
    legacyOccasions: ["birthday", "anniversary", "justbecause"],
    legacyRecipients: ["friend", "partner", "student"],
    offerings: {
      photobooks: {
        slug: "kolam-diaries",
        kind: "Mini Photobook",
        price: 1599,
        compareAt: 1799,
        description:
          "A pocket-sized photobook that reads like a keepsake. Twenty pages, a kolam-dot pattern debossed on the cover, and space for a short dedication on the first page.",
      },
      "photo-prints": {},
      keepsakes: {},
    },
  },
  {
    id: "pondy-bazaar-postcards",
    name: "Pondy Bazaar Postcards",
    motif: "auto",
    palette: [MISTY, TERRACOTTA, MARIGOLD],
    blurb: "Every trip has a Pondy Bazaar moment. Frame it.",
    story: "Postcard-style layouts — one photo, one line, one page — for errands, detours and auto rides.",
    primaryCollection: "First Trip",
    themes: ["Friends & College", "Chennai Classics"],
    occasions: ["Farewell", "Friendship", "Just Because"],
    places: ["Chennai", "Cities", "Road Trips"],
    memories: ["Friends", "Adventures", "College Days"],
    recipients: ["Friend", "Colleague"],
    style: ["Fun", "Artistic"],
    personalisation: ["Photo", "Message", "Location"],
    legacyOccasions: ["farewell", "justbecause"],
    legacyRecipients: ["friend", "colleague"],
    offerings: {
      photobooks: {
        slug: "pondy-bazaar-postcards",
        kind: "Mini Photobook",
        price: 1599,
        compareAt: null,
        description:
          "A travel-format mini photobook with postcard-style layouts — one photo, one line, one page. Good for a single trip or a whole year of Saturday errands.",
      },
      "photo-prints": {},
      keepsakes: {},
      mugs: {},
    },
  },
  {
    id: "filter-kaapi-rituals",
    name: "Filter Kaapi Rituals",
    motif: "davara",
    palette: [OLIVE, MARIGOLD],
    blurb: "Start whenever. The first page is always today.",
    story: "A davara-and-tumbler motif for the ritual that starts most Chennai days.",
    themes: ["Everyday Rituals", "Chennai Classics"],
    occasions: ["New Year", "Birthday", "Housewarming"],
    places: ["Chennai", "Home"],
    memories: ["Everyday Moments", "Little Things"],
    recipients: ["Friend", "Colleague", "Partner"],
    style: ["Minimal"],
    personalisation: ["Name", "Date"],
    legacyOccasions: ["newyear", "birthday", "housewarming"],
    legacyRecipients: ["friend", "colleague", "partner", "myself"],
    bestseller: true,
    offerings: {
      planners: {
        slug: "filter-kaapi-rituals",
        kind: "Undated Daily Planner",
        price: 999,
        compareAt: 1199,
        description:
          "An undated daily planner with a davara-and-tumbler motif running along the footer of every page. Monthly overviews, daily blocks, and a habit tracker sized for one small, good habit at a time.",
      },
      mugs: { blurb: "Decoction first, everything else after." },
      notebooks: {},
    },
  },
  {
    id: "kutcheri-season",
    name: "Kutcheri Season",
    motif: "veena",
    palette: [TERRACOTTA, HALF_WHITE],
    blurb: "For calendars that fill up every December.",
    story: "Built around the December music season — sabha names, timings, and the friends you meet there.",
    themes: ["Festivals & Traditions", "Chennai Classics"],
    occasions: ["New Year", "Birthday"],
    places: ["Chennai"],
    memories: ["Celebrations", "Friends"],
    recipients: ["Friend", "Colleague", "Parent"],
    style: ["Artistic", "Premium"],
    personalisation: ["Name", "Date"],
    legacyOccasions: ["newyear", "birthday"],
    legacyRecipients: ["friend", "colleague", "parent"],
    offerings: {
      planners: {
        slug: "kutcheri-season",
        kind: "Weekly Desk Planner",
        price: 1099,
        compareAt: null,
        description:
          "A desk planner built around the December music season — weekly spreads with room for sabha names, timings, and the friends you're meeting there.",
      },
      calendars: {},
    },
  },
  {
    id: "kanjeevaram-threads",
    name: "Kanjeevaram Threads",
    motif: "kolam",
    palette: [TERRACOTTA, MARIGOLD, KUMKUM],
    blurb: "A page a day, woven like a good silk border.",
    story: "Borders drawn from a Kanjeevaram weave — patient, bright, and built to last generations.",
    primaryCollection: "Anniversary",
    themes: ["Couples & Wedding", "Festivals & Traditions"],
    occasions: ["Wedding", "Anniversary", "New Year", "Graduation"],
    places: ["South India", "Chennai"],
    memories: ["Milestones", "Forever & Always"],
    recipients: ["Partner", "Wife", "Friend"],
    style: ["Premium", "Romantic"],
    personalisation: ["Name", "Message"],
    legacyOccasions: ["newyear", "birthday", "graduation"],
    legacyRecipients: ["friend", "partner", "myself", "student"],
    offerings: {
      journals: {
        slug: "kanjeevaram-threads",
        kind: "Gratitude Journal",
        price: 899,
        compareAt: 999,
        description:
          "A guided gratitude journal with prompts inspired by the patience of a Kanjeevaram weave — small, daily entries that add up to something you didn't notice being built.",
      },
      photobooks: { kind: "Wedding Photobook", price: 2299, compareAt: 2599 },
      frames: {},
    },
  },
  {
    id: "kapaleeshwarar-evenings",
    name: "Kapaleeshwarar Evenings",
    motif: "gopuram",
    palette: [OLIVE, MISTY],
    blurb: "For the walk around the tank, after the lamps are lit.",
    story: "Evening check-ins and a temple-lamp line drawing — how the day went, and what to carry into tomorrow.",
    themes: ["Everyday Rituals", "Chennai Classics"],
    occasions: ["Birthday", "New Year", "Just Because"],
    places: ["Chennai"],
    memories: ["Everyday Moments"],
    recipients: ["Friend", "Partner"],
    style: ["Minimal", "Emotional"],
    personalisation: ["Name"],
    legacyOccasions: ["birthday", "newyear", "justbecause"],
    legacyRecipients: ["myself", "friend", "partner"],
    offerings: {
      journals: {
        slug: "kapaleeshwarar-evenings",
        kind: "Wellness Journal",
        price: 899,
        compareAt: null,
        description:
          "A wellness journal with evening-check-in prompts — how the day went, what to let go of, what to carry into tomorrow. Cover debossed with a temple-lamp line drawing.",
      },
      frames: {},
    },
  },
  {
    id: "kolam-grid",
    name: "Kolam Grid",
    motif: "kolam",
    palette: [SAGE, OLIVE, HALF_WHITE],
    blurb: "Dots that already know how to become a pattern.",
    story: "A dot grid for planning, sketching, or actually drawing your own kolam.",
    themes: ["Everyday Rituals", "Festivals & Traditions"],
    occasions: ["Birthday", "Graduation", "Just Because"],
    places: ["Chennai"],
    memories: ["Little Things"],
    recipients: ["Friend", "Colleague", "Child"],
    style: ["Minimal", "Artistic"],
    personalisation: ["Name"],
    legacyOccasions: ["birthday", "graduation", "justbecause"],
    legacyRecipients: ["friend", "student", "colleague", "myself"],
    offerings: {
      notebooks: {
        slug: "kolam-grid",
        kind: "Dotted Notebook",
        price: 699,
        compareAt: 799,
        description:
          "A dot-grid notebook for planning, sketching, or actually drawing your own kolam. 120 pages of thick, fountain-pen-friendly paper.",
      },
    },
  },
  {
    id: "kacheri-notes",
    name: "Kacheri Notes",
    motif: "davara",
    palette: [MARIGOLD, TERRACOTTA],
    blurb: "For lyrics, ragas, and the odd grocery list.",
    story: "Sized for a concert programme in one pocket, with a brass-foil title panel.",
    themes: ["Festivals & Traditions", "Everyday Rituals"],
    occasions: ["Birthday", "Farewell"],
    places: ["Chennai"],
    memories: ["Little Things"],
    recipients: ["Colleague", "Friend"],
    style: ["Minimal"],
    personalisation: ["Name"],
    legacyOccasions: ["birthday", "farewell"],
    legacyRecipients: ["colleague", "friend", "myself"],
    offerings: {
      notebooks: {
        slug: "kacheri-notes",
        kind: "Lined Notebook",
        price: 699,
        compareAt: null,
        description:
          "A lined notebook sized for a concert programme in one pocket. Ribbon marker, elastic closure, and a brass-foil title panel you get to fill in yourself.",
      },
    },
  },
  // --- New designs --------------------------------------------------------
  {
    id: "malli-poo",
    name: "Malli Poo",
    motif: "jasmine",
    palette: [HALF_WHITE, LOTUS, OLIVE],
    blurb: "Soft, sweet, and gone too soon — like the best evenings together.",
    story: "A string of jasmine runs along every border, for the two of you and everything in between.",
    primaryCollection: "Us",
    themes: ["Couples & Wedding"],
    occasions: ["Anniversary", "Valentine's Day", "Engagement", "Birthday"],
    places: ["Our Favourite Places", "Honeymoon Destinations"],
    memories: ["Us", "First Love", "First Date", "Forever & Always"],
    recipients: ["Partner", "Wife", "Husband"],
    style: ["Romantic", "Emotional"],
    personalisation: ["Photo", "Name", "Message", "Date"],
    legacyOccasions: ["anniversary", "birthday", "justbecause"],
    legacyRecipients: ["partner"],
    bestseller: true,
    isNew: true,
    offerings: { photobooks: {}, frames: {}, mugs: {}, "photo-prints": {}, keepsakes: {}, journals: {} },
  },
  {
    id: "thali-thoranam",
    name: "Thali & Thoranam",
    motif: "ring",
    palette: [KUMKUM, MARIGOLD, HALF_WHITE],
    blurb: "Mango-leaf thoranams, nadaswaram, and the moment the thali is tied.",
    story: "A wedding design with a mango-leaf thoranam across the top of every page.",
    primaryCollection: "Anniversary",
    themes: ["Couples & Wedding", "Festivals & Traditions"],
    occasions: ["Wedding", "Engagement", "Anniversary"],
    places: ["South India", "Chennai"],
    memories: ["Milestones", "Us", "Celebrations", "Forever & Always"],
    recipients: ["Partner", "Wife", "Husband", "Parent"],
    style: ["Premium", "Romantic"],
    personalisation: ["Photo", "Name", "Date", "Message"],
    legacyOccasions: ["anniversary"],
    legacyRecipients: ["partner", "parent"],
    isNew: true,
    offerings: {
      photobooks: { kind: "Wedding Photobook", price: 2299, compareAt: 2599 },
      frames: {},
      calendars: {},
      keepsakes: {},
    },
  },
  {
    id: "thottil-days",
    name: "Thottil Days",
    motif: "cradle",
    palette: [SAGE, LOTUS, HALF_WHITE],
    blurb: "The first year goes by in a blink. Keep every month of it.",
    story: "Named for the cloth cradle swung by every grandmother — month-by-month pages for a first year.",
    themes: ["Baby & Early Years", "Family & Generations"],
    occasions: ["Baby & Newborn", "Baby Shower", "Birthday"],
    places: ["Home"],
    memories: ["Baby's First Year", "Milestones", "Family"],
    recipients: ["Parent", "Child"],
    style: ["Emotional", "Fun"],
    personalisation: ["Photo", "Name", "Date"],
    legacyOccasions: ["birthday", "housewarming"],
    legacyRecipients: ["parent", "grandparent"],
    isNew: true,
    offerings: {
      photobooks: { kind: "Baby's First Year Book" },
      calendars: {},
      frames: {},
      keepsakes: {},
      journals: { kind: "Baby Memory Journal" },
    },
  },
  {
    id: "thatha-paati",
    name: "Thatha Paati",
    motif: "family",
    palette: [OLIVE, TERRACOTTA, MISTY],
    blurb: "Their stories, in their words, with the photos you found in the almirah.",
    story: "For restoring old black-and-whites and writing down the stories before they're forgotten.",
    primaryCollection: "Our Story",
    themes: ["Family & Generations"],
    occasions: ["Birthday", "Anniversary", "Retirement", "Festivals"],
    places: ["Home", "South India"],
    memories: ["Generations", "Family", "Childhood"],
    recipients: ["Parent"],
    style: ["Emotional", "Premium"],
    personalisation: ["Photo", "Name", "Message"],
    legacyOccasions: ["anniversary", "birthday"],
    legacyRecipients: ["parent", "grandparent"],
    bestseller: true,
    offerings: { photobooks: { kind: "Large Photobook", price: 2299, compareAt: 2599 }, frames: {}, calendars: {}, mugs: {} },
  },
  {
    id: "ammas-kitchen",
    name: "Amma's Kitchen",
    motif: "pot",
    palette: [MARIGOLD, TERRACOTTA, HALF_WHITE],
    blurb: "Write it down before 'a pinch of this' is lost for good.",
    story: "A recipe journal with room for the measurements nobody ever wrote down.",
    themes: ["Family & Generations", "Everyday Rituals"],
    occasions: ["Mother's Day", "Housewarming", "Birthday"],
    places: ["Home"],
    memories: ["Family", "Generations", "Everyday Moments"],
    recipients: ["Parent"],
    style: ["Emotional", "Fun"],
    personalisation: ["Name", "Photo"],
    legacyOccasions: ["housewarming", "birthday"],
    legacyRecipients: ["parent", "grandparent"],
    isNew: true,
    offerings: { journals: { kind: "Recipe Journal", price: 999, compareAt: 1149 }, mugs: {}, notebooks: {} },
  },
  {
    id: "pongal-kolam",
    name: "Pongal Kolam",
    motif: "pot",
    palette: [TURMERIC, OLIVE, TERRACOTTA],
    blurb: "Sugarcane, a boiling pot, and a kolam big enough for the whole street.",
    story: "Harvest-festival colours for the photos of the year you'd like to remember all together.",
    themes: ["Festivals & Traditions", "Family & Generations"],
    occasions: ["Festivals", "New Year", "Thank You"],
    places: ["South India", "Home"],
    memories: ["Celebrations", "Family"],
    recipients: ["Parent", "Friend", "Colleague"],
    style: ["Fun", "Artistic"],
    personalisation: ["Photo", "Name", "Date"],
    legacyOccasions: ["newyear", "housewarming"],
    legacyRecipients: ["parent", "friend", "colleague"],
    offerings: { calendars: { blurb: "Twelve months, with every festival already marked." }, photobooks: {}, keepsakes: {}, mugs: {} },
  },
  {
    id: "goa-susegad",
    name: "Goa Susegad",
    motif: "palm",
    palette: [PEACOCK, MARIGOLD, HALF_WHITE],
    blurb: "Salt in the air, sand in our shoes, and nowhere to be.",
    story: "For the trip where nobody checked the time — palms, shacks and very long sunsets.",
    primaryCollection: "Goa",
    themes: ["Travel & Holidays", "Friends & College"],
    occasions: ["Friendship", "Birthday", "Just Because"],
    places: ["Goa", "Beaches", "India"],
    memories: ["Adventures", "Friends", "First Trip"],
    recipients: ["Friend", "Partner"],
    style: ["Fun"],
    personalisation: ["Photo", "Location", "Date"],
    legacyOccasions: ["justbecause", "farewell"],
    legacyRecipients: ["friend", "partner"],
    bestseller: true,
    offerings: { photobooks: {}, "photo-prints": {}, frames: {}, keepsakes: {} },
  },
  {
    id: "kerala-kayal",
    name: "Kerala Kayal",
    motif: "leaf",
    palette: [SAGE, OLIVE, HALF_WHITE],
    blurb: "Houseboats, banana chips, and green in every direction.",
    story: "Backwater greens and a slow-moving layout for trips that were never in a hurry.",
    primaryCollection: "First Trip",
    themes: ["Travel & Holidays", "Family & Generations"],
    occasions: ["Anniversary", "Just Because"],
    places: ["Kerala", "South India", "India"],
    memories: ["Adventures", "Family", "First Trip"],
    recipients: ["Partner", "Parent", "Friend"],
    style: ["Minimal", "Emotional"],
    personalisation: ["Photo", "Location", "Date"],
    legacyOccasions: ["anniversary", "justbecause"],
    legacyRecipients: ["partner", "parent", "friend"],
    isNew: true,
    offerings: { photobooks: {}, "photo-prints": {}, frames: {} },
  },
  {
    id: "ooty-mist",
    name: "Ooty Mist",
    motif: "hills",
    palette: [INDIGO, SAGE, MISTY],
    blurb: "Toy trains, tea estates and a sweater you didn't think you'd need.",
    story: "Layered hills and cool blues for mountain weekends — Ooty, Kodai, or further up.",
    primaryCollection: "First Trip",
    themes: ["Travel & Holidays"],
    occasions: ["Anniversary", "Friendship", "Just Because"],
    places: ["Mountains", "South India", "Road Trips", "Honeymoon Destinations"],
    memories: ["Adventures", "Us", "First Trip"],
    recipients: ["Partner", "Friend"],
    style: ["Minimal", "Romantic"],
    personalisation: ["Photo", "Location", "Date"],
    legacyOccasions: ["anniversary", "justbecause"],
    legacyRecipients: ["partner", "friend"],
    offerings: { photobooks: {}, "photo-prints": {}, calendars: {}, journals: { kind: "Travel Journal" } },
  },
  {
    id: "passport-pages",
    name: "Passport Pages",
    motif: "arch",
    palette: [INDIGO, TERRACOTTA, HALF_WHITE],
    blurb: "Stamps, boarding passes and the photo you took at every arch.",
    story: "A travel design with stamp-style captions for the international trips you still talk about.",
    primaryCollection: "First Trip",
    themes: ["Travel & Holidays"],
    occasions: ["Anniversary", "Graduation", "Just Because"],
    places: ["International Trips", "Europe", "Asia", "Honeymoon Destinations"],
    memories: ["Adventures", "First Trip", "Us"],
    recipients: ["Partner", "Friend"],
    style: ["Premium", "Artistic"],
    personalisation: ["Photo", "Location", "Date"],
    legacyOccasions: ["anniversary", "graduation", "justbecause"],
    legacyRecipients: ["partner", "friend"],
    offerings: { photobooks: { kind: "Large Photobook", price: 2299, compareAt: 2599 }, journals: { kind: "Travel Journal" }, "photo-prints": {} },
  },
  {
    id: "namma-gang",
    name: "Namma Gang",
    motif: "paperPlane",
    palette: [MARIGOLD, PEACOCK, HALF_WHITE],
    blurb: "Canteen tea, last benches, and a group chat that never sleeps.",
    story: "Loud colours for school and college friends — farewells, reunions, and everything in between.",
    themes: ["Friends & College"],
    occasions: ["Friendship", "Farewell", "Graduation", "Birthday"],
    places: ["Cities", "Our Favourite Places"],
    memories: ["Friends", "College Days", "School Days", "Best of Us"],
    recipients: ["Friend", "Colleague"],
    style: ["Fun"],
    personalisation: ["Photo", "Name", "Message"],
    legacyOccasions: ["farewell", "graduation", "birthday"],
    legacyRecipients: ["friend", "student", "colleague"],
    isNew: true,
    offerings: { photobooks: {}, "photo-prints": {}, mugs: {}, keepsakes: {}, notebooks: {} },
  },
  {
    id: "gruhapravesam",
    name: "Gruhapravesam",
    motif: "home",
    palette: [OLIVE, TURMERIC, HALF_WHITE],
    blurb: "A new threshold, a first kolam, and a pot of milk boiling over.",
    story: "For the first photos in a new home — and the people who helped carry the boxes.",
    themes: ["Family & Generations", "Festivals & Traditions"],
    occasions: ["Housewarming", "Thank You"],
    places: ["Home"],
    memories: ["Family", "Milestones"],
    recipients: ["Parent", "Friend", "Partner"],
    style: ["Minimal", "Emotional"],
    personalisation: ["Photo", "Name", "Date", "Location"],
    legacyOccasions: ["housewarming"],
    legacyRecipients: ["parent", "friend", "partner"],
    offerings: { frames: {}, photobooks: {}, keepsakes: {}, calendars: {} },
  },
];

// ---------------------------------------------------------------------------
// Products — one per (design, category) offering.
// ---------------------------------------------------------------------------

export type Product = {
  slug: string;
  name: string;
  designId: string;
  category: string; // display name, e.g. "Photobooks"
  categorySlug: CategorySlug;
  kind: string;
  price: number; // in rupees, for the default size
  compareAt?: number;
  blurb: string;
  description: string;
  colors: ColorOption[];
  icon: IconName;
  palette: ColorOption[];
  bestseller: boolean;
  isNew: boolean;
  // Legacy tags used by the guided gift finder (src/lib/giftFinder.ts).
  occasions: string[];
  recipients: string[];
  primaryCollection?: Collection;
  themes: Theme[];
  taxonomyRecipients: Recipient[];
  taxonomyOccasions: Occasion[];
  places: Place[];
  memoryTypes: MemoryType[];
  personalisation: PersonalisationOption[];
  style: Style[];
};

const SLUG_SUFFIX: Record<CategorySlug, string> = {
  photobooks: "photobook",
  journals: "journal",
  planners: "planner",
  notebooks: "notebook",
  calendars: "calendar",
  frames: "frame",
  "photo-prints": "prints",
  mugs: "mug",
  keepsakes: "magnets",
};

function describe(design: Design, category: Category): string {
  return `${design.story} ${category.intro}`;
}

function buildProducts(): Product[] {
  const list: Product[] = [];
  for (const category of CATEGORIES) {
    for (const design of DESIGNS) {
      const offering = design.offerings[category.slug];
      if (!offering) continue;

      const price = offering.price ?? category.price;
      const compareAt = offering.compareAt === null ? undefined : offering.compareAt ?? category.compareAt;

      list.push({
        slug: offering.slug ?? `${design.id}-${SLUG_SUFFIX[category.slug]}`,
        name: design.name,
        designId: design.id,
        category: category.name,
        categorySlug: category.slug,
        kind: offering.kind ?? category.kind,
        price,
        compareAt,
        blurb: offering.blurb ?? design.blurb,
        description: offering.description ?? describe(design, category),
        colors: category.options.colorOverride ?? design.palette,
        icon: design.motif,
        palette: design.palette,
        bestseller: Boolean(design.bestseller),
        isNew: Boolean(design.isNew),
        occasions: design.legacyOccasions,
        recipients: design.legacyRecipients,
        primaryCollection: design.primaryCollection,
        themes: design.themes,
        taxonomyRecipients: design.recipients,
        taxonomyOccasions: design.occasions,
        places: design.places,
        memoryTypes: design.memories,
        personalisation: design.personalisation,
        style: design.style,
      });
    }
  }
  return list;
}

export const products: Product[] = buildProducts();

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function productsInCategory(slug: CategorySlug) {
  return products.filter((p) => p.categorySlug === slug);
}

// Other products from the same design — "complete the set".
export function siblingsOf(product: Product) {
  return products.filter((p) => p.designId === product.designId && p.slug !== product.slug);
}

export const categories = CATEGORIES.map((c) => c.name);
