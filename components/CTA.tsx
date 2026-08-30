"use client";

export default function CTA() {
  return (
    <section id="contact" className="relative overflow-hidden bg-berkeley-blue py-20 text-white md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-california-gold/15 blur-3xl"
      />
      <div className="container-tight grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-california-gold">
            — Stay close
          </span>
          <h2 className="mt-3 font-serif text-3xl leading-tight md:text-5xl">
            Get on the WILA list.
          </h2>
          <p className="mt-4 max-w-xl text-white/80">
            Quarterly notes, event invites, mentor program openings, and the
            spotlight straight to your inbox. No noise — promise.
          </p>
        </div>
        <form
          className="md:col-span-5 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@haasalumni.org"
            className="w-full rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm text-white placeholder-white/50 focus:border-california-gold focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-california-gold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
