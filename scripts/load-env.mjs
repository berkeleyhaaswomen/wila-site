import { existsSync, readFileSync } from "node:fs";

/**
 * Minimal .env.local reader for the CLI scripts. Next.js loads these itself at
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
