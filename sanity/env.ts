/**
 * Central place to pull Sanity env vars.
 *
 * If NEXT_PUBLIC_SANITY_PROJECT_ID is unset, the app falls back to hardcoded
 * content in lib/content.ts so the site still builds and renders.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
export const readToken = process.env.SANITY_API_READ_TOKEN ?? "";

export const sanityConfigured = projectId.length > 0;
