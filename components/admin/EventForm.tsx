"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import { saveEvent, removeEvent } from "@/app/admin/events/actions";
import {
  TextField,
  TextArea,
  SelectField,
  FormError,
  Card
} from "@/components/admin/Field";
import { EVENT_FORMATS, type EventItem } from "@/lib/types";

/** <input type="datetime-local"> wants `YYYY-MM-DDTHH:mm` in local time. */
function toLocalInput(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-berkeley-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-ink disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save event"}
    </button>
  );
}

export default function EventForm({ event }: { event?: EventItem }) {
  const [state, formAction] = useFormState(saveEvent, {});

  return (
    <>
      <form action={formAction} className="space-y-6">
        {event?.id && <input type="hidden" name="id" value={event.id} />}

        <FormError message={state?.error} />

        <Card>
          <div className="space-y-5">
            <TextField
              name="title"
              label="Event title"
              required
              maxLength={160}
              defaultValue={event?.title}
              placeholder="Reclaim Your Ambitions: A Sustainable Approach to Thriving"
            />
            <TextField
              name="slug"
              label="Slug"
              hint="Leave blank to generate from the title"
              maxLength={120}
              defaultValue={event?.slug}
              placeholder="reclaim-your-ambitions"
            />
            <TextArea
              name="blurb"
              label="Blurb"
              required
              rows={4}
              maxLength={800}
              defaultValue={event?.blurb}
              placeholder="A transformative workshop with Haas alum and life-work strategist…"
            />
          </div>
        </Card>

        <Card>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              name="startsAt"
              label="Starts at"
              type="datetime-local"
              required
              defaultValue={toLocalInput(event?.startsAt)}
            />
            <TextField
              name="endsAt"
              label="Ends at"
              hint="optional"
              type="datetime-local"
              defaultValue={toLocalInput(event?.endsAt)}
            />
            <TextField
              name="location"
              label="Location"
              required
              maxLength={160}
              defaultValue={event?.location}
              placeholder="Pleasanton, CA — or Zoom"
            />
            <SelectField
              name="format"
              label="Format"
              required
              options={EVENT_FORMATS}
              defaultValue={event?.format ?? "In person"}
            />
            <TextField
              name="price"
              label="Price"
              hint="optional"
              maxLength={60}
              defaultValue={event?.price}
              placeholder="Free, or $75"
            />
            <TextField
              name="rsvpUrl"
              label="RSVP / recap link"
              hint="optional"
              type="url"
              maxLength={500}
              defaultValue={event?.rsvpUrl}
              placeholder="https://wila.haasalumni.org/event/…"
            />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ink/50">
            The public site labels this link &ldquo;RSVP&rdquo; for upcoming
            events and &ldquo;View recap&rdquo; for past ones, and moves the
            event between Upcoming and Past automatically based on its start
            time.
          </p>
        </Card>

        <div className="flex items-center gap-3">
          <SaveButton />
          <Link
            href="/admin/events"
            className="rounded-full border border-black/15 px-6 py-2.5 text-sm font-semibold text-ink/70 transition hover:bg-white"
          >
            Cancel
          </Link>
        </div>
      </form>

      {event?.id && (
        <form
          action={removeEvent}
          className="mt-10 border-t border-black/10 pt-6"
        >
          <input type="hidden" name="id" value={event.id} />
          <h2 className="text-sm font-semibold text-ink">Delete this event</h2>
          <p className="mt-1 text-sm text-ink/60">
            This removes it from the public site immediately and cannot be
            undone.
          </p>
          <button
            type="submit"
            className="mt-3 rounded-full border border-red-300 px-5 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-600 hover:text-white"
          >
            Delete event
          </button>
        </form>
      )}
    </>
  );
}
