import Reveal from "@/components/Reveal";
import Parallax from "@/components/Parallax";

/**
 * The mentorship network, lifted from the live site. Dark band between the
 * lighter content sections so the page has a rhythm rather than one long
 * stretch of cream.
 */
export default function Mentorship() {
  return (
    <section id="mentorship" className="relative overflow-hidden bg-berkeley-blue">
      <Parallax
        src="/photos/wila-22.jpg"
        speed={0.16}
        className="absolute inset-0 h-full w-full opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-berkeley-blue via-berkeley-blue/90 to-berkeley-blue/40" />

      <div className="container-tight relative py-24 md:py-36">
        <Reveal className="block max-w-2xl">
          <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-california-gold">
            <span className="h-px w-8 bg-california-gold/70" />
            Mentorship network
          </span>
          <h2 className="display mt-6 text-[clamp(1.9rem,5vw,4rem)] text-white">
            Find someone who
            <br />
            has been there
          </h2>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-white/75 md:text-lg">
            Connect with accomplished women leaders from the Berkeley Haas
            alumni community who are ready to guide your professional journey.
          </p>
          <a
            href="#contact"
            className="group mt-9 inline-flex items-center gap-3 rounded-full bg-california-gold px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-white"
          >
            Find a mentor
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
