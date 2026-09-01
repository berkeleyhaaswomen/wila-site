"use client";

import { useMemo, useState } from "react";

import { removeMember } from "./actions";
import { MEMBER_FIELDS, type MemberField } from "@/lib/types";
import type { MemberRow } from "@/lib/repo";

/**
 * The member list, plus the export panel.
 *
 * Export happens entirely in the browser: the rows are already on the page, so
 * building a CSV needs no round trip and no endpoint that could leak the list.
 * Both a file download and a clipboard copy are offered because pasting
 * straight into an email client is usually the faster path.
 */

/** RFC 4180 quoting. Anything with a comma, quote or newline gets wrapped. */
function csvCell(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function formatValue(m: MemberRow, key: MemberField): string {
  const raw = m[key];
  if (raw === null || raw === undefined) return "";
  if (key === "createdAt") {
    const d = new Date(raw);
    return Number.isNaN(d.getTime())
      ? ""
      : d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          timeZone: "America/Los_Angeles"
        });
  }
  return String(raw);
}

export default function MembersTable({ members }: { members: MemberRow[] }) {
  const [selected, setSelected] = useState<MemberField[]>(["name", "email"]);
  const [copied, setCopied] = useState<string | null>(null);

  const toggle = (key: MemberField) =>
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  // Keep the export column order stable, matching the table.
  const columns = useMemo(
    () => MEMBER_FIELDS.filter((f) => selected.includes(f.key)),
    [selected]
  );

  const csv = useMemo(() => {
    if (!columns.length) return "";
    const head = columns.map((c) => csvCell(c.label)).join(",");
    const body = members.map((m) =>
      columns.map((c) => csvCell(formatValue(m, c.key))).join(",")
    );
    return [head, ...body].join("\r\n");
  }, [columns, members]);

  /** Tab-separated instead, which pastes into Sheets and Excel as columns. */
  const tsv = useMemo(() => {
    if (!columns.length) return "";
    const head = columns.map((c) => c.label).join("\t");
    const body = members.map((m) =>
      columns.map((c) => formatValue(m, c.key).replace(/\t/g, " ")).join("\t")
    );
    return [head, ...body].join("\n");
  }, [columns, members]);

  const emails = useMemo(
    () => members.map((m) => m.email).join(", "),
    [members]
  );

  async function copy(text: string, what: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard access can be refused; fall back to a selectable prompt.
      window.prompt("Copy the text below", text);
    }
    setCopied(what);
    setTimeout(() => setCopied(null), 2200);
  }

  function download() {
    // Pacific, to match the dates inside the file. toISOString would be UTC
    // and could name the file a day ahead of every row in it.
    const stamp = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date());
    const blob = new Blob([`﻿${csv}`], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wila-members-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {/* ---------------------------------------------------------- export -- */}
      <div className="mt-8 rounded-xl border border-black/10 bg-white p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-sm uppercase tracking-[0.12em] text-ink">
            Export
          </h2>
          <span className="text-xs text-ink/45">
            {members.length} {members.length === 1 ? "member" : "members"}
          </span>
        </div>

        <p className="mt-2 text-sm text-ink/60">
          Tick the columns you need, then download a spreadsheet or copy the
          rows straight into an email.
        </p>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
          {MEMBER_FIELDS.map((f) => (
            <label key={f.key} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={selected.includes(f.key)}
                onChange={() => toggle(f.key)}
                className="h-4 w-4 rounded border-black/25 accent-berkeley-blue"
              />
              <span className="text-sm text-ink/80">{f.label}</span>
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={download}
            disabled={!columns.length || !members.length}
            className="rounded-full bg-berkeley-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            Download CSV
          </button>
          <button
            type="button"
            onClick={() => copy(tsv, "rows")}
            disabled={!columns.length || !members.length}
            className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold text-ink/75 transition hover:bg-soft-gray disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copied === "rows" ? "Copied" : "Copy rows"}
          </button>
          <button
            type="button"
            onClick={() => copy(emails, "emails")}
            disabled={!members.length}
            className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold text-ink/75 transition hover:bg-soft-gray disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copied === "emails" ? "Copied" : "Copy every email"}
          </button>
          {!columns.length && (
            <span className="text-xs text-ink/45">Pick at least one column.</span>
          )}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-ink/45">
          &ldquo;Copy every email&rdquo; gives a comma-separated list ready to
          paste into the BCC field. Use BCC, not To, so members cannot see each
          other&apos;s addresses.
        </p>
      </div>

      {/* ----------------------------------------------------------- table -- */}
      {members.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-black/20 bg-white/60 p-12 text-center">
          <p className="text-sm text-ink/60">
            Nobody has signed up yet. The form is live at{" "}
            <a href="/join" className="font-semibold text-berkeley-blue hover:underline">
              /join
            </a>
            .
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-black/10 bg-white p-2">
          <table className="w-full min-w-[860px] text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-ink/50">
                <th className="px-4 py-2 font-semibold">Name</th>
                <th className="px-4 py-2 font-semibold">Email</th>
                <th className="px-4 py-2 font-semibold">Year</th>
                <th className="px-4 py-2 font-semibold">Program</th>
                <th className="px-4 py-2 font-semibold">LinkedIn</th>
                <th className="px-4 py-2 font-semibold">Signed up</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-t border-black/5 align-top">
                  <td className="px-4 py-3 font-semibold text-ink">{m.name}</td>
                  <td className="px-4 py-3 text-sm">
                    <a
                      href={`mailto:${m.email}`}
                      className="text-berkeley-blue hover:underline"
                    >
                      {m.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-sm text-ink/70">
                    {m.gradYear || "Not given"}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink/70">
                    {m.program || "Not given"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {m.linkedin ? (
                      <a
                        href={m.linkedin}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-berkeley-blue hover:underline"
                      >
                        Verify
                      </a>
                    ) : (
                      <span className="text-ink/40">Not given</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink/55">
                    {formatValue(m, "createdAt")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={removeMember}>
                      <input type="hidden" name="id" value={m.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-600 hover:text-white"
                      >
                        Remove
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
