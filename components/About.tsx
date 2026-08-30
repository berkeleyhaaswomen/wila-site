export default function About() {
  return (
    <section id="about" className="bg-white py-20 md:py-28">
      <div className="container-tight grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <span className="eyebrow">Our Community</span>
          <h2 className="section-title mt-4">
            A network built on candor, craft, and care.
          </h2>
        </div>
        <div className="md:col-span-7">
          <p className="lede">
            WILA convenes Berkeley Haas alumnae across industries and continents
            for authentic, compassionate conversation. Our programming spans
            professional development, personal well-being, and community impact
            — because leadership is never one-dimensional.
          </p>
          <p className="lede mt-5">
            Whether you are navigating a career pivot, raising your voice in a
            new role, or looking to mentor the next wave of Haas women, WILA is
            a place to be known and to belong.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { k: "Mentorship", v: "1:1 and cohort programs" },
              { k: "Events", v: "Global + chapter gatherings" },
              { k: "Community", v: "Private alumnae directory" }
            ].map((i) => (
              <div
                key={i.k}
                className="rounded-xl border border-black/5 bg-cream p-4"
              >
                <div className="text-xs uppercase tracking-wider text-berkeley-blue">
                  {i.k}
                </div>
                <div className="mt-1 text-sm text-ink/80">{i.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
