import { existsSync, readFileSync } from "node:fs";

/**
 * Minimal .env reader for the CLI scripts. Next.js loads these itself at
 * runtime; the standalone scripts need their own tiny parser so we don't take
 * on a dependency for it. Values already in the environment always win.
 */
export function loadEnv(file = ".env.local") {
  if (!existsSync(file)) return;
  for (const raw of readFileSync(file, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

/**
 * Picks the env file based on a --prod flag, so pointing a script at the live
 * database is explicit and one-off. Without this the tempting move is editing
 * .env.local, which is easy to forget to undo — and then `npm run dev` is
 * silently reading and writing production.
 */
export function loadEnvForTarget(argv = process.argv) {
  const prod = argv.includes("--prod") || argv.includes("--production");
  const file = prod ? ".env.production.local" : ".env.local";
  loadEnv(file);
  return { prod, file };
}

/** argv minus our flags, so positional args still line up. */
export function positionalArgs(argv = process.argv) {
  return argv.slice(2).filter((a) => !a.startsWith("--"));
}
