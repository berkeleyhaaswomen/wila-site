import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { listNominations, type NominationRow } from "@/lib/repo";
import AdminShell from "@/components/admin/AdminShell";
import { markNomination, removeNomination } from "./actions";

export const dynamic = "force-dynamic";

function when(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "America/Los_Angeles"
  });
}

function Row({ n }: { n: NominationRow }) {
  const reviewed = n.status === "reviewed";
  return (
    <tr className={`border-t border-black/5 ${reviewed ? "text-ink/45" : ""}`}>
      <td className="py-3.5 pr-4">
        <div className="font-medium text-ink">{n.name}</div>
        <a
          href={`mailto:${n.email}`}
          className="text-[13px] text-ink/55 underline decoration-ink/20 underline-offset-2 transition hover:text-berkeley-blue"
        >
          {n.email}
        </a>
      </td>

      <td className="py-3.5 pr-4 align-top">
        {/* One row per nominee: a second nomination raises this, it never
            adds a second entry. */}
        <span
          title={
            n.votes === 1
              ? "Nominated once"
              : `Nominated by ${n.votes} different submissions`
          }
          className={`inline-flex min-w-[2rem] items-center justify-center rounded-full px-2.5 py-1 font-display text-sm ${
            n.votes > 1 && !reviewed
              ? "bg-california-gold/20 text-ink"
              : "bg-black/5 text-ink/60"
          }`}
        >
          {n.votes}
        </span>
      </td>

      <td className="py-3.5 pr-4 align-top text-[13px] text-ink/55">
        {when(n.updatedAt)}
        {n.votes > 1 && (
          <div className="text-ink/35">first {when(n.createdAt)}</div>
        )}
      </td>

      <td className="py-3.5 align-top">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <form action={markNomination}>
            <input type="hidden" name="id" value={n.id} />
            <input type="hidden" name="status" value={reviewed ? "new" : "reviewed"} />
            <button
              type="submit"
              className="rounded-md border border-black/10 px-2.5 py-1.5 text-[13px] font-medium text-ink/70 transition hover:border-black/25 hover:text-ink"
            >
              {reviewed ? "Move back" : "Mark reviewed"}
            </button>
          </form>
          <form action={removeNomination}>
            <input type="hidden" name="id" value={n.id} />
            <button
              type="submit"
              className="rounded-md px-2.5 py-1.5 text-[13px] font-medium text-ink/45 transition hover:bg-red-50 hover:text-red-700"
            >
              Delete
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}

function Table({ rows }: { rows: NominationRow[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/45">
          <th className="pb-2 pr-4 font-semibold">Nominee</th>
          <th className="pb-2 pr-4 font-semibold">Nominations</th>
          <th className="pb-2 pr-4 font-semibold">Latest</th>
          <th className="pb-2" />
        </tr>
      </thead>
      <tbody>
        {rows.map((n) => (
          <Row key={n.id} n={n} />
        ))}
      </tbody>
    </table>
  );
}

export default async function NominationsPage() {
  const me = await requireUser("/admin/nominations");

  let nominations: NominationRow[] = [];
  let loadError: string | null = null;

  if (dbConfigured()) {
    try {
      nominations = await listNominations();
    } catch (err) {
      loadError = err instanceof Error ? err.message : String(err);
    }
  } else {
    loadError = "DATABASE_URL isn't set.";
  }

  const toReview = nominations.filter((n) => n.status === "new");
  const reviewed = nominations.filter((n) => n.status === "reviewed");

  return (
    <AdminShell user={me} current="/admin/nominations" title="Nominations">
      {loadError && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {loadError}
          <br />
          Have you run <code className="font-mono">npm run db:migrate</code>?
        </div>
      )}

      <p className="max-w-2xl text-sm leading-relaxed text-ink/65">
        Alumnae put forward for the spotlight through the public form, most
        supported first. Each person appears once: when several people nominate
        the same alumna, her count goes up rather than the list repeating her.
      </p>

      {nominations.length === 0 && !loadError ? (
        <div className="mt-8 rounded-xl border border-dashed border-black/15 bg-white p-10 text-center">
          <p className="text-sm text-ink/60">
            No nominations yet. The form lives at{" "}
            <Link href="/nominate" className="font-medium text-berkeley-blue hover:underline">
              /nominate
            </Link>
            , linked from the spotlight on the homepage.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          <section className="rounded-xl border border-black/10 bg-white p-6 md:p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-sm uppercase tracking-[0.12em] text-ink">
                To review
              </h2>
              <span className="text-xs text-ink/45">
                {toReview.length} {toReview.length === 1 ? "alumna" : "alumnae"}
              </span>
            </div>
            {toReview.length === 0 ? (
              <p className="mt-4 text-sm text-ink/55">
                Nothing waiting. Everything has been reviewed.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <Table rows={toReview} />
              </div>
            )}
          </section>

          {reviewed.length > 0 && (
            <section className="rounded-xl border border-black/10 bg-white p-6 md:p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-display text-sm uppercase tracking-[0.12em] text-ink">
                  Reviewed
                </h2>
                <span className="text-xs text-ink/45">{reviewed.length}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">
                Kept for reference. A fresh nomination moves someone back to the
                top list automatically.
              </p>
              <div className="mt-4 overflow-x-auto">
                <Table rows={reviewed} />
              </div>
            </section>
          )}
        </div>
      )}

      <p className="mt-8 text-xs leading-relaxed text-ink/45">
        Ready to feature someone?{" "}
        <Link href="/admin/spotlights/new" className="font-medium text-berkeley-blue hover:underline">
          Create her spotlight
        </Link>{" "}
        and mark her reviewed here.
      </p>
    </AdminShell>
  );
}
