import Reveal from "@/components/Reveal";
import Parallax from "@/components/Parallax";
import { getSpotlight } from "@/lib/content";

/**
 * The quarterly alumnae spotlight, published from /admin.
 *
 * When nothing has been published the section invites a nomination rather
 * than showing an invented person. Any individual field left blank is omitted
 * instead of rendering an empty row.
 */
export default async function Spotlight() {
  const s = await getSpotlight();

  // Nominations go to the board inbox; there is no form for them yet.
  const nominateHref =
    "mailto:wila@haas.berkeley.edu?subject=" +
    encodeURIComponent("WILA spotlight nomination");

  return (
    <section id="spotlight" className="relative overflow-hidden bg-cream py-20 md:py-32">
      <div className="container-tight">
        <Reveal className="block max-w-2xl">
          <span className="eyebrow">Alumnae spotlight</span>
          <h2 className="section-title mt-5">In her own words</h2>
          <p className="lede mt-5">
            Each quarter we highlight an alumna whose work reflects the WILA
            pillars in motion.
          </p>
        </Reveal>

        {!s ? (
          <Reveal delay={120} className="mt-12 block">
            <div className="grid overflow-hidden rounded-3xl border border-ink/10 bg-white md:grid-cols-12">
              <Parallax
                src="/photos/wila-28.jpg"
                alt="A WILA member speaking at an event"
                speed={0.1}
                className="aspect-[4/3] md:col-span-5 md:aspect-auto"
              />
              <div className="p-8 md:col-span-7 md:p-12">
                <h3 className="display text-[clamp(1.5rem,3vw,2.5rem)] text-ink">
                  Know someone
                  <br />
                  who should be here?
                </h3>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/70">
                  The next spotlight has not been published yet. Nominate an
                  alumna whose work is moving this community forward and we will
                  be in touch.
                </p>
                <a href={nominateHref} className="btn-primary mt-8">
                  Nominate an alumna
                </a>
              </div>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={120} className="mt-12 block">
            <article className="grid overflow-hidden rounded-3xl bg-white shadow-card md:grid-cols-12">
              <div className="relative aspect-square md:col-span-5 md:aspect-auto">
                {s.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.photoUrl}
                    alt={s.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-berkeley-blue to-ink" />
                )}
                {s.spotlightLabel && (
                  <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-berkeley-blue">
                    <span className="h-1.5 w-1.5 rounded-full bg-california-gold" />
                    {s.spotlightLabel}
                  </span>
                )}
              </div>

              <div className="p-8 md:col-span-7 md:p-12">
                <h3 className="display text-[clamp(1.6rem,3.2vw,2.6rem)] text-ink">
                  {s.name}
                </h3>
                {s.gradYear && (
                  <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-berkeley-blue/70">
                    {s.gradYear}
                  </div>
                )}

                {(s.title || s.involvement) && (
                  <dl className="mt-6 space-y-2 border-l-2 border-california-gold pl-5">
                    {s.title && (
                      <div>
                        <dt className="sr-only">Role</dt>
                        <dd className="text-[15px] font-semibold text-ink">{s.title}</dd>
                      </div>
                    )}
                    {s.involvement && (
                      <div>
                        <dt className="sr-only">WILA involvement</dt>
                        <dd className="text-[14px] text-ink/65">
                          <span className="font-semibold text-medalist">WILA:</span>{" "}
                          {s.involvement}
                        </dd>
                      </div>
                    )}
                  </dl>
                )}

                {s.bio && (
                  <p className="mt-6 whitespace-pre-line text-[15px] leading-relaxed text-ink/75">
                    {s.bio}
                  </p>
                )}

                {/* Older spotlights may carry a quote; the template does not. */}
                {s.quote && !s.bio && (
                  <blockquote className="mt-6 font-serif text-lg italic leading-relaxed text-ink/85">
                    {s.quote}
                  </blockquote>
                )}

                {s.cta && (
                  <p className="mt-6 text-[15px] font-semibold text-berkeley-blue">
                    {s.cta}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {s.linkedin && (
                    <a
                      href={s.linkedin}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="btn-primary"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5.001zM3 9h4v12H3zM9 9h3.8v1.71h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21H17.6v-5.32c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9z" />
                      </svg>
                      Connect with {s.name.split(" ")[0]}
                    </a>
                  )}
                  <a href={nominateHref} className="btn-ghost">
                    Nominate an alumna
                  </a>
                </div>
              </div>
            </article>
          </Reveal>
        )}
      </div>
    </section>
  );
}
