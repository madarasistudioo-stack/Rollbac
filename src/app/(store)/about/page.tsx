import { KolamDivider } from "@/components/KolamDivider";
import { GopuramIcon, DavaraIcon, BellIcon, AutoIcon } from "@/components/Icons";

const chapters = [
  {
    icon: GopuramIcon,
    title: "It started with a temple visit",
    copy: "Rollbac began as a photobook made for one Kapaleeshwarar Temple wedding — printed for a grandmother who wanted something to hold, not scroll through.",
  },
  {
    icon: DavaraIcon,
    title: "Then it became a habit",
    copy: "Friends asked for their own — a Marina Beach year, a Mylapore childhood, a filter-kaapi morning ritual. Each one meant designing covers and layouts that actually looked like home.",
  },
  {
    icon: AutoIcon,
    title: "Now it travels further than we do",
    copy: "Today, Rollbac ships across India and abroad — to Chennai families who moved away, and to anyone who wants their memories bound the way this city would do it.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-page py-16">
      <h1 className="max-w-xl font-display text-4xl leading-tight text-pine">
        We make books that smell a little like Madras.
      </h1>
      <p className="mt-4 max-w-lg text-pine/65">
        Not literally — but every cover, colour and page prompt is pulled from this city: its
        temples, its coffee, its music season, its patience for detail.
      </p>

      <div className="my-14">
        <KolamDivider />
      </div>

      <div className="space-y-14">
        {chapters.map(({ icon: Icon, title, copy }, i) => (
          <div key={title} className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-8">
            <Icon className="h-10 w-10 text-olive" />
            <div>
              <h2 className="font-display text-xl text-pine">{title}</h2>
              <p className="mt-2 max-w-lg text-pine/60">{copy}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="my-14">
        <KolamDivider />
      </div>

      <div className="rounded-xl border border-mist bg-cloud/40 p-8">
        <BellIcon className="h-8 w-8 text-olive" />
        <h2 className="mt-4 font-display text-xl text-pine">Made close to home</h2>
        <p className="mt-2 max-w-lg text-pine/60">
          Every book is designed and finished by a small team in Chennai. If you'd rather talk
          through a design with a person than an assistant, write to us — we read every note.
        </p>
      </div>
    </div>
  );
}
