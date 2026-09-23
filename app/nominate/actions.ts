"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { dbConfigured } from "@/lib/db";
import { addNomination } from "@/lib/repo";

export type NominateState = { error?: string; ok?: boolean; name?: string };

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter her full name.")
    .max(160),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address for her.")
    .max(200)
});

/**
 * Records a spotlight nomination from the public form.
 *
 * Nominating the same alumna again raises her count rather than creating a
 * second entry, so the board sees one row per person with the support behind
 * her. Nothing is sent to the nominee: the board reaches out themselves after
 * reviewing.
 */
export async function nominateAlumna(
  _prev: NominateState | undefined,
  formData: FormData
): Promise<NominateState> {
  // Honeypot, same as the join form. Bots fill every field they find.
  if (String(formData.get("company") ?? "").trim() !== "") {
    return { ok: true };
  }

  if (!dbConfigured()) {
    return {
      error:
        "Nominations are not available right now. Please email wila@haas.berkeley.edu."
    };
  }

  const parsed = schema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? "")
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  try {
    await addNomination(parsed.data);
  } catch (err) {
    console.error("[nominate] could not record nomination:", err);
    return { error: "Something went wrong. Please try again in a moment." };
  }

  revalidatePath("/admin/nominations");
  revalidatePath("/admin");
  return { ok: true, name: parsed.data.name };
}
