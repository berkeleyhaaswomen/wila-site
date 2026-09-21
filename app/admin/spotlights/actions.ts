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
    "Links must start with http:// or https://"
  )
  .optional();

/**
 * Mirrors the 2026 spotlight template. Name and bio are the two things a
 * spotlight cannot go live without; everything else is shown when present
 * and left out cleanly when not.
 */
const schema = z.object({
  name: z.string().trim().min(1, "Full name is required.").max(120),
  gradYear: z.string().trim().max(80).optional(),
  title: z.string().trim().max(160).optional(),
  involvement: z.string().trim().max(160).optional(),
  bio: z
    .string()
    .trim()
    .min(1, "The bio is required. It is the heart of the spotlight.")
    .max(1500),
  linkedin: optionalUrl,
  cta: z.string().trim().max(200).optional(),
  photoUrl: z
    .string()
    .trim()
    .max(500)
    .refine(
      (v) => !v || /^(https?:\/\/|\/api\/images\/)/.test(v),
      "The photo must be an uploaded file or a full https:// link."
    )
    .optional(),
  spotlightLabel: z.string().trim().max(40).optional(),
  featuredFrom: z.string().trim().max(20).optional()
});

function parse(formData: FormData) {
  const get = (k: string) => String(formData.get(k) ?? "");
  return schema.safeParse({
    name: get("name"),
    gradYear: get("gradYear"),
    title: get("title"),
    involvement: get("involvement"),
    bio: get("bio"),
    linkedin: get("linkedin"),
    cta: get("cta"),
    photoUrl: get("photoUrl"),
    spotlightLabel: get("spotlightLabel"),
    featuredFrom: get("featuredFrom")
  });
}

function toInput(v: z.infer<typeof schema>): SpotlightInput {
  return {
    name: v.name,
    gradYear: v.gradYear || null,
    title: v.title || null,
    involvement: v.involvement || null,
    bio: v.bio,
    linkedin: v.linkedin || null,
    cta: v.cta || null,
    photoUrl: v.photoUrl || null,
    spotlightLabel: v.spotlightLabel || null,
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
