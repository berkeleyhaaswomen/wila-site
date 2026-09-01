"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Column-flow gallery with a lightbox.
 *
 * CSS columns rather than a measured masonry: the browser balances the
 * heights, so there is no layout pass to run and nothing to recalculate on
 * resize. Each tile fades up the first time it appears.
 *
 * The lightbox traps focus loosely (Escape closes, arrows move) and restores
 * scroll on exit.
 */
export default function Gallery({ photos }: { photos: string[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpen((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  // Reveal tiles as they arrive rather than all at once on mount.
  useEffect(() => {
    const root = gridRef.current;
    if (!root) return;
    const tiles = Array.from(root.querySelectorAll<HTMLElement>("[data-tile]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tiles.forEach((t) => t.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    tiles.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [photos]);

  return (
    <>
      <div
        ref={gridRef}
        className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4"
      >
        {photos.map((src, i) => (
          <button
            key={src}
            data-tile
            onClick={() => setOpen(i)}
            style={{ transitionDelay: `${(i % 6) * 60}ms` }}
            className="group mb-3 block w-full break-inside-avoid overflow-hidden rounded-lg bg-black/5 opacity-0 translate-y-6 transition-all duration-700 ease-out [&.is-in]:translate-y-0 [&.is-in]:opacity-100 md:mb-4"
            aria-label={`Open photo ${i + 1} of ${photos.length}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm md:p-10"
          onClick={close}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[open]}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
          />

          <button
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white transition hover:bg-white hover:text-ink md:right-8 md:top-8"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {[-1, 1].map((d) => (
            <button
              key={d}
              onClick={(e) => {
                e.stopPropagation();
                step(d);
              }}
              aria-label={d < 0 ? "Previous photo" : "Next photo"}
              className={`absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 text-white transition hover:bg-white hover:text-ink ${
                d < 0 ? "left-3 md:left-8" : "right-3 md:right-8"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d={d < 0 ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
            {open + 1} of {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
