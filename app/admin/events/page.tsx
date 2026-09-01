import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { listEvents } from "@/lib/repo";
import { formatEventDate, partitionEvents } from "@/lib/format";
import AdminShell from "@/components/admin/AdminShell";
import { FormNotice } from "@/components/admin/Field";
import type { EventItem } from "@/lib/types";

export const dynamic = "force-dynamic";

function Row({ e, past }: { e: EventItem; past: boolean }) {
  return (
    <tr className="border-t border-black/5">
      <td className="py-3 pr-4">
        <Link
          href={`/admin/events/${e.id}`}
          className="font-semibold text-berkeley-blue hover:underline"
        >
          {e.title}
        </Link>
        <div className="mt-0.5 text-xs text-ink/50">{e.location}</div>
      </td>
      <td className="py-3 pr-4 text-sm text-ink/70">{formatEventDate(e)}</td>
      <td className="py-3 pr-4">
        <span className="rounded-full bg-berkeley-blue/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-berkeley-blue">
          {e.format}
        </span>
      </td>
      <td className="py-3 pr-4 text-sm text-ink/70">{e.price || "Not set"}</td>
      <td className="py-3 text-right">
        <span
          className={`text-[11px] font-semibold uppercase tracking-wider ${
            past ? "text-ink/45" : "text-medalist"
          }`}
        >
          {past ? "Past" : "Upcoming"}
        </span>
      </td>
    </tr>
  );
}

export default async function EventsPage({
  searchParams
}: {
  searchParams: { saved?: string; deleted?: string };
}) {
  const user = await requireUser("/admin/events");

  let upcoming: EventItem[] = [];
  let past: EventItem[] = [];
  let error: string | null = null;

  if (dbConfigured()) {
    try {
      const parts = partitionEvents(await listEvents());
      upcoming = parts.upcoming;
      past = parts.past;
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    }
  } else {
    error = "DATABASE_URL isn't set, so there's nothing to edit yet.";
  }

  const empty = !error && upcoming.length === 0 && past.length === 0;

  return (
    <AdminShell
      user={user}
      current="/admin/events"
      title="Events"
      action={
        <Link
          href="/admin/events/new"
          className="rounded-full bg-berkeley-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink"
        >
          New event
        </Link>
      }
    >
      <div className="space-y-4">
        {searchParams.saved && <FormNotice message="Event saved." />}
        {searchParams.deleted && <FormNotice message="Event deleted." />}
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </div>
        )}
      </div>

      {empty && (
        <div className="mt-6 rounded-2xl border border-dashed border-black/15 bg-white/50 p-10 text-center">
          <p className="text-sm text-ink/60">
            No events yet. The public site is showing its built-in sample events
            until you add one.
          </p>
          <Link
            href="/admin/events/new"
            className="mt-4 inline-flex rounded-full bg-berkeley-blue px-5 py-2 text-sm font-semibold text-white transition hover:bg-ink"
          >
            Add the first event
          </Link>
        </div>
      )}

      {(upcoming.length > 0 || past.length > 0) && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-black/5 bg-white p-2 shadow-card">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-ink/50">
                <th className="px-4 py-2 font-semibold">Event</th>
                <th className="px-4 py-2 font-semibold">When</th>
                <th className="px-4 py-2 font-semibold">Format</th>
                <th className="px-4 py-2 font-semibold">Price</th>
                <th className="px-4 py-2 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="px-4">
              {upcoming.map((e) => (
                <Row key={e.id} e={e} past={false} />
              ))}
              {past.map((e) => (
                <Row key={e.id} e={e} past />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
