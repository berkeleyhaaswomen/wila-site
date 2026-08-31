import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

import { queryOne } from "./db";

export type Role = "superadmin" | "admin";

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  isOwner: boolean;
};

const COOKIE = "wila_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

/**
 * The session cookie is a signed JWT. AUTH_SECRET must be set in production —
 * we refuse to fall back to a default, because a predictable secret would let
 * anyone mint an admin session.
 */
function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET ?? "";
  if (s.length < 32) {
    throw new Error(
      "AUTH_SECRET must be set to a random string of at least 32 characters. " +
        "Generate one with: openssl rand -base64 32"
    );
  }
  return new TextEncoder().encode(s);
}

// ---- passwords ---------------------------------------------------------

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/**
 * Minimum bar for admin passwords. Deliberately modest — length does the real
 * work, and rules people can't satisfy just push them toward "Password1!".
 */
export function passwordProblem(plain: string): string | null {
  if (plain.length < 12) return "Password must be at least 12 characters.";
  if (plain.length > 200) return "Password must be under 200 characters.";
  return null;
}

// ---- sessions ----------------------------------------------------------

export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());

  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS
  });
}

export function destroySession(): void {
  cookies().delete(COOKIE);
}

/**
 * Returns the signed-in user, or null. Re-reads the row from the database so
 * that a revoked user or a role change takes effect immediately rather than
 * waiting for the token to expire.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;

  let sub: string;
  try {
    const { payload } = await jwtVerify(token, secret());
    sub = String(payload.sub ?? "");
  } catch {
    return null;
  }
  if (!sub) return null;

  try {
    const row = await queryOne<{
      id: string;
      email: string;
      name: string | null;
      role: Role;
      is_owner: boolean;
    }>(`SELECT id, email, name, role, is_owner FROM users WHERE id = $1`, [sub]);
    return row ? { ...row, isOwner: Boolean(row.is_owner) } : null;
  } catch {
    return null;
  }
}

// ---- guards ------------------------------------------------------------

/** Any signed-in admin. Redirects to the login page when signed out. */
export async function requireUser(returnTo = "/admin"): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(`/admin/login?next=${encodeURIComponent(returnTo)}`);
  return user;
}

/** Superadmins only — used by everything under /admin/users. */
export async function requireSuperadmin(
  returnTo = "/admin"
): Promise<SessionUser> {
  const user = await requireUser(returnTo);
  if (user.role !== "superadmin") redirect("/admin?denied=superadmin");
  return user;
}
