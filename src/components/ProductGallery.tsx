"use client";

import { useState } from "react";
import type { ArtKind, ColorOption } from "@/lib/products";
import type { IconName } from "@/components/Icons";
import { ProductArt } from "@/components/ProductArt";
import { TemplateSpread, type SpreadTheme } from "@/components/TemplateSpread";
import { cn } from "@/lib/utils";

type Slide = { key: string; label: string; render: () => React.JSX.Element };

/**
 * Product images as a 3D coverflow: the cover in the chosen colour first, then
 * inside-page spreads for books, then the other colour options.
 */
export function ProductGallery({
  art,
  icon,
  palette,
  colors,
  selected,
  title,
  subtitle,
  theme,
  showSpreads,
}: {
  art: ArtKind;
  icon: IconName;
  palette: string[];
  colors: ColorOption[];
  selected: ColorOption;
  title: string;
  subtitle: string;
  theme: SpreadTheme;
  showSpreads: boolean;
}) {
  const [index, setIndex] = useState(0);

  const cover = (c: ColorOption) => () => <ProductArt kind={art} icon={icon} color={c.hex} palette={palette} title={title} subtitle={subtitle} className="border-0" />;
  const spread = (v: number, sub: string) => () => (
    <div className="flex aspect-[4/5] items-center bg-[linear-gradient(165deg,var(--art-from),var(--art-to))] p-4">
      <TemplateSpread title={title} subtitle={sub} icon={icon} palette={palette} theme={theme} variant={v} className="w-full" />
    </div>
  );

  const slides: Slide[] = [
    { key: "cover", label: "Cover", render: cover(selected) },
    ...(showSpreads
      ? [
          { key: "s0", label: "Inside", render: spread(0, "Chapter one") },
          { key: "s1", label: "Inside", render: spread(1, "The little things") },
          { key: "s2", label: "Inside", render: spread(2, "Ever after") },
        ]
      : []),
    ...colors.filter((c) => c.hex !== selected.hex).map((c) => ({ key: c.hex, label: c.name, render: cover(c) })),
  ];
  const at = Math.min(index, slides.length - 1);

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-mist" style={{ perspective: "1400px" }}>
        {slides.map((s, i) => {
          const offset = i - at;
          return (
            <div
              key={s.key}
              aria-hidden={offset !== 0}
              className="absolute inset-0 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none"
              style={{
                transform: `translateX(${offset * 70}%) translateZ(${offset === 0 ? 0 : -260}px) rotateY(${offset === 0 ? 0 : offset > 0 ? -55 : 55}deg)`,
                opacity: Math.abs(offset) > 1 ? 0 : offset === 0 ? 1 : 0.5,
                zIndex: 10 - Math.abs(offset),
              }}
            >
              {s.render()}
            </div>
          );
        })}
        {slides.length > 1 && (
          <>
            <Arrow dir="prev" onClick={() => setIndex(Math.max(0, at - 1))} disabled={at === 0} />
            <Arrow dir="next" onClick={() => setIndex(Math.min(slides.length - 1, at + 1))} disabled={at === slides.length - 1} />
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {slides.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${s.label}`}
              className={cn("w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors", i === at ? "border-olive" : "border-transparent opacity-70 hover:opacity-100")}
            >
              <div className="pointer-events-none">{s.render()}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Arrow({ dir, onClick, disabled }: { dir: "prev" | "next"; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous image" : "Next image"}
      className={cn(
        "absolute top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-mist bg-cloud/90 text-pine shadow disabled:opacity-0",
        dir === "prev" ? "left-3" : "right-3"
      )}
    >
      {dir === "prev" ? "‹" : "›"}
    </button>
  );
}
