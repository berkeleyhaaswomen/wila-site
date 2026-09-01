"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireSuperadmin, hashPassword, passwordProblem } from "@/lib/auth";
import {
  createUser,
  deleteUser,
  findUserByEmail,
  updateUserRole,
  updateUserPassword,
  countSuperadmins,
  transferOwnership,
  listUsers
} from "@/lib/repo";

export type UserFormState = { error?: string; ok?: string };

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  name: z.string().trim().max(120).optional(),
  role: z.enum(["superadmin", "admin"]),
  password: z.string()
});

function revalidateUsers() {
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

/** Add a new person who can manage the website. Superadmins only. */
export async function addUser(
  _prev: UserFormState | undefined,
  formData: FormData
): Promise<UserFormState> {
  await requireSuperadmin("/admin/users");

  const parsed = schema.safeParse({
    email: String(formData.get("email") ?? ""),
    name: String(formData.get("name") ?? ""),
    role: String(formData.get("role") ?? "admin"),
    password: String(formData.get("password") ?? "")
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const problem = passwordProblem(parsed.data.password);
  if (problem) return { error: problem };

  if (await findUserByEmail(parsed.data.email)) {
    return { error: "Someone with that email already has access." };
  }

  try {
    await createUser({
      email: parsed.data.email,
      name: parsed.data.name || null,
      role: parsed.data.role,
      passwordHash: await hashPassword(parsed.data.password)
    });
  } catch (err) {
    console.error("[admin] addUser failed:", err);
    return { error: "Couldn't add that person. Please try again." };
  }

  revalidateUsers();
  redirect("/admin/users?added=1");
}

/**
 * Change someone's role. Refuses to demote the last superadmin — otherwise
 * nobody could ever manage users again.
 */
export async function changeRole(formData: FormData): Promise<void> {
  const me = await requireSuperadmin("/admin/users");

  const id = String(formData.get("id") ?? "").trim();
  const role = String(formData.get("role") ?? "");
  if (!id || (role !== "superadmin" && role !== "admin")) return;

  const users = await listUsers();
  const target = users.find((u) => u.id === id);
  if (!target) return;

  // Only the owner can change the owner's role.
  if (target.isOwner && target.id !== me.id) {
    redirect("/admin/users?error=owner-protected");
  }

  if (
    target.role === "superadmin" &&
    role === "admin" &&
    (await countSuperadmins()) <= 1
  ) {
    redirect("/admin/users?error=last-superadmin");
  }

  // The owner must stay a super admin; demoting them would leave an account
  // nobody can manage.
  if (target.isOwner && role === "admin") {
    redirect("/admin/users?error=owner-must-be-superadmin");
  }

  await updateUserRole(id, role);
  revalidateUsers();
  redirect(id === me.id && role === "admin" ? "/admin" : "/admin/users?updated=1");
}

/** Remove someone's access entirely. */
export async function removeUser(formData: FormData): Promise<void> {
  const me = await requireSuperadmin("/admin/users");

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  if (id === me.id) redirect("/admin/users?error=self-delete");

  const users = await listUsers();
  const target = users.find((u) => u.id === id);
  if (!target) return;

  // The owner can only be removed by transferring ownership first.
  if (target.isOwner) redirect("/admin/users?error=owner-protected");

  if (target.role === "superadmin" && (await countSuperadmins()) <= 1) {
    redirect("/admin/users?error=last-superadmin");
  }

  await deleteUser(id);
  revalidateUsers();
  redirect("/admin/users?removed=1");
}

/** Set someone else's password, for when they're locked out. */
export async function resetUserPassword(
  _prev: UserFormState | undefined,
  formData: FormData
): Promise<UserFormState> {
  const me = await requireSuperadmin("/admin/users");

  const id = String(formData.get("id") ?? "").trim();

  // Resetting someone's password is equivalent to taking over their account,
  // so the owner's password is off-limits to everyone but the owner.
  const target = (await listUsers()).find((u) => u.id === id);
  if (target?.isOwner && target.id !== me.id) {
    return { error: "Only the owner can change the owner's password." };
  }
  const password = String(formData.get("password") ?? "");
  if (!id) return { error: "Missing user." };

  const problem = passwordProblem(password);
  if (problem) return { error: problem };

  await updateUserPassword(id, await hashPassword(password));
  revalidateUsers();
  return { ok: "Password reset. Share it with them privately, and ask them to change it." };
}

/**
 * Hand ownership to another super admin. Only the current owner can do this,
 * and it's the only way the owner's protection is ever lifted.
 */
export async function makeOwner(formData: FormData): Promise<void> {
  const me = await requireSuperadmin("/admin/users");
  if (!me.isOwner) redirect("/admin/users?error=owner-only");

  const id = String(formData.get("id") ?? "").trim();
  if (!id || id === me.id) return;

  const target = (await listUsers()).find((u) => u.id === id);
  if (!target) return;

  await transferOwnership(id);
  revalidateUsers();
  redirect("/admin/users?owner=1");
}
