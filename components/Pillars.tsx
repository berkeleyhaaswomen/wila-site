const pillars = [
  {
    title: "Question the Status Quo",
    tag: "Diversity & Inclusion",
    body: "We challenge norms and build more equitable paths for women in leadership — across industries, life stages, and geographies."
  },
  {
    title: "Confidence Without Attitude",
    tag: "Positive Engagement & Well-Being",
    body: "We lead with conviction and humility, making room for others to thrive alongside us."
  },
  {
    title: "Student Always",
    tag: "Professional Development",
    body: "We keep learning — through mentorship, programming, and the generous exchange of hard-earned wisdom."
  },
  {
    title: "Beyond Yourself",
    tag: "Community Support & Impact",
    body: "We invest in our alumnae sisters, our campus, and the communities we call home."
  }
];

export default function Pillars() {
  return (
    <section id="pillars" className="bg-cream py-20 md:py-28">
      <div className="container-tight">
        <div className="max-w-3xl">
          <span className="eyebrow">The Four Pillars</span>
          <h2 className="section-title mt-4">
            The Berkeley Haas Defining Principles, in our voice.
          </h2>
          <p className="lede mt-5">
            Our pillars are more than words on a wall — they shape every event,
            mentor match, and conversation we host.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {pillars.map((p, i) => (
            <article
              key={p.title}
              className="group card relative overflow-hidden p-7 md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-berkeley-blue/70">
                  0{i + 1} · {p.tag}
                </span>
                <span
                  aria-hidden="true"
                  className="h-2 w-8 rounded-full bg-california-gold"
                />
              </div>
              <h3 className="mt-4 font-serif text-2xl text-ink">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/75">
                {p.body}
              </p>
              <div
                aria-hidden="true"
                className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-berkeley-blue/5 transition group-hover:bg-berkeley-blue/10"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
