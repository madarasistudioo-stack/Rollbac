"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Rises and un-tilts its children in 3D the first time they scroll into view. */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("reveal-3d", visible && "is-visible", className)} style={{ ["--reveal-delay" as string]: `${delay}ms` }}>
      {children}
    </div>
  );
}
