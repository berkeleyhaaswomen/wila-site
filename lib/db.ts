import { Pool } from "pg";

/**
 * Postgres connection.
 *
 * Works with any Postgres provider (Neon, Supabase, Vercel Postgres, RDS).
 * the only configuration is DATABASE_URL. If it isn't set, callers fall back
 * to the hardcoded content in lib/content.ts, so the public site still builds
 * and renders in a fresh clone.
 *
 * Everything here reads process.env *lazily*, inside functions. Reading it at
 * module scope looks equivalent but isn't: bundlers can fold a module-scope
 * `process.env.X` into a literal at build time, and Vercel deliberately hides
 * Secret-type variables from the build. That combination bakes in an empty
 * string and the deployed site reports "database not configured" no matter
 * what's in the dashboard.
 *
 * The pool is cached on globalThis because Next.js dev (and serverless warm
 * starts) re-evaluate modules; without this we'd leak a pool per reload.
 */

function connectionString(): string {
  return process.env.DATABASE_URL ?? "";
}

/** True when a database is configured. Call it; don't hoist it to a const. */
export function dbConfigured(): boolean {
  return connectionString().length > 0;
}

declare global {
  // eslint-disable-next-line no-var
  var __wilaPool: Pool | undefined;
}

function createPool(url: string): Pool {
  return new Pool({
    connectionString: url,
    // Hosted Postgres (Neon/Supabase/Vercel) requires TLS. Local dev against a
    // plain postgres:// on localhost does not.
    ssl: /localhost|127\.0\.0\.1/.test(url)
      ? undefined
      : { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000
  });
}

/** The pool, created on first use. Null when DATABASE_URL isn't set. */
export function getPool(): Pool | null {
  const url = connectionString();
  if (!url) return null;
  return (globalThis.__wilaPool ??= createPool(url));
}

/**
 * Run a parameterised query. Always pass values as parameters ($1, $2, …).
 * Never interpolate user input into the SQL string.
 */
export async function query<T = any>(
  text: string,
  params: readonly unknown[] = []
): Promise<T[]> {
  const pool = getPool();
  if (!pool) throw new Error("DATABASE_URL is not set");
  const res = await pool.query(text, params as unknown[]);
  return res.rows as T[];
}

/** Convenience for queries that return at most one row. */
export async function queryOne<T = any>(
  text: string,
  params: readonly unknown[] = []
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
