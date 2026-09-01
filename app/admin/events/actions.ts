"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireUser } from "@/lib/auth";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  eventSlugTaken,
  type EventInput
} from "@/lib/repo";
import { slugify } from "@/lib/slug";
import { pacificInputToISO } from "@/lib/format";

export type EventFormState = { error?: string };

const schema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(160),
  slug: z
    .string()
    .trim()
    .max(120)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens."
    ),
  startsAt: z.string().trim().min(1, "Start date and time is required."),
  endsAt: z.string().trim().optional(),
  location: z.string().trim().min(1, "Location is required.").max(160),
  format: z.enum(["In person", "Virtual", "Hybrid"]),
  price: z.string().trim().max(60).optional(),
  blurb: z.string().trim().min(1, "Blurb is required.").max(800),
  rsvpUrl: z
    .string()
    .trim()
    .max(500)
    .refine((v) => !v || /^https?:\/\//.test(v), "Link must start with http:// or https://")
    .optional()
});

function parse(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const rawSlug = String(formData.get("slug") ?? "").trim();
  return schema.safeParse({
    title,
    // Empty slug is a convenience, not an error. Derive it from the title.
    slug: rawSlug || slugify(title),
    startsAt: String(formData.get("startsAt") ?? ""),
    endsAt: String(formData.get("endsAt") ?? ""),
    location: String(formData.get("location") ?? ""),
    format: String(formData.get("format") ?? ""),
    price: String(formData.get("price") ?? ""),
    blurb: String(formData.get("blurb") ?? ""),
    rsvpUrl: String(formData.get("rsvpUrl") ?? "")
  });
}

function toInput(v: z.infer<typeof schema>): EventInput {
  return {
    title: v.title,
    slug: v.slug,
    // Form times are Pacific wall-clock, not the server's zone.
    startsAt: pacificInputToISO(v.startsAt)!,
    endsAt: v.endsAt ? pacificInputToISO(v.endsAt) : null,
    location: v.location,
    format: v.format,
    price: v.price || null,
    blurb: v.blurb,
    rsvpUrl: v.rsvpUrl || null
  };
}

/** Refresh every surface that renders events. */
function revalidateEvents() {
  revalidatePath("/");
  revalidatePath("/admin/events");
  revalidatePath("/admin");
}

export async function saveEvent(
  _prev: EventFormState | undefined,
  formData: FormData
): Promise<EventFormState> {
  await requireUser("/admin/events");

  const id = String(formData.get("id") ?? "").trim() || null;
  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  if (!pacificInputToISO(parsed.data.startsAt)) {
    return { error: "Start date and time isn't a valid date." };
  }
  if (parsed.data.endsAt && !pacificInputToISO(parsed.data.endsAt)) {
    return { error: "End date and time isn't a valid date." };
  }

  if (await eventSlugTaken(parsed.data.slug, id ?? undefined)) {
    return { error: `Another event already uses the slug "${parsed.data.slug}".` };
  }

  try {
    if (id) await updateEvent(id, toInput(parsed.data));
    else await createEvent(toInput(parsed.data));
  } catch (err) {
    console.error("[admin] saveEvent failed:", err);
    return { error: "Couldn't save. Please try again." };
  }

  revalidateEvents();
  redirect("/admin/events?saved=1");
}

export async function removeEvent(formData: FormData): Promise<void> {
  await requireUser("/admin/events");
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  await deleteEvent(id);
  revalidateEvents();
  redirect("/admin/events?deleted=1");
}
