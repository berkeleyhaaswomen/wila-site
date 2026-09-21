import type { Metadata } from "next";
import Link from "next/link";

import Nav from "@/components/Nav";
import LogoWatermark from "@/components/LogoWatermark";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { formatEventDate } from "@/lib/content";
import { dbConfigured } from "@/lib/db";
import { listEventsWithPhotos, type EventWithPhotos } from "@/lib/repo";
import { GALLERY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Photos · WILA",
  description: "Moments from WILA events, newest first."
};

// Uploads revalidate this page directly; the timer is a safety net.
export const revalidate = 300;

/**
 * Photos grouped by the event they came from, most recent event first. Each
 * group links to that event on /events.
 *
 * The archive at the bottom is the photography from the old site. It was
 * published as one flat gallery with no captions, so there is no reliable way
 * to say which event each frame belongs to, and it stays together rather
 * than being guessed into the wrong place.
 */
export default async function PhotosPage() {
  let groups: EventWithPhotos[] = [];
  if (dbConfigured()) {
    try {
      groups = await listEventsWithPhotos();
    } catch (err) {
      console.warn("[photos] could not load event photos:", err);
    }
  }

  return (
    <main className="min-h-screen bg-cream">
      <ScrollProgress />
      <LogoWatermark />
      <Nav />
      <PageHeader
        eyebrow="Photos"
        title={"See what\nwe have been up to"}
        lede="Summits, panels, chapter dinners, and the conversations in between."
        photo="/photos/wila-29.jpg"
      />

      <div className="container-wide space-y-20 py-16 md:space-y-28 md:py-24">
        {groups.map(({ event, photos }) => (
          <section key={event.id} id={event.slug} className="scroll-mt-28">
            <Reveal className="block">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-5">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-medalist">
                    {formatEventDate(event)}
                  </div>
                  <h2 className="mt-2 font-display text-[clamp(1.3rem,2.6vw,2rem)] uppercase leading-tight tracking-[-0.01em] text-ink">
                    {event.title}
                  </h2>
                  <div className="mt-1 text-sm text-ink/55">{event.location}</div>
                </div>
                <Link
                  href={`/events#${event.slug}`}
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-berkeley-blue"
                >
                  <span className="border-b border-berkeley-blue/30 pb-0.5 transition group-hover:border-berkeley-blue">
                    About this event
                  </span>
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </Link>
              </div>
            </Reveal>
            <Gallery photos={photos.map((p) => p.url)} />
          </section>
        ))}

        <section id="archive" className="scroll-mt-28">
          <Reveal className="block">
            <div className="mb-8 border-b border-ink/10 pb-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-medalist">
                2022 to 2025
              </div>
              <h2 className="mt-2 font-display text-[clamp(1.3rem,2.6vw,2rem)] uppercase leading-tight tracking-[-0.01em] text-ink">
                From the archive
              </h2>
              <div className="mt-1 text-sm text-ink/55">
                Conferences, dinners and gatherings from WILA&apos;s first years.
              </div>
            </div>
          </Reveal>
          <Gallery photos={GALLERY} />
        </section>
      </div>

      <Footer />
    </main>
  );
}
