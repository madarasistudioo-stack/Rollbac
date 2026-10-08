"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COVER_LAYOUT, CALENDAR_LAYOUT, MONTHS, PAGE_LAYOUTS, type Box } from "@/lib/bookLayouts";
import { uploadPhoto } from "@/lib/upload";
import { cn } from "@/lib/utils";

type Slot = { url: string; status: "uploading" | "ready" | "error" };
export type BookContent = {
  pages: { page: number; slot: number; url: string }[];
  captions: { page: number; text: string }[];
  uploading: boolean;
};

type Props = {
  mode: "photobook" | "calendar";
  pageCount: number; // inside pages, excluding the cover
  title: string;
  coverColor: string;
  accent: string;
  onChange: (content: BookContent) => void;
};

/**
 * A page-by-page editor shown as an open book. Every page has its own photo
 * boxes — click one to upload straight into it — and pages turn in 3D.
 * Page 0 is the cover; spreads after it pair pages (1,2), (3,4)…
 */
export function BookEditor({ mode, pageCount, title, coverColor, accent, onChange }: Props) {
  const [slots, setSlots] = useState<Record<string, Slot>>({});
  const [captions, setCaptions] = useState<Record<number, string>>({});
  const [spread, setSpread] = useState(0);
  const [turn, setTurn] = useState<{ dir: "next" | "prev"; to: number; run: boolean } | null>(null);
  const target = useRef<{ page: number; slot: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const spreadCount = Math.ceil(pageCount / 2) + 1;
  const layoutOf = (page: number): Box[] =>
    page === 0 ? COVER_LAYOUT : mode === "calendar" ? CALENDAR_LAYOUT : PAGE_LAYOUTS[(page - 1) % PAGE_LAYOUTS.length];
  const pagesOf = (s: number): [number | null, number | null] => (s === 0 ? [null, 0] : [2 * s - 1, 2 * s <= pageCount ? 2 * s : null]);

  const totalBoxes = useMemo(() => {
    let n = COVER_LAYOUT.length;
    for (let p = 1; p <= pageCount; p++) n += layoutOf(p).length;
    return n;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageCount, mode]);
  const filled = Object.entries(slots).filter(([k, s]) => s.status === "ready" && Number(k.split("-")[0]) <= pageCount).length;

  // Keep the parent's copy in sync (drops photos on pages removed by a smaller page count).
  useEffect(() => {
    onChange({
      pages: Object.entries(slots)
        .filter(([, s]) => s.status === "ready")
        .map(([k, s]) => ({ page: Number(k.split("-")[0]), slot: Number(k.split("-")[1]), url: s.url }))
        .filter((p) => p.page <= pageCount)
        .sort((a, b) => a.page - b.page || a.slot - b.slot),
      captions: Object.entries(captions)
        .filter(([p, t]) => t.trim() && Number(p) <= pageCount)
        .map(([p, text]) => ({ page: Number(p), text })),
      uploading: Object.values(slots).some((s) => s.status === "uploading"),
    });
  }, [slots, captions, pageCount, onChange]);

  useEffect(() => {
    if (spread >= spreadCount) setSpread(spreadCount - 1);
  }, [spread, spreadCount]);

  function pick(page: number, slot: number) {
    target.current = { page, slot };
    fileRef.current?.click();
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    const t = target.current;
    if (!file || !t) return;
    const key = `${t.page}-${t.slot}`;
    setSlots((s) => ({ ...s, [key]: { url: URL.createObjectURL(file), status: "uploading" } }));
    try {
      const url = await uploadPhoto(file);
      setSlots((s) => ({ ...s, [key]: { url, status: "ready" } }));
    } catch {
      setSlots((s) => ({ ...s, [key]: { ...s[key], status: "error" } }));
    }
  }

  function remove(page: number, slot: number) {
    setSlots((s) => {
      const next = { ...s };
      delete next[`${page}-${slot}`];
      return next;
    });
  }

  function go(to: number) {
    if (turn || to < 0 || to >= spreadCount || to === spread) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setSpread(to);
    setTurn({ dir: to > spread ? "next" : "prev", to, run: false });
    requestAnimationFrame(() => requestAnimationFrame(() => setTurn((t) => (t ? { ...t, run: true } : t))));
    setTimeout(() => {
      setSpread(to);
      setTurn(null);
    }, 820);
  }

  const page = (p: number | null, interactive: boolean) =>
    p === null ? (
      <BlankPage />
    ) : (
      <PageView
        page={p}
        mode={mode}
        boxes={layoutOf(p)}
        slots={slots}
        caption={captions[p] ?? ""}
        title={title}
        coverColor={coverColor}
        accent={accent}
        interactive={interactive}
        onPick={pick}
        onRemove={remove}
        onCaption={(text) => setCaptions((c) => ({ ...c, [p]: text }))}
      />
    );

  const [curL, curR] = pagesOf(spread);
  const [toL, toR] = turn ? pagesOf(turn.to) : [null, null];
  // Under the turning leaf we already show the destination's far page.
  const baseL = turn?.dir === "prev" ? toL : curL;
  const baseR = turn?.dir === "next" ? toR : curR;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-pine/60">
          {spread === 0 ? "Cover" : `Pages ${curL}${curR ? `–${curR}` : ""}`} of {pageCount} ·{" "}
          <span className="text-pine">
            {filled} of {totalBoxes} photo boxes filled
          </span>
        </p>
        <p className="text-xs text-pine/45">Tap any box to add a photo. Captions are optional.</p>
      </div>

      <div className="relative mx-auto mt-4 max-w-4xl" style={{ perspective: "2200px" }}>
        <div className="relative grid aspect-[8/5] grid-cols-2 rounded-lg shadow-[0_40px_60px_-30px_rgba(0,0,0,0.45)]" style={{ transform: "rotateX(6deg)", transformStyle: "preserve-3d" }}>
          <div className="relative overflow-hidden rounded-l-lg">{spread === 0 && !turn ? <DeskSpace /> : page(baseL, !turn)}</div>
          <div className="relative overflow-hidden rounded-r-lg">{page(baseR, !turn)}</div>
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-10 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.12),transparent)]" />

          {turn && (
            <div
              className={cn("page-leaf pointer-events-none absolute inset-y-0 w-1/2", turn.dir === "next" ? "left-1/2" : "from-left left-0")}
              style={{ transform: turn.run ? `rotateY(${turn.dir === "next" ? -180 : 180}deg)` : "rotateY(0deg)" }}
            >
              <div className="page-face overflow-hidden">{page(turn.dir === "next" ? curR : curL, false)}</div>
              <div className="page-face overflow-hidden" style={{ transform: "rotateY(180deg)" }}>
                {page(turn.dir === "next" ? toL : toR, false)}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => go(spread - 1)}
          disabled={spread === 0}
          aria-label="Previous pages"
          className="absolute -left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-mist bg-cloud text-pine shadow disabled:opacity-30 sm:-left-5"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => go(spread + 1)}
          disabled={spread === spreadCount - 1}
          aria-label="Next pages"
          className="absolute -right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-mist bg-cloud text-pine shadow disabled:opacity-30 sm:-right-5"
        >
          ›
        </button>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: spreadCount }).map((_, s) => {
          const [l, r] = pagesOf(s);
          const pagesHere = [l, r].filter((p): p is number => p !== null);
          const boxes = pagesHere.reduce((n, p) => n + layoutOf(p).length, 0);
          const done = pagesHere.reduce((n, p) => n + layoutOf(p).filter((_, i) => slots[`${p}-${i}`]?.status === "ready").length, 0);
          return (
            <button
              key={s}
              type="button"
              onClick={() => go(s)}
              className={cn(
                "shrink-0 rounded-md border px-3 py-1.5 text-xs",
                s === spread ? "border-olive bg-olive text-ivory" : done === boxes ? "border-sage text-pine" : "border-mist text-pine/60 hover:border-olive"
              )}
            >
              {s === 0 ? "Cover" : mode === "calendar" ? pagesHere.map((p) => MONTHS[p - 1]?.split(" · ")[1]?.slice(0, 3)).join("–") : pagesHere.join("–")}
              <span className="ml-1 opacity-60">
                {done}/{boxes}
              </span>
            </button>
          );
        })}
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
    </div>
  );
}

