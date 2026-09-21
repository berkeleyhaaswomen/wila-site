"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { removeEventPhoto } from "@/app/admin/events/actions";
import { shrinkForUpload } from "@/lib/clientImage";
import type { EventPhoto } from "@/lib/repo";

/**
 * Photos for one event, managed from the event's edit page. After an event,
 * the host picks everything from their camera roll at once; each file is
 * shrunk in the browser and sent on its own, with a running count, so one bad
 * file does not sink the rest.
 */
export default function EventPhotos({
  eventId,
  photos
}: {
  eventId: string;
  photos: EventPhoto[];
}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  async function upload(files: FileList) {
    const list = Array.from(files);
    setErrors([]);
    setProgress({ done: 0, total: list.length });
    const failed: string[] = [];

    for (const [i, original] of list.entries()) {
      try {
        const body = new FormData();
        body.append("file", await shrinkForUpload(original));
        const res = await fetch(`/api/admin/events/${eventId}/photos`, {
          method: "POST",
          body
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          failed.push(data?.error ?? `${original.name} failed to upload.`);
        }
      } catch {
        failed.push(`${original.name} failed to upload.`);
      }
      setProgress({ done: i + 1, total: list.length });
    }

    setErrors(failed);
    setProgress(null);
    if (input.current) input.current.value = "";
    router.refresh();
  }

  const busy = progress !== null;

  return (
    <div className="rounded-xl border border-black/10 bg-white p-6 md:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-sm uppercase tracking-[0.12em] text-ink">
          Event photos
        </h2>
        <span className="text-xs text-ink/45">
          {photos.length} {photos.length === 1 ? "photo" : "photos"}
        </span>
      </div>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/60">
        Add photos after the event. They appear on the Photos page under this
        event, newest events first, and on the event&apos;s own listing. Pick
        as many as you like at once; large phone photos are resized
        automatically.
      </p>

      <input
        ref={input}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.length && upload(e.target.files)}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => input.current?.click()}
        className="mt-5 rounded-full bg-berkeley-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink disabled:opacity-60"
      >
        {busy ? `Uploading ${progress.done} of ${progress.total}…` : "Add photos"}
      </button>

      {errors.length > 0 && (
        <ul
          role="alert"
          className="mt-4 space-y-1 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {errors.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      )}

      {photos.length > 0 && (
        <ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {photos.map((p) => (
            <li key={p.id} className="group relative aspect-square overflow-hidden rounded-lg bg-soft-gray">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" className="h-full w-full object-cover" />
              <form
                action={removeEventPhoto}
                className="absolute right-1.5 top-1.5 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100"
              >
                <input type="hidden" name="photoId" value={p.id} />
                <input type="hidden" name="eventId" value={eventId} />
                <button
                  type="submit"
                  aria-label="Remove this photo"
                  className="grid h-7 w-7 place-items-center rounded-full bg-white/95 text-red-700 shadow transition hover:bg-red-600 hover:text-white"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
