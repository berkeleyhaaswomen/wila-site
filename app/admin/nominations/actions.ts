"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { deleteNomination, setNominationStatus } from "@/lib/repo";

function refresh() {
  revalidatePath("/admin/nominations");
  revalidatePath("/admin");
}

/** Moves a nominee between the "to review" and "reviewed" piles. */
export async function markNomination(formData: FormData): Promise<void> {
  await requireUser("/admin/nominations");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || (status !== "new" && status !== "reviewed")) return;
  await setNominationStatus(id, status);
  refresh();
}

/** Removes a nomination entirely, for spam or a mistaken entry. */
export async function removeNomination(formData: FormData): Promise<void> {
  await requireUser("/admin/nominations");
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteNomination(id);
  refresh();
}
