"use client";

import { useEffect, useRef, useState } from "react";
import { KolamIcon } from "@/components/Icons";
import { uploadPhoto } from "@/lib/upload";
import { cn } from "@/lib/utils";

export type PhotoSlot = { url: string | null; status: "empty" | "uploading" | "ready" | "error" };

export type PhotoLayout = "grid" | "hero" | "strip";

const HERO_COLLECTIONS = ["Wedding", "Anniversary", "Us", "Our Story", "Engagement"];
const STRIP_COLLECTIONS = ["Goa", "First Trip", "Road Trips", "International Trips", "Honeymoon Destinations"];

export function layoutForCollection(collection?: string): PhotoLayout {
  if (collection && HERO_COLLECTIONS.includes(collection)) return "hero";
  if (collection && STRIP_COLLECTIONS.includes(collection)) return "strip";
  return "grid";
}

export function PhotoTemplatePicker({
  slotCount,
  label = "Fill in your photos",
  layout = "grid",
  onChange,
}: {
  slotCount: number;
  label?: string;
  layout?: PhotoLayout;
  onChange: (photos: PhotoSlot[]) => void;
}) {
  const [slots, setSlots] = useState<PhotoSlot[]>(
    Array.from({ length: slotCount }, () => ({ url: null, status: "empty" }))
  );

  // Changing size or pack changes how many photos fit — keep what's already added.
  useEffect(() => {
    setSlots((prev) => {
      if (prev.length === slotCount) return prev;
      const next = Array.from({ length: slotCount }, (_, i) => prev[i] ?? { url: null, status: "empty" as const });
      onChange(next);
      return next;
    });
  }, [slotCount, onChange]);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function updateSlot(index: number, patch: Partial<PhotoSlot>) {
    setSlots((prev) => {
      const next = prev.map((s, i) => (i === index ? { ...s, ...patch } : s));
      onChange(next);
      return next;
    });
  }

  function openFilePicker(index: number) {
    setActiveSlot(index);
    fileInputRef.current?.click();
  }

  async function handleFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const index = activeSlot;
    e.target.value = "";
    if (!file || index === null) return;

    const previewUrl = URL.createObjectURL(file);
    updateSlot(index, { url: previewUrl, status: "uploading" });

    try {
      updateSlot(index, { url: await uploadPhoto(file), status: "ready" });
    } catch (err) {
      console.error(err);
      updateSlot(index, { status: "error" });
    }
  }

  function removePhoto(index: number) {
    updateSlot(index, { url: null, status: "empty" });
  }

  function openGoogleDrive(index: number) {
    setActiveSlot(index);
    alert(
      "Google Drive isn't connected yet. This needs a Google Picker API credential — see the README for setup steps."
    );
  }

  function slotClass(index: number): string {
    if (slotCount === 1) return "col-span-2 aspect-[4/5]";
    if (layout === "hero" && index === 0) return "col-span-4 aspect-[16/9]";
    if (layout === "strip") return "aspect-[3/2] w-40 flex-none";
    return "aspect-square";
  }

  const containerClass =
    layout === "strip" ? "flex gap-2 overflow-x-auto pb-1" : "grid grid-cols-4 gap-2";

  return (
    <div>
      <p className="text-sm text-pine/60">
        {label}{" "}
        <span className="text-pine/40">
          ({slots.filter((s) => s.status === "ready").length} of {slotCount} added)
        </span>
      </p>

      <div className={cn("mt-3", containerClass)}>
        {slots.map((slot, i) => (
          <div
            key={i}
            className={cn("relative overflow-hidden rounded-md border border-mist bg-ivory", slotClass(i))}
          >
            {slot.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={slot.url}
                alt={`Personalisation photo ${i + 1}`}
                className={cn("h-full w-full object-cover", slot.status === "uploading" && "opacity-50")}
              />
            ) : (
              <button
                type="button"
                onClick={() => openFilePicker(i)}
                className="flex h-full w-full flex-col items-center justify-center gap-1 text-pine/30 hover:text-olive"
              >
                <KolamIcon className="h-6 w-6" />
                <span className="text-[10px]">Add photo</span>
              </button>
            )}

            {slot.status === "uploading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-ivory/60 text-[10px] text-pine/60">
                Uploading…
              </div>
            )}
            {slot.status === "error" && (
              <>
                <div className="absolute inset-0 flex items-center justify-center bg-rose/10 text-[10px] text-rose">
                  Failed — tap to retry
                </div>
                <button
                  type="button"
                  onClick={() => openFilePicker(i)}
                  className="absolute inset-0"
                  aria-label="Retry upload"
                />
              </>
            )}

            {slot.url && slot.status !== "uploading" && (
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ivory/90 text-xs text-pine shadow"
                aria-label="Remove photo"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <button
          type="button"
          onClick={() => openFilePicker(Math.max(slots.findIndex((s) => s.status === "empty"), 0))}
          className="rounded-md border border-mist px-3 py-1.5 text-pine/70 hover:border-olive hover:text-pine"
        >
          Upload from device
        </button>
        <button
          type="button"
          onClick={() => openGoogleDrive(Math.max(slots.findIndex((s) => s.status === "empty"), 0))}
          className="rounded-md border border-mist px-3 py-1.5 text-pine/70 hover:border-olive hover:text-pine"
        >
          Upload from Google Drive
        </button>
      </div>
      <p className="mt-1 text-[11px] text-pine/40">
        On iPhone or Mac, "Upload from device" already shows iCloud Photos and iCloud Drive — no separate button
        needed.
      </p>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChosen} />
    </div>
  );
}
