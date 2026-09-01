import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import Parallax from "@/components/Parallax";
import PhotoRiver from "@/components/PhotoRiver";
import { SITE, FEATURE_PHOTOS, GALLERY } from "@/lib/site";

const STATS = [
  { to: SITE.founded, label: "Founded" },
  { to: 9, label: "Board members" },
  { to: 4, label: "Leadership pillars" }
];

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-cream py-20 md:py-32">
      <div className="container-tight">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="block md:col-span-5">
            <span className="eyebrow">About WILA</span>
            <h2 className="section-title mt-5">
              A community who uplift and amplify each other
            </h2>
          </Reveal>

          <Reveal delay={120} className="block md:col-span-7">
            <p className="text-lg leading-relaxed text-ink/80 md:text-xl">
              {SITE.mission}
            </p>
            <p className="lede mt-6">{SITE.missionLong}</p>

            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-ink/10 pt-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/45">
                    {s.label}
                  </dt>
                  <dd className="mt-2 font-display text-[clamp(1.6rem,4vw,2.6rem)] leading-none text-berkeley-blue">
                    <Counter to={s.to} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      {/* A wide breath of real photography between the copy and the pillars. */}
      <div className="mt-16 md:mt-24">
        <PhotoRiver top={FEATURE_PHOTOS.slice(0, 6)} bottom={GALLERY.slice(12, 20)} />
      </div>

      <div className="container-tight mt-16 grid gap-6 md:mt-24 md:grid-cols-12">
        <Reveal className="block md:col-span-7">
          <Parallax
            src="/photos/wila-16.jpg"
            alt="WILA alumnae gathered at an event"
            speed={0.14}
            className="aspect-[16/11] w-full rounded-2xl"
          />
        </Reveal>
        <Reveal delay={140} className="block md:col-span-5 md:pt-12">
          <Parallax
            src="/photos/wila-21.jpg"
            alt="Two WILA members laughing together"
            speed={-0.1}
            className="aspect-[4/5] w-full rounded-2xl"
          />
        </Reveal>
      </div>
    </section>
  );
}
