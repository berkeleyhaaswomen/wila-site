import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { listSpotlights } from "@/lib/repo";
import AdminShell from "@/components/admin/AdminShell";
import { FormNotice } from "@/components/admin/Field";
import type { SpotlightItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SpotlightsPage({
  searchParams
}: {
  searchParams: { saved?: string; deleted?: string };
}) {
  const user = await requireUser("/admin/spotlights");

  let items: SpotlightItem[] = [];
  let error: string | null = null;

  if (dbConfigured()) {
    try {
      items = await listSpotlights();
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    }
  } else {
    error = "DATABASE_URL isn't set, so there's nothing to edit yet.";
  }

  return (
    <AdminShell
      user={user}
      current="/admin/spotlights"
      title="Spotlights"
      action={
        <Link
          href="/admin/spotlights/new"
          className="rounded-full bg-berkeley-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink"
        >
          New spotlight
        </Link>
      }
    >
      <div className="space-y-4">
        {searchParams.saved && <FormNotice message="Spotlight saved." />}
        {searchParams.deleted && <FormNotice message="Spotlight deleted." />}
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </div>
        )}
      </div>

      {!error && items.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-black/15 bg-white/50 p-10 text-center">
          <p className="text-sm text-ink/60">
            No spotlights yet. The public site is showing its built-in sample
            until you add one.
          </p>
          <Link
            href="/admin/spotlights/new"
            className="mt-4 inline-flex rounded-full bg-berkeley-blue px-5 py-2 text-sm font-semibold text-white transition hover:bg-ink"
          >
            Add the first spotlight
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s, i) => (
            <li key={s.id}>
              <Link
                href={`/admin/spotlights/${s.id}`}
                className="flex h-full gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-card transition hover:shadow-soft"
              >
                <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-soft-gray">
                  {s.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.photoUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-[10px] text-ink/40">
                      No photo
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  {i === 0 && (
                    <span className="mb-1 inline-block rounded-full bg-california-gold/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-medalist">
                      On the homepage
                    </span>
                  )}
                  <div className="truncate font-semibold text-berkeley-blue">
                    {s.name}
                  </div>
                  <div className="truncate text-xs text-ink/60">
                    {s.title || "Not set"}
                  </div>
                  <div className="mt-1 text-xs text-ink/45">
                    {s.featuredFrom
                      ? `Featured from ${s.featuredFrom}`
                      : "No featured date"}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
