"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireSuperadmin } from "@/lib/auth";
import { deleteMember } from "@/lib/repo";

/**
 * Removes a member record.
 *
 * Superadmin only, like the rest of this page: the members table is the one
 * place holding personal data collected from outside the board.
 */
export async function removeMember(formData: FormData): Promise<void> {
  await requireSuperadmin("/admin/members");
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  await deleteMember(id);
  revalidatePath("/admin/members");
  redirect("/admin/members?removed=1");
}
