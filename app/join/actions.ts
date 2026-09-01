"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { dbConfigured } from "@/lib/db";
import { upsertMember } from "@/lib/repo";
import { HAAS_PROGRAMS } from "@/lib/types";

export type JoinState = { error?: string; ok?: boolean };

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address.")
    .max(200),
  gradYear: z
    .string()
    .trim()
    .regex(/^(19|20)\d{2}$/, "Enter your graduation year as four digits.")
    .refine(
      (v) => Number(v) <= new Date().getFullYear() + 8,
      "That graduation year looks too far in the future."
    ),
  program: z
    .string()
    .trim()
    .refine((v) => (HAAS_PROGRAMS as readonly string[]).includes(v), "Pick your program."),
  linkedin: z
    .string()
    .trim()
    .max(300)
    .refine(
      (v) => /^https?:\/\/([a-z0-9-]+\.)?linkedin\.com\/.+/i.test(v),
      "Paste the full link to your LinkedIn profile, starting with https://"
    )
});

/**
 * Handles a membership request from the public form.
 *
 * The LinkedIn profile is the proof of affiliation: the board checks it before
 * adding anyone to the mailing list, which is why the field is required and
 * validated as a real LinkedIn URL rather than any link.
 */
export async function joinWila(
  _prev: JoinState | undefined,
  formData: FormData
): Promise<JoinState> {
  // Honeypot. A real person never fills a field they cannot see, so anything
  // in here is a bot and gets a success response without being stored.
  if (String(formData.get("company") ?? "").trim() !== "") {
    return { ok: true };
  }

  if (!dbConfigured()) {
    return {
      error:
        "Sign-ups are not available right now. Please email wila@haas.berkeley.edu."
    };
  }

  const parsed = schema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    gradYear: String(formData.get("gradYear") ?? ""),
    program: String(formData.get("program") ?? ""),
    linkedin: String(formData.get("linkedin") ?? "")
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  try {
    await upsertMember(parsed.data);
  } catch (err) {
    console.error("[join] could not record member:", err);
    return { error: "Something went wrong. Please try again in a moment." };
  }

  revalidatePath("/admin/members");
  return { ok: true };
}
