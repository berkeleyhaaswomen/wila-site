import Reveal from "@/components/Reveal";
import { BOARD_GROUPS, initials, type BoardPerson } from "@/lib/site";

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5.001zM3 9h4v12H3zM9 9h3.8v1.71h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21H17.6v-5.32c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9z" />
    </svg>
  );
}

/**
 * One board member. The whole card is the link to their LinkedIn, rather than
 * a small icon that only appears on hover: people click the photo.
 */
function Person({ m }: { m: BoardPerson }) {
  const body = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-soft-gray">
        {m.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={m.photo}
            alt={m.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover grayscale transition-all duration-[900ms] ease-out group-hover:scale-[1.05] group-hover:grayscale-0"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-berkeley-blue to-ink">
            <span className="font-display text-4xl text-california-gold">
              {initials(m.name)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-berkeley-blue/20 transition-opacity duration-700 group-hover:opacity-0" />
        {m.linkedin && (
          <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-berkeley-blue shadow-sm transition group-hover:bg-berkeley-blue group-hover:text-white">
            <LinkedInIcon />
          </span>
        )}
      </div>
      <figcaption className="mt-4">
        <div className="font-display text-[13px] uppercase tracking-[0.06em] text-ink">
          {m.name}
        </div>
        <div className="mt-1 text-[13px] text-ink/55">{m.role}</div>
      </figcaption>
    </>
  );

  return (
    <figure className="group">
      {m.linkedin ? (
        <a
          href={m.linkedin}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`${m.name}, ${m.role}, on LinkedIn`}
          className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-california-gold focus-visible:ring-offset-4"
        >
          {body}
        </a>
      ) : (
        body
      )}
    </figure>
  );
}

export default function Leadership({ showIntro = true }: { showIntro?: boolean }) {
  return (
    <section id="leadership" className="bg-white py-20 md:py-32">
      <div className="container-tight">
        {showIntro && (
          <Reveal className="block max-w-2xl">
            <span className="eyebrow">Leadership</span>
            <h2 className="section-title mt-5">Meet the WILA board</h2>
            <p className="lede mt-5">
              The volunteer alumnae who build the programming, run the chapters,
              and keep this network moving.
            </p>
          </Reveal>
        )}

        {/* One row per group, so the structure of the board is obvious. */}
        <div className={`space-y-16 md:space-y-20 ${showIntro ? "mt-14" : ""}`}>
          {BOARD_GROUPS.map((g) => (
            <div key={g.label}>
              <Reveal className="block">
                <h3 className="mb-7 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-medalist">
                  {g.label}
                  <span className="h-px flex-1 bg-ink/10" />
                </h3>
              </Reveal>
              <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-8">
                {g.people.map((m, i) => (
                  <Reveal key={m.name} delay={i * 90} className="block">
                    <Person m={m} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
