import type { Metadata } from "next";
import Link from "next/link";

import Nav from "@/components/Nav";
import LogoWatermark from "@/components/LogoWatermark";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { getEvents, formatEventDate, partitionEvents } from "@/lib/content";
import { zoneOf } from "@/lib/format";
import { dbConfigured } from "@/lib/db";
import { listEventsWithPhotos, type EventPhoto } from "@/lib/repo";
import type { EventItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "Events · WILA",
  description:
    "Every WILA event, upcoming and past: summits, dinners, workshops, and circles."
};

export const revalidate = 300;

function yearOf(e: EventItem): string {
  return e.startsAt
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        timeZone: zoneOf(e)
      }).format(new Date(e.startsAt))
    : "Earlier";
}

function Row({
  e,
  past,
  photos
}: {
  e: EventItem;
  past: boolean;
  photos: EventPhoto[];
}) {
  const external = e.rsvpUrl?.startsWith("http");
  return (
    <article
      id={e.slug}
      className="scroll-mt-28 border-t border-ink/10 py-8 first:border-t-0 md:py-10"
    >
      <div className="grid gap-5 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-3">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-medalist">
            {formatEventDate(e)}
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wider text-ink/50">
            <span>{e.format}</span>
            {e.price && <span>· {e.price}</span>}
          </div>
        </div>
        <div className="md:col-span-9">
          <h3 className="font-display text-[clamp(1.1rem,2vw,1.5rem)] uppercase leading-tight tracking-[-0.01em] text-ink">
            {e.title}
          </h3>
          <div className="mt-2 text-sm text-ink/55">{e.location}</div>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/75">
            {e.blurb}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold">
            {e.rsvpUrl && (
              <a
                href={e.rsvpUrl}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer noopener" : undefined}
                className="text-berkeley-blue hover:underline"
              >
                {past ? "Event details" : "RSVP"} &rarr;
              </a>
            )}
            {photos.length > 0 && (
              <Link href={`/photos#${e.slug}`} className="text-berkeley-blue hover:underline">
                {photos.length} {photos.length === 1 ? "photo" : "photos"} &rarr;
              </Link>
            )}
          </div>

          {photos.length > 0 && (
            <Link href={`/photos#${e.slug}`} className="mt-5 flex gap-2 overflow-hidden">
              {photos.slice(0, 5).map((p) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={p.id}
                  src={p.url}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-20 w-28 shrink-0 rounded-md object-cover md:h-24 md:w-32"
                />
              ))}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function EventsPage() {
  const events = await getEvents();
  const { upcoming, past } = partitionEvents(events);

  let photosByEvent = new Map<string, EventPhoto[]>();
  if (dbConfigured()) {
    try {
      const groups = await listEventsWithPhotos();
      photosByEvent = new Map(groups.map((g) => [g.event.id!, g.photos]));
    } catch {
      // Photos are a bonus on this page; the event list still renders.
    }
  }
  const photosFor = (e: EventItem) => (e.id ? photosByEvent.get(e.id) ?? [] : []);

  // Past events grouped by year, newest year first.
  const years: { year: string; items: EventItem[] }[] = [];
  for (const e of past) {
    const y = yearOf(e);
    const last = years[years.length - 1];
    if (last?.year === y) last.items.push(e);
    else years.push({ year: y, items: [e] });
  }

  return (
    <main className="min-h-screen bg-cream">
      <ScrollProgress />
      <LogoWatermark />
      <Nav />
      <PageHeader
        eyebrow="Events"
        title={"Gathering, learning,\nshowing up"}
        lede="Summits, dinners, workshops and circles, built by alumnae for alumnae."
        photo="/photos/wila-05.jpg"
      />

      <div className="container-tight py-16 md:py-24">
        <section aria-labelledby="upcoming">
          <Reveal className="block">
            <h2 id="upcoming" className="section-title">
              Upcoming
            </h2>
          </Reveal>
          {upcoming.length === 0 ? (
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink/65">
              Nothing is on the calendar yet.{" "}
              <Link href="/join" className="font-semibold text-berkeley-blue hover:underline">
                Join our community
              </Link>{" "}
              to hear first when the next event opens.
            </p>
          ) : (
            <div className="mt-6">
              {upcoming.map((e) => (
                <Row key={e.id ?? e.title} e={e} past={false} photos={photosFor(e)} />
              ))}
            </div>
          )}
        </section>

        {years.length > 0 && (
          <section aria-labelledby="past" className="mt-20 md:mt-28">
            <Reveal className="block">
              <h2 id="past" className="section-title">
                Past events
              </h2>
              <p className="lede mt-3">
                {past.length} events since {years[years.length - 1].year}.
              </p>
            </Reveal>

            <div className="mt-10 space-y-14">
              {years.map(({ year, items }) => (
                <div key={year}>
                  <h3 className="flex items-center gap-4 font-display text-2xl text-berkeley-blue">
                    {year}
                    <span className="h-px flex-1 bg-ink/10" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/40">
                      {items.length} {items.length === 1 ? "event" : "events"}
                    </span>
                  </h3>
                  <div className="mt-2">
                    {items.map((e) => (
                      <Row key={e.id ?? e.title} e={e} past photos={photosFor(e)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
