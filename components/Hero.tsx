export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-berkeley-blue text-white"
    >
      {/* soft accent glow, no photo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 -z-0 h-[520px] w-[520px] rounded-full bg-california-gold/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-0 -z-0 h-[420px] w-[420px] rounded-full bg-white/5 blur-3xl"
      />

      <div className="container-wide relative flex flex-col items-center gap-8 py-28 text-center md:py-40">
        {/* WILA logo */}
        <img
          src="/wila-logo.svg"
          alt="Berkeley Haas WILA — Women in Leadership Alumnae"
          className="h-40 w-auto md:h-52"
        />

        <h1 className="font-serif text-5xl leading-tight tracking-tight md:text-7xl">
          Welcome To WILA
        </h1>

        <p className="max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
          Berkeley Haas Women In Leadership Alumnae (WILA) is a worldwide network
          of Berkeley Haas alumnae committed to a community that celebrates and
          amplifies the power of bringing women together.
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <a href="#events" className="btn-primary bg-california-gold text-ink hover:bg-california-gold/90">
            See upcoming events
          </a>
          <a
            href="#contact"
            className="btn-ghost border-white/40 text-white hover:bg-white/10"
          >
            Join the network
          </a>
        </div>
      </div>
    </section>
  );
}
