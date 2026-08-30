"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { projectId, dataset, apiVersion } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";

/**
 * Sanity Studio configuration.
 *
 * The Studio is embedded in the Next.js app at /studio and shares the site's
 * domain. Users log in with email or Google. Roles (Administrator / Editor /
 * Viewer) are managed at https://sanity.io/manage — see ADMIN.md.
 */
export default defineConfig({
  name: "wila",
  title: "WILA — Berkeley Haas Content Studio",
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    // Vision is a GROQ query playground. Restrict to Admins only in Studio UI.
    visionTool({ defaultApiVersion: apiVersion })
  ]
});
