"use client";

import { useEffect, useRef } from "react";

/**
 * Moves its child vertically as the element crosses the viewport.
 *
 * The child is scaled up slightly so the translation never exposes an edge.
 * `speed` is the fraction of the pass to travel; negative moves the other way.
 */
export default function Parallax({
  src,
  alt = "",
  speed = 0.12,
  className = ""
}: {
  src: string;
  alt?: string;
  speed?: number;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let queued = false;
    let frame = 0;
    const update = () => {
      queued = false;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
      const centre = rect.top + rect.height / 2;
      const offset = (centre - window.innerHeight / 2) / window.innerHeight;
      if (img.current) {
        img.current.style.transform = `translate3d(0, ${offset * speed * 100}%, 0) scale(1.18)`;
      }
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return (
    <div ref={wrap} className={`overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={img}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full scale-[1.18] object-cover will-change-transform"
      />
    </div>
  );
}
