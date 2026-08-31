import { Pool } from "pg";

/**
 * Postgres connection.
 *
 * Works with any Postgres provider (Neon, Supabase, Vercel Postgres, RDS) —
 * the only configuration is DATABASE_URL. If it isn't set, `db` is null and
 * callers fall back to the hardcoded content in lib/content.ts, so the public
 * site still builds and renders in a fresh clone.
 *
 * The pool is cached on globalThis because Next.js dev (and serverless warm
 * starts) re-evaluate modules; without this we'd leak a pool per reload.
 */

const connectionString = process.env.DATABASE_URL ?? "";

export const dbConfigured = connectionString.length > 0;

declare global {
  // eslint-disable-next-line no-var
  var __wilaPool: Pool | undefined;
}

function createPool(): Pool {
  return new Pool({
    connectionString,
    // Hosted Postgres (Neon/Supabase/Vercel) requires TLS. Local dev against a
    // plain postgres:// on localhost does not.
    ssl: /localhost|127\.0\.0\.1/.test(connectionString)
      ? undefined
      : { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000
  });
}

export const db: Pool | null = dbConfigured
  ? (globalThis.__wilaPool ??= createPool())
  : null;

/**
 * Run a parameterised query. Always pass values as parameters ($1, $2, …) —
 * never interpolate user input into the SQL string.
 */
export async function query<T = any>(
  text: string,
  params: readonly unknown[] = []
): Promise<T[]> {
  if (!db) throw new Error("DATABASE_URL is not set");
  const res = await db.query(text, params as unknown[]);
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
