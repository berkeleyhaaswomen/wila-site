export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-berkeley-blue bg-gradient-to-br from-[#001C38] via-berkeley-blue to-[#0B5286] text-white"
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
          src="/wila-logo.png"
          alt="Berkeley Haas WILA — Women in Leadership Alumnae"
          width={2048}
          height={1688}
          className="h-52 w-auto md:h-72"
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
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-berkeley-blue focus:outline-none focus:ring-2 focus:ring-california-gold focus:ring-offset-2 focus:ring-offset-berkeley-blue"
          >
            Join the network
          </a>
        </div>
      </div>
    </section>
  );
}
