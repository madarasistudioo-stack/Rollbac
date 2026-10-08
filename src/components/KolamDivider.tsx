"use client";

import { cn } from "@/lib/utils";

/**
 * A horizontal line of kolam-style loops, generated as a single continuous
 * path. This is the one recurring signature motif used across the site —
 * everywhere else stays quiet so this keeps its meaning.
 */
export function KolamDivider({ className, animate = false }: { className?: string; animate?: boolean }) {
  const loops = 10;
  const width = 1000;
  const step = width / loops;

  let d = `M 0 20`;
  for (let i = 0; i < loops; i++) {
    const x0 = i * step;
    const x1 = x0 + step / 2;
    const x2 = x0 + step;
    d += ` C ${x0 + step * 0.15} 0, ${x1 - step * 0.15} 0, ${x1} 20`;
    d += ` C ${x1 + step * 0.15} 40, ${x2 - step * 0.15} 40, ${x2} 20`;
  }

  return (
    <svg
      viewBox={`0 0 ${width} 40`}
      preserveAspectRatio="none"
      className={cn("h-6 w-full text-olive/60", className)}
      aria-hidden="true"
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        pathLength={1}
        strokeDasharray={1}
        style={
          animate
            ? { animation: "draw-line 1.6s ease-out forwards" }
            : { strokeDashoffset: 0 }
        }
        className="motion-reduce:!animate-none"
      />
    </svg>
  );
}
