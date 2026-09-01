import Link from "next/link";

import Reveal from "@/components/Reveal";
import { BOARD } from "@/lib/site";

/**
 * A compact row of the board on the home page, linking through to the full
 * page. Overlapping avatars rather than a grid, so it reads as one group
 * rather than nine separate cards.
 */
export default function BoardStrip() {
  return (
    <section id="leadership" className="bg-white py-20 md:py-28">
      <div className="container-tight">
        <Reveal className="block">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-xl">
              <span className="eyebrow">Leadership</span>
              <h2 className="section-title mt-5">Meet the women behind WILA</h2>
            </div>
            <Link
              href="/board"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-berkeley-blue"
            >
              <span className="border-b border-berkeley-blue/30 pb-0.5 transition group-hover:border-berkeley-blue">
                See the whole board
              </span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-12 block">
          <div className="flex flex-wrap items-center gap-y-6">
            {BOARD.map((m, i) => (
              <div
                key={m.name}
                title={`${m.name}, ${m.role}`}
                style={{ zIndex: BOARD.length - i }}
                className="group relative -mr-4 h-20 w-20 shrink-0 overflow-hidden rounded-full border-[3px] border-white bg-soft-gray transition-all duration-500 hover:z-50 hover:-translate-y-1.5 md:h-28 md:w-28"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.photo}
                  alt={m.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover grayscale transition duration-700 group-hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
