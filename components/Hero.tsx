import HeroArt from "./HeroArt";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 md:pt-36">
      {/* background accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-white to-cream"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 -z-10 h-[420px] w-[420px] rounded-full bg-california-gold/10 blur-3xl"
      />

      <div className="container-wide grid items-center gap-12 pb-20 md:grid-cols-12 md:gap-16 md:pb-28">
        <div className="md:col-span-6">
          <span className="eyebrow">Berkeley Haas · Alumnae Network</span>
          <h1 className="mt-5 font-serif text-4xl leading-[1.05] tracking-tight text-ink md:text-6xl">
            Women in Leadership,{" "}
            <span className="text-berkeley-blue">questioning the status quo</span>
            <span className="text-california-gold">.</span>
          </h1>
          <p className="lede mt-6 max-w-xl">
            WILA is a global network of Berkeley Haas alumnae fostering a
            supportive community that uplifts and empowers women through
            authentic conversation, mentorship, and leadership.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#events" className="btn-primary">
              See upcoming events
            </a>
            <a href="#contact" className="btn-ghost">
              Join the network
            </a>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
            <div>
              <dt className="text-xs uppercase tracking-wider text-ink/55">
                Members
              </dt>
              <dd className="mt-1 font-serif text-2xl text-berkeley-blue">
                1,200+
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-ink/55">
                Chapters
              </dt>
              <dd className="mt-1 font-serif text-2xl text-berkeley-blue">
                12
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-ink/55">
                Years
              </dt>
              <dd className="mt-1 font-serif text-2xl text-berkeley-blue">
                15+
              </dd>
            </div>
          </dl>
        </div>

        <div className="md:col-span-6">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-4 -z-10 rounded-[28px] bg-berkeley-blue/5"
            />
            <HeroArt />
          </div>
        </div>
      </div>
    </section>
  );
}
