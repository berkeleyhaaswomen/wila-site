#!/usr/bin/env node
/**
 * Applies db/schema.sql. Idempotent — run it as often as you like.
 *
 *   npm run db:migrate
 *
 * Reads DATABASE_URL from the environment (or .env.local).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

import { loadEnv } from "./load-env.mjs";

loadEnv();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "DATABASE_URL is not set.\n" +
      "Add it to .env.local (see .env.example), then re-run: npm run db:migrate"
  );
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(here, "..", "db", "schema.sql"), "utf8");

const client = new pg.Client({
  connectionString: url,
  ssl: /localhost|127\.0\.0\.1/.test(url)
    ? undefined
    : { rejectUnauthorized: false }
});

try {
  await client.connect();
  await client.query(sql);
  console.log("✓ Schema applied.");
} catch (err) {
  console.error("Migration failed:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
