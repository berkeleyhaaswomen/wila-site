import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { listEvents, listSpotlights, listUsers } from "@/lib/repo";
import AdminShell from "@/components/admin/AdminShell";
import { partitionEvents } from "@/lib/format";

export const dynamic = "force-dynamic";

function Stat({
  label,
  value,
  href
}: {
  label: string;
  value: string | number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-black/10 bg-white p-5 transition hover:border-black/25"
    >
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/45">
        {label}
      </div>
      <div className="mt-2 font-display text-3xl text-ink">{value}</div>
    </Link>
  );
}

export default async function AdminHome({
  searchParams
}: {
  searchParams: { denied?: string };
}) {
  const user = await requireUser("/admin");

  let upcomingCount = 0;
  let pastCount = 0;
  let spotlightCount = 0;
  let userCount = 0;
  let loadError: string | null = null;

  if (dbConfigured()) {
    try {
      const [events, spotlights] = await Promise.all([
        listEvents(),
        listSpotlights()
      ]);
      const { upcoming, past } = partitionEvents(events);
      upcomingCount = upcoming.length;
      pastCount = past.length;
      spotlightCount = spotlights.length;
      if (user.role === "superadmin") userCount = (await listUsers()).length;
    } catch (err) {
      loadError = err instanceof Error ? err.message : String(err);
    }
  }

  return (
    <AdminShell user={user} current="/admin" title={`Hi, ${user.name || user.email}`}>
      {searchParams.denied === "superadmin" && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          Managing users is limited to super admins. Ask one of them if you need
          someone added or removed.
        </div>
      )}

      {loadError && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          Couldn&apos;t read from the database: {loadError}
          <br />
          Have you run <code className="font-mono">npm run db:migrate</code>?
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Upcoming events" value={upcomingCount} href="/admin/events" />
        <Stat label="Past events" value={pastCount} href="/admin/events" />
        <Stat label="Spotlights" value={spotlightCount} href="/admin/spotlights" />
        {user.role === "superadmin" && (
          <Stat label="Website managers" value={userCount} href="/admin/users" />
        )}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-6">
          <h2 className="font-display text-sm uppercase tracking-[0.12em] text-ink">Add an event</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">
            Events sort themselves into Upcoming and Past on the public site
            based on their start time, so you never have to move them by hand.
          </p>
          <Link
            href="/admin/events/new"
            className="mt-4 inline-flex rounded-full bg-berkeley-blue px-5 py-2 text-sm font-semibold text-white transition hover:bg-ink"
          >
            New event
          </Link>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-6">
          <h2 className="font-display text-sm uppercase tracking-[0.12em] text-ink">Rotate the spotlight</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">
            The homepage shows whichever spotlight has the most recent
            &ldquo;Featured from&rdquo; date. Older ones stay here for reference.
          </p>
          <Link
            href="/admin/spotlights/new"
            className="mt-4 inline-flex rounded-full bg-berkeley-blue px-5 py-2 text-sm font-semibold text-white transition hover:bg-ink"
          >
            New spotlight
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
