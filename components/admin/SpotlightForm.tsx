"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import { saveSpotlight, removeSpotlight } from "@/app/admin/spotlights/actions";
import { TextField, TextArea, FormError, Card } from "@/components/admin/Field";
import PhotoField from "@/components/admin/PhotoField";
import type { SpotlightItem } from "@/lib/types";

/**
 * Laid out as the seven numbered questions of the 2026 spotlight template, in
 * the same order and wording, so whoever is entering a submission can copy
 * answers straight across from the document without hunting for fields.
 */

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-berkeley-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-ink disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save spotlight"}
    </button>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-berkeley-blue/10 text-[11px] font-semibold text-berkeley-blue">
        {n}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export default function SpotlightForm({
  spotlight,
  uploadsEnabled
}: {
  spotlight?: SpotlightItem;
  uploadsEnabled: boolean;
}) {
  const [state, formAction] = useFormState(saveSpotlight, {});

  return (
    <>
      <form action={formAction} className="space-y-6">
        {spotlight?.id && <input type="hidden" name="id" value={spotlight.id} />}

        <FormError message={state?.error} />

        <Card>
          <h2 className="mb-2 font-display text-sm uppercase tracking-[0.12em] text-ink">
            From the spotlight template
          </h2>
          <p className="mb-7 text-sm text-ink/55">
            Same seven questions, same order. Light edits are fine: the aim is
            connection, not promotion.
          </p>

          <div className="space-y-7">
            <Step n={1}>
              <TextField
                name="name"
                label="Full name"
                hint="as she would like it to appear publicly"
                required
                maxLength={120}
                defaultValue={spotlight?.name}
                placeholder="Her full name"
              />
            </Step>

            <Step n={2}>
              <PhotoField
                defaultValue={spotlight?.photoUrl}
                uploadsEnabled={uploadsEnabled}
              />
              <p className="mt-2 text-xs text-ink/45">
                The template asks for a square headshot, at least 500×500.
              </p>
            </Step>

            <Step n={3}>
              <TextField
                name="gradYear"
                label="Year graduated and program"
                maxLength={80}
                defaultValue={spotlight?.gradYear}
                placeholder="MBA, Class of 2015"
              />
            </Step>

            <Step n={4}>
              <TextField
                name="title"
                label="Current title and company"
                maxLength={160}
                defaultValue={spotlight?.title}
                placeholder="VP of Marketing, ABC Corp"
              />
            </Step>

            <Step n={5}>
              <TextField
                name="involvement"
                label="WILA involvement"
                hint="one line"
                maxLength={160}
                defaultValue={spotlight?.involvement}
                placeholder="Organizer, SF Chapter Fall Mixer"
              />
            </Step>

            <Step n={6}>
              <TextArea
                name="bio"
                label="Bio"
                hint="3 to 5 sentences, third person"
                required
                rows={6}
                maxLength={1500}
                defaultValue={spotlight?.bio}
                placeholder="What she is proud of, what Haas or WILA has meant to her, what she cares about outside work, advice for other Haas women. Two or three of those, not all."
              />
            </Step>

            <Step n={7}>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  name="linkedin"
                  label="LinkedIn or other way to connect"
                  type="url"
                  maxLength={500}
                  defaultValue={spotlight?.linkedin}
                  placeholder="https://www.linkedin.com/in/…"
                />
                <TextField
                  name="cta"
                  label="Call to action"
                  hint="optional"
                  maxLength={200}
                  defaultValue={spotlight?.cta}
                  placeholder="Connect with me on LinkedIn."
                />
              </div>
            </Step>
          </div>
        </Card>

        <Card>
          <h2 className="mb-5 font-display text-sm uppercase tracking-[0.12em] text-ink">
            Publishing
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              name="spotlightLabel"
              label="Spotlight label"
              hint="the badge over the photo"
              maxLength={40}
              defaultValue={spotlight?.spotlightLabel}
              placeholder="Q3 2026 Spotlight"
            />
            <TextField
              name="featuredFrom"
              label="Featured from"
              hint="the newest date wins the homepage"
              type="date"
              defaultValue={spotlight?.featuredFrom}
            />
          </div>
        </Card>

        <div className="flex items-center gap-3">
          <SaveButton />
          <Link
            href="/admin/spotlights"
            className="rounded-full border border-black/15 px-6 py-2.5 text-sm font-semibold text-ink/70 transition hover:bg-white"
          >
            Cancel
          </Link>
        </div>
      </form>

      {spotlight?.id && (
        <form action={removeSpotlight} className="mt-10 border-t border-black/10 pt-6">
          <input type="hidden" name="id" value={spotlight.id} />
          <h2 className="text-sm font-semibold text-ink">Delete this spotlight</h2>
          <p className="mt-1 text-sm text-ink/60">
            If this is the one currently on the homepage, the next most recent
            spotlight takes its place. This cannot be undone.
          </p>
          <button
            type="submit"
            className="mt-3 rounded-full border border-red-300 px-5 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-600 hover:text-white"
          >
            Delete spotlight
          </button>
        </form>
      )}
    </>
  );
}
