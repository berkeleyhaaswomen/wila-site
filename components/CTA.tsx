import Link from "next/link";

import Reveal from "@/components/Reveal";

/**
 * Membership call to action.
 *
 * Deliberately a link rather than an inline email field. The board needs the
 * graduation year, program and LinkedIn profile to confirm someone is a Haas
 * alumna, and asking for an address here would have collected a list nobody
 * could verify.
 */
export default function CTA() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-berkeley-blue py-24 text-white md:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-california-gold/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/5 blur-3xl"
      />

      <div className="container-tight relative grid gap-10 md:grid-cols-12 md:items-end">
        <Reveal className="block md:col-span-7">
          <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-california-gold">
            <span className="h-px w-8 bg-california-gold/60" />
            Stay close
          </span>
          <h2 className="display mt-5 text-[clamp(1.9rem,4.4vw,3.5rem)]">
            Get on the WILA list
          </h2>
          <p className="mt-5 max-w-xl text-white/75">
            Quarterly notes, event invitations, mentor program openings, and the
            spotlight, straight to your inbox. Membership is free and open to
            every Berkeley Haas alumna.
          </p>
        </Reveal>

        <Reveal delay={140} className="block md:col-span-5 md:justify-self-end">
          <Link
            href="/join"
            className="group inline-flex items-center gap-3 rounded-full bg-california-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition hover:bg-white"
          >
            Become a member
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
          <p className="mt-4 text-xs text-white/45">
            Takes about a minute. We verify with your LinkedIn profile.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
