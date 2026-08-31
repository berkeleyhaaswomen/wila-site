"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import { saveSpotlight, removeSpotlight } from "@/app/admin/spotlights/actions";
import {
  TextField,
  TextArea,
  SelectField,
  FormError,
  Card
} from "@/components/admin/Field";
import PhotoField from "@/components/admin/PhotoField";
import { PILLARS, type SpotlightItem } from "@/lib/types";

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
          <h2 className="mb-5 font-serif text-lg text-ink">Who she is</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              name="name"
              label="Alumna name"
              required
              maxLength={120}
              defaultValue={spotlight?.name}
              placeholder="Priya Ramanathan"
            />
            <TextField
              name="gradYear"
              label="Class year"
              hint="optional"
              maxLength={40}
              defaultValue={spotlight?.gradYear}
              placeholder="MBA ’14"
            />
            <div className="sm:col-span-2">
              <TextField
                name="title"
                label="Current title"
                hint="the big headline on the card"
                maxLength={160}
                defaultValue={spotlight?.title}
                placeholder="VP of Product, Lumen Health"
              />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-5 font-serif text-lg text-ink">Her words</h2>
          <div className="space-y-5">
            <TextArea
              name="quote"
              label="Quote"
              required
              rows={6}
              maxLength={1200}
              defaultValue={spotlight?.quote}
              hint="shown as the pull quote — include the curly quotation marks"
              placeholder="“The most useful thing Haas gave me wasn’t a framework — it was permission…”"
            />
            <TextArea
              name="bio"
              label="Short bio"
              hint="optional"
              rows={4}
              maxLength={1500}
              defaultValue={spotlight?.bio}
              placeholder="Priya leads the product org at Lumen Health…"
            />
          </div>
        </Card>

        <Card>
          <h2 className="mb-5 font-serif text-lg text-ink">Photo &amp; links</h2>
          <div className="space-y-5">
            <PhotoField
              defaultValue={spotlight?.photoUrl}
              uploadsEnabled={uploadsEnabled}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                name="linkedin"
                label="LinkedIn URL"
                hint="optional"
                type="url"
                maxLength={500}
                defaultValue={spotlight?.linkedin}
                placeholder="https://www.linkedin.com/in/…"
              />
              <TextField
                name="nominateUrl"
                label="'Nominate an alumna' link"
                hint="defaults to #contact"
                maxLength={500}
                defaultValue={spotlight?.nominateUrl}
                placeholder="#contact"
              />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-5 font-serif text-lg text-ink">Card details</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              name="spotlightLabel"
              label="Spotlight label"
              hint="the badge over the photo"
              maxLength={40}
              defaultValue={spotlight?.spotlightLabel}
              placeholder="Q2 2026 Spotlight"
            />
            <TextField
              name="featuredFrom"
              label="Featured from"
              hint="the newest date wins the homepage"
              type="date"
              defaultValue={spotlight?.featuredFrom}
            />
            <SelectField
              name="pillar"
              label="Pillar"
              options={PILLARS}
              includeBlank="— none —"
              defaultValue={spotlight?.pillar}
            />
            <TextField
              name="chapter"
              label="Chapter"
              maxLength={60}
              defaultValue={spotlight?.chapter}
              placeholder="Bay Area"
            />
            <TextField
              name="mentorCohort"
              label="Mentor cohort"
              maxLength={60}
              defaultValue={spotlight?.mentorCohort}
              placeholder="2024 – present"
            />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ink/50">
            Pillar, Chapter, and Mentor cohort make up the three-column strip at
            the bottom of the card. Leave any of them blank and it&apos;s left
            out rather than rendering an empty column.
          </p>
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
        <form
          action={removeSpotlight}
          className="mt-10 border-t border-black/10 pt-6"
        >
          <input type="hidden" name="id" value={spotlight.id} />
          <h2 className="text-sm font-semibold text-ink">
            Delete this spotlight
          </h2>
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
