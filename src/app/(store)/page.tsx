import { Hero } from "@/components/Hero";
import Link from "next/link";
import { CategoryStrip } from "@/components/CategoryStrip";
import { ProductCard } from "@/components/ProductCard";
import { getLiveProducts } from "@/lib/catalog";
import type { Product } from "@/lib/products";
import { Reveal } from "@/components/Reveal";
import { TemplateCard } from "@/components/TemplateCard";
import { KolamDivider } from "@/components/KolamDivider";
import { AIAssistantWidget } from "@/components/AIAssistantWidget";
import { GopuramIcon, DavaraIcon, BellIcon, type IconName } from "@/components/Icons";
import { slugify } from "@/lib/utils";

const vignettes = [
  {
    icon: GopuramIcon,
    title: "Marina, before the crowds",
    copy: "The hour when the beach still belongs to walkers, fishermen, and the first light — our most-photographed page theme.",
  },
  {
    icon: DavaraIcon,
    title: "Filter kaapi, every morning",
    copy: "A davara-and-tumbler motif runs through our planners, for the ritual that starts most Chennai days.",
  },
  {
    icon: BellIcon,
    title: "December, kutcheri season",
    copy: "Sabha timings, encore requests, and the friends you only see this time of year — a page for all of it.",
  },
];

type Showcase = { label: string; caption: string; icon: IconName; accent: string };

const OCCASION_SHOWCASE: Showcase[] = [
  { label: "Birthday", caption: "Birthday photobook templates", icon: "gift", accent: "#E2A93D" },
  { label: "Anniversary", caption: "Anniversary keepsakes", icon: "heartPair", accent: "#A6553D" },
  { label: "Wedding", caption: "Wedding & engagement books", icon: "ring", accent: "#5C6B3E" },
  { label: "Housewarming", caption: "New home, new chapter", icon: "home", accent: "#8FA876" },
];

const PLACE_SHOWCASE: Showcase[] = [
  { label: "Chennai", caption: "Home-turf favourites", icon: "gopuram", accent: "#5C6B3E" },
  { label: "Goa", caption: "Sun, sand, and stories", icon: "wave", accent: "#E2A93D" },
  { label: "Kerala", caption: "Backwaters & greenery", icon: "leaf", accent: "#8FA876" },
  { label: "Europe", caption: "International trip albums", icon: "arch", accent: "#A6553D" },
];

const MEMORY_SHOWCASE: Showcase[] = [
  { label: "Us", caption: "For the two of you", icon: "heartPair", accent: "#A6553D" },
  { label: "Family", caption: "Generations, together", icon: "family", accent: "#5C6B3E" },
  { label: "First Trip", caption: "The one that started it all", icon: "suitcase", accent: "#E2A93D" },
  { label: "Childhood", caption: "Playful, easy, unforgettable", icon: "paperPlane", accent: "#8FA876" },
];


export default async function HomePage() {
  const products = await getLiveProducts();
  return (
    <>
      <Hero products={products} />

      <section className="container-page py-8">
        <h2 className="mb-5 font-display text-2xl text-pine">Popular products</h2>
        <Reveal>
          <CategoryStrip />
        </Reveal>
      </section>

      <section className="container-page py-10">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl text-pine">Bestsellers</h2>
          <Link href="/shop" className="text-sm text-olive hover:underline">Shop all designs</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.filter((p) => p.bestseller).slice(0, 8).map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 90}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      <ShowcaseSection title="Shop by occasion" type="occasion" items={OCCASION_SHOWCASE} products={products} />
      <ShowcaseSection title="Shop by place" type="place" items={PLACE_SHOWCASE} products={products} />
      <ShowcaseSection title="Shop by memory" type="memory" items={MEMORY_SHOWCASE} products={products} />

      <section className="container-page py-6">
        <KolamDivider animate />
      </section>

      <Reveal>
      <section className="container-page grid gap-8 py-14 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <h2 className="font-display text-2xl text-pine">Ask Rollbac!</h2>
          <p className="mt-3 max-w-sm text-pine/65">
            Not sure which book fits, or what to write inside the cover? Describe who it's for and
            the assistant will suggest a product, a colour, and a line to open with — right here,
            before you add anything to your bag.
          </p>
        </div>
        <AIAssistantWidget variant="inline" />
      </section>
      </Reveal>

      <Reveal>
      <section className="container-page py-14">
        <h2 className="font-display text-2xl text-pine">Written into every page</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {vignettes.map(({ icon: Icon, title, copy }) => (
            <div key={title}>
              <Icon className="h-8 w-8 text-olive" />
              <h3 className="mt-4 font-display text-lg text-pine">{title}</h3>
              <p className="mt-2 text-sm text-pine/60">{copy}</p>
            </div>
          ))}
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section className="container-page py-14">
        <KolamDivider />
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <Testimonial
            quote="Made a book of my parents' wedding photos, restored and reprinted. My mother keeps it on the coffee table, not the shelf."
            author="Priya R., Adyar"
          />
          <Testimonial
            quote="The planner's little coffee-tumbler icon at the bottom of every page is such a small thing, but it made it feel made for me."
            author="Arun K., Besant Nagar"
          />
        </div>
      </section>
      </Reveal>
    </>
  );
}

function ShowcaseSection({
  title,
  type,
  items,
  products,
}: {
  title: string;
  type: "occasion" | "place" | "memory";
  items: Showcase[];
  products: Product[];
}) {
  // Colour each template with a real design from that collection.
  const paletteFor = (label: string, accent: string) => {
    const match = products.find((p) =>
      type === "occasion" ? p.taxonomyOccasions.includes(label as never) : type === "place" ? p.places.includes(label as never) : p.memoryTypes.includes(label as never)
    );
    return match ? match.palette.map((c) => c.hex) : [accent, "#E2A93D", "#8FA876"];
  };
  return (
    <section className="container-page py-10">
      <Reveal>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl text-pine">{title}</h2>
          <Link href={`/collections/${type}/${slugify(items[0].label)}`} className="text-sm text-olive hover:underline">
            See all
          </Link>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal key={item.label} delay={i * 90}>
            <TemplateCard
              label={item.label}
              caption={item.caption}
              icon={item.icon}
              palette={paletteFor(item.label, item.accent)}
              theme={type}
              variant={i}
              href={`/collections/${type}/${slugify(item.label)}`}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Testimonial({ quote, author }: { quote: string; author: string }) {
  return (
    <blockquote className="rounded-xl border border-mist bg-cloud/40 p-6">
      <p className="text-pine/80">"{quote}"</p>
      <footer className="mt-4 text-sm text-pine/45">{author}</footer>
    </blockquote>
  );
}
