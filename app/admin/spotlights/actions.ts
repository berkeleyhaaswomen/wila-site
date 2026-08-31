"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireUser } from "@/lib/auth";
import {
  createSpotlight,
  updateSpotlight,
  deleteSpotlight,
  type SpotlightInput
} from "@/lib/repo";

export type SpotlightFormState = { error?: string };

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) => !v || /^https?:\/\//.test(v),
    "Link must start with http:// or https://"
  )
  .optional();

const schema = z.object({
  name: z.string().trim().min(1, "Alumna name is required.").max(120),
  gradYear: z.string().trim().max(40).optional(),
  spotlightLabel: z.string().trim().max(40).optional(),
  title: z.string().trim().max(160).optional(),
  quote: z.string().trim().min(1, "The quote is required.").max(1200),
  bio: z.string().trim().max(1500).optional(),
  linkedin: optionalUrl,
  photoUrl: optionalUrl,
  pillar: z.string().trim().max(60).optional(),
  chapter: z.string().trim().max(60).optional(),
  mentorCohort: z.string().trim().max(60).optional(),
  // Allows an on-page anchor like #contact as well as a full URL.
  nominateUrl: z
    .string()
    .trim()
    .max(500)
    .refine(
      (v) => !v || /^(https?:\/\/|#|\/)/.test(v),
      "Must be a full URL, an anchor like #contact, or a path like /nominate"
    )
    .optional(),
  featuredFrom: z.string().trim().max(20).optional()
});

function parse(formData: FormData) {
  const get = (k: string) => String(formData.get(k) ?? "");
  return schema.safeParse({
    name: get("name"),
    gradYear: get("gradYear"),
    spotlightLabel: get("spotlightLabel"),
    title: get("title"),
    quote: get("quote"),
    bio: get("bio"),
    linkedin: get("linkedin"),
    photoUrl: get("photoUrl"),
    pillar: get("pillar"),
    chapter: get("chapter"),
    mentorCohort: get("mentorCohort"),
    nominateUrl: get("nominateUrl"),
    featuredFrom: get("featuredFrom")
  });
}

function toInput(v: z.infer<typeof schema>): SpotlightInput {
  return {
    name: v.name,
    gradYear: v.gradYear || null,
    spotlightLabel: v.spotlightLabel || null,
    title: v.title || null,
    quote: v.quote,
    bio: v.bio || null,
    linkedin: v.linkedin || null,
    photoUrl: v.photoUrl || null,
    pillar: v.pillar || null,
    chapter: v.chapter || null,
    mentorCohort: v.mentorCohort || null,
    nominateUrl: v.nominateUrl || null,
    featuredFrom: v.featuredFrom || null
  };
}

function revalidateSpotlights() {
  revalidatePath("/");
  revalidatePath("/admin/spotlights");
  revalidatePath("/admin");
}

export async function saveSpotlight(
  _prev: SpotlightFormState | undefined,
  formData: FormData
): Promise<SpotlightFormState> {
  await requireUser("/admin/spotlights");

  const id = String(formData.get("id") ?? "").trim() || null;
  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  if (
    parsed.data.featuredFrom &&
    Number.isNaN(new Date(parsed.data.featuredFrom).getTime())
  ) {
    return { error: "'Featured from' isn't a valid date." };
  }

  try {
    if (id) await updateSpotlight(id, toInput(parsed.data));
    else await createSpotlight(toInput(parsed.data));
  } catch (err) {
    console.error("[admin] saveSpotlight failed:", err);
    return { error: "Couldn't save. Please try again." };
  }

  revalidateSpotlights();
  redirect("/admin/spotlights?saved=1");
}

export async function removeSpotlight(formData: FormData): Promise<void> {
  await requireUser("/admin/spotlights");
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  await deleteSpotlight(id);
  revalidateSpotlights();
  redirect("/admin/spotlights?deleted=1");
}
