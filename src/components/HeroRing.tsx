"use client";

import { Children, useEffect, useRef } from "react";

/**
 * A full 3D carousel ring. It turns slowly on its own, scrolling the page
 * spins it faster, and it can be dragged. Stays still for reduced motion.
 */
export function HeroRing({ children }: { children: React.ReactNode }) {
  const items = Children.toArray(children);
  const ringRef = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const boost = useRef(0);
  const drag = useRef<{ x: number; start: number } | null>(null);
  const step = 360 / items.length;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lastY = window.scrollY;
    let frame = 0;

    const onScroll = () => {
      boost.current += (window.scrollY - lastY) * 0.12;
      lastY = window.scrollY;
    };
    const tick = () => {
      if (!drag.current) angle.current -= (reduce ? 0 : 0.06) + boost.current;
      boost.current *= 0.9;
      if (ringRef.current) ringRef.current.style.transform = `translateZ(calc(var(--ring-r) * -1)) rotateY(${angle.current}deg)`;
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="relative mx-auto h-[300px] w-full touch-pan-y select-none sm:h-[380px] [--card-w:120px] [--ring-r:300px] sm:[--card-w:160px] sm:[--ring-r:520px]"
      style={{ perspective: "1600px", perspectiveOrigin: "50% 30%" }}
      onPointerDown={(e) => (drag.current = { x: e.clientX, start: angle.current })}
      onPointerMove={(e) => {
        if (drag.current) angle.current = drag.current.start + (e.clientX - drag.current.x) * 0.25;
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={() => (drag.current = null)}
    >
      <div ref={ringRef} className="absolute inset-0" style={{ transformStyle: "preserve-3d", transform: "translateZ(calc(var(--ring-r) * -1))" }}>
        {items.map((child, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 w-[var(--card-w)] -translate-x-1/2 -translate-y-1/2"
            style={{
              transform: `translate(-50%, -50%) rotateY(${i * step}deg) translateZ(var(--ring-r))`,
              backfaceVisibility: "hidden",
            }}
          >
            {child}
          </div>
        ))}
      </div>
      {/* reflection-like floor shadow */}
      <div className="pointer-events-none absolute inset-x-[15%] bottom-2 h-10 rounded-[50%] bg-pine/10 blur-2xl" />
    </div>
  );
}
