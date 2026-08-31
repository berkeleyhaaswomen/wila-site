#!/usr/bin/env node
/**
 * Creates (or updates) an admin account.
 *
 *   npm run admin:create
 *
 * Prompts for the password with the input hidden, so it is never written to
 * your shell history, a file, or this repo. Use this to bootstrap the very
 * first superadmin; after that, superadmins can add people from /admin/users.
 */
import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";
import pg from "pg";
import bcrypt from "bcryptjs";

import { loadEnvForTarget, positionalArgs } from "./load-env.mjs";

const { prod, file } = loadEnvForTarget();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(`DATABASE_URL is not set in ${file}.`);
  process.exit(1);
}

if (prod) {
  const host = url.replace(/^.*@/, "").replace(/\/.*$/, "");
  console.log(`Target: PRODUCTION (${host})\n`);
}

// Two input paths, because Node's readline behaves differently on each:
//
//   TTY  — rl.question() with output muted for password prompts, so nothing
//          typed is echoed to the screen.
//   pipe — rl.question() can only be called once on a non-TTY stdin (the
//          second call never resolves), so read lines off the async iterator
//          instead. This is what makes the script testable and scriptable.
const isTty = Boolean(stdin.isTTY);

const rl = createInterface({
  input: stdin,
  output: isTty ? stdout : undefined,
  terminal: isTty
});

let muted = false;
if (isTty) {
  const write = rl._writeToOutput.bind(rl);
  rl._writeToOutput = (str) => {
    if (!muted) write(str);
  };
}

const lines = isTty ? null : rl[Symbol.asyncIterator]();

function ask(query, { hidden = false } = {}) {
  if (!isTty) {
    return lines.next().then(({ value }) => String(value ?? "").trim());
  }
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      if (muted) {
        muted = false;
        stdout.write("\n"); // the newline the user's Enter didn't echo
      }
      resolve(answer.trim());
    });
    // rl.question writes the prompt synchronously, so muting here hides only
    // what gets typed afterwards.
    muted = hidden;
  });
}

let exitCode = 0;

// Built only once the prompts are done: constructing a pg.Client parses the
// connection string, and on Neon that prints an sslmode deprecation notice
// which lands on top of the first prompt and makes it look like a hang.
let client = null;
function connectionClient() {
  return new pg.Client({
    connectionString: url,
    ssl: /localhost|127\.0\.0\.1/.test(url)
      ? undefined
      : { rejectUnauthorized: false }
  });
}

try {
  const email = (positionalArgs()[0] || (await ask("Email: "))).toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw new Error("That doesn't look like an email address.");
  }

  const name = await ask("Display name (optional): ");

  const roleAnswer =
    (await ask("Role — [1] superadmin, [2] admin (default 1): ")) || "1";
  const role = roleAnswer === "2" ? "admin" : "superadmin";

  const password = await ask("Password (min 12 chars, hidden): ", {
    hidden: true
  });
  if (password.length < 12) {
    throw new Error("Password must be at least 12 characters.");
  }

  const confirm = await ask("Confirm password: ", { hidden: true });
  if (password !== confirm) {
    throw new Error("Passwords didn't match.");
  }

  client = connectionClient();
  await client.connect();
  const hash = await bcrypt.hash(password, 12);
  const { rows } = await client.query(
    `INSERT INTO users (email, name, role, password_hash)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (lower(email)) DO UPDATE
       SET password_hash = EXCLUDED.password_hash,
           role = EXCLUDED.role,
           name = COALESCE(EXCLUDED.name, users.name)
     RETURNING id, email, role`,
    [email, name || null, role, hash]
  );
  const u = rows[0];

  // The first superadmin becomes the owner: the one account no other super
  // admin can demote, remove, or reset the password of.
  let becameOwner = false;
  if (u.role === "superadmin") {
    const { rowCount } = await client.query(
      `UPDATE users SET is_owner = true
       WHERE id = $1 AND NOT EXISTS (SELECT 1 FROM users WHERE is_owner)`,
      [u.id]
    );
    becameOwner = rowCount > 0;
  }

  console.log(`\n✓ ${u.email} is now a ${u.role}.`);
  if (becameOwner) {
    console.log(
      "  They are also the OWNER — no other super admin can remove or demote them."
    );
  }
  console.log(
    "  Sign in at /admin/login — they can change the password from Account."
  );
} catch (err) {
  console.error(`\n${err.message}`);
  exitCode = 1;
} finally {
  rl.close();
  if (client) await client.end().catch(() => {});
  process.exit(exitCode);
}
