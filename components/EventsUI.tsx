"use client";

import { useState } from "react";
import type { EventItem } from "@/lib/types";
import { formatEventDate } from "@/lib/format";

function FormatBadge({ format }: { format: EventItem["format"] }) {
  const styles =
    format === "Virtual"
      ? "bg-founders-rock/15 text-founders-rock"
      : format === "Hybrid"
      ? "bg-california-gold/20 text-medalist"
      : "bg-berkeley-blue/10 text-berkeley-blue";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${styles}`}
    >
      {format}
    </span>
  );
}

function EventCard({ item, isPast }: { item: EventItem; isPast: boolean }) {
  const href = item.rsvpUrl ?? "#contact";
  const external = href.startsWith("http");
  return (
    <article className="card flex h-full flex-col p-6 md:p-7">
      <div className="flex items-center justify-between gap-3">
        <FormatBadge format={item.format} />
        <span
          className={`text-[11px] font-semibold uppercase tracking-wider ${
            isPast ? "text-ink/50" : "text-california-gold"
          }`}
        >
          {isPast ? "Past" : "Open"}
        </span>
      </div>
      <h3 className="mt-4 font-serif text-xl leading-snug text-ink">
        {item.title}
      </h3>
      <dl className="mt-3 space-y-1 text-sm text-ink/70">
        <div className="flex items-start gap-2">
          <dt className="sr-only">Date</dt>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mt-1 shrink-0">
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="#003262" strokeWidth="1.6"/>
            <path d="M3 9h18M8 3v4M16 3v4" stroke="#003262" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <dd>{formatEventDate(item)}</dd>
        </div>
        <div className="flex items-start gap-2">
          <dt className="sr-only">Location</dt>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mt-1 shrink-0">
            <path d="M12 22s7-7.16 7-12a7 7 0 1 0-14 0c0 4.84 7 12 7 12z" stroke="#003262" strokeWidth="1.6"/>
            <circle cx="12" cy="10" r="2.5" stroke="#003262" strokeWidth="1.6"/>
          </svg>
          <dd>{item.location}</dd>
        </div>
        {item.price && (
          <div className="flex items-start gap-2">
            <dt className="sr-only">Price</dt>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mt-1 shrink-0">
              <circle cx="12" cy="12" r="9" stroke="#003262" strokeWidth="1.6"/>
              <path d="M15 9c-.5-1.2-1.7-2-3-2-1.7 0-3 1-3 2.5S10.3 12 12 12s3 .5 3 2.5S13.7 17 12 17c-1.3 0-2.5-.8-3-2M12 6v12" stroke="#003262" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <dd>{item.price}</dd>
          </div>
        )}
      </dl>
      <p className="mt-4 text-[15px] leading-relaxed text-ink/75">{item.blurb}</p>
      <div className="mt-auto pt-5">
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer noopener" : undefined}
          className="inline-flex items-center gap-1 text-sm font-semibold text-berkeley-blue hover:underline"
        >
          {isPast ? "View recap" : "RSVP"}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="card col-span-full flex flex-col items-center justify-center gap-3 p-12 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-cream">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="2" stroke="#003262" strokeWidth="1.6"/>
          <path d="M3 9h18M8 3v4M16 3v4" stroke="#003262" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </div>
      <h3 className="font-serif text-xl text-ink">No upcoming events yet.</h3>
      <p className="max-w-md text-sm text-ink/70">
        We're finalizing our next round of programming. Join the WILA email list
        below to be the first to hear when new events open.
      </p>
      <a href="#contact" className="btn-primary mt-2">
        Get on the list
      </a>
    </div>
  );
}

export default function EventsUI({
  upcoming,
  past
}: {
  upcoming: EventItem[];
  past: EventItem[];
}) {
  const [tab, setTab] = useState<"upcoming" | "past">(
    upcoming.length ? "upcoming" : "past"
  );
  const items = tab === "upcoming" ? upcoming : past;

  return (
    <div className="mt-10">
      <div
        role="tablist"
        aria-label="Event filter"
        className="inline-flex rounded-full border border-black/10 bg-cream p-1"
      >
        <button
          role="tab"
          aria-selected={tab === "upcoming"}
          onClick={() => setTab("upcoming")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            tab === "upcoming"
              ? "bg-berkeley-blue text-white shadow"
              : "text-ink/70 hover:text-berkeley-blue"
          }`}
        >
          Upcoming {upcoming.length > 0 && `(${upcoming.length})`}
        </button>
        <button
          role="tab"
          aria-selected={tab === "past"}
          onClick={() => setTab("past")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            tab === "past"
              ? "bg-berkeley-blue text-white shadow"
              : "text-ink/70 hover:text-berkeley-blue"
          }`}
        >
          Past ({past.length})
        </button>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          items.map((e) => (
            <EventCard
              key={e.id ?? e.title}
              item={e}
              isPast={tab === "past"}
            />
          ))
        )}
      </div>
    </div>
  );
}
