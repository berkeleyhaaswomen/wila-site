import Reveal from "@/components/Reveal";
import { PILLARS } from "@/lib/site";

/**
 * The four principles as a grid of photo cards.
 *
 * This replaced a pinned panel that held the page for four screens and would
 * not let you scroll past until all four had played. Everything is visible at
 * once now, and the motion is a reveal on arrival plus a slow zoom on hover.
 */
export default function Pillars() {
  return (
    <section id="pillars" className="bg-ink py-20 md:py-28">
      <div className="container-tight">
        <Reveal className="block max-w-2xl">
          <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-california-gold">
            <span className="h-px w-8 bg-california-gold/70" />
            The four pillars
          </span>
          <h2 className="display mt-5 text-[clamp(1.9rem,4.2vw,3.5rem)] text-white">
            Haas principles, in practice
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/65 md:text-lg">
            Every event, mentor match, and conversation we host comes back to
            one of these.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2 md:gap-5">
          {PILLARS.map((p, i) => (
            <Reveal key={p.n} delay={(i % 2) * 120} className="block">
              <article className="group relative isolate flex aspect-[4/3] items-end overflow-hidden rounded-2xl md:aspect-[16/11]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.photo}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/75 to-ink/20" />
                <div className="absolute inset-0 -z-10 bg-berkeley-blue/20 mix-blend-multiply" />

                <div className="p-6 md:p-8">
                  <div className="mb-2 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-california-gold md:text-[11px]">
                    <span className="text-white/45">{p.n}</span>
                    {p.label}
                  </div>
                  <h3 className="display text-[clamp(1.5rem,2.8vw,2.3rem)] text-white">
                    {p.title}
                  </h3>
                  <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/70 md:text-[15px]">
                    {p.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
