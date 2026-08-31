"use server";

import { redirect } from "next/navigation";

import {
  createSession,
  destroySession,
  verifyPassword,
  hashPassword,
  passwordProblem,
  requireUser
} from "@/lib/auth";
import { findUserByEmail, updateUserPassword } from "@/lib/repo";
import { dbConfigured } from "@/lib/db";

/**
 * Sign in. Deliberately returns the same message for "no such user" and "wrong
 * password" so the form can't be used to enumerate which emails have accounts.
 */
export async function signIn(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }
  if (!dbConfigured) {
    return {
      error:
        "The database isn't configured yet. Set DATABASE_URL, then run: npm run db:migrate"
    };
  }

  let user;
  try {
    user = await findUserByEmail(email);
  } catch (err) {
    console.error("[admin] login lookup failed:", err);
    return { error: "Could not reach the database. Try again in a moment." };
  }

  const ok = user ? await verifyPassword(password, user.password_hash) : false;
  if (!user || !ok) {
    return { error: "That email and password don't match an account." };
  }

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isOwner: Boolean(user.is_owner)
  });

  // Only allow relative paths, so `?next=` can't be used as an open redirect.
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/admin");
}

export async function signOut(): Promise<void> {
  destroySession();
  redirect("/admin/login");
}

/** Change your own password. Requires the current one. */
export async function changeOwnPassword(
  _prev: { error?: string; ok?: string } | undefined,
  formData: FormData
): Promise<{ error?: string; ok?: string }> {
  const user = await requireUser("/admin/account");

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const row = await findUserByEmail(user.email);
  if (!row || !(await verifyPassword(current, row.password_hash))) {
    return { error: "Your current password isn't right." };
  }
  if (next !== confirm) return { error: "The new passwords don't match." };

  const problem = passwordProblem(next);
  if (problem) return { error: problem };

  await updateUserPassword(user.id, await hashPassword(next));
  return { ok: "Password updated." };
}
