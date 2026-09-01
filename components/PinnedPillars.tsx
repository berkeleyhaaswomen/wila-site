"use client";

import { useEffect, useRef, useState } from "react";
import { PILLARS } from "@/lib/site";

/**
 * The four principles as a single pinned frame that swaps its contents as you
 * scroll, rather than four sections you pass by.
 *
 * The wrapper is tall and the panel inside is sticky. Progress through the
 * wrapper picks the active pillar and drives a scale on the backdrop, so each
 * photograph is still moving while its text is legible. A progress rail on the
 * left shows how far through the set you are.
 */
export default function PinnedPillars() {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [within, setWithin] = useState(0);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;

    let queued = false;
    let frame = 0;

    const update = () => {
      queued = false;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const p = Math.min(1, Math.max(0, -rect.top / scrollable));
      // Spread the four panels across the scroll, holding each one steady in
      // the middle of its slot so the copy has time to be read.
      const raw = p * PILLARS.length;
      const idx = Math.min(PILLARS.length - 1, Math.floor(raw));
      setActive((prev) => (prev === idx ? prev : idx));
      setWithin(p);
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

  return (
    <section id="pillars" ref={wrap} className="relative h-[400vh] bg-ink">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Backdrops crossfade, and the live one keeps drifting closer. */}
        {PILLARS.map((p, i) => (
          <div
            key={p.n}
            aria-hidden={i !== active}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.photo}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
              style={{
                transform: `scale(${1.06 + (i === active ? within * 0.12 : 0)})`,
                transition: "transform 900ms cubic-bezier(0.22,1,0.36,1)"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
            <div className="absolute inset-0 bg-berkeley-blue/25 mix-blend-multiply" />
          </div>
        ))}

        <div className="relative flex h-full items-end">
          <div className="container-wide w-full pb-16 md:pb-24">
            <div className="flex items-end gap-8 md:gap-14">
              {/* Progress rail */}
              <div className="hidden w-px shrink-0 self-stretch bg-white/15 md:block">
                <div
                  className="w-px bg-california-gold transition-[height] duration-500 ease-out"
                  style={{ height: `${Math.round(within * 100)}%` }}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40 md:text-[11px]">
                  <span className="text-california-gold">The four pillars</span>
                  {PILLARS.map((p, i) => (
                    <span
                      key={p.n}
                      className={`transition-colors duration-300 ${
                        i === active ? "text-white" : ""
                      }`}
                    >
                      {p.n}
                    </span>
                  ))}
                </div>

                <div className="relative h-[15rem] md:h-[17rem]">
                  {PILLARS.map((p, i) => (
                    <div
                      key={p.n}
                      className={`absolute inset-0 transition-all duration-700 ease-out ${
                        i === active
                          ? "translate-y-0 opacity-100 blur-0"
                          : "pointer-events-none translate-y-8 opacity-0 blur-[3px]"
                      }`}
                    >
                      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-california-gold">
                        {p.label}
                      </div>
                      <h3 className="display max-w-[16ch] text-[clamp(1.9rem,5.2vw,4.5rem)] text-white">
                        {p.title}
                      </h3>
                      <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/70 md:text-lg">
                        {p.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
