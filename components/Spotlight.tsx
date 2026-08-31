import { getSpotlight } from "@/lib/content";

/**
 * Placeholder portrait, used when the spotlight has no photo yet.
 * Inline SVG so the page builds with zero external dependencies.
 */
function SpotlightPortrait() {
  return (
    <svg
      viewBox="0 0 400 500"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sp-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#003262" />
          <stop offset="100%" stopColor="#0A1F33" />
        </linearGradient>
        <linearGradient id="sp-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDB515" />
          <stop offset="100%" stopColor="#C4820E" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#sp-bg)" />
      {/* gold arc */}
      <path
        d="M0 360 Q200 220 400 360 L400 500 L0 500 Z"
        fill="url(#sp-gold)"
        opacity="0.95"
      />
      {/* figure */}
      <circle cx="200" cy="200" r="78" fill="#FBF7F0" />
      <path
        d="M90 420 C90 340 140 300 200 300 C260 300 310 340 310 420 Z"
        fill="#FBF7F0"
      />
      {/* ring */}
      <circle
        cx="200"
        cy="200"
        r="96"
        stroke="#FDB515"
        strokeWidth="4"
        fill="none"
      />
      {/* name strip */}
      <rect x="40" y="452" width="120" height="6" rx="3" fill="#FBF7F0" />
    </svg>
  );
}

export default async function Spotlight() {
  const s = await getSpotlight();

  const photoUrl = s.photoUrl || null;

  const byline = [s.name, s.gradYear].filter(Boolean).join(" · ");
  const nominateHref = s.nominateUrl || "#contact";
  const nominateExternal = nominateHref.startsWith("http");

  // Only render a fact if the editor filled it in.
  const facts = [
    { label: "Pillar", value: s.pillar },
    { label: "Chapter", value: s.chapter },
    { label: "Mentor cohort", value: s.mentorCohort }
  ].filter((f) => Boolean(f.value));

  return (
    <section id="spotlight" className="relative overflow-hidden bg-cream py-20 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-california-gold/10 blur-3xl"
      />
      <div className="container-tight">
        <div className="max-w-2xl">
          <span className="eyebrow">Alumnae Spotlight</span>
          <h2 className="section-title mt-4">
            In her own words.
          </h2>
          <p className="lede mt-4">
            Each quarter we highlight an alumna whose work reflects the WILA
            pillars in motion.
          </p>
        </div>

        <article className="mt-12 grid overflow-hidden rounded-3xl bg-white shadow-card md:grid-cols-12">
          <div className="relative aspect-[4/5] md:col-span-5 md:aspect-auto">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={s.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <SpotlightPortrait />
            )}
            {s.spotlightLabel && (
              <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-berkeley-blue">
                <span className="h-1.5 w-1.5 rounded-full bg-california-gold" />
                {s.spotlightLabel}
              </span>
            )}
          </div>

          <div className="md:col-span-7 md:p-12 p-8">
            {byline && (
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-berkeley-blue/70">
                {byline}
              </div>
            )}
            {s.title && (
              <h3 className="mt-2 font-serif text-3xl text-ink md:text-4xl">
                {s.title}
              </h3>
            )}

            <blockquote className="mt-6 border-l-2 border-california-gold pl-5 font-serif text-lg italic leading-relaxed text-ink/85">
              {s.quote}
            </blockquote>

            {s.bio && (
              <p className="mt-6 whitespace-pre-line text-[15px] leading-relaxed text-ink/75">
                {s.bio}
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
                    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5.001zM3 9h4v12H3zM9 9h3.8v1.71h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21H17.6v-5.32c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9z"/>
                  </svg>
                  View LinkedIn profile
                </a>
              )}
              <a
                href={nominateHref}
                target={nominateExternal ? "_blank" : undefined}
                rel={nominateExternal ? "noreferrer noopener" : undefined}
                className="btn-ghost"
              >
                Nominate an alumna
              </a>
            </div>

            {facts.length > 0 && (
              <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-black/5 pt-6">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-[11px] uppercase tracking-wider text-ink/55">
                      {f.label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-berkeley-blue">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
