"use client";

import { useEffect, useRef } from "react";

/**
 * Two rows of photographs that slide past each other as the section crosses
 * the viewport. The offset is derived from scroll position, not a timer, so
 * the rows track the wheel exactly and stop dead when you do.
 *
 * The strip is duplicated once and translated by a whole strip width, which
 * makes the seam invisible without measuring anything.
 */
export default function PhotoRiver({
  top,
  bottom
}: {
  top: string[];
  bottom: string[];
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const rowA = useRef<HTMLDivElement>(null);
  const rowB = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let queued = false;
    let frame = 0;

    const update = () => {
      queued = false;
      const rect = el.getBoundingClientRect();
      // 0 as the section enters the bottom of the screen, 1 as it leaves the top.
      const p =
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const travel = Math.min(1, Math.max(0, p));
      const span = 42; // percent of a strip width to traverse across the pass
      if (rowA.current) {
        rowA.current.style.transform = `translate3d(${-travel * span}%,0,0)`;
      }
      if (rowB.current) {
        rowB.current.style.transform = `translate3d(${travel * span - span}%,0,0)`;
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
  }, []);

  const Row = ({
    photos,
    innerRef,
    tall
  }: {
    photos: string[];
    innerRef: React.RefObject<HTMLDivElement>;
    tall?: boolean;
  }) => (
    <div className="overflow-hidden">
      <div
        ref={innerRef}
        className="flex w-max gap-4 will-change-transform md:gap-6"
      >
        {[...photos, ...photos].map((src, i) => (
          <div
            key={`${src}-${i}`}
            className={`relative shrink-0 overflow-hidden rounded-xl bg-berkeley-blue/20 ${
              tall
                ? "h-52 w-[15rem] md:h-80 md:w-[24rem]"
                : "h-40 w-[13rem] md:h-64 md:w-[19rem]"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div ref={wrap} className="space-y-4 md:space-y-6">
      <Row photos={top} innerRef={rowA} tall />
      <Row photos={bottom} innerRef={rowB} />
    </div>
  );
}