function PageView({
  page,
  mode,
  boxes,
  slots,
  caption,
  title,
  coverColor,
  accent,
  interactive,
  onPick,
  onRemove,
  onCaption,
}: {
  page: number;
  mode: "photobook" | "calendar";
  boxes: Box[];
  slots: Record<string, Slot>;
  caption: string;
  title: string;
  coverColor: string;
  accent: string;
  interactive: boolean;
  onPick: (page: number, slot: number) => void;
  onRemove: (page: number, slot: number) => void;
  onCaption: (text: string) => void;
}) {
  const cover = page === 0;
  return (
    <div className="absolute inset-0" style={{ background: cover ? coverColor : "#FFFDF7" }}>
      {!cover && <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`, backgroundSize: "14px 14px" }} />}
      {boxes.map((b, i) => {
        const slot = slots[`${page}-${i}`];
        return (
          <div
            key={i}
            className={cn(
              "absolute overflow-hidden rounded-[3px]",
              slot ? "" : "border border-dashed",
              cover ? "border-white/60 bg-white/15" : "border-[#B9B4A4] bg-[#F1EDE2]"
            )}
            style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}
          >
            {slot ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slot.url} alt="" className={cn("h-full w-full object-cover", slot.status === "uploading" && "opacity-50")} />
                {slot.status === "uploading" && <span className="absolute inset-0 flex items-center justify-center text-[10px] text-[#3B4229]">Uploading…</span>}
                {slot.status === "error" && (
                  <button type="button" onClick={() => onPick(page, i)} className="absolute inset-0 bg-white/70 text-[10px] text-[#A6553D]">
                    Failed — tap to retry
                  </button>
                )}
                {interactive && slot.status !== "uploading" && (
                  <div className="absolute right-1 top-1 flex gap-1">
                    <button type="button" onClick={() => onPick(page, i)} className="rounded bg-white/90 px-1.5 text-[10px] text-[#3B4229] shadow">
                      Change
                    </button>
                    <button type="button" onClick={() => onRemove(page, i)} aria-label="Remove photo" className="rounded bg-white/90 px-1.5 text-[10px] text-[#3B4229] shadow">
                      ✕
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                type="button"
                disabled={!interactive}
                onClick={() => onPick(page, i)}
                className={cn("flex h-full w-full flex-col items-center justify-center gap-0.5 text-[10px] sm:text-xs", cover ? "text-white/85" : "text-[#8A8676] hover:text-[#5C6B3E]")}
              >
                <span className="text-lg leading-none sm:text-2xl">+</span>
                <span className="hidden sm:block">Add photo</span>
              </button>
            )}
          </div>
        );
      })}

      {cover && (
        <div className="absolute inset-x-[10%] bottom-[12%] text-center" style={{ color: luminance(coverColor) > 0.36 ? "#3B4229" : "#F8F5EC" }}>
          <p className="font-display text-sm leading-tight sm:text-2xl">{title}</p>
          <p className="mt-1 text-[8px] uppercase tracking-[0.3em] opacity-70 sm:text-[10px]">Rollbac</p>
        </div>
      )}

      {!cover && mode === "calendar" && <MonthGrid page={page} accent={accent} />}

      {!cover && mode === "photobook" && (
        <div className="absolute inset-x-[9%] bottom-[5%]">
          {interactive ? (
            <input
              value={caption}
              onChange={(e) => onCaption(e.target.value.slice(0, 80))}
              placeholder="Add a caption…"
              className="w-full border-b border-transparent bg-transparent text-center font-display text-[10px] text-[#3B4229] placeholder:text-[#B9B4A4] focus:border-[#B9B4A4] focus:outline-none sm:text-sm"
            />
          ) : (
            <p className="text-center font-display text-[10px] text-[#3B4229] sm:text-sm">{caption}</p>
          )}
        </div>
      )}

      {!cover && <span className="absolute bottom-[1.5%] left-1/2 -translate-x-1/2 text-[8px] text-[#B9B4A4]">{page}</span>}
    </div>
  );
}

function MonthGrid({ page, accent }: { page: number; accent: string }) {
  return (
    <div className="absolute inset-x-[7%] bottom-[6%] top-[62%]">
      <p className="text-center font-display text-[9px] text-[#3B4229] sm:text-sm">{MONTHS[page - 1]}</p>
      <div className="mt-1 grid grid-cols-7 gap-[2px]">
        {Array.from({ length: 28 }).map((_, i) => (
          <span key={i} className="h-1.5 rounded-[1px] sm:h-3" style={{ background: i === 9 ? accent : "#ECE8DC" }} />
        ))}
      </div>
    </div>
  );
}

function BlankPage() {
  return <div className="absolute inset-0 bg-[#FFFDF7]" />;
}

// Left of the cover: the desk the closed book is lying on.
function DeskSpace() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(165deg,var(--art-from),var(--art-to))] p-6 text-center">
      <p className="max-w-[12rem] text-xs text-pine/50 sm:text-sm">Start with the cover, then turn the page to fill the inside.</p>
    </div>
  );
}

function luminance(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
