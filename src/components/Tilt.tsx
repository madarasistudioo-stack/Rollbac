"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/** Tilts towards the pointer in 3D, like picking a book up off the table. */
export function Tilt({ children, className, max = 10 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  function move(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * max}deg) rotateY(${x * max}deg) translateZ(12px)`;
  }

  function leave() {
    if (ref.current) ref.current.style.transform = "";
  }

  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className={cn("transition-transform duration-300 ease-out will-change-transform motion-reduce:!transform-none", className)}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
